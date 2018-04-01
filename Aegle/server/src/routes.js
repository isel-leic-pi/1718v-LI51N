'use strict'

/**
 * Module that contains the main set of routes.
 * @module routes
 */

/**
 * Module dependencies.
 * @private
 */
const express = require('express')
const model = require('./datatypes')

/**
 * Creates an express application instance and initiates it with the set of supported routes.
 * @param {patients_repo.PatientsRepo} - The repository instance to be used
 * @param {string} - The application's root directory
 * @return {express.Application} - The newly created application
 */
module.exports = exports = function(patientsRepository, root) {
    
    const app = express()
    const path = require('path')
    const hbs = require('hbs')

    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, './views'))
    hbs.registerHelper('equals', (theOne, theOther) => theOne === theOther)

    app.use((req, res, next) => {
        const oldEnd = res.end
        res.end = function (...args) { 
            console.log(`Serviced ${req.method} ${req.originalUrl} with status code ${res.statusCode}`)
            return oldEnd.call(this, ...args) 
        }
        next()
    })
     
    app.use(express.static(path.join(root, 'static')))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.get('/patients', (req, res) => {
        patientsRepository.getPatients((err, data) => {
            if (err) throw err
            res.format({
                html: () => res.render('patients.hbs', { patients: data }),
                json: () => res.json(data)
            })
        })
    })

    app.post('/patients', (req, res) => {
        const info = req.body
        if (!info || !info.patientId || Number.isNaN(Number(info.heartrate)))
            return res.sendStatus(400)

        const patient = new model.Patient(info.patientId, Number(info.heartrate), info.description)
        patientsRepository.updatePatient(patient, (err) => {
            if (err) throw err
            res.redirect(303, `${req.url}/${info.patientId}`)
        })
    })

    app.get('/patients/:id', (req, res, next) => {
        patientsRepository.getPatient(req.params.id, (err, data) => {
            if (err) throw err
            if (!data) next()
            else {
                res.format({
                    html: () => res.render('patient.hbs', data),
                    json: () => res.json(data)
                })
            }
        })
    })

    app.put('/patients/:id', (req, res) => {
        const patientInfo = req.body
        if (!patientInfo || Number.isNaN(Number(patientInfo.heartRate)))
            return res.sendStatus(400)

        const patient = new model.Patient(req.params.id, Number(patientInfo.heartRate), patientInfo.name)
        patientsRepository.updatePatient(patient, (err) => {
            if (err) throw err
            res.end()
        })
    })

    app.get('/status', (req, res) => {
        patientsRepository.getPatientsStatus((err, data) => {
            if (err) throw err
            res.format({
                html: () => res.render('status.hbs', { patientsStatus: data }),
                json: () => res.json(data)
            })
        })
    })

    app.get('/patients/:id/events', (req, res, next) => {

        patientsRepository.getPatient(req.params.id, (err, data) => {
            if (err) throw err
            if (!data) return next()
            
            if (!req.query.eventType)
                return res.sendStatus(400)
    
            patientsRepository.getPatientEvents(req.params.id, req.query.eventType, (err, data) => {
                if (err) throw err
                res.json(data)
            })
        })
    })

    app.post('/patients/:id/events', (req, res) => {

        const dto = req.body
        if (!dto || !dto.eventType)
            return res.sendStatus(400)

        patientsRepository.registerEvent(new model.Event(dto.eventType, dto.source, dto.message), (err) => {
            if (err) throw err
            res.end()
        })
    })

    return app
}

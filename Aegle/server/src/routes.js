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
 * @return {express.Application} - The newly created application
 */
module.exports = exports = function(patientsRepository) {
    
    const app = express()

    app.use(express.urlencoded({ extended: true }))
     
    app.get('/patients', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.getPatients((err, data) => {
            if (err) return res.sendStatus(500)
            res.json(data)
        })
    })

    app.get('/patients/:id', (req, res, next) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.getPatient(req.params.id, (err, data) => {
            if (err) return res.sendStatus(500)
            if (!data) next()
            else res.json(data)
        })
    })

    app.get('/status', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.getPatientsStatus((err, data) => {
            if (err) return res.sendStatus(500)
            res.json(data)
        })
    })

    app.post('/patients/:id/events', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.registerEvent(new model.Event('Heartbeat', req.params.id), (err) => {
            if (err) return res.sendStatus(500)
            res.end()
        })
    })

    return app
}

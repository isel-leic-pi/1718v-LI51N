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
            // TODO: Error handling
            res.set("Content-Type", "application/json")
            res.send(JSON.stringify(data))
        })
    })

    app.get('/patients/status', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.getPatientsStatus((err, data) => {
            // TODO: Error handling
            res.set("Content-Type", "application/json")
            res.send(JSON.stringify(data))
        })
    })

    app.post('/patients/:id/events', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.registerEvent(new model.Event('Heartbeat', req.params.id), (err) => {
            // TODO: Error handling
        })
        res.end()
    })

    return app
}

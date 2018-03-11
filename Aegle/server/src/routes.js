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

/**
 * Creates an express application instance and initiates it with the set of supported routes.
 * @param {patients_repo.PatientsRepo} - The repository instance to be used
 * @return {express.Application} - The newly created application
 */
module.exports = function(patientsRepository) {
    
    const app = express()

    app.use(express.urlencoded({ extended: true }))
     
    app.get('/patients', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        res.set("Content-Type", "application/json")
        res.send(JSON.stringify(patientsRepository.getPatientsStatus()))
    })

    app.post('/patients/:id/events', (req, res) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        patientsRepository.registerEvent({ eventType: 'Heartbeat', source: req.params.id})
        res.end()
    })

    return app
}
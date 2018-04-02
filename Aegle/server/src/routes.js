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
const patientsRoutes = require('./routes_patient')
const statusRoutes = require('./routes_status')

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

    app.use('/patients', patientsRoutes(patientsRepository, express))
    app.use('/', statusRoutes(patientsRepository, express))

    return app
}

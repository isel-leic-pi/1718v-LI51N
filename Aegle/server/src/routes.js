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
 * @param {patients_repo.PatientsRepo} patientsRepository - The repository instance to be used
 * @param {users_repo.UsersRepo} usersRepository - The repository instance bearing users information
 * @param {string} root - The application's root directory
 * @return {express.Application} - The newly created application
 */
module.exports = exports = function(patientsRepository, usersRepository, root) {
    
    const app = express()
    const path = require('path')
    const hbs = require('hbs')
    const methodOverride = require('method-override')
    
    const expressSession = require('express-session')({ secret: 'its a secret', resave: true, saveUninitialized: true })
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy

    passport.use(new LocalStrategy(
        function(username, password, done) {
            const user = usersRepository.verifyCredentials(username, password)
            return user ? done(null, user) : done(null, false);
        }
    ))

    app.set('view engine', 'hbs')
    app.set('views', path.join(__dirname, './views'))
    hbs.registerHelper('equals', (theOne, theOther) => theOne === theOther)
    hbs.registerHelper('and', (theOne, theOther) => theOne && theOther)
    hbs.registerPartials(__dirname + '/views/partials')

    app.use((req, res, next) => {
        const oldEnd = res.end
        res.end = function (...args) { 
            console.log(`Serviced ${req.method} ${req.originalUrl} with status code ${res.statusCode}`)
            return oldEnd.call(this, ...args) 
        }
        next()
    })
     
    app.use('/aegle', express.static(path.join(root, 'static')))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use(methodOverride('_method'))
    
    app.use(expressSession);
    app.use(passport.initialize())
    app.use(passport.session())    

    const signInRoutes = {
        login: '/aegle/login',
        logout: '/aegle/logout'
    }
    
    app.use('/aegle/patients', patientsRoutes(patientsRepository, express, signInRoutes))
    app.use('/aegle', statusRoutes(patientsRepository, express, signInRoutes))

    app.get('/aegle/home', (req, res) => { 
        res.render('home.hbs', { menuState: { home: "active", signInRoutes, user: req.user } } ) 
    })

    app.get('/aegle/patient/new.hbs', (req, res) => { 
        res.render('patientNew.hbs', { menuState: { signInRoutes, user: req.user } } )
    })

    app.get(signInRoutes.login, (req, res) => { 
        const loginUrl = `${req.protocol}://${req.headers.host}${req.url}`
        res.render('login.hbs', { 
            menuState: { signInRoutes, user: req.user }, 
            action: signInRoutes.login,
            failedAttempt: loginUrl === req.headers.referer
        }) 
    })

    app.get(signInRoutes.logout, (req, res) => { req.logout(); res.redirect('/aegle/home') })

    app.post(signInRoutes.login,
        passport.authenticate('local', { failureRedirect: signInRoutes.login }),
        (req, res) => res.redirect('/aegle/home')
    )

    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser((id, done) => { done(null, id) })

    return app
}

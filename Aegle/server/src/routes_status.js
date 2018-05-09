'use strict'

/**
 * Module that contains the set of routes pertaining to patient status and events.
 * @module routes_status
 */

/**
 * Module dependencies.
 * @private
 */
const model = require('./datatypes')

/**
 * Creates an express.Router instance and initiates it with the set of supported routes.
 * @param {patients_repo.PatientsRepo} patientsRepository - The repository instance to be used
 * @param {express.Application} express - The express application instance
 * @param {login: String, logout: String} signInRoutes - The endpoints to be used for sign-in and sign out
 * @return {express.Router} - The newly created instance
 */
module.exports = exports = function (patientsRepository, express, signInRoutes) {
  const router = express.Router()

  router.get('/status', (req, res) => {
    patientsRepository.getPatientsStatus((err, data) => {
      if (err) throw err
      res.format({
        html: () => res.render('status.hbs', {
          patientsStatus: data,
          menuState: { status: 'active', signInRoutes, user: req.user }
        }),
        json: () => res.json(data)
      })
    })
  })

  router.get('/alerts', (req, res) => {
    patientsRepository.getPatientsStatus((err, data) => {
      if (err) throw err

      const alerts = data
        .filter((it) => it.health === 'DEAD')
        .map((it) => new model.Alert('Flatline', it.patientId))

      res.json(alerts)
    })
  })

  router.get('/patients/:id/events', (req, res, next) => {
    patientsRepository.getPatient(req.params.id, (err, data) => {
      if (err) throw err
      if (!data) return next()

      if (!req.query.eventType) { return res.sendStatus(400) }

      patientsRepository.getPatientEvents(req.params.id, req.query.eventType, (err, data) => {
        if (err) throw err
        res.json(data)
      })
    })
  })

  router.post('/patients/:id/events', (req, res) => {
    const dto = req.body
    if (!dto || !dto.eventType) { return res.sendStatus(400) }

    patientsRepository.registerEvent(new model.Event(dto.eventType, dto.source, dto.message), (err) => {
      if (err) throw err
      res.end()
    })
  })

  return router
}

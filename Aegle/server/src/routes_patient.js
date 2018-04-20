'use strict'

/**
 * Module that contains the set of routes pertaining to patient information.
 * @module routes_patient
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
 * @return {express.Router} - The newly created instance
 */
module.exports = exports = function(patientsRepository, express) {
    
    const router = express.Router()

    router.get('/', (req, res) => {
        patientsRepository.getPatients((err, data) => {
            if (err) throw err
            res.format({
                html: () => res.render('patients.hbs', { patients: data }),
                json: () => res.json(data)
            })
        })
    })

    router.post('/', (req, res) => {
        const info = req.body
        if (!info || !info.patientId || Number.isNaN(Number(info.heartrate)))
            return res.sendStatus(400)

        const patient = new model.Patient(info.patientId, Number(info.heartrate), info.description)
        patientsRepository.updatePatient(patient, (err) => {
            if (err) throw err
            res.redirect(303, `${req.originalUrl}/${info.patientId}`)
        })
    })

    router.get('/:id', (req, res, next) => {
        patientsRepository.getPatient(req.params.id, (err, data) => {
            if (err) throw err
            if (!data) next()
            else {
                
                res.format({
                    html: () => res.render('patient.hbs', {
                        actionUrl: `/aegle/patients/${data.id}?_method=PUT`,
                        patientInfo: data 
                    }),
                    json: () => res.json(data)
                })
            }
        })
    })

    router.put('/:id', (req, res, next) => {

        const patientInfo = req.body
        if (!patientInfo || Number.isNaN(Number(patientInfo.heartrate)))
            return res.sendStatus(400)

        const updatePatient = function(redirectUrl) {
            const patient = new model.Patient(req.params.id, Number(patientInfo.heartrate), patientInfo.description)
            patientsRepository.updatePatient(patient, (err) => {
                if (err) throw err
                if (redirectUrl) res.redirect(303, `${req.originalUrl}`)
                else res.end()
            })
        }

        if (req.originalMethod === 'POST') {
            patientsRepository.getPatient(req.params.id, (err, data) => {
                if (err) throw err
                if (!data) next()
                else updatePatient(`${req.originalUrl}`)
            })
        } else {
            updatePatient()
        }
    })

    return router
}


'use strict'

/**
 * Module that contains the specification of the patients' heartbeat repository.
 * @module patients_repo
 * @public
 */

module.exports.createRepository = createRepository
module.exports.computePatientHealth = computePatientHealth

/**
 * Module dependencies.
 * @private
 */
const model = require('./datatypes')

/**
 * Function that produces the status of the given patient.
 * @param   {number} lastHeartbeat  - The time instant (in milliseconds) of the last hearbeat.
 * @param   {number} heartrate      - The patient's heart rate (in seconds).
 * @return  {string} The computed patient health (i.e. OK | DEAD)
 * @api public
 */
function computePatientHealth(lastHeartbeat, heartRate) {
    const flatline = (heartRate + heartRate / 2) * 1000
    const now = Date.now()
    return (now - lastHeartbeat) > flatline ? 'DEAD' : 'OK'
}

/** 
 * @callback writeCallback
 * @param   {object} err - The error object, if one occurred.
 */

/** 
 * @callback readCallback
 * @param   {object} err - The error object, if one occurred.
 * @param   {object} data - The read data.
 */

/**
 * Factory function that produces a new repository instance.
 * @constructs @type PatientsRepo
 * @param   {Array[model.Event]?} - An optional array bearing the initial set of events to 
 *                                  be added to the repository.
 * @return  {PatientsRepo} The newly created repository.
 * @api public
 */
function createRepository(events) {
    const DEFAULT_HEARTRATE = 10
    const patients = new Map()

    const getStatus = (patientId) => {

        const patient = patients.get(patientId)
        if (!patient)
            return new model.PatientStatus(patientId, 'UNKNOWN')

        const heartbeats = patient.events.get('Heartbeat') 
        if (!heartbeats || heartbeats.length == 0)
            return new model.PatientStatus(patientId, 'UNKNOWN')

        const lastHeartbeat = heartbeats[heartbeats.length - 1].timestamp
        const health = computePatientHealth(lastHeartbeat, patient.patientData.heartRate)
        return new model.PatientStatus(patientId, health, patient.patientData.name)
    }

    const addEvent = (event) => {
        let patient = patients.get(event.source)
        if (!patient) {
            patients.set(event.source, patient = { 
                patientData: new model.Patient(event.source, DEFAULT_HEARTRATE), 
                events: new Map()
            })
        }

        let eventList = patient.events.get(event.type)
        if (!eventList) 
            patient.events.set(event.type, eventList = [])

        eventList.push(event)
    }

    if (events && events instanceof Array)
        events.forEach((event) => addEvent(event))

    return {

        /**
         * Exposed for testing purposes only
         */
        __patients__: patients,

        /** 
         * Registers the given event.
         * @param   {Event} event - The event to be registered.
         * @param   {writeCallback} cb - Completion callback.
         * @memberof PatientsRepo# 
         */
        registerEvent: (event, cb) => { addEvent(event); cb() },

        /** 
         * Gets the list of known patient's.
         * @param   {readCallback} cb - Completion callback.
         * @memberof PatientsRepo#
         */
        getPatients: (cb) => {
            const patientsData = Array.from(patients.keys()).map(
                (patientId) => patients.get(patientId).patientData
            )
            cb(null, patientsData)
        },

        /** 
         * Gets the patient with the given identifier. Calls the read callback with the patient 
         * instance or undefined, if the client was not found.
         * @param   {string} patientId - The patient identifier.
         * @param   {readCallback} cb - Completion callback.
         * @memberof PatientsRepo#
         */
        getPatient: (patientId, cb) => {
            const patient = patients.get(patientId) 
            cb(null, patient ? patient.patientData : patient)
        },

        /**
         * Updates the given patient information.
         * @param   {Patient} patient - The patient information to be updated.
         * @param   {writeCallback} cb - Completion callback.
         * @memberof PatientsRepo# 
         */
        updatePatient: (patient, cb) => {
            let existingPatient = patients.get(patient.id)
            if (!existingPatient) {
                existingPatient = {
                    patientData: new model.Patient(patient.id, DEFAULT_HEARTRATE), 
                    events: new Map()
                }
            }
            
            if (patient.heartRate)
                existingPatient.patientData.heartRate = patient.heartRate
            
            existingPatient.patientData.name = patient.name

            patients.set(patient.id, existingPatient)
            cb()
        },

        /** 
         * Gets the list of known patient's status.
         * @param   {readCallback} cb - Completion callback.
         * @memberof PatientsRepo#
         */
        getPatientsStatus: (cb) => { 
            const patientsStatus = Array.from(patients.keys()).map((patientId) => getStatus(patientId))
            cb(null, patientsStatus)
        },

        /**
         * Gets the patient's status.
         * @param   {string} patientId - The patient identifier.
         * @param   {readCallback} cb - Completion callback.
         * @memberof PatientsRepo#
         */
        getPatientStatus: (patientId, cb) => cb (null, getStatus(patientId)),

        /**
         * Gets the events of the given type that where registered by the given patient.
         * @param   {string} patientId - The patient identifier.
         * @param   {string} eventType - The event type.
         * @param   {readCallback} cb - Completion callback.
         * @memberof PatientsRepo#
         */
        getPatientEvents: (patientId, eventType, cb) => {
            const patient = patients.get(patientId)
            if (!patient || !patient.events.get(eventType))
                return cb(null, [])
            cb(null, patients.get(patientId).events.get(eventType))
        }
    }
}

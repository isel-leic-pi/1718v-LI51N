'use strict'

/**
 * Module that contains the specification of the patients' heartbeat repository.
 * @module patients_repo
 * @public
 */
module.exports = createRepository

/** 
 * Data type that represents events to be recorded.
 * @typedef    {Object} Event
 * @property   {string} eventType - The event type.
 * @property   {string} source - The event source identifier, that is, the patient identifier.
 * @api public
 **/

/** 
 * Type whose instances represent the patients' repository.
 * @typedef    {Object} PatientsRepo
 * @property   {function(Event)} registerEvent - Registers a given event.
 * @property   {function():Array[PatientStatus]} getPatientsStatus - Gets all the patients' health status.
 * @api public
 **/

/**
 * Factory function that produces a new repository instance.
 * @return {PatientsRepo} The newly created repository.
 */
function createRepository() {
    const patients = []
    return {
        registerEvent: (event) => { 
            patients.push(event)
        },
        getPatientsStatus: () => patients
    }
}

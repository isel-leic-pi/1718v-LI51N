'use strict'

/**
 * Module that contains the specification of the patients' heartbeat repository.
 * @module patients_repo
 * @public
 */

 module.exports.createRepository = createRepository

/** 
 * Type whose instances represent the patients' repository.
 * @typedef    {Object} PatientsRepo
 * @property   {function(datatypes.Event)} registerEvent - Registers a given event.
 * @property   {function():Array[datatypes.PatientStatus]} getPatientsStatus - Gets all the patients' health status.
 * @api public
 **/

/**
 * Factory function that produces a new repository instance.
 * @return {PatientsRepo} The newly created repository.
 * @api public
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

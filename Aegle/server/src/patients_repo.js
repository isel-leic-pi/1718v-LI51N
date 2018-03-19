'use strict'

/**
 * Module that contains the specification of the patients' heartbeat repository.
 * @module patients_repo
 * @public
 */

 module.exports.createRepository = createRepository

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
 * @return  {PatientsRepo} The newly created repository.
 * @api public
 */
function createRepository() {
    const patients = []
    return {
        /** 
         * Registers de given event.
         * @param   {Event} event - The event to be registered.
         * @param   {writeCallback} cb - Completion callback.
         * @memberof PatientsRepo# 
         */
        registerEvent: (event, cb) => { 
            patients.push(event)
            cb()
        },
        /** 
         * Gets the list of know patient's status.
         * @param   {readCallback} cb - Completion callback.
         * @memberof PatientsRepo#
         */
        getPatientsStatus: (cb) => cb(null, patients)
    }
}

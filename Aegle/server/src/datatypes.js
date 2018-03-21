'use strict'

module.exports.Patient = Patient
module.exports.Event = Event
module.exports.PatientStatus = PatientStatus

/**
 * Module that contains the specification of the existing data types.
 * @module datatypes
 * @public
 */

/**
 * Constructor function that initializes a new Patient instance with the given arguments.
 * @param       {string} id - The patient identifier.
 * @param       {number} heartRate - The expected time interval (in seconds) between heartbeats.
 * @param       {string?} name - The patient's human friendly name.
 * @class
 * @classdesc Data type that represents patients to be monitored.
 * @api public
 */
function Patient(id, heartRate, name) {
    if (!(this instanceof Patient)) return { id, heartRate, name }
    this.id = id
    this.heartRate = heartRate
    this.name = name
}

/**
 * Constructor function that initializes a new Event instance with the given arguments.
 * @param    {string} type - The event type (e.g. 'Heartbeat' | 'UnhandledError' | ...).
 * @param    {string} source - The identifier of the event's origin, i.e. the patient identifier.
 * @param    {string?} message - An optional text message.
 * @class
 * @classdesc Data type that represents events to be recorded.
 * @api public
 */
function Event(type, source, message) {
    if (!(this instanceof Event)) return { type, source, timestamp: new Date(), message }
    this.type = type
    this.source = source
    this.timestamp = Date.now()
    this.message = message
}

/**
 * Constructor function that initializes a new PatientStatus instance with the given arguments.
 * @param    {string} patientId - The event type (e.g. 'Heartbeat' | 'UnhandledError' | ...).
 * @param    {string} health - The patient's healt (i.e. OK | DEAD | UNKNOWN)
 * @param    {string} patientName? - The patient name, if available.
 * @class
 * @classdesc Data type that represents the status of a given patient (it's a DTO, actually).
 * @api public
 */
function PatientStatus(patientId, health, patientName) {
    if (!(this instanceof PatientStatus)) return { patientId, patientName, health }
    this.patientId = patientId
    this.patientName = patientName
    this.health = health
}

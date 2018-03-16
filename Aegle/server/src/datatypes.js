'use strict'

module.exports.Patient = Patient
module.exports.Event = Event
module.exports.PatientStatus = PatientStatus

/** 
 * Data type that represents patients to be monitored.
 * @typedef     {Object} Patient
 * @property    {string} id - The patient identifier.
 * @property    {number} heartRate - The expected time interval (in seconds) between heartbeats.
 * @property    {string?} name - The patient's  human friendly name.
 * @api public
 **/

/**
 * Constructor function that initializes a new Patient instance with the given arguments.
 * @param       {string} id - The patient identifier.
 * @param       {number} heartRate - The expected time interval (in seconds) between heartbeats.
 * @param       {string?} name - The patient's  human friendly name.
 * @constructor
 * @api public
 */
function Patient(id, heartRate, name) {
    if(!this) return { id, heartRate, name }
    this.id = id
    this.heartRate = heartRate
    this.name = name
}

/** 
 * Data type that represents events to be recorded.
 * @typedef     {Object} Event
 * @property    {string} type - The event type (e.g. 'Heartbeat' | 'UnhandledError' | ...).
 * @property    {string} source - The identifier of the event's origin, i.e. the patient identifier.
 * @property    {Date} timestamp - the time instant when the event was registered (produced by the server).
 * @property    {string?} message - An optional text message.
 * @api public
 **/

/**
 * Constructor function that initializes a new Event instance with the given arguments.
 * @param    {string} type - The event type (e.g. 'Heartbeat' | 'UnhandledError' | ...).
 * @param    {number} source - The identifier of the event's origin, i.e. the patient identifier.
 * @param    {string?} message - An optional text message.
 * @api public
 * @constructor
 */
function Event(type, source, message) {
    if(!this) return { type, source, timestamp: new Date(), message }
    this.type = type
    this.source = source
    this.timestamp = new Date()
    this.message = message
}

/** 
 * Data type that represents the status of a given patient (it's a DTO, actually).
 * @typedef     {Object} PatientStatus
 * @property    {string} patientId - The event type (e.g. 'Heartbeat' | 'UnhandledError' | ...).
 * @property    {string} patientName? - The patient name, if available.
 * @property    {string} health - The patient's healt (i.e. OK | DEAD)
 * @api public
 **/

/**
 * Constructor function that initializes a new PatientStatus instance with the given arguments.
 * @param    {string} patientId - The event type (e.g. 'Heartbeat' | 'UnhandledError' | ...).
 * @param    {string} health - The patient's healt (i.e. OK | DEAD)
 * @param    {string} patientName? - The patient name, if available.
 * @api public
 * @constructor
 */
function PatientStatus(patientId, health, patientName) {
    if(!this) return { patientId, patientName, health }
    this.patientId = patientId
    this.patientName = patientName
    this.health = health
}

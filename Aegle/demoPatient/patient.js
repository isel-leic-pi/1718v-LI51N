'use sctrict'

 /**
  * Demo patient module.
  * @module patient
  */

 /** 
  * Data type that represents events to be recorded.
  * @typedef    {Object} Event
  * @property   {string} eventType - The event type.
  * @property   {string} source - The event source identifier.
  **/

 /** 
  * Type whose instances represent patients to be monitored.
  * @typedef    {Object} Patient
  * @property   {function()} start - Starts the patient's heartbeat.
  * @property   {function()} stop - Stops the patient's heart.
  **/

/**
 * Creates a patient with the given arguments.
 * @param {function(Event)} sendHeartbeat - The function to use to send heartbeat events.
 * @param {string} patientId - The patient identifier.
 * @param {number} periodInSeconds - The period, in seconds, for the heartbeat event generation.
 * @return {Patient} The newly created patient.
 */
module.exports = function(sendHeartbeat, patientId, periodInSeconds) {
    let timerId;
    return {
        start: () =>
            timerId = setInterval(() => sendHeartbeat({ 
                eventType: 'Heartbeat', 
                source: patientId 
            }), periodInSeconds * 1000),
        stop: () => clearInterval(timerId)
    }
}

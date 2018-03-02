'use sctrict'

 /**
 * Demo patient module.
 * @module patient
 */

/**
 * Creates a patient with the given arguments.
 * @param {Channel} channel - The channel to where heartbeat events are posted.
 * @param {string} patientId - The patient identifier.
 * @param {number} periodInSeconds - The period, in seconds, for the heartbeat event generation.
 * @return {Patient} The newly created patient.
 */
module.exports = function(channel, patientId, periodInSeconds) {
    let timerId;
    return {
        start: () =>
            timerId = setInterval(() => channel.post({ 
                eventType: 'Heartbeat', 
                source: patientId 
            }), periodInSeconds * 1000),
        stop: () => clearInterval(timerId)
    }
}

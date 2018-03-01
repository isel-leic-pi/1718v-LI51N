'use sctrict'

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

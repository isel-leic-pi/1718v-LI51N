'use sctrict'

module.exports = function(channel, patientId, periodInSeconds) {
    setInterval(function() {
        channel.post({
            eventType: 'Heartbeat',
            source: patientId
        })
    }, periodInSeconds * 1000)    
}
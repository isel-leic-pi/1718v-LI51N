
const channel = {
    post: (event) => console.log(event)
}

const patientId = process.argv[2]
const periodInSeconds = Number.parseInt(process.argv[3])

if (!patientId || Number.isNaN(periodInSeconds)) {
    console.error("Usage: node app <patientId> <periodInMinutes>")
    return
}

setInterval(function() {
    channel.post({
        eventType: 'Heartbeat',
        source: patientId,
    })
}, periodInSeconds * 1000)
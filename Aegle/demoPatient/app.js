
const channel = {
    post: (msg) => console.log(msg)
}

const patientId = process.argv[2]
const periodInSeconds = Number.parseInt(process.argv[3])

if (!patientId || Number.isNaN(periodInSeconds)) {
    console.error("Usage: node app <patientId> <periodInMinutes>")
    return
}

setInterval(function() {
    channel.post(`Heartbeat from ${patientId}`)
}, periodInSeconds * 1000)
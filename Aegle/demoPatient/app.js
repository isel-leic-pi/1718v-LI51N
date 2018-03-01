const fs = require('fs')
const patientFactory = require('./patient.js')

const patientId = process.argv[2]
const periodInSeconds = Number.parseInt(process.argv[3])

if (!patientId || Number.isNaN(periodInSeconds)) {
    console.error('Usage: node app <patientId> <periodInMinutes>')
    return
}

const channel = {
    post: (event) => console.log(event)
}


const patient = patientFactory(channel, patientId, periodInSeconds)

patient.start()
setTimeout(() => patient.stop(), 30*1000)
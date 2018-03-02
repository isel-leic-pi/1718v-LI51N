const fs = require('fs')
const patientFactory = require('./patient.js')

const configFilePath = process.argv[2]

if (!configFilePath || !fs.existsSync(configFilePath)) {
    console.error('Usage: node app <configFilePath>')
    return
}

const configInfo = JSON.parse(fs.readFileSync(configFilePath).toString())

const channel = {
    post: (event) => console.log(event)
}

configInfo
    .map(element => {
        return {
            patient: patientFactory(channel, element.id, element.heartbeatPeriod),
            ttl: element.ttl
        }
    })
    .forEach(patientInfo => {
        patientInfo.patient.start()
        if (patientInfo.ttl)
            setTimeout(() => patientInfo.patient.stop(), patientInfo.ttl * 1000)
    })

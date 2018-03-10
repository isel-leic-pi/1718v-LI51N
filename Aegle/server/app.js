'use strict'

const express = require('express')
const app = express()

function Patient(patientId) {
    return {
        id: patientId,
        lastHeartbeat: new Date()
    }
}

const patients = [
]

app.use(express.urlencoded({ extended: true }))

app.get('/patients', (req, res) => {
    console.log(`Servicing ${req.method} ${req.originalUrl}`)
    res.set("Content-Type", "application/json")
    res.send(JSON.stringify(patients))
})

app.post('/patients/:id/events', (req, res) => {
    console.log(`Servicing ${req.method} ${req.originalUrl}`)
    const patient = Patient(req.params.id)
    patients.push(patient)
    res.end()
})

app.listen(8080)
console.log("Server is listening")

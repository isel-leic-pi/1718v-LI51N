
const express = require('express')
const app = express()

const patients = [
    {
        id: 'An Application ID',
        lastHeartbeat: new Date()
    },
    {
        id: 'Another Application ID',
        lastHeartbeat: new Date()
    }
]

app.get('/patients', (req, res) => {
    console.log(`Servicing ${req.method} ${req.originalUrl}`)
    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify(patients))
})

app.listen(8080)
console.log('Server is listening')

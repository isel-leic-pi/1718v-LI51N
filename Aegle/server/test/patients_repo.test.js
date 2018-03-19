'use strict'

const test = require('tape')
const patientsRepo = require('../src/patients_repo')
const model = require('../src/datatypes')

test('patients_repo test: registerEvent stores the received event', (assert) => {
    
    let event = new model.Event('Heartbeat', 'someApp')
    const sut = patientsRepo.createRepository()

    assert.plan(3)

    sut.registerEvent(event, (err) => {
        assert.error(err, 'Event registered correctly')
        sut.getPatientsStatus((err, data) => {
            assert.error(err, 'Patient status obtained')
            assert.ok(data.find((elem) => elem.type === event.type && elem.source === event.source))
        })
    })

    assert.end()
})

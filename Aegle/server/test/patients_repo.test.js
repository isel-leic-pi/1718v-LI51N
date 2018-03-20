'use strict'

const test = require('tape')
const patientsRepo = require('../src/patients_repo')
const model = require('../src/datatypes')

test('patients_repo test: computePatientHealth returns OK for good life signs', (assert) => {

    const sut = patientsRepo.computePatientHealth
    const lastHearbeat = Date.now()
    assert.plan(1)

    setTimeout(() => {
        assert.equal(sut(lastHearbeat, 1), 'OK')
        assert.end()
    }, 0.5 * 1000)
})

test('patients_repo test: computePatientHealth returns DEAD for no life signs', (assert) => {

    const sut = patientsRepo.computePatientHealth
    const lastHearbeat = Date.now()
    
    assert.plan(1)
    setTimeout(() => {
        assert.equal(sut(lastHearbeat, 1), 'DEAD')
        assert.end()
    }, 2 * 1000)
})

test('patients_repo test: registerEvent stores the received event', (assert) => {
    
    const event = new model.Event('Heartbeat', 'somePatientId')
    const sut = patientsRepo.createRepository()

    assert.plan(4)

    sut.registerEvent(event, (err) => {
        assert.error(err, 'Event registered correctly')
        sut.getPatientEvents(event.source, event.type, (err, data) => {
            assert.error(err, 'Patient events obtained')
            assert.equal(data.length, 1, 'The event array size is correct')
            assert.ok(
                data.find((elem) => elem.type === event.type && elem.source === event.source),
                'The event array contains the registered event'
            )

            assert.end()
        })
    })
})

test('patients_repo test: getPatientEvents produces an empty array for an unknown patient', (assert) => {
    
    const sutRepo = patientsRepo.createRepository()

    assert.plan(3)
    sutRepo.getPatientEvents('somePatientId', 'Heartbeat', (err, data) => {
        assert.error(err, 'Patient events obtained')
        assert.ok(Array.isArray(data), 'The result is an array')
        assert.equal(data.length, 0, 'The result array size is correct')
        assert.end()
    })
})

test('patients_repo test: getPatientStatus produces the UNKNOWN state for an unknown patient', (assert) => {
    
    const sutRepo = patientsRepo.createRepository()

    assert.plan(3)
    sutRepo.getPatientStatus('somePatientId', (err, data) => {
        assert.error(err, 'Patient status obtained')
        assert.ok(data instanceof model.PatientStatus, 'The result is an instance of the correct type')
        assert.equal(data.health, 'UNKNOWN', 'The result is correct')
        assert.end()
    })
})

test('patients_repo test: getPatientsStatus produces an array with the health of all known patients', (assert) => {
    
    const sutRepo = patientsRepo.createRepository()

    const event = new model.Event('Heartbeat', 'patientId')
    let registeredCount = 0
    const eventCount = 10
    const patientCount = eventCount / 2

    assert.plan(3)
    const testAssertions = () => {
        sutRepo.getPatientsStatus((err, data) => {
            assert.error(err, 'Patients status obtained')
            assert.ok(Array.isArray(data), 'The result is an array')
            assert.equal(data.length, patientCount, 'The array contains the correct number of entries')
            assert.end()
        })
    }

    for(let count = 0; count < eventCount; ++count) {
        event.source = 'patientId' + Math.floor(count / 2)
        sutRepo.registerEvent(event, (err) => {
            if(++registeredCount == eventCount) {
                testAssertions()
            }
        })
    }
})

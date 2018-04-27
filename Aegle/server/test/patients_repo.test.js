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

  assert.plan(3 + eventCount)
  const testAssertions = () => {
    sutRepo.getPatientsStatus((err, data) => {
      assert.error(err, 'Patients status obtained')
      assert.ok(Array.isArray(data), 'The result is an array')
      assert.equal(data.length, patientCount, 'The array contains the correct number of entries')
      assert.end()
    })
  }

  for (let count = 0; count < eventCount; ++count) {
    event.source = 'patientId' + Math.floor(count / 2)
    sutRepo.registerEvent(event, (err) => {
      assert.error(err, 'Assert no errors occured')
      if (++registeredCount === eventCount) {
        testAssertions()
      }
    })
  }
})

test('patients_repo test: getPatient produces the existing patient', (assert) => {
  const sutRepo = patientsRepo.createRepository()
  const aPatient = new model.Patient('patientId', 5)
  sutRepo.__patients__.set(aPatient.id, { patientData: aPatient, events: new Map() })

  assert.plan(3)
  sutRepo.getPatient(aPatient.id, (err, data) => {
    assert.error(err, 'Patient info obtained')
    assert.ok(data instanceof model.Patient, 'instance is of correct type')
    assert.equal(data.id, aPatient.id, 'instance is the expected one')
    assert.end()
  })
})

test('patients_repo test: getPatient produces undefined for an unknown patient', (assert) => {
  const sutRepo = patientsRepo.createRepository()

  assert.plan(2)
  sutRepo.getPatient('unknownPatientId', (err, data) => {
    assert.error(err, 'Patient info obtained')
    assert.notOk(data, 'result is undefined')
    assert.end()
  })
})

test('patients_repo test: updatePatient for non existing patient creates a new one', (assert) => {
  const sutRepo = patientsRepo.createRepository()
  const patientInfo = new model.Patient('theId', 5, 'The name')

  assert.plan(7)
  sutRepo.updatePatient(patientInfo, (err) => {
    assert.error(err, 'Patient info updated')
    const addedPatient = sutRepo.__patients__.get(patientInfo.id)
    assert.ok(addedPatient, 'A new instance was added')
    assert.equal(addedPatient.events.size, 0, 'there are no recorded events')
    assert.ok(addedPatient.patientData instanceof model.Patient, 'instance is of correct type')
    assert.equal(addedPatient.patientData.id, patientInfo.id, 'id is correct')
    assert.equal(addedPatient.patientData.heartRate, patientInfo.heartRate, 'heartRate is correct')
    assert.equal(addedPatient.patientData.name, patientInfo.name, 'name is correct')
    assert.end()
  })
})

test('patients_repo test: updatePatient for an existing patient updates it', (assert) => {
  const sutRepo = patientsRepo.createRepository()
  const patientInfo = new model.Patient('theId', 5, 'the name')
  sutRepo.__patients__.set(patientInfo.id, { patientData: new model.Patient(patientInfo.id, 4), events: new Map() })

  assert.plan(5)
  sutRepo.updatePatient(patientInfo, (err) => {
    assert.error(err, 'Patient info updated')
    const patient = sutRepo.__patients__.get(patientInfo.id)
    assert.ok(patient, 'The instance exists')
    assert.equal(patient.patientData.id, patientInfo.id, 'id is correct')
    assert.equal(patient.patientData.heartRate, patientInfo.heartRate, 'heartRate is correct')
    assert.equal(patient.patientData.name, patientInfo.name, 'name is correct')
    assert.end()
  })
})

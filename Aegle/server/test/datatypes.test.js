'use strict'

const test = require('tape')
const model = require('../src/datatypes')

test('datatypes.Patient test: constructor function called with all parameters initializes instances correctly',
  (assert) => {
    const expectedId = 'The id'
    const expectedHeartRate = 30
    const expectedName = 'The name'

    const sut = new model.Patient(expectedId, expectedHeartRate, expectedName)

    assert.equal(sut.id, expectedId)
    assert.equal(sut.heartRate, expectedHeartRate)
    assert.equal(sut.name, expectedName)
    assert.end()
  }
)

test('datatypes.Event test: constructor function called with all parameters initializes instances correctly',
  (assert) => {
    const expectedType = 'Heartbeat'
    const expectedSource = 'The source Id'
    const expectedMessage = 'A message'

    const sut = new model.Event(expectedType, expectedSource, expectedMessage)

    assert.equal(sut.type, expectedType)
    assert.equal(sut.source, expectedSource)
    assert.ok(sut.timestamp, 'timestamp should not be undefined')
    assert.equal(sut.message, expectedMessage)
    assert.end()
  }
)

test('datatypes.PatientStatus test: constructor function called with all parameters initializes instances correctly',
  (assert) => {
    const expectedPatientId = 'PatientId'
    const expectedHealthStatus = 'OK'
    const expectedPatientName = 'A name'

    const sut = new model.PatientStatus(expectedPatientId, expectedHealthStatus, expectedPatientName)

    assert.equal(sut.patientId, expectedPatientId)
    assert.equal(sut.health, expectedHealthStatus)
    assert.equal(sut.patientName, expectedPatientName)
    assert.end()
  }
)

test('datatypes.User test: constructor function called with all parameters initializes instances correctly',
  (assert) => {
    const expectedUsername = 'testUser'
    const expectedPassword = 'testPwd'
    const expectedName = 'The user name'
    const expectedGravatar = 'http://gravatar.com/thegravatar/link'
    const expectedEmail = 'the.user@test.mail.com'

    const sut = new model.User(expectedUsername, expectedPassword, expectedName, expectedGravatar, expectedEmail)

    assert.equal(sut.username, expectedUsername)
    assert.equal(sut.password, expectedPassword)
    assert.equal(sut.name, expectedName)
    assert.equal(sut.gravatar, expectedGravatar)
    assert.equal(sut.email, expectedEmail)
    assert.end()
  }
)

test('datatypes.Alert test: constructor function called with all parameters initializes instances correctly',
  (assert) => {
    const expectedType = 'Flatline'
    const expectedPatientId = 'The Patient Id'
    const expectedMessage = 'A message'

    const sut = new model.Alert(expectedType, expectedPatientId, expectedMessage)

    assert.equal(sut.type, expectedType)
    assert.equal(sut.patientId, expectedPatientId)
    assert.ok(sut.timestamp, 'timestamp should not be undefined')
    assert.equal(sut.message, expectedMessage)
    assert.end()
  }
)

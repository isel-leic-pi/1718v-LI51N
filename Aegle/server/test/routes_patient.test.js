'use strict'
 
const test = require('tape');
const request = require('supertest')
 
const appFactory = require('../src/routes.js')
const model = require('../src/datatypes')
const repoFactory = require('../src/patients_repo')

const dummyIds = [ 'id1', 'id2' ]
const dummyEvents = [
    new model.Event('Heartbeat', dummyIds[0]),
    new model.Event('Heartbeat', dummyIds[1]),
    new model.Event('UnhandledError', dummyIds[0]),
]

test('routes test: GET /patients/:id expecting 200', function (assert) {

    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    assert.plan(3)
    request(app)
        .get(`/patients/${dummyIds[0]}`)
        .accept('application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            const result = res.body
            assert.equal(result.id, dummyIds[0], 'The result is the expected instance')
            assert.ok(result.heartRate, 'The resulting patient has a heartrate')
            assert.end()
        })
})

test('routes test: GET /patients/:id expecting 404', function (assert) {

    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    assert.plan(1)
    request(app)
        .get(`/patients/nonExistingId`)
        .expect(404)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: PUT /patients/:id for new patient with application/x-www-form-urlencoded', function(assert) {
    
    const repo = repoFactory.createRepository(dummyEvents)
    repo.__patients__.set('tretaId', { 
        patientData: new model.Patient('tretaId', 1000), 
        events: new Map()
    })
    const app = appFactory(repo, __dirname)

    const patientId = 'newPatientId'
    const patientData = { heartRate: 5, name: 'The patient name' }

    assert.plan(5)
    request(app)
        .put(`/patients/${patientId}`)
        .type('form')
        .send(patientData)
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            repo.getPatient(patientId, (err, data) => {
                assert.error(err, 'Patient info obtained')
                assert.equal(data.id, patientId)
                assert.equal(data.heartRate, patientData.heartRate)
                assert.equal(data.name, patientData.name)
                assert.end()
            })
        })
})

test('routes test: PUT /patients/:id for new patient with application/json', function(assert) {
    
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    const patientId = 'newPatientId'
    const patientData = { heartRate: 5, name: 'The patient name' }

    assert.plan(1)
    request(app)
        .put(`/patients/${patientId}`)
        .type('json')
        .send(patientData)
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: PUT /patients/:id for existing patient', function(assert) {
    
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    const newPatientData = { heartRate: 5, name: 'The patient name' }

    assert.plan(5)
    request(app)
        .put(`/patients/${dummyIds[0]}`)
        .type('json')
        .send(newPatientData)
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            repo.getPatient(dummyIds[0], (err, data) => {
                assert.error(err, 'Patient info obtained')
                assert.equal(data.id, dummyIds[0])
                assert.equal(data.heartRate, newPatientData.heartRate)
                assert.equal(data.name, newPatientData.name)
                assert.end()
            })
        })
})

test('routes test: POST /patients for creating a new patient with valid information', function (assert) {
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    const newPatientData = { patientId: 'ID', heartrate: 5, description: 'The patient name' }

    assert.plan(5)
    request(app)
        .post('/patients')
        .type('form')
        .send(newPatientData)
        .expect(303)
        .expect('Location', `/patients/${newPatientData.patientId}`)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            repo.getPatient(newPatientData.patientId, (err, data) => {
                assert.ok(data, 'The patient was created')
                assert.equal(data.id, newPatientData.patientId, 'The ID is correct')
                assert.equal(data.heartRate, newPatientData.heartrate, 'The heartRate is correct')
                assert.equal(data.name, newPatientData.description, 'The name is correct')
                assert.end()
            })
        })
})

test('routes test: POST /patients for creating a new patient with absent ID', function (assert) {
    const app = appFactory(repoFactory.createRepository(), __dirname)
    const newPatientData = { heartrate: 5, description: 'The patient name' }

    request(app)
        .post('/patients')
        .type('form')
        .send(newPatientData)
        .expect(400, assert.end)
})

test('routes test: POST /patients for creating a new patient with absent heartRate', function (assert) {
    const app = appFactory(repoFactory.createRepository(), __dirname)
    const newPatientData = { patientId: 'ID' }

    request(app)
        .post('/patients')
        .type('form')
        .send(newPatientData)
        .expect(400, assert.end)
})

test('routes test: GET /patients', function (assert) {

    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    assert.plan(3 + dummyIds.length)
    request(app)
        .get('/patients')
        .accept('application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            const result = res.body
            assert.ok(Array.isArray(result), 'The result is an array')
            assert.equal(result.length, dummyIds.length, 'The result array size is correct')
            dummyIds.forEach((id) => 
                assert.ok(result.find((elem) => id === elem.id && elem.heartRate))
            )
            assert.end()
        })
})

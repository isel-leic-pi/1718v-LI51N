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
    const app = appFactory(repo)

    assert.plan(3)
    request(app)
        .get(`/patients/${dummyIds[0]}`)
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
    const app = appFactory(repo)

    assert.plan(1)
    request(app)
        .get(`/patients/nonExistingId`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
    })
})

test('routes test: GET /patients', function (assert) {

    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo)

    assert.plan(3 + dummyIds.length)
    request(app)
        .get('/patients')
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

test('routes test: GET /patients-status', function (assert) {

    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo)

    assert.plan(3 + dummyIds.length)
    request(app)
        .get('/patients-status')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            const result = res.body
            assert.ok(Array.isArray(result), 'The result is an array')
            assert.equal(result.length, dummyIds.length, 'The result array size is correct')
            dummyIds.forEach((id) => 
                assert.ok(result.find((elem) => id === elem.patientId && elem.health))
            )
            assert.end()
    })
})


test('routes test: POST /patients/:id/events', function (assert) {
    
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo)

    request(app)
        .post('/patients/someApp/events')
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})
'use strict'
 
/**
 * Test suit for the routes_status module.
 * 
 * The tests use TAPE and Supertest.
 * Supertest is based in superagent, whose docs are hosted here:
 * http://visionmedia.github.io/superagent
 */

const test = require('tape')
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

test('routes test: GET /status', function (assert) {

    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    assert.plan(3 + dummyIds.length)
    request(app)
        .get('/status')
        .expect(200)
        .accept('application/json')
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

test('routes test: GET /patients/:id/events unknown :id', function (assert) {
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    const someAppId = 'someUnknownApp'
    const eventType = 'Heartbeat'

    assert.plan(1)
    request(app)
        .get(`/patients/${someAppId}/events`)
        .expect(404)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: GET /patients/:id/events without query string', function (assert) {
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    assert.plan(1)
    request(app)
        .get(`/patients/${dummyIds[0]}/events`)
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: GET /patients/:id/events with valid query string', function (assert) {
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    assert.plan(1)
    request(app)
        .get(`/patients/${dummyIds[0]}/events`)
        .query({eventType: 'Heartbeat'})
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})


test('routes test: POST /patients/:id/events with invalid payload', function (assert) {
    
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    const someAppId = 'someApp'
    const eventType = 'Heartbeat'

    assert.plan(1)
    request(app)
        .post(`/patients/${someAppId}/events`)
        .expect(400)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.end()
        })
})

test('routes test: POST /patients/:id/events with valid payload', function (assert) {
    
    const repo = repoFactory.createRepository(dummyEvents)
    const app = appFactory(repo, __dirname)

    const someAppId = 'someApp'
    const eventType = 'Heartbeat'

    assert.plan(5)
    request(app)
        .post(`/patients/${someAppId}/events`)
        .send({eventType, source: someAppId, message: 'I LIVE!'})
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            repo.getPatientEvents(someAppId, eventType, (err, data) => {
                assert.error(err, 'Assert that no errors occured')
                assert.ok(Array.isArray(data), 'The result is an array')
                assert.equal(data.length, 1, 'The result array size is correct')
                assert.ok(data.find((elem) => elem instanceof model.Event))
                assert.end()
            })
        })
})
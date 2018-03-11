'use strict'
 
const test = require('tape');
const request = require('supertest')
 
const appFactory = require('../src/routes.js')
const repoFactory = require('../src/patients_repo')

test('routes test: GET /patients', function (assert) {
    
    const repo = repoFactory()
    const event = { eventType: 'Heartbeat', source: 'someApp' }
    repo.registerEvent(event)
    const app = appFactory(repo)

    request(app)
        .get('/patients')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            const expectedResult = [ event ]
            const actualResult = res.body
            assert.error(err, 'Assert that no errors occured')
            assert.same(actualResult, expectedResult, 'Retrieve list of events')
            assert.end()
    })
})

test('routes test: POST /patients/:id/events', function (assert) {
    
    const repo = repoFactory()
    const event = { eventType: 'Heartbeat', source: 'someApp' }
    const app = appFactory(repo)

    request(app)
        .post('/patients/someApp/events')
        .expect(200)
        .end(function (err, res) {
            assert.error(err, 'Assert that no errors occured')
            assert.ok(repo.getPatientsStatus().find(function(element) {
                return element.eventType === event.eventType && element.source === event.source;
            }))
            assert.end()
        })
})
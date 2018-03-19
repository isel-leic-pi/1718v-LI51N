'use strict'
 
const test = require('tape');
const request = require('supertest')
 
const appFactory = require('../src/routes.js')
const model = require('../src/datatypes')

/**
 * The test dummy.
 * Terminology according to http://xunitpatterns.com/Test%20Double.html
 */
const dummyPatient = new model.PatientStatus('The patient ID', 'OK', 'The patient name')
function dummyRepo() {
    let callCount = []
    const incCallCount = (methodName) => { 
        if (!callCount[methodName])
            callCount[methodName] = 0
        callCount[methodName] += 1
    }
    return {
        getPatientsStatus: (cb) => { incCallCount('getPatientsStatus'); cb(null, [dummyPatient]) },
        registerEvent: (event, cb) => { incCallCount('registerEvent'); cb() },
        getCallCount: (methodName) => callCount[methodName]
    }
}

test('routes test: GET /patients', function (assert) {
    
    const repo = dummyRepo()
    const app = appFactory(repo)

    request(app)
        .get('/patients')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            const expectedResult = [ dummyPatient ]
            assert.error(err, 'Assert that no errors occured')
            const actualResult = res.body
            assert.same(actualResult, expectedResult, 'Retrieve list of events')
            assert.end()
    })
})

test('routes test: POST /patients/:id/events', function (assert) {
    
    const repo = dummyRepo()
    const app = appFactory(repo)

    request(app)
        .post('/patients/someApp/events')
        .expect(200)
        .end(function (err, res) {
            const event = { eventType: 'Heartbeat', source: 'someApp' }
            assert.error(err, 'Assert that no errors occured')
            assert.equal(repo.getCallCount('registerEvent'), 1)
            assert.end()
        })
})
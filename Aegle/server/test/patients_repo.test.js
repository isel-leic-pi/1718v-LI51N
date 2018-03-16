'use strict'

const test = require('tape')
const patientsRepo = require('../src/patients_repo')
const model = require('../src/datatypes')

test('patients_repo test: registerEvent stores the received event', (assert) => {
    
    let event = new model.Event('Heartbeat', 'someApp')
    const repo = patientsRepo.createRepository()

    assert.plan(1)

    repo.registerEvent(event)
    assert.ok(repo.getPatientsStatus().find(function(element) {
        return element.type === event.type && element.source === event.source;
    }))

    assert.end()
})

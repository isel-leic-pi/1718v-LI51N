'use strict'

const test = require('tape')
const repoFactory = require('../src/patients_repo')

test('patients_repo test: registerEvent stores the received event', (assert) => {
    
    let event = { eventType: 'Heartbeat', source: 'someApp' }
    const repo = repoFactory()

    assert.plan(1)

    repo.registerEvent(event)
    assert.ok(repo.getPatientsStatus().find(function(element) {
        return element.eventType === event.eventType && element.source === event.source;
    }))

    assert.end()
})

const test = require('tape')
const repeatCallback = require(process.argv[2])

test('repeatCallback executes cb the expected number of times', function (t) {
    const expectedCount = 3
    t.plan(expectedCount)
    repeatCallback(expectedCount, () => { 
        t.pass()
    })
})


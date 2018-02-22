const assert = require('assert')
const isCoolNumber = require(process.argv[2])

assert.ok(isCoolNumber(42), '42 should be a cool number')
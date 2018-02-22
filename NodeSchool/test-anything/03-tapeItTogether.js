
const test = require('tape')
const fancify = require(process.argv[2])

test('fancify returns wrapped string', function (t) {
    t.plan(1)
    const plainStr = 'plain'
    const fancyStr = `~*~${plainStr}~*~`
    t.equal(fancify(plainStr), fancyStr, `${plainStr} should become ${fancyStr}`)
    t.end()
})

test('fancify second argument controls ALLCAPS behaviour correctly', function (t) {
    t.plan(2)
    const plainStr = 'plain'
    const fancyStr = `~*~${plainStr}~*~`
    const fancyStrCaps = `~*~${plainStr.toUpperCase()}~*~`
    t.equal(fancify(plainStr, false), fancyStr, `${plainStr} should become ${fancyStr}`)
    t.equal(fancify(plainStr, true), fancyStrCaps, `${plainStr} should become ${fancyStrCaps}`)
    t.end()
})

test('fancify returns wrapped string', function (t) {
    t.plan(1)
    const plainStr = 'plain'
    const fancyStr = `~!~${plainStr}~!~`
    t.equal(fancify(plainStr, false, '!'), fancyStr, `${plainStr} should become ${fancyStr}`)
    t.end()
})

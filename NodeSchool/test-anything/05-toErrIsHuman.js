const test = require('tape')
const feedCat = require(process.argv[2])

test('feedCat with food works properly', function (t) {
    t.plan(2)
    t.equal(feedCat('fish'), 'yum', 'Cats should like fish')
    t.throws(feedCat.bind(null, 'chocolate'), Error, 'Cats cannot eat chocolate')
})


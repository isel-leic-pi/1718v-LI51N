function reduce(inputWords, fn, initial) {

    const reduceStep = (index, value) => 
        (index == inputWords.length) ? 
            value : 
            reduceStep(index + 1, fn(value, inputWords[index], index, inputWords))

    return reduceStep(0, initial)
}

module.exports = reduce

function countWords(inputWords) {
    let initialReduction = { }
    return inputWords.reduce((reduction, word) => {
        reduction[word] = ++reduction[word] || 1 // increment or initialize to 1
        return reduction
    }, initialReduction)
}

module.exports = countWords
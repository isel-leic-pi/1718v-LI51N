
const input = process.argv
    .filter((value, idx) => idx >= 2)

const result = input
    .map((value) => value.charAt(0))
    .reduce((acc, value) => acc + value)

console.log(`[${input}] becomes "${result}"`)

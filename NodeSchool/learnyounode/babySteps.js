

let sum = process.argv
    .map((elem) => Number(elem))
    .filter((elem) => !isNaN(elem))
    .reduce((acc, value) => acc + value)

console.log(sum)
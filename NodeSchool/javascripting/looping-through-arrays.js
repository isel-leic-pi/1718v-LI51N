const pets = ['cat', 'dog', 'rat']

pets
    .filter((elem, idx) => idx !== 0)
    .map((elem) => elem + 1)
    .forEach((elem) => console.log(elem))

const values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
const sum = values
    .filter(elem => elem % 2 === 0)
    .reduce((acc, elem) => acc + elem)

console.log(sum)
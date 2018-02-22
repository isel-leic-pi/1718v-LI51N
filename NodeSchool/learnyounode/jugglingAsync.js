const http = require('http')

const startIndex = 2
const completed = []

function conditionalComplete() {
    if (completed.every((elem) => elem.completed)) {
        completed.forEach((elem) => console.log(elem.content))
    }
}

process.argv
    .slice(startIndex)
    .forEach((url, index) => {
        const entry = completed[index] = { 'completed': false, 'content': '' }
        http.get(url, function callback(response) {
            response
                .setEncoding('utf8')
                .on('data', (data) => {
                    entry.content = entry.content.concat(data)
                })
                .on('end', () => {
                    entry.completed = true
                    conditionalComplete()
                })
        })
    })

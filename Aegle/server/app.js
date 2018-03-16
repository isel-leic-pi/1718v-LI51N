'use strict'

/**
 * Entry point that starts the server at a given port.
 * 
 * @module server.app
 */

main(process.argv[2])

/**
 * The application's entry point.
 * @param {string?} port - Optionaly, the port where the server will accept requests
 */
function main(port) {

    const model = require('./src/datatypes')

    const app = require('./src/routes')
    const repo = require('./src/patients_repo')
    const server = app(repo)

    server.listen(Number(port))
    console.log(`Server is listening on port ${port}`)
}

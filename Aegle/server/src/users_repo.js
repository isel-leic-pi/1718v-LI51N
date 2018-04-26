
/**
 * Module that contains the specification of the user's repository.
 * @module users_repo
 * @public
 */

/**
 * Factory function that produces a new repository instance.
 * @constructs @type UsersRepo
 * @param   {String} - The absolute filename (a json file) where the repository data is stored.
 * @return  {UsersRepo} The newly created repository.
 * @api public
 */
module.exports = exports = function(filename) {

    const fs = require('fs')
    const db = JSON.parse(fs.readFileSync(filename))

    return {
        /**
         * Verifies the given credentials.
         * @param   {string} username - The user identifier.
         * @param   {string} password - The user password. (TODO: Fix this)
         * @returns {User?} - The associated User instance, if the credentials are correct, undefined otherwise
         * @memberof UsersRepo#
         */

        verifyCredentials: (username, password) => db && db.users ? 
            db.users.find((user) => user.username === username && user.password === password) :
            undefined
    }
}
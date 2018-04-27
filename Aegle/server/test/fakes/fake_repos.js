
module.exports.createUsersRepo = createUsersRepo

function createUsersRepo () {
  return {
    verifyCredentials: (username, password) => {
      return {
        username,
        name: 'Test User',
        email: 'test.user@fake.mail',
        gravatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y'
      }
    }
  }
}

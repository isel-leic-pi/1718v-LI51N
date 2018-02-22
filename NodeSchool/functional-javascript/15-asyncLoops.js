
function loadUsers(userIds, load, done) {
    
    const users = []
    let pendingCount = userIds.length
    userIds.forEach((id, index, _) => {
        load(id, (user) => { 
            users[index] = user
            if (!--pendingCount) done(users)
        })
    })
}

module.exports = loadUsers
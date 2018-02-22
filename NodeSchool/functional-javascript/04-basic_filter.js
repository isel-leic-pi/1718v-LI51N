function getShortMessages(messages) {
    return messages
            .filter((elem) => elem.message.length < 50)
            .map((elem)=> elem.message)
}

module.exports = getShortMessages

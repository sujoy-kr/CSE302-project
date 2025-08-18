const bcrypt = require('bcrypt')

const saltRounds = 10

const hash = async (password) => {
    const hashedPass = await bcrypt.hash(password, saltRounds)
    return hashedPass
}

const compare = async (password, hashedPass) => {
    const result = await bcrypt.compare(password, hashedPass)
    return result
}

module.exports = {
    hash,
    compare,
}

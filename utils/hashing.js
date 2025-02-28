const bcrypt = require('bcrypt');
require("dotenv").config()

module.exports = {
    hashPass: async (plainTextPass) => {
        const salt = await bcrypt.genSalt(parseInt(process.env.HASH_SALT))
        const hashedPass = await bcrypt.hash(plainTextPass, salt)
        return hashedPass
    },
    comparePass: async (plainTextPass, hashedPass) => {
        return await bcrypt.compare(plainTextPass, hashedPass)
    }
}
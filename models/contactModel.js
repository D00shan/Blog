const mysql = require("mysql2/promise")
const logger = require("../utils/logger")

require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}


module.exports = {
    writeMsg: async (messageBody) => {

        let connection

        try {

            let sql = "INSERT INTO messages (name, surname, email, message) VALUES (?, ?, ?, ?)"

            connection = await mysql.createConnection(config)

            await connection.execute(sql, Object.values(messageBody))

            return {
                success: true,
                status: 200
            }

        } catch (error) {

            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "Error submiting contact form"
            }

        } finally {
            if(connection) {
                await connection.end()
            }
        }
        
    }
}
const mysql = require("mysql2/promise")
const logger = require("../utils/logger")

require("dotenv").config()

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}

module.exports = {
    indexList: async () => {
        let connection;

        try {

            connection = await mysql.createConnection(config)

            let [result] = await connection.execute("SELECT * FROM posts ORDER BY date DESC LIMIT 5")

            return {
                result: result,
                status: 200,
                success: true
            }

        } catch (error) {
            
            logger.error("Database error:" + error)

            return {
                status: 500,
                success: false,
                message: "Internal database error!"
            }
        } finally {
            if(connection) {
                await connection.end()
            }
        }
    }
}
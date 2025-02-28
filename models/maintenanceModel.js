const mysql = require("mysql2/promise")
const fs = require("fs/promises");
const path = require("path");
const logger = require("../utils/logger")

require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}


async function searchFile(filename) {
    let connection;

    try {
        
        let sql = "SELECT cover, img_url FROM posts, post_contents WHERE cover = ? OR img_url = ?"

        connection = await mysql.createConnection(config)

        let [result] = await connection.execute(sql, [filename, filename])

        return {
            result: result.length === 0,
        }

    } catch (error) {
        
        logger.error("Database error:" + error)

        return {
            result: false
        }

    } finally {
        
        if (connection) {
            connection.end()
        }

    }


}

module.exports = {
    purgeOrphans: async () => {
        let filelist = await fs.readdir('./public/media');

        filelist.forEach(async (file) => {

            if((await searchFile(file)).result) {
                
                let filePath = path.join(__dirname, `../public/media/${file}`)

                try {
                
                    fs.unlink(filePath);
                
                } catch (err) {
                
                    logger.error(`Error deleting file: ${err.message}`);
                
                }
            }
        })
    }
}
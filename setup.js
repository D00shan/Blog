require('dotenv').config()

const logger = require("./utils/logger")

const mysql = require("mysql2/promise")

const hashing = require("./utils/hashing")

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}

async function main(username, password) {

    let connection

    try {
        
        connection = await mysql.createConnection(config)

        await Promise.all(
            [
                connection.execute("CREATE TABLE IF NOT EXISTS `messages` (`msg_id` int unsigned NOT NULL AUTO_INCREMENT, `name` varchar(64) NOT NULL, `surname` varchar(64) NOT NULL, `email` varchar(254) NOT NULL, `message` varchar(2000) NOT NULL, `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`msg_id`), UNIQUE KEY `msg_id_UNIQUE` (`msg_id`)) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"),
                connection.execute("CREATE TABLE IF NOT EXISTS `posts` (`post_id` int NOT NULL AUTO_INCREMENT, `title` varchar(256) NOT NULL, `description` varchar(256) NOT NULL, `cover` varchar(256) DEFAULT NULL, `date` datetime DEFAULT NULL, `slug` varchar(256) NOT NULL, PRIMARY KEY (`post_id`), UNIQUE KEY `slug_UNIQUE` (`slug`)) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"),
                connection.execute("CREATE TABLE IF NOT EXISTS `post_contents` (`content_id` int NOT NULL AUTO_INCREMENT, `post_id` int NOT NULL, `order` int NOT NULL,`type` enum('paragraph','header','image') NOT NULL,`content` text, `img_url` varchar(256) DEFAULT NULL, PRIMARY KEY (`content_id`),UNIQUE KEY `content_id_UNIQUE` (`content_id`)) ENGINE=InnoDB AUTO_INCREMENT=391 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"),
                connection.execute("CREATE TABLE IF NOT EXISTS `users` (`user_id` int NOT NULL AUTO_INCREMENT,`username` varchar(64) NOT NULL,`password` varchar(64) NOT NULL, PRIMARY KEY (`user_id`), UNIQUE KEY `Username_UNIQUE` (`username`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci")
            ])

        await connection.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username.toLowerCase(), await hashing.hashPass(password)])

    } catch (error) {
        logger.error(error)
    } finally {
        if(connection) {
            await connection.end()
        }
    }

}

if(typeof process.argv[2] === "undefined" || typeof process.argv[3] === "undefined") {
    logger.error(`Please enter command line paramaters in the format: node ${process.argv[1]} **[Admin Username] [Admin Password]**`)
} else {
    main(process.argv[2], process.argv[3])
}
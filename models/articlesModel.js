const mysql = require('mysql2/promise')
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
    ArticleList: async (order, page) => {

        let cutOff = parseInt(process.env.BLOG_CUT_OFF)

        let connection;

        let orderby;

        switch (order) {
            case "latest":
                orderby = "date DESC"
                break;
            case "oldest":
                orderby = "date ASC"
                break;
            default:
                orderby = "date DESC"
                break;
        }

        try {

            let count = "SELECT COUNT(*) AS count FROM posts"

            connection = await mysql.createConnection(config)

            let [[postCount]] = await connection.execute(count)

            if(isNaN(page) || page < 1) {
                page = 1
            } else if(page > Math.ceil(postCount.count/cutOff)) {
                page = Math.ceil(postCount.count/cutOff)
            }

            let posts = `SELECT * FROM posts ORDER BY ${orderby} LIMIT ${cutOff} OFFSET ${(page - 1)*cutOff}`

            let [result] = await connection.execute(posts)

            return {
                success: true,
                status: 200,
                result: result,
                postCount: postCount.count,
                page: page,
                cutOff: cutOff
            }

        } catch (error) {
            
            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "internal server error"
            }

        } finally {

            if (connection) {
                await connection.end();
            }

        }

    },
    ArticleBody: async (slug) => {

        let connection;
        
        try {
            
            let sql = "SELECT posts.title, posts.cover, posts.description, post_contents.type, post_contents.content, post_contents.img_url FROM post_contents, posts WHERE posts.slug = ? AND posts.post_id = post_contents.post_id ORDER BY `order` ASC"

            connection = await mysql.createConnection(config)

            let [result] = await connection.execute(sql, [slug])

            return result

        } catch (error) {
            
            logger.error("Database error:" + error)

            return []

        } finally {

            if (connection) {
                await connection.end();
            }

        }

    }
}
const mysql = require('mysql2/promise')
const logger = require("../utils/logger")
const hashing = require("../utils/hashing");

require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}

module.exports = {
    Delete: async(slug) => {

        let connection;

        try {

            let sql_delete = "DELETE posts, post_contents FROM posts JOIN post_contents ON posts.post_id = post_contents.post_id WHERE posts.slug = ?;"

            let sql_cover = "SELECT cover FROM posts WHERE slug = ?"

            let sql_images = "SELECT post_contents.img_url FROM posts, post_contents WHERE posts.slug = ? AND post_contents.post_id = posts.post_id AND post_contents.img_url IS NOT NULL"

            connection = await mysql.createConnection(config)

            await connection.beginTransaction();

            let [[cover], [images]] = await Promise.all([
                connection.execute(sql_cover, [slug]),
                connection.execute(sql_images, [slug])
            ])

            if(cover.length === 0) {
                return {
                    success: false,
                    status: 404,
                    message: "no such article"
                }
            }

            await connection.execute(sql_delete, [slug])

            await connection.commit();

            let img_list = []

            images.forEach((image) => {
                img_list.push(image.img_url)
            })

            img_list.push(cover[0].cover)

            return {
                success: true,
                status: 200,
                message: "Success!",
                images: img_list
            }

        } catch (error) {

            await connection.rollback();

            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "Internal error"
            }

        } finally {

            if(connection) {
                await connection.end()
            }

        }

    },
    addPost: async (body, files) => {
        let connection

        try {

            const fileMap = new Map()

            for (const file of files){
                fileMap.set(file.fieldname, file.filename)
            }

            connection = await mysql.createConnection(config)

            let metadata = JSON.parse(body.metadata)

            //start transaction
            await connection.beginTransaction();

            let [insertion] = await connection.execute("INSERT INTO posts (title, description, cover, date, slug) VALUES (?, ?, ?, NOW() ,?)", [metadata.title, metadata.description, fileMap.get("cover") ,metadata.slug])

            let queries = body.contentBlocks.map((block, index) => {
                switch (block.type) {
                    case "header":
                    case "paragraph":
                        return connection.execute("INSERT INTO post_contents (post_id, `order`, type, content) VALUES (?, ?, ?, ?)", [insertion.insertId, index, block.type, block.content])
                        break;
                    case "image":
                        return connection.execute("INSERT INTO post_contents (post_id, `order`, type, img_url) VALUES (?, ?, ?, ?)", [insertion.insertId, index, block.type, fileMap.get(`contentBlocks[${index}][image]`)])
                        break; 
                    default:
                        throw new Error("Invalid datatype")
                        break;
                }
            })

            await Promise.all(queries)

            //end transaction
            await connection.commit();

            return { success: true, status: 200, message: "Article saved successfully!"}

        } catch (error) {

            await connection.rollback();

            logger.error("Database error:" + error)
            
            if(error.code === "ER_DUP_ENTRY") {

                return {
                    success: false,
                    status: 422,
                    message: "Slug already taken"
                }

            } else {

                return {
                    success: false,
                    status: 500,
                    message: "Error saving blog post"
                }

            }

        } finally {

            if(connection) {
                await connection.end()
            }

        }
    },
    ArticleList: async (page = 1) => {

        let connection;

        let cutOff = parseInt(process.env.DASH_CUT_OFF)

        try {

            connection = await mysql.createConnection(config)

            let count = "SELECT COUNT(*) AS count FROM posts"

            let [[postCount]] = await connection.execute(count)

            if(isNaN(page) || page < 1) {
                page = 1
            } else if(page > Math.ceil(postCount.count/cutOff)) {
                page = Math.ceil(postCount.count/cutOff)
            }

            let posts = `SELECT * FROM posts ORDER BY date DESC LIMIT ${cutOff} OFFSET ${(page - 1)*cutOff}`

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
                message: "Internal server error"
            }

        } finally {

            if (connection) {
                await connection.end();
            }

        }

    },
    LogIn: async (username, password) => {

        const connection = await mysql.createConnection(config);
      
        try {

            const [user] = await connection.execute('SELECT password FROM users WHERE username = ?', [username.toLowerCase()]);
      
            if(user.length === 0){
                return {
                    success: false,
                    status: 401,
                    message: "Wrong username or password"
                }
            }

            if(await hashing.comparePass(password, user[0].password)) {
                return {
                    success: true,
                    status: 200
                }
            }

            return {
                success: false,
                status: 401,
                message: "Wrong username or password"
            }

        } catch (error) {
            logger.error("Database error:" + error)
            
            return {
                success: false,
                status: 500,
                message: "Error logging in"
            }
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },
    getMessage: async (page) => {

        let connection;

        try {

            connection = await mysql.createConnection(config)

            let count = "SELECT COUNT(*) AS count FROM messages"

            let [[msgCount]] = await connection.execute(count)

            if(isNaN(page) || page < 1) {
                page = 1
            } else if(page > msgCount.count) {
                page = msgCount.count
            }

            let posts = `SELECT * FROM messages ORDER BY date DESC LIMIT 1 OFFSET ${(page - 1)}`

            let [[result]] = await connection.execute(posts)

            return {
                success: true,
                status: 200,
                result: result,
                msgCount: msgCount.count,
                page: page
            }

        } catch (error) {
            
            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "Internal server error"
            }

        } finally {

            if (connection) {
                await connection.end();
            }

        }
    },
    changeUsr: async (currentUsr, newUsr, password) => {
        let connection;

        try {
            
            connection = await mysql.createConnection(config)

            let [[rows]] = await connection.execute("SELECT password FROM users WHERE username = ?", [currentUsr])

            if(!(await hashing.comparePass(password, rows.password))) {
                return {
                    success: false,
                    status: 401,
                    message: "Wrong password"
                }
            }

            let [result] = await connection.execute("UPDATE users SET username = ? WHERE username = ?", [newUsr, currentUsr])

            if(result.affectedRows) {
                return {
                    success: true,
                    status: 200
                }
            }

            logger.error("Database operation resulted in zero rows being affected at adminModel.js changeUsr")

            return {
                success: false,
                status: 500,
                message: "Internal server error"
            }

        } catch (error) {
            
            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "Internal server error"
            }

        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },
    changePass: async (username, password, newPassword) => {

        let connection

        try {
            
            connection = await mysql.createConnection(config)

            let [[rows]] = await connection.execute("SELECT password FROM users WHERE username = ?", [username])

            if(!(await hashing.comparePass(password, rows.password))) {
                return {
                    success: false,
                    status: 401,
                    message: "Wrong password"
                }
            }

            let [result] = await connection.execute("UPDATE users SET password = ? WHERE username = ?", [await hashing.hashPass(newPassword), username])

            if(result.affectedRows) {
                return {
                    success: true,
                    status: 200
                }
            }

            logger.error("Database operation resulted in zero rows being affected at adminModel.js changePass")

            return {
                success: false,
                status: 500,
                message: "Internal server error"
            }

        } catch (error) {
            
            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "Internal server error"
            }

        } finally {
            if (connection) {
                await connection.end();
            }
        }

    },
    deleteMsg: async (id) => {

        let connection

        try {
            
            connection = await mysql.createConnection(config)

            connection.execute("DELETE FROM messages WHERE msg_id = ?", [id])

            return {
                success: true,
                status: 200
            }

        } catch (error) {
            
            logger.error("Database error:" + error)

            return {
                success: false,
                status: 500,
                message: "Internal server error"
            }

        } finally {
            if(connection) {
                connection.end()
            }
        }
    }
}
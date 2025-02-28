const express = require('express')

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');

require('dotenv').config();

const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const sessionStore = new MySQLStore(dbOptions);

module.exports = (app) => {
    app.use(express.json()),
    app.use(express.urlencoded({ extended: true })),
    app.use(express.static(path.join(__dirname, 'public'))),
    app.set('view engine', 'ejs'),
    app.use(session({
        key: 'blog_session',
        secret: 'Xy32PP3RYGtr9',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
    }));
}






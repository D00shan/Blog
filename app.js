require('dotenv').config();
const express = require('express')
const app = express()
const cron = require("node-cron")

const maintenanceModel = require("./models/maintenanceModel")
const errorHandler = require("./utils/errorHandler")
const logger = require("./utils/logger")

const articles = require('./routes/articles');
const contact = require('./routes/contact')
const admin = require("./routes/admin")

const indexController = require("./controllers/indexController")

cron.schedule('0 0 * * *', () => {
  logger.info("Starting purge orphans function")
  maintenanceModel.purgeOrphans()
}, {
  scheduled:true,
  timezone: "CET"
})

const port = process.env.PORT || 3000

require("./middlewares")(app)

app.use('/articles', articles)
app.use('/contact-us', contact)
app.use('/admin', admin)

app.get("/", indexController.index)

app.use((req, res, next) => next(errorHandler.createError(404, 'The page you are looking for does not exist.')));

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('pages/error', {
    statusCode: err.status || 500,
    message: err.message || 'Something went wrong. Please try again later.'
  });
});

app.listen(port, () => {
  logger.info(`listening on port ${port}`)
})
const contactModel = require("../models/contactModel")
const errorHandling = require("../utils/errorHandler")

module.exports = {
    contactPage: (req, res) => {
        res.render('pages/contact-us')
    },
    contactData: async (req, res, next) => {
        let result = await contactModel.writeMsg(req.body)

        if(result.success) {
            res.redirect("/")
        } else {
            next(errorHandling.createError(result.status, result.message))
        }
    }
}
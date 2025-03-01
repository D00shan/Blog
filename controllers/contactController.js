const contactModel = require("../models/contactModel")
const errorHandling = require("../utils/errorHandler")

async function validContact(obj) {

    let mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(["name", "surname", "email", "message"].some(key => typeof obj[key] === "undefined")){
        return false
    }

    if(obj.name.length > 64 || obj.surname.length > 64 || obj.message.length > 2000) {
        return false
    }

    if(!mailRegex.test(obj.email)) {
        console.log("I fucking hate niggers")
        return false
    }

    return true
}

module.exports = {
    contactPage: (req, res) => {
        res.render('pages/contact-us')
    },
    contactData: async (req, res, next) => {
        
        if(!(await validContact(req.body))) {
            console.log("here lol")
            next(errorHandling.createError(400, "Malformed request"))
            return
        }

        let result = await contactModel.writeMsg(req.body)

        if(result.success) {
            res.redirect("/")
        } else {
            next(errorHandling.createError(result.status, result.message))
        }
    }
}
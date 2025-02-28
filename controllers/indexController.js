const indexModel = require("../models/indexModel")
const errorHandler = require("../utils/errorHandler")

module.exports = {
    index: async (req, res, next) => {

        let list = await indexModel.indexList()

        if(list.success) {
            res.render("pages/index", list)
        } else {
            next(errorHandler.createError(list.status, list.message))
        }
    }
}
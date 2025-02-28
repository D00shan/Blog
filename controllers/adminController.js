const path = require('path');
const fs = require("fs")

const logger = require("../utils/logger")
const adminModel = require("../models/adminModel")
const errorHandler = require("../utils/errorHandler");

function deleteImageList(images) {
    images.forEach((image) => {
        
        let filePath = path.join(__dirname ,`../public/media/${image}`)

        fs.promises.unlink(filePath).catch(error => {
            logger.error(`Error deleting file: ${error.message}`);
        });
    })
}

async function blogPostIsValid(body, files) {
    try {
        const allFIlesValid = files.every(file => file.mimetype.startsWith('image/'));
 
        if(!allFIlesValid) {
            return false
        }

        if(!body.metadata || !body.contentBlocks){
            return false
        }

        let metadata

        try {
            metadata = JSON.parse(body.metadata)
        } catch (error) {
            return false
        }

        if (!metadata.title || !metadata.description || !metadata.slug) {
            return false
        }
        
        if(!Array.isArray(body.contentBlocks) || body.contentBlocks.length === 0){
            return false
        }

        const validTypes = ["header", "paragraph", "image"];

        for(const [index, block] of body.contentBlocks.entries()) {
            if (!block.type || !validTypes.includes(block.type)) {
                return false
            }
            if(block.type === "image") {
                if(!files.some(file => file.fieldname === `contentBlocks[${index}][image]`)) {
                    return false
                }
            }
        }

        return true

    } catch (error) {
        logger.error(`failed with error ${error}`)
        return false
    }
}

module.exports = {
    loginPage: (req, res) => {
        if(!req.session.admin) {
            res.render('pages/log-in')
        } else {
            res.redirect("/admin/dashboard")
        }
    },
    loginData: async (req, res) => {
        
        let result = await adminModel.LogIn(req.body.username, req.body.password)
    
        if(result.success) {
            req.session.admin = true;
            req.session.username = req.body.username.toLowerCase()
        }
    
        res.status(result.status).json(result)
    },
    dashboardPage: async (req, res, next) => {
        if(req.session.admin) {
            let posts = await adminModel.ArticleList(parseInt(req.query.page))

            if(!posts.success) {
                next(errorHandler.createError(posts.status, posts.message))
                return
            }

            res.render('pages/dashboard', posts)

        } else {
            next(errorHandler.createError(403,  "You do not have permission to access this resource."))
        }
    },
    writePage: async (req, res,next) => {
        if(req.session.admin) {
            res.render('pages/write-article')
        } else {
            next(errorHandler.createError(403,  "You do not have permission to access this resource."))
        }
    },
    delete: async (req, res) => {
        if(req.session.admin) {

            if(typeof req.body.slug === "undefined") {
                res.send({success: false, message:"Slug must not be undefined"})
                return
            }

            let data = await adminModel.Delete(req.body.slug)
    
            res.status(data.status).send(data)

            if(data.success){
                deleteImageList(data.images)
            }
        } else {
            res.status(403).json({success: false, message:"Permission denied"})
        }
    },
    upload: async(req, res) => {
        if(req.session.admin) {

            const isValid = blogPostIsValid(req.body, req.files)

            let InsertionData

            if(await isValid) {
                InsertionData = await adminModel.addPost(req.body, req.files)
            } else {
                InsertionData = {
                    success: false,
                    status: 400,
                    message: "Malformed request"
                }
            }

            res.status(InsertionData.status).send(InsertionData)

            if(!InsertionData.success) {
                req.files.forEach((file) => {
                    fs.promises.unlink(file.path).catch(error => {
                        logger.error(`Error deleting file: ${error.message}`);
                    });
                })
            }
        } else {
            res.status(403).json({success: false, message:"Permission denied"})
        }
    },
    readMessages: async(req, res, next) => {
        if(req.session.admin) {
            let data = await adminModel.getMessage(parseInt(req.query.page))

            if(data.success) {
                res.render("pages/read-messages", data)
            } else {
                next(errorHandler.createError(data.status, data.message))
            }
        } else {
            next(errorHandler.createError(403,  "You do not have permission to access this resource."))
        }
    },
    myAccount: async (req, res, next) => {
        if(req.session.admin){
            res.render("pages/my-account" , req.session)
        } else {
            next(errorHandler.createError(403,  "You do not have permission to access this resource."))
        }
    },
    changeUsr: async (req, res, next) => {
        if(req.session.admin) {
            res.render("pages/change-usr")
        } else {
            next(errorHandler.createError(403,  "You do not have permission to access this resource."))
        }
    },
    changePass: async (req, res, next) => {
        if(req.session.admin) {
            res.render("pages/change-pass")
        } else {
            next(errorHandler.createError(403,  "You do not have permission to access this resource."))
        }
    },
    changeUsrData: async (req, res, next) => {
        if(req.session.admin) {
            let result = await adminModel.changeUsr(req.session.username, req.body.usr, req.body.pass) 

            if(result.success){
                req.session.username = req.body.usr
            }

            res.status(result.status || 500).send(await adminModel.changeUsr(req.session.username, req.body.usr, req.body.pass))
        } else {
            res.status(403).json({success: false, message:"Permission denied"})
        }
    },
    changePassData: async (req, res, next) => {
        if(req.session.admin) {

            let result = await adminModel.changePass(req.session.username, req.body.current, req.body.newPass)

            res.status(result.status).send(result)
        } else {
            res.status(403).json({success: false, message:"Permission denied"})
        }
    }
}
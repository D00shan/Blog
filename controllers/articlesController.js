const articlesModel = require("../models/articlesModel");
const errorHandler = require("../utils/errorHandler")

module.exports = {
    articles: async (req, res, next) => {

        let posts = await articlesModel.ArticleList(req.query.sortby, parseInt(req.query.page))

        if(posts.success) {
            res.render('pages/blog', posts)
        } else {
            next(errorHandler.createError(posts.status, posts.message))
        }

    },
    readArticle: async (req,res,next) => {
        let article = await articlesModel.ArticleBody(req.params.articleName)
    
        if(article.length === 0) {
            next(errorHandler.createError(404, 'The page you are looking for does not exist.'))
        } else {
            res.render('pages/article', { body: article } )
        }
    
    }
}
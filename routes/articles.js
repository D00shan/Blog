const express = require('express');
const router = express.Router();

const articlesController = require("../controllers/articlesController")

router.get('/', articlesController.articles);

router.get('/:articleName', articlesController.readArticle)

module.exports = router;

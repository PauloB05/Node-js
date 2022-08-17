'use strict'


var express = require('express');

var ArticleController = require('../controllers/article');
var userController = require('../controllers/user');
var mul = require('connect-multiparty');
const article = require('../models/article');
var md_upload = mul({ uploadDir: './upload/article'});
const verifyToken = require('../routes/validate-token');
const { buscarPorCampo } = require('../controllers/article');
var router = express.Router();


router.post('/register', userController.register);
router.post('/login',userController.login);

router.get('/test', ArticleController.test);
router.post('/datos', ArticleController.datosCurso);

router.get('/get-image/:image',ArticleController.getImage);

router.use(verifyToken);
router.post('/article',ArticleController.save);
router.get('/article',ArticleController.getArticles)
router.get('/article/:id',ArticleController.getArticle);
router.put('/article/:id',ArticleController.update);
router.delete('/article/:id',ArticleController.delete);

router.post('/article/:campo/:name',ArticleController.buscarPorCampo);
// router.post('/article/:campo/:name',(req,resp)=>{
// const campo = req.params.campo;
// console.log(campo);


// });

router.post('/upload-image/:id',md_upload, ArticleController.upload);
router.get('/search/:search',ArticleController.search);

module.exports = router;
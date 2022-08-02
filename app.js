'use strict'
//Cargar modulos de node
var express = require('express');
var bodyParseR = require('body-parser');

//Ejecutrar express
var app = express();

//Cargar fivcheros rutas
var article_routes = require('./routes/article');

//MiddLewares

app.use(bodyParseR.urlencoded({extended:false}));
app.use(bodyParseR.json());

//Cors


//Añadir prefijos rutas
app.use('/', article_routes);


//ruta de prueba

// app.post('/probando',(req,resp)=>{
// var params = req.body.hola;
//    return resp.status(200).send({
//     curso: 'Master en franw',
//     autor:'yo quien mas',
//     ulr :'asdasdd@gmali.com',
//     params

//    });

// });

//export

module.exports = app;
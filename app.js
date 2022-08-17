'use strict'
//Cargar modulos de node
var express = require('express');
var bodyParseR = require('body-parser');

//Ejecutrar express
var app = express();

//Cargar fivcheros rutas
var article_routes = require('./routes/article');
const cors = require('cors');

app.use(cors());
//MiddLewares
// const cors = require("cors")

// const whitelist = ["http://localhost:3900"]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }

// app.use(cors(corsOptions))
app.use(bodyParseR.urlencoded({extended:false}));
app.use(bodyParseR.json());

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



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
'use strict'

var mongoose = require('mongoose');
var app= require('./app');
var port = 3900;

// mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true})
.then(()=>{
        //crear servidor
        app.listen(port, ()=>{
            console.log("funciona aaaaa"+port);


        })



});



// import routes

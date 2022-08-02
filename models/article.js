'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema= Schema({
    title: String,
    content: String,
    ////////////////////////////////
    created_at:date,
    updated_at:timestamp,
    date: {
        type: Date, default: Date.now
    },
    image: String
});


module.exports = mongoose.model('Article', ArticleSchema);


//articles -->guarda documentos de este tipo dentro de la coleccion


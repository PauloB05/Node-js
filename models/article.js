'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// date = {
//     type: Date, default: Date.now
// }
var ArticleSchema= Schema({
    title: String,
    content: String,
    ////////////////////////////////
    created_at:{ type: Date, required: true, default: Date.now },
    updated_at:{ type: Date, required: true, default: Date.now },
    image: String
});


module.exports = mongoose.model('Article', ArticleSchema);


//articles -->guarda documentos de este tipo dentro de la coleccion


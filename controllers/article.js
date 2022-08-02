'use strict'




let validator = require('validator');
const article = require('../models/article');
let Article = require('../models/article');
let moment = require('moment');
let fs = require('fs');
let path = require('path');
const { exec } = require('child_process');
const { DefaultDeserializer } = require('v8');

const createQuery = (campoN, data) => {

    const objSubQuery = { 
        "$regex": data, 
        "$options" : "i" 
    };

    let tempObjQuery;

    switch (campoN) {
        case 'title':
            tempObjQuery = { title: objSubQuery }        
            break;
        case 'content':
            tempObjQuery = { content: objSubQuery }        
            break;
        default:
            tempObjQuery = { id: objSubQuery }        
            break;
    };

    return tempObjQuery

}

let controller = {

    datosCurso:(req,resp)=>{
        let params = req.body.hola;
        return resp.status(200).send({
            curso: 'Master en franw',
            autor:'yo quien mas',
            ulr :'asdasdd@gmali.com',
            params
        
        });
        
    },

    test: (req,resp) =>{
        return resp.status(200).send({
            message:'soy el metodo test'
        });
    },        

    save:(req,resp)=>{
        //tomar parametros por post
        let params = req.body;
        let date = moment().format('MMMM Do YYYY, h:mm:ss a');
        //validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return resp.status(200).send({
                status:'error',
                message:'faltan datos por enviar'
            }); 
        }
        
        if(validate_title && validate_content){
            //crear el objeto a guardar
            let article= new Article();
            //asignar valores 
            article.title = params.title;
            article.content = params.content;
            article.created_at = date;
            article.updated_at = '';
            article.image = null;

            //guardar
            article.save((err,articleStored)=>{
                if (err || !articleStored){
                    return resp.status(404).send({
                        status:'error',
                        message:'el articulo no se ha guradado'
                    });
                };
                //devolver una respuesta

                return resp.status(200).send({
                    status  :'succes',
                    article : articleStored
                });
            });

           
        }else{
            return resp.status(200).send({
                status:'error',
                message:'los datos no son validos'
            });

        }
       
    },

    getArticles:(req,resp)=>{
        let query = Article.find({});
        let last =req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }
        //find()
        query.sort('-_id').exec((err,articles)=>{
            if(err){
                return resp.status(500).send({
                    status:'error',
                    message:'Error al devolver el articulo'
                });
            }
            if(!articles){
                return resp.status(404).send({
                    status:'error',
                    message:'No hay articulos'
                });
            }


            return resp.status(200).send({
                status:'succes',
                articles
            });
        })   
    },

    getArticle:(req,resp)=>{

        let ArticleId = req.params.id;
        if(!ArticleId || ArticleId == null){
            return resp.status(404).send({
                status:'error',
                message:'No hay articulos'
            });
        }
        Article.findById(ArticleId,(err,article)=>{
            if (err ||!article){
                return resp.status(404).send({
                    status:'error',
                    message:'error en el servidor'
                });
            }
            return resp.status(200).send({
                status:'succes',
                article
            });
        });
    },

    update:(req,resp)=>{
        let ArticleId = req.params.id;
        let params = req.body;
            try{
                let validate_title = !validator.isEmpty(params.title);
                let validate_content = !validator.isEmpty(params.content);
            }catch(err){
                return resp.status(404).send({
                    status:'error',
                    message:'faltan datos'
                });
            }
        if(validate_title && validate_content ){
            Article.findOneAndUpdate({_id:ArticleId},params,{new :true},(err,articleUpdate)=>{
                if(err){
                    return resp.status(500).send({
                        status:'error',
                        message:'error'
                    });       
                }
                if(!articleUpdate){
                    return resp.status(500).send({
                        status:'error',
                        message:'no existe el article'
                    });
                }
                
                return resp.status(200).send({
                    status:'succes',
                    message:'article update'
                });

            }) ; 

        }else{
            return resp.status(404).send({
                status:'error',
                message:'la validacion no es correcta'
            });
        }

    },

    delete:(req,resp)=>{
        let ArticleId = req.params.id;
        
        Article.findOneAndDelete({_id:ArticleId},(err,articleRemoved)=>{
            if(err){
                return resp.status(500).send({
                    status:'error',
                    message:'error'
                });       
            }
            if(!articleRemoved){
                return resp.status(500).send({
                    status:'error',
                    message:'no existe el article'
                });
            }
            
            return resp.status(200).send({
                status:'succes',
                article:articleRemoved
            });
        });

    },

    upload:(req,resp)=>{
        //config modulo connect multiparty
        // //tomar fichero
        if(!req.files){
            return resp.status(404).send({
                status:'error',
                message:file_name
            });
        };
        //conseguir nombre y extension
        let file_path = req.files.file0.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];
        let extension_split = file_name.split('\.');
        let file_ext = extension_split[1];
        //comprobar la extension solo imagenes
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            fs.unlink(file_path, (err)=>{
                return resp.status(200).send({
                   status: 'error',
                   message : 'la extension de la imagen no es valida'
                });
            })

        }else {
            Article.findOneAndUpdate({_id : req.params.id}, {image: file_name}, {new :true}, (err,articleUpdated)=>{
                if(err || !articleUpdated ){
                    return resp.status(200).send({
                        status :'error',
                        message : 'erro al guardar la imagen del articulo'
                    });
                }        
                return resp.status(200).send({
                    status :'succes',
                    article: articleUpdated
                });
            });

        }  
        //buscar articulo,nombre imagen actualizar
    },

    getImage:(req,resp)=>{
        let file = req.params.image;
        let path_file = './upload/article/'+file;
        
        fs.exists(path_file,(exists)=>{
            if(exists){
                return resp.sendFile(path.resolve(path_file));
            }else {
                return resp.status(200).send({
                    status :'error',
                    message: 'la imagen no existe'
                });
            }
        })
       
    },

    search:(req,resp)=>{
        let searchString = req.params.search;
        Article.find({"$or" : [
            {"title": { "$regex": searchString, "$options" : "i" }},
            {"content": { "$regex": searchString, "$options" : "i" }}
        ]})
        .sort([['date','descending']])
        .exec((err,articles)=>{
           if(err){
            return resp.status(500).send({
                status :'error',
                message:'error en la peticion'
            });
           }
              
           if(!articles || articles.length <= 0){
            return resp.status(404).send({
                status :'error',
                message:'no hay articulos para mostrar'
            });
           }
            return resp.status(200).send({
                status :'succes',
                articles
            });
        });


    },

    buscarPorCampo:(req,resp)=>{

        let campoN = req.params.campo;
        let data = req.params.name;

        const objQuery = createQuery(campoN, data);

        Article.find(
            {"$or" : [
                objQuery
            ]}
        )
        .sort([['date','descending']])
        .exec((err,articles)=>{
            return resp.status(200).send({
                status :'succes',
                articles
            });
        });

    }
}

module.exports = controller;
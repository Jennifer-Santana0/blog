const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagens')
const Postagem = mongoose.model('postagens')


router.get('/',(req,res)=>{
    Postagem.find().sort({data:'desc'}).then((postagem)=>{
        res.render('index',{postagem})
    }).catch((err)=>{
        req.flash('error_msg',"Houve um erro interno")
        res.redirect('/404')
    })
})

router.get('/404',(req,res)=>{
    res.render('404')
})

router.get('/admin/postagens/:slug',(req,res)=>{
    Postagem.findOne({slug:req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index',{postagem})
        }else {
            req.flash('error_msg','esta postagem nao existe')
            res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro interno')
        res.redirect('/')
    })
})

router.get('/categorias',(req,res)=>{
    Categoria.find().sort({data:'desc'}).then((categoria)=>{
        res.render('categorias/index',{categoria})
    }).catch((err)=>{
        req.flash('error_msg','houve um erro interno ao listar as categorias')
        res.redirect('/')
    })
})

router.get('/categorias/:slug',(req,res)=>{
    Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
        if(categoria){
            res.render('categorias/categorias',{categoria})
        }else{
            req.flash('error_msg','Esta categoria nao existe')
            res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg','houve um erro interno ao listar as categorias')
        res.redirect('/')
    })
})

router.get('/admin/categorias',(req,res)=>{
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias:categorias})
    }).catch((err)=>{
        res.send('houve um erro ao listar as categorias')
    })
})



router.get('/admin/categorias/add',(req,res)=>{
    res.render('admin/addcategorias',{erros:[]})
})
router.post('/admin/categorias/nova',(req,res)=>{

    let erros = []

    if(req.body.nome==''){
        erros.push({texto:'O campo nome esta vazio'})
    }
    if(req.body.slug==''){
        erros.push({texto:'O campo nome esta vazio'})
    }

    if (erros.length>0){
        res.render('admin/addcategorias', {erros})
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg','Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg','houve algum erro ao salvar a categoria')
            res.redirect('/admin/categorias/add')
        })
    }
})

router.get('/admin/categorias/edit/:id',(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria})
    }).catch((err)=>{
        req.flash('error_msg','Esta categoria nao existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/admin/categorias/edit',(req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg','Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg','Houve algum erro interno ao salvar a categoria')
            res.redirect('/admin/categorias')
        })
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
})
router.post('/admin/categorias/deletar',(req,res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Categoria foi deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','Houve algum erro ao deletar')
        res.redirect('/admin/categorias')
    })
})

router.get('/admin/postagens',(req,res)=>{
    Postagem.find().populate('categoria').sort({date:'desc'}).then((postagem)=>{
        res.render('admin/postagens',{postagem})
    }).catch((err)=>{
        req.flash('error_msg','Houve algum erro')
        console.log(err)
        res.redirect('/admin')
    })
})



router.get('/admin/postagens/add',(req,res)=>{
    Categoria.find().then((categoria)=>{
        res.render('admin/addpostagens',{categoria})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulario')
        res.redirect('/admin')
    })
})



router.post('/admin/postagens/nova',(req,res)=>{
    if(req.body.titulo=='' || req.body.slug=='' || req.body.descricao=='' || req.body.conteudo==''){
        req.flash('error_msg',"Algum campo esta avazio")
       res.redirect('/admin/postagens/add')
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', "Postagem criada com sucesso")
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', "Houve algum erro")
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/admin/postagens/edit/:id',(req,res)=>{

    Postagem.findOne({_id:req.params.id}).then((postagem)=>{
        Categoria.find().then((categoria)=>{
            res.render('admin/editpostagens',{categoria,postagem})
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao listar as categoria')
            res.redirect('/admin/postagem')
        })

    }).catch((err)=>{
        req.flash('error_msg','Houve algum erro ao carregar o formulario')
        res.redirect('/admin/postagem')
    })

    
})

router.post('/admin/postagem/edit',(req,res)=>{
    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.conteudo = req.body.conteudo
        postagem.descricao = req.body.descricao

        postagem.save().then(()=>{
            req.flash('success_msg','Postagem editdata com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg','Houve algum erro ao editar a postagem')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('errer_msg','Houve um erro')
        res.redirect('/admin/postagens')
    })
})

router.post('/admin/postagem/deletar',(req,res)=>{
    Postagem.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Postagem deletada com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro')
        res.redirect('/admin/postagens')
    })
})



module.exports = router


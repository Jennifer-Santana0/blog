const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')


router.get('/',(req,res)=>{
    res.render('main')
})

router.get('/admin',(req,res)=>{
    res.render('admin/index')
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
            res.redirect('/admin/categorias',)
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
    res.render('admin/postagens')
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
        res.send('ok')
    }

})

module.exports = router


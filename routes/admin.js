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
    res.render('admin/editcategorias')
})

module.exports = router


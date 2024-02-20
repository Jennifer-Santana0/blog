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
    res.render('admin/categorias')
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
            console.log('categoria salva')
        }).catch((err)=>{
            console.log('erro ao salvar categoria ' + err)
        })
    }

    
})

module.exports = router


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
    res.render('admin/addcategorias')
})
router.post('/admin/categorias/nova',(req,res)=>{
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        console.log('categoria salva')
    }).catch((err)=>{
        console.log('erro ao salvar categoria')
    })
})

module.exports = router
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')

router.get('/registro',(req,res)=>{
    res.render('usuarios/registro',{erros:''})
})

router.post('/registro',(req,res)=>{
    let erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:'Nome invalido'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto:'Email invalido'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto:'Senha invalido'})
    }
    if(req.body.senha.length < 4) {
        erros.push({texto:'Senha muito curta'})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto:'As senha sao diferentes tente novamente!'})
    }

    if(erros.length>0){
        res.render('usuarios/registro',{erros})
    }else {
        Usuario.findOne({email:req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg','Ja existe uma conta registrada com esse email')
                res.redirect('/usuarios/registro')
            }else {

                const novousuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novousuario.senha, salt, (erro, hash) =>{
                        if(erro){
                            req.flash('error_msg','Houve algum err durante o salvamento')
                            res.redirect('/')
                        }

                        novousuario.senha = hash

                        novousuario.save().then(()=>{
                            req.flash('success_msg','Usuario criado com sucesso')
                            res.redirect('/')
                        }).catch((err)=>{
                            req.flash('error_msg','houve algum erro')
                            res.redirect('/')
                        })
                    })
                })

            }
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/')
        })
    }

})

router.get('/login',(req,res)=>{
    res.render('usuarios/login')
})


module.exports = router
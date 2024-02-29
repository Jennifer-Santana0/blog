const localStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model de usuario
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')



module.exports = (passport) =>{

    passport.use(new localStrategy({usernameField:'email'}, (email,senha,done)=>{
        Usuario.findOne({email:email}).then((usuario)=>{
            if(!usuario){
                return done(null,false,{message: 'Esta conta nao existe'})
            } 

            bcrypt.compare(senha,usuario.senha, (erro,batem)=>{
                if(batem){
                    return done(null,user)
                }else {
                    return done(null,false, {message: 'Senha incorreta'})
                }
            })
        })
    }))

    passport.serializeUser((usuario,done)=>{
        done(null,usuario.id)
    })

    passport.deserializeUser((id,done)=>{
        UserActivation.findById(id,(err,usuario)=>{
            done(err,user)
        })
    })

}
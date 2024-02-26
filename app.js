// CARREGANDO MODULOS
    const express = require('express')
    const path = require('path')
    const admin = require('./routes/admin')
    const usuarios = require('./routes/usuario')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    const app = express()

//CONFIGURACOES
    //sessao
    app.use(session({
        secret: 'nodejs',
        resave: true,
        saveUninitialized: true
    }))
    //flash
    app.use(flash())

    //middlewares
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    // utilizando ejs
    app.set('view engine', 'ejs')

    // utilizando css e outros
    app.use(express.static(path.join(__dirname, 'public')))

    // utilizando req.body
    app.use(express.urlencoded({ extended: true }));

    // mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb+srv://root:admin@cluster0.amsf5ic.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>{
        console.log('banco de dados conectado')
    }).catch((err)=>{
        console.log('erro ao se conectar ao banco de dados ' + err)
    })

    //utilizando middlewares
    app.use((req,res,next)=>{
        console.log('ola mundo, middlewares')
        next()
    }) 


// ROTAS
    app.use('/',admin)
    app.use('/usuarios',usuarios)


// OUTROS
const PORT = 8081
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})
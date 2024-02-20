// CARREGANDO MODULOS
    const express = require('express')
    const path = require('path')
    const admin = require('./routes/admin')
    const mongoose = require('mongoose')
    const app = express()

//CONFIGURACOES
    app.set('view engine', 'ejs')
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(express.urlencoded({ extended: true }));

    // mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb+srv://root:admin@cluster0.amsf5ic.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>{
        console.log('banco de dados conectado')
    }).catch((err)=>{
        console.log('erro ao se conectar ao banco de dados ' + err)
    })

// ROTAS
    app.use('/',admin)


// OUTROS
const PORT = 8081
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})
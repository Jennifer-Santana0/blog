// CARREGANDO MODULOS
    const express = require('express')
    const path = require('path')
    const admin = require('./routes/admin')
    const app = express()

//CONFIGURACOES
    app.set('view engine', 'ejs')
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(express.urlencoded({ extended: true }));


// ROTAS
    app.use('/',admin)


// OUTROS
const PORT = 8081
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})
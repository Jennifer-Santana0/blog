const mongoose = require('mongoose')


const Categoria = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('categorias', Categoria)
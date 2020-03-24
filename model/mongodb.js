const mongoose = require('mongoose')

let dbschema = mongoose.Schema({

    "username": {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true
    },
    "mobile": {
        type: Number,
        required: false
    },
    "address": {
        type: String,
        required: false
    },
    "description": {
        type: String,
        required: false
    },
    "extras" : {
        type: String,
        required: false
    },
    "created_date" :{
        type: String,
        required: true
    },
    "modified_date" :{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('customer', dbschema)
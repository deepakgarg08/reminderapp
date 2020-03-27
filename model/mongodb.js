const mongoose = require('mongoose')

let productschema = mongoose.Schema({

    "product_name": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        required: false
    }, "price": {
        type: Number,
        required: false
    }, "note": {
        type: String,
        required: false
    }, "created_date": {
        type: String,
        required: false
    },
    "modified_date": {
        type: String,
        required: false
    }

})

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
    "extras": {
        type: String,
        required: false
    },
    "created_date": {
        type: String,
        required: true
    },
    "modified_date": {
        type: String,
        required: false
    },
    "password": {
        type: String,
        required: false
    },
    "userrole": {
        type: String,
        required: false
    },
    "products": [productschema]
})


module.exports = mongoose.model('customer', dbschema)

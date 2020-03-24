const express = require('express')

console.log("hello world")
let app = express();
var MongoClient = require('mongodb').MongoClient;
const fs = require('fs')
const mongoose = require('mongoose')
const Posts = require('./model/mongodb')

let uri = "mongodb://localhost:27017/MyDb";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) console.log('error connecting the mongodb')
    else console.log('conncection is successful.')
})


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true}))


app.get('/', function (request, response) {
    response.send("<h1>welcome to reminder app</h1>")
})

app.post('/new', function (request, response) {
    let body = request.body
    console.log("body  ", body);

    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    const date = day + "/" + month + "/" + year;

    body.created_date = date;

    function lower(obj) {
        for (var prop in obj) {
            if (typeof obj[prop] === 'string') {
                obj[prop] = obj[prop].toLowerCase();
            }
            if (typeof obj[prop] === 'object') {
                lower(obj[prop]);
            }
        }
        return obj;
    }

    console.log('check body before', body);

    body = lower(body)
    console.log("check final body  :  ", body);

    const customer = new Posts(body)
    customer.save().then(data => {
        response.json(data)
    }).catch(err => response.json(err))
})
//value can be read by id, username and mobile
app.get('/read/:value', async function (request, response) {
    const value = request.params.value;

    if (value.length === 24) {
        try {
            const customer = await Posts.findById(value);
            await response.json(customer)
        } catch (err) {
            console.log("error occured", err)
            await response.json('error occured', err)

        }
    } else if (!isNaN(value)) {
        console.log("check value", value);
        try {
            const customer = await Posts.find({mobile: value});
            await response.json(customer)
        } catch (err) {
            console.log("error occured", err)
        }
    } else {
        try {
            const customer = await Posts.find({username: value});
            await response.json(customer)
        } catch (err) {
            console.log("error occured", err)
        }
    }

})

app.get('/readall', async function (request, response) {

    try {
        const customer = await Posts.find();
        response.json(customer)
    } catch (err) {
        console.log("error occured", err)
    }

})


app.patch('/update/:id', async function (request, response) {

    let body = request.body
    console.log("body  ", body);

    try {
        const updatedPost = await Posts.updateOne({_id: request.params.id}, {
            $set: {
                name: body.name,
                mobile: body.mobile,
                address: body.address,
                description: body.description,
                created_date: body.created_date
            }
        })
        await response.json(updatedPost)
    } catch (err) {
        console.log("error occured", err)
        await response.send('error occured' + err)
    }

})


let x = {
    "_id": "5e7a14c80a637e7c47512825",
    "username": "vikasgaeg",
    "name": "vikas garg",
    "mobile": 1234567890,
    "address": "911 jc ward 35 janta colony",
    "description": "hgi industries",
    "created_date": "24/3/2020",
    "__v": 0
}


app.delete('/delete/:value', async function (request, response) {

    try {
        await Posts.deleteOne({_id: request.params.value})
        await response.json("Customer details deleted successfully")
    } catch (err) {
        console.log("error occured", err)
        await response.json('error occured', err)

    }

})

app.delete('/deleteall', async function (request, response) {

    try {
        const res = await Posts.deleteMany({});
        console.log("check deleted records count", res.deletedCount);
        await response.json(`All records (${res.deletedCount}) deleted successfully`)

    } catch (error) {
        console.log(("check err", error))
    }

})

app.listen(3000);
console.log("server started at port 3000");



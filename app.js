const express = require('express')

let app = express();
const mongoose = require('mongoose')
const Posts = require('./model/mongodb')


// let uri = "mongodb+srv://deepakgarg08:92119211@cluster0-zr3gu.mongodb.net/MyDb?retryWrites=true";
let uri = "mongodb://deepakadmin:921192119211@localhost:27017/MyDb";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) console.log('error connecting the mongodb' + err)
    else console.log('connection is successful.')
})


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true}))

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// let admin_user = null; //100
let admin_user = 100

function getCurrentDate() {

    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    const date = day + "/" + month + "/" + year;
    return date
}

app.get('/', function (request, response) {
    response.send("<h1>welcome to reminder app</h1>")
})

app.post('/authenticate', async function (request, response) {
    let body = request.body
    console.log("body  ", body);
    const {username, password} = body;

    try {
        let customer = await Posts.find({username: username});
        if (customer.length === 0) {
            await response.send("no customer found")
            return;
        }

        if (password === customer[0].password && customer[0].userrole === "ADMIN") {
            console.log("customer password:  ", password);
            response.send("user authenticated")
            admin_user = 100;
            return;
        }


        await response.json(customer)
    } catch (err) {
        console.log("error occured", err)
    }


})

app.post('/new', async function (request, response) {
    console.log("admin_user  ", admin_user)

    if (admin_user === 100) {

        let body = request.body
        console.log("body  ", body);

        try {
            let customer = await Posts.find({username: body.username});
            if (customer === null || customer.length === 0) {

                let date = getCurrentDate()
                console.log('today date', date);

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

                body = lower(body)
                customer = new Posts(body)
                customer.save().then(data => {
                    response.json(data)
                }).catch(err => response.json(err))


            } else {
                response.send(`username (${body.username}) already exist`)
            }
        } catch (err) {
            console.log("error occured", err)
            await response.send("error occured")
        }

    } else {
        response.send("you are not authorized")
    }


})

//value can be read by id, username and mobile
app.get('/read/:value', async function (request, response) {
    if (admin_user === 100) {
        const value = request.params.value;

        if (value.length === 24) {
            try {
                const customer = await Posts.findById(value);
                if (customer === null || customer.length === 0) {
                    await response.send("no customer found")
                    return;
                }
                await response.json(customer)
            } catch (err) {
                console.log("error occured", err)
                await response.send('error occured' + err)

            }
        } else if (!isNaN(value)) {
            console.log("check value", value);
            try {
                const customer = await Posts.find({mobile: value});
                if (customer === null || customer.length === 0) {
                    await response.send("no customer found")
                    return;
                }
                await response.json(customer)
            } catch (err) {
                console.log("error occured", err)
                await response.send("error occured")

            }
        } else {
            try {
                const customer = await Posts.find({username: value});
                if (customer === null || customer.length === 0) {
                    await response.send("Wrong username or id")
                    return;
                }
                await response.json(customer)
            } catch (err) {
                console.log("error occured", err)
                await response.send("error occured")
            }
        }
    } else {
        response.send("you are not authorized")
    }


})

app.get('/readall', async function (request, response) {

    if (admin_user === 100) {
        try {
            const customer = await Posts.find();
            if (customer.length === 0) {
                await response.send("no record found")
                return;
            }
            console.log("check customer count", customer.length)
            let resultsets = {
                Total_No_of_Records: customer.length - 1,
                Records: customer
            }
            response.json(resultsets)
        } catch (err) {
            console.log("error occured", err)
            response.send("error occured")
        }
    } else {
        response.send("you are not authorized")
    }
})


app.patch('/update', async function (request, response) {

    if (admin_user === 100) {
        let bodytemparr = {}
        let body = request.body
        // console.log("body  ", body);
        const {username, id, name, mobile, address, description, extras, products} = body;

        console.log(`check name: ${name}, mobile : ${mobile}, address ${address},  Description ${description}, extras ${extras} `)

        if (body === null) {
            response.send("empty body")
        }
        if (name) {
            bodytemparr.name = name;
        }
        if (mobile) {
            bodytemparr.mobile = mobile
        }
        if (address) {
            bodytemparr.address = address
        }
        if (description) {
            bodytemparr.description = description
        }
        if (extras) {
            bodytemparr.extras = extras
        }
        console.log("check products")
        // if(products){
        //     bodytemparr.products = products
        // }
        let date = getCurrentDate()
        console.log('today date', date);

        bodytemparr.modified_date = date

        if (id  && id.length === 24) {
            try {
                const customer = await Posts.findById(id);
                if (customer === null) {
                    await response.send("no customer found with this id")
                    return;
                }
                const updatedPost = await Posts.updateOne({_id: id}, {
                    $set: bodytemparr
                })
                const updatedPost2 = await Posts.updateOne({_id: id}, {
                    $push:  {products : products}
                })
                await response.json({basic: updatedPost, product: updatedPost2})
            } catch (err) {
                console.log("error occured", err)
                await response.send('error occured' + err)

            }
        } else if (username){
            try {
                const customer = await Posts.find({username: username});
                if (customer === null || customer.length === 0) {
                    await response.send("Wrong username or id")
                    return;
                }
                const updatedPost = await Posts.updateOne({username: username}, {
                    $set: bodytemparr
                })
                const updatedPost2 = await Posts.updateOne({username: username}, {
                    $push:  {products : products}
                })
                await response.json({basic: updatedPost, product: updatedPost2})
            } catch (err) {
                console.log("error occured", err)
                await response.send("error occured")
            }
        }
        else {
            response.send("Invalid Id")
        }
    } else {
        response.send("you are not authorized")
    }


})


app.delete('/delete/:id', async function (request, response) {

        if (admin_user === 100) {
            if (request.params.id.length === 24) {


                try {
                    let result = await Posts.deleteOne({_id: request.params.id})
                    console.log("cehck result", result);

                    if (result.n == 0) {
                        console.log("No record found")
                        await response.send("No record found with this ID")

                    } else {
                        console.log(" record found")
                        await response.send("Customer details deleted successfully")
                    }
                } catch (err) {
                    console.log("error occured  " + err)
                    await response.send('error occured ' + err)

                }
            } else {
                response.send("Invalid CustomerID")
            }

        } else {
            response.send("you are not authorized")
        }
    }
)

app.delete('/deleteall', async function (request, response) {

    if (admin_user === 100) {
        try {
            const res = await Posts.deleteMany({});
            console.log("check deleted records count", res.deletedCount);
            await response.json(`All records (${res.deletedCount}) deleted successfully`)

        } catch (error) {
            console.log(("check err", error))
            await response.json('error occured', error)
            ;
        }
    } else {
        response.send("you are not authorized")
    }

})



app.listen(process.env.PORT || 3000);
console.log("server started at port 3000");


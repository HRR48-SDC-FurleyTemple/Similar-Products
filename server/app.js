const express = require('express');
const Furniture = require('../database-mongodb/Furniture');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/api/similarProducts/products/:id', (request, response) => {
    Furniture.find({id: request.params.id})
        .then((res) => {
            response.json(res);
        })
        .catch((error) => {
            response.end(error);
        });
});

app.post('/api/similarProducts/products', (request, response) => {
    //create new id from last id
    Furniture.find({}).sort({id: -1}).limit(1)
    .then((res) => {
      request.body.id = res[0].id + 1;
      Furniture.create(request.body)
      .then((result) => {
        console.log("new entry created", result);
        response.status(201).send("product added")
      })
    })
    .catch((error) => {
      console.log(error);
      response.sendStatus(400)
    })
})

app.put('/api/similarProducts/products/:id/:name', (request, response) => {
    debugger;
    var nameString = request.params.name.split('-').join(' ');
    var updates = request.body
    console.log("body", request.body, "name", nameString);
        Furniture.updateOne({id: request.params.id, name: nameString}, {
            name: updates.name,
            category: updates.category,
            price: updates.price,
            rating: updates.rating,
            imageUrl: updates.imageUrl,
            onSale: updates.onSale
        })
        .then((res) => {
            console.log("res", res)
        })
        .catch((error) => {
            response.sendStatus(404)
        });
})

app.delete('/api/similarProducts/products/:id', (request, response) => {
    console.log(request.params);
    Furniture.deleteMany({id: request.params.id})
    .then((res) => {
        response.status(200).send(`deleted similar items for item ${request.params.name}`);
    })
    .catch((error) => {
        response.sendStatus(404);
    })
});

app.get('/products/:id', (request, response) => {
    response.sendFile(path.join(__dirname, "/../client/dist", "index.html"));
});

module.exports = app;
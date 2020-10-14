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
//app.put()
//app.put()

app.delete('/api/similarProducts/products/:id', (request, response) => {
    console.log(request.params);
    Furniture.deleteMany({id: request.params.id})
    .then((res) => {
        response.status(200).send(`deleted similar items for item ${request.params.name}`);
    })
    .catch((error) => {
        response.sendStatus(404);
    })
})

app.get('/products/:id', (request, response) => {
    response.sendFile(path.join(__dirname, "/../client/dist", "index.html"));
});

module.exports = app;
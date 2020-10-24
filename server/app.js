require('newrelic');
const express = require('express');
const pg = require('../database1/postgresModel');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/api/similarProducts/products/:id', (request, response) => {
  pg.getSimilarProducts(request, response);
})

//GET ALL REQUEST CAUSES FATAL ERROR JS heap out of memory if not limited in model
app.get('/api/similarProducts/products', (request, response) => {
  pg.getAll(request, response);
})

app.post('/api/similarProducts/products', (request, response) => {
  console.log("post", request.body)
  pg.create(request, response);
})

app.delete('/api/similarProducts/products/:id', (request, response) => {
  console.log("delete", request.params)
  pg.remove(request, response);
})

app.put('/api/similarProducts/products/:id', (request, response) => {
  pg.update(request, response);
})

app.get('/products/:id', (request, response) => {
  response.sendFile(path.join(__dirname, "/../client/dist", "index.html"));
});

 module.exports = app;
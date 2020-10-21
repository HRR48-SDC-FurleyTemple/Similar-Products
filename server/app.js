const express = require('express');
const pg = require('../database1/postgresModel');
const cass = require('../database2/cassandraModel')
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/api/similarProducts/products/:id', (request, response) => {
  console.log(request.params);
  //pg.getOne(request, response);
  cass.getOne(request, response);
})

//GET ALL REQUEST CAUSES FATAL ERROR JS heap out of memory if not limited in model
app.get('/api/similarProducts/products', (request, response) => {
  console.log("get allrequest made: ", request.params);
  //pg.getAll(request, response);
  cass.getAll(request, response);
})

app.post('/api/similarProducts/products', (request, response) => {
  console.log("post", request.body)
  //pg.create(request, response);
  cass.create(request, response);
})

app.delete('/api/similarProducts/products/:id', (request, response) => {
  console.log("delete", request.params)
  //pg.remove(request, response);
  cass.remove(request, response);
})

app.put('/api/similarProducts/products/:id', (request, response) => {
  console.log("put replace", request.body);
  console.log("put item number to replace", request.params);
  //pg.update(request, response);
  cass.update(request, response);
})

app.get('/products/:id', (request, response) => {
  response.sendFile(path.join(__dirname, "/../client/dist", "index.html"));
});

 module.exports = app;
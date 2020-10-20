const express = require('express');
const pg = require('../database1/postgresModel');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/api/similarProducts/products/:id', (request, response) => {
  console.log(request.params)
  pg.getOne(request, response)
})

app.post('/api/similarProducts/products', (request, response) => {
  console.log(request.body)
  //pg.create(request, response);
})

// app.post('/api/similarProducts/products', (request, response) => {
//     //create new id from last id
//     model.createItem(request.body, (result, error) => {
//       if (error) {
//         console.log(error);
//         response.sendStatus(400).end();
//       } else {
//         console.log("new entry created", result);
//         response.status(201).send("product added")
//       }
//     })
// })

// app.put('/api/similarProducts/products/:id/:name', (request, response) => {
//     var nameString = request.params.name.split('-').join(' ');
//     var updates = request.body
//     model.updateItem(request.params.id, nameString, updates, (result, error) => {
//         if (error) {
//             console.log(error);
//             response.sendStatus(404).end();
//         } else {
//             console.log("item update result: ", result);
//             response.status(200).send("item updated");
//         }
//     })
// })

// app.delete('/api/similarProducts/products/:id', (request, response) => {
//     model.deleteSimilarItems(request.params.id, (result, error) => {
//         if (error) {
//             console.log(error);
//             response.sendStatus(400).end();
//         } else {
//             console.log("item delete result: ", result);
//             response.status(200).send(`deleted similar items for item ${request.params.id}`);
//         }
//     })
// });

app.get('/products/:id', (request, response) => {
    response.sendFile(path.join(__dirname, "/../client/dist", "index.html"));
});

 module.exports = app;
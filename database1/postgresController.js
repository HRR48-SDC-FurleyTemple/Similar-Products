require('dotenv').config()
const { Client } = require('pg');
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  database: 'similar_prod',
  password: process.env.DB_PASS
});

client.connect();

module.exports = {
  //getAll causes fatal error when fetching all 14000000 + records
  //added a limit for testing purposes
  getAll : (req, res) => {
    const text = `SELECT * FROM products limit 1000`;
    client.query(text)
    .then((result) => {
      res.status(200).send(result.rows)
    })
    .catch((err) => {
      console.error(err.stack);
      res.sendStatus(400).end();
      //client.end();
    })
  },

  getSimilarProducts : (req, res) => {
    var productId = req.params.id;
    const conditionsText = `SELECT price, category FROM products WHERE productid = ${productId}`;
    client.query(conditionsText)
    .then((result) => {
      const prodPrice = result.rows[0].price;
      const category = result.rows[0].category;
      const productsText = `SELECT * FROM products WHERE category = ${category} AND price <= ${prodPrice + 50} AND price >= ${prodPrice - 50} LIMIT 8`;
      client.query(productsText)
      .then((result) => {
        var rows = result.rows;
        var products = [];
        for (var i = 0; i < rows.length; i ++) {
          let product = {
            productId: rows[i].productid,
            imageUrl: rows[i].imageurl,
            name: rows[i].name,
            onSale: rows[i].onsale,
            price: rows[i].price,
            rating: rows[i].rating
          }
          products.push(product);
        }
        console.log(`sending products similar to ${productId}`);
        res.status(200).send(products);
      })
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(404).send('product not found');
      //client.end();
    })
  },

  create : (req, res) => {
    console.log("request body", req.body);
    const {name, category, price, rating, imageUrl, onSale} = req.body;
    const insertText = `INSERT INTO products (name, category, price, rating, imageurl, onsale) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [name, category, price, rating, imageUrl, onSale];
    client.query(insertText, values)
    .then((result) => {

      const message = `${result.rows[0].name} added to ${result.rows[0].category}`
      res.status(201).send(message);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send('invalid entry');
      //client.end();
    })
  },

  remove : (req, res) => {
    console.log("DELETE REQUEST PARAMS:", req.params)
    var productId = req.params.id;
    const deleteText = `DELETE FROM products WHERE productid = ${productId} RETURNING *`;
    client.query(deleteText)
    .then((result) => {
      const deletedRow = result.rows[0]
      const message = `${deletedRow.name} removed from ${deletedRow.category}`
      console.log("deleted row: ", deletedRow);
      res.status(200).send(message);
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(404).send('product not found');
      //client.end();
    })
  },

  update : (req, res) => {
    const {name, category, price, rating, imageUrl, onSale} = req.body;
    const productId = req.params.id;
    //refactor: find b.category id range, check if id is within range
    const values = [name, category, price, rating, imageUrl, onSale, productId]
    const updateText = `
      UPDATE products
      SET name = $1,
          category = $2,
          price = $3,
          rating = $4,
          imageurl = $5,
          onsale = $6
      WHERE productid = $7
      RETURNING *`;
    client.query(updateText, values)
    .then((result) => {
      console.log(`updates to ${productId}: name ${result.rows[0].name}, price ${result.rows[0].price}, rating ${result.rows[0].rating}, image ${result.rows[0].imageurl}, sale ${result.rows[0].onsale}`)
      const message = `product number ${result.rows[0].productid} updated`
      res.status(201).send(message);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send('invalid entry');
      //client.end();
    })
  }
}



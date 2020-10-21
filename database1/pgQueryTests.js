const pg = require('./pgQueryTests.js')
const { Client } = require('pg');

const client = new Client({
  user: 'clairemelbourne',
  database: 'similar_prod'
});

client.connect();

//get request from 14000000
const getOne = (productId, res) => {
  const priceText = `SELECT price FROM products WHERE productid = ${productId}`;
  client.query(priceText)
  .then((result) => {
    const price = result.rows[0].price
    const productsText = `SELECT * FROM products WHERE ${getRange(productId, null)} AND price <= ${price + 50} AND price <= ${price - 50} LIMIT 8`;
    client.query(productsText)
    .then((result) => {
      console.log("results of query", result.rows);
    })
  })
  .catch((err) => {
    console.error(err.stack);
    client.end();
  })
}

const create = (req, res) => {
  console.log("request body", req.body);
  const b = req.body
  const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, b.category)}`;
  client.query(idText)
  .then((result) => {
  console.log("id", result.rows[0].max)
  var productId = result.rows[0].max + 1;
    var text = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    var values = [productId, b.name, b.category, b.price, b.rating, b.imageUrl, b.onSale];
    client.query(text, values)
    .then((result) => {
      const message = `${result.rows[0].name} added to products`
      res.status(201).send(message);
    })
    .catch(err => {
      console.error('error in insert attempt: ', err.stack);
      res.status(400).send('invalid entry')
    })
  })
  .catch(err => {
    console.error(err);
    res.status(400).send('invalid entry');
    client.end();
  })
}

//delete request from 14040000


//post request for closet


//post request for laundry

//put request for 14030001
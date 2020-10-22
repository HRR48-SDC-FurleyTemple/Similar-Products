const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  database: 'similar_prod'
});

client.connect();

const getRange = (id, category) => {
  if (id > 12060000 || category === 'laundry') {
    // 'laundry': 12060001 - 14070000
    return 'productid >= 12060001 AND productid <= 14070000';
  } else if (id > 10050000 || category === 'closet') {
    // 'closet': 10050001 - 12060000,
    return 'productid >= 10050001 AND productid <= 12060000';
  } else if (id > 8040000 || category === 'bathroom') {
    // 'bathroom' 8040001 - 10050000,
    return 'productid >= 8040001 AND productid <= 10050000';
  } else if (id > 6030000 || category === 'bedroom') {
    // 'bedroom' 6030001 - 8040000,
    return 'productid >= 6030001 AND productid <= 8040000';
  } else if (id > 4020000 || category === 'dining') {
    // 'dining'4020001 - 6030000,
    return 'productid >= 4020001 AND productid <= 6030000';
  } else if (id > 2010000 || category === 'kitchen') {
    // 'kitchen': 2010001 - 4020000,
    return 'productid >= 2010001 AND productid <= 4020000';
  } else {
    //'living-room': 1 - 2010000,
    return 'productid >= 1 AND productid <= 2010000';
  }
}

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
      res.sendStatus(400);
      client.end();
    })
  },

  getSimilarProducts : (req, res) => {
    console.log("REQUEST PARAMS:", req.params)
    var productId = req.params.id;
    const priceText = `SELECT price FROM products WHERE productid = ${productId}`;
    client.query(priceText)
    .then((result) => {
      const price = result.rows[0].price
      const productsText = `SELECT * FROM products WHERE ${getRange(productId, null)} AND price <= ${price + 50} AND price >= ${price - 50} LIMIT 8`;
      client.query(productsText)
      .then((result) => {
        console.log("results of query", result.rows);
        res.status(200).send(result.rows);
      })
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(404).send('product not found');
      client.end();
    })
  },

  create : (req, res) => {
    console.log("request body", req.body);
    const reqBody = req.body;
    console.log('category, ', reqBody.category);
    const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, reqBody.category)}`;
    client.query(idText)
    .then((result) => {
      console.log("inside request", result.rows)
      const productId = result.rows[0].max + 1;
      const insertText = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const values = [productId, reqBody.name, reqBody.category, reqBody.price, reqBody.rating, reqBody.imageUrl, reqBody.onSale];
      client.query(insertText, values)
      .then((result) => {
        const message = `${result.rows[0].name} added to products`
        res.status(201).send(message);
      })
      .catch(err => {
        console.error('inside insert query: ', err);
        res.status(400).send('invalid entry')
      })
    })
    .catch(err => {
      console.error(err);
      res.status(400).send('invalid entry');
      client.end();
    })
  },

  remove : (req, res) => {
    console.log("DELETE REQUEST PARAMS:", req.params)
    var productId = req.params.id;
    const deleteText = `DELETE FROM products WHERE productid = ${productId} RETURNING *`;
    client.query(deleteText)
    .then((result) => {
      const deletedRow = result.rows[0]
      const message = `${deletedRow.name} removed from db`
      console.log("deleted row: ", deletedRow);
      res.status(200).send(message);
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(404).send('product not found');
      client.end();
    })
  },


  update : (req, res) => {
    console.log("request body", req.body);
    const reqBody = req.body;
    var productId = req.params.id;
    //refactor: find b.category id range, check if id is within range
    const values = [reqBody.name, reqBody.price, reqBody.rating, reqBody.imageUrl, reqBody.onSale, productId]
    const updateText = `
      UPDATE products
      SET name = $1,
          price = $2,
          rating = $3,
          imageurl = $4,
          onsale = $5
      WHERE productid = $6
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
      client.end();
    })
  }
}



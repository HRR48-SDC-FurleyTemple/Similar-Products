const { Client } = require('pg');
const client = new Client({
  user: 'clairemelbourne',
  database: 'similar_prod'
});

client.connect();

getRange = (id, category) => {
  if (id > 12060000 || category === 'laundry') {
    // 'laundry': 12060001 - 14070000
    return 'productid >= 1206001 AND productid <= 14070000';
  } else if (id > 10050000 || category === 'closet') {
    // 'closet': 10050001 - 12060000,
    return 'productid >= 10050001 AND productid <= 1206000';
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
  getOne : (req, res) => {
    console.log("REQUEST PARAMS:", req.params)
    var productId = req.params.id;
    const priceText = `SELECT price FROM products WHERE productid = ${productId}`;
    client.query(priceText)
    .then((result) => {
      const price = result.rows[0].price
      const productsText = `SELECT * FROM products WHERE ${getRange(productId, null)} AND price <= ${price + 50} AND price <= ${price - 50} LIMIT 8`;
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
    const b = req.body
    const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, b.category)}`;
    client.query(idText)
    .then((result) => {
    console.log(result.rows[0].max)
    var productId = result.rows[0].max + 1;
      var text = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      var values = [productId, b.name, b.category, b.price, b.rating, b.imageUrl, b.onSale];
      client.query(text, values)
      .then((result) => {
        const message = `${result.rows[0].name} added to products`
        res.status(201).send(message);
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

  //fix table parameters to accept longer url
  update : (req, res) => {
    console.log("request body", req.body);
    const b = req.body;
    var productId = req.params.id;
    //refactor: find b.category id range, check if id is within range
    const values = [b.name, b.price, b.rating, b.imageUrl, b.onSale, productId]
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

// const create = (req, res) => {
//   console.log(req);
//   const category = 'living';
//   const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, category)}`;
//   client.query(idText)
//   // client.query(`SELECT MAX(productid) FROM products WHERE productid >= 1206001 AND productid <= 14070000`)
//   .then((result) => {
//     console.log(result.rows[0].max)
//     //var b = req.body
//     var productId = result.rows[0].max + 1;
//     var text = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
//     //var values = [productId, b.name, b.category, b.price, b.rating, b.imageUrl, b.onSale];
//     const values = [productId, 'bucket', 'bathroom', 20, 3.5, 'http', true]
//     client.query(text, values)
//     .then((res) => {
//       console.log(res.rows[0])
//     })
//   })
//   .catch(err => {
//     console.error(err)
//   })
// }

// create();
  // client
  //   .query("CREATE TABLE product(id SERIAL PRIMARY KEY, name VARCHAR(80), rating REAL, price REAL, sale BOOLEAN, category VARCHAR(80))")
  //   .then(res => console.log(res))
  //   .catch((err) => {
  //     console.error(err.stack)
  //     client
  //     .query("DROP DATABASE similar_products")
  //     .then(res => console.log(res))
  //     .catch(err => console.error(err))
  //   })
  // })
// client
//   .query("CREATE DATABASE test3")
//   .then((res) => {
//     console.log(res)
//     client
//     .query("CREATE TABLE product(name text NOT NULL)")
//     .then(res => console.log(res))
//     .catch(err => console.error(err.stack))
//   })
//   .catch(err => console.error(err.stack))
// client.query('SELECT $1::text as message', ['HELLO WORLD!'], (err,res) => {
//   console.log(err ? err.stack : res.rows[0].message);
//   client.end();
// })

// client
//   .query('SELECT NOW() as currentTime')
//   .then(res => console.log(res.rows[0]))
//   .catch(e => console.error(e.stack))

// const text = 'INSERT INTO products(name, category) VALUES ($1, $2) RETURNING *';
// const values = ['foam rug', 'useful floor thing']
// client
//   .query(text, values)
//   .then(res => {
//     console.log(res.rows[0])
//     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//   })
//   .catch(e => console.error(e.stack))
// const query = {
//   text: 'SELECT $1::text as first_name',
//   values: ['Brian'],
//   rowMode: 'array',
// }
// // callback
// client.query(query, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.fields.map(field => field.name)) // ['first_name', 'last_name']
//     console.log(res.rows[0]) // ['Brian', 'Carlson']
//   }
// })


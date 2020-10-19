const { Client } = require('pg');
const client = new Client({
  user: 'clairemelbourne',
  database: 'similar_prod'
});

client.connect();

getIdRange = (id) => {
  if ( id > 12060000) {
     // 'laundry': 12060001 - 14070000
    return 'productid >= 1206001 AND productid <= 14070000';
  } else if (id > 10050000) {
    // 'closet': 10050001 - 12060000,
    return 'productid >= 10050001 AND productid <= 1206000';
  } else if (id > 8040000) {
    // 'bathroom' 8040001 - 10050000,
    return 'productid >= 8040001 AND productid <= 10050000';
  } else if (id > 6030000) {
     // 'bedroom' 6030001 - 8040000,
    return 'productid >= 6030001 AND productid <= 8040000';
  } else if (id > 4020000) {
     // 'dining'4020001 - 6030000,
    return 'productid >= 4020001 AND productid <= 6030000';
  } else if (id > 2010000) {
    // 'kitchen': 2010001 - 4020000,
    return 'productid >= 2010001 AND productid <= 4020000';
  } else {
    //'living-room': 1 - 2010000,
    return 'productid >= 1 AND productid <= 2010000';
  }
}

module.exports = {
  getOne : (req, res) => {
    var productId = req.params.id;
    var prodPrice = req.body.price;
    console.log(prodPrice, "req from server")
    client.query(`SELECT * FROM products WHERE ${getIdRange(productId)} AND price <= ${prodPrice + 50} AND price <= ${prodPrice - 50} LIMIT 8`)
     .then((result) => {
       console.log("results of query", result.rows);
       res.status(200).send(result.rows);
     })
     .catch((err) => {
       console.error(err.stack);
       client.end();
     })
   }
}


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


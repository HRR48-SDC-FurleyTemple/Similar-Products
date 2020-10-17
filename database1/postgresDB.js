const { Client } = require('pg');
const initialDb = new Client({
  user: 'clairemelbourne',
  database: 'postgres'
});

initialDb.connect();

initialDb
  .query("CREATE DATABASE similar_products")
  .then((res) => {
    console.log(res)
    initialDb
    .end()
    .then(() => {
      console.log('set db client disconnected');
      const client = new Client({
        user: 'clairemelbourne',
        database: 'similar_products'
      })
      client
      .query("CREATE TABLE product(id SERIAL PRIMARY KEY, name VARCHAR(80), rating REAL, price REAL, sale BOOLEAN, category VARCHAR(80))")
      .then((res) => {
        console.log(res);
        client
        .end()
        .then(() => console.log("similar_products disconnected"))
        .catch(err => console.error(err))
      })
      .catch((err) => {
      console.error(err.stack)
      })
    })
  })
  .catch((err) => {
    console.error(err.stack)
  })


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


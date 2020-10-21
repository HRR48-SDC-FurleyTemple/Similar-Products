const cass = require('cassandra-driver');

const client = new cass.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'similar_prod'
});

const getRange = (id, category) => {
  if (id > 12060000 || category === 'laundry') {
    // 'laundry': 12060001 - 14070000
    return [12060001, 14070000];
  } else if (id > 10050000 || category === 'closet') {
    // 'closet': 10050001 - 12060000,
    return [10050001, 12060000];
  } else if (id > 8040000 || category === 'bathroom') {
    // 'bathroom' 8040001 - 10050000,
    return [8040001, 10050000];
  } else if (id > 6030000 || category === 'bedroom') {
    // 'bedroom' 6030001 - 8040000,
    return [6030001, 8040000];
  } else if (id > 4020000 || category === 'dining') {
    // 'dining'4020001 - 6030000,
    return [4020001, 6030000];
  } else if (id > 2010000 || category === 'kitchen') {
    // 'kitchen': 2010001 - 4020000,
    return [2010001, 4020000];
  } else {
    //'living-room': 1 - 2010000,
    return [1, 2010000];
  }
};

client.connect();
module.exports = {
  getOne : (request, response) => {
    console.log("get params received in model: ", request.params);
    const productId = request.params.id;
    //const productId = 7;
    const query = `SELECT * FROM products WHERE productid = ?`;
    client.execute(query, [productId], {prepare: true})
    .then(result => {
      const row = result.rows[0];
      console.log("price result", row.price)
      const low = parseInt(row.price) - 50;
      const high = parseInt(row.price) + 50;
      const values = getRange(productId, null).concat(low, high);
      console.log(values, "values look like this")
      const query = `SELECT * FROM products WHERE productid >= ? AND productid <= ? AND price >= ? AND price <= ? limit 8 allow filtering`;
      client.execute(query, values, {prepare: true})
      .then(result => {
        console.log(result.rows, "<---similar products");
        response.status(200).send(result.rows)
      })
    })
    .catch(err => {
      console.error(err.stack);
      response.status(404).end('product not found')
    })
  },

  create : (request, response) => {
    //console.log("post body received in model: ", request.body)
    const b = request.body;
    console.log('category, ', b.category);
    const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, b.category)}`;
    // .then(result => {

    // })
    // .catch(err => {
    //   console.error(err.stack);
    // })
  },

  remove : (request, response) => {
    console.log("delete request params received in model: ", request.params)
    .then(result => {

    })
    .catch(err => {
      console.error(err.stack);
    })
  },

  update : (request, response) => {
    console.log("put request body received in model: ", request.params)
    .then(result => {

    })
    .catch(err => {
      console.error(err.stack);
    })
  }
}


// const getOne = (request, response) => {
//   //console.log("get params received in model: ", request.params);
//   //const productId = request.params.id;
//   const productId = 7;
//   const query =`SELECT * FROM products WHERE productid = ?`;
//   client.execute(query, [productId], {prepare: true})
//   .then(result => {
//     console.log(result.rows[0])
//     response.status(200).send(result.rows[0])
//   })
//   .catch(err => {
//     console.error(err.stack);
//   })
// }
// getOne();
//   .then(() => {
//       const query = "DROP KEYSPACE similar_prod";
//       return client.execute(query);
//     })
//     .catch((err) => {
//       console.error('keyspace not defined or other error: ', err);
//     })
//     .then((result) => {
//       console.log('keyspace dropped: ', result);
//       const query = "CREATE KEYSPACE IF NOT EXISTS similar_prod WITH replication =" + "{'class': 'SimpleStrategy', 'replication_factor': '1'}";
//       return client.execute(query);
//     })
//     .then((result) => {
//       console.log('keyspace created: ', result);
//       const query = "CREATE TABLE IF NOT EXISTS similar_prod.products" + "(productId int PRIMARY KEY, name text, category text, price decimal, rating decimal, imageUrl text, onSale boolean)"
//       return client.execute(query);
//     })
//     .then((result) => {
//       console.log('table created: ', result);
//       return client.shutdown().then(() => {console.log('connection complete')})
//     })

//     .catch((err) => {
//       console.error('Heres the problem: ', err);
//       return client.shutdown().then(() => { throw err; });
//     })
// }

// createProductsKeyspace();

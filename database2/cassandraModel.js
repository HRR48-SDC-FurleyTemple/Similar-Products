const cass = require('cassandra-driver');

const client = new cass.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'similar_prod'
});

const getStartHighest = (category) => {
  if (category === 'laundry') {
    return 14060000;
  } else if (category === 'closet') {
    return 12050000;
  } else if (category === 'bathroom') {
    return 10040000;
  } else if (category === 'bedroom') {
    return 8030000;
  } else if (category === 'dining') {
    return 6020000;
  } else if (category === 'kitchen') {
    return 4010000;
  } else {
    return 2000000;
  }
};

//  const checkForHighest = (highest) => {
//   const query = `SELECT productId FROM products WHERE productid = ?`;
//   return client.execute(query, [highest], {prepare: true})
//   .then (result => {
//     if (result.rows[0] !== undefined) {
//       highest ++;
//       return checkForHighest(highest);
//     } else {
//       return highest;
//     }
//   })
//   .catch (err => {
//     console.error(err);
//   })
// }
// console.log(checkForHighest(14060000));

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
    console.log("post body received in model: ", request.body)
    const b = request.body;
    let maxId = getStartHighest(b.category);
    const insertQuery = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [b.name, b.category, b.price, b.rating, b.imageUrl, b.onSale];
    checkForHighest(maxId)
    .then(() =>{
      console.log(maxId, "is still here?")
    })
      // console.log(maxId, "new productId")
      // values.unshift(productId);
      // console.log("values", values)
      // client.execute(insertQuery, values, {prepare: true})
      // .then(result => {
      //   console.log("results of insert", result)
      // })
      // .catch(err => {
      //   console.error("callback failed: ", err.stack);
      // })
    //)
    // .then(
    //   console.log('made it to next query')
    // )
    // .catch (err => {
    //   console.error(err);
    // })
    const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, b.category)}`;
  },

  remove : (request, response) => {
    console.log("delete request params received in model: ", request.params);
    const query = `DELETE FROM products WHERE productid = ?`
    const productId = request.params.id;
    console.log(productId)
    client.execute(query, [productId], {prepare: true})
    .then(result => {
      console.log(result, "from removal")
      const message = `${productId} removed from products`
      response.status(200).send(message)
    })
    .catch(err => {
      console.error(err.stack);
      response.status(404).end('invalid request')
    })
  },

  update : (request, response) => {
    console.log("put request body received in model: ", request.body);
    const b = request.body;
    var productId = request.params.id;
    const values = [b.name, b.price, b.rating, b.imageUrl, b.onSale, productId]
    const query = `
      UPDATE products
      SET name = ?,
          price = ?,
          rating = ?,
          imageurl = ?,
          onsale = ?
      WHERE productid = ?`;
    client.execute(query, values, {prepare: true})
    .then(result => {
      response.status(200).send('product updated');
    })
    .catch(err => {
      console.error(err.stack);
      response.status(400).send('invalid request')
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

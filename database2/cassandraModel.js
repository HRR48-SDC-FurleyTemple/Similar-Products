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

const getCatId = (category) => {
  if (category === 'laundry') {
    return 7;
  } else if (category === 'closet') {
    return 6;
  } else if (category === 'bathroom') {
    return 5;
  } else if (category === 'bedroom') {
    return 4;
  } else if (category === 'dining') {
    return 3;
  } else if (category === 'kitchen') {
    return 2;
  } else {
    return 1;
  }
};

client.connect();
module.exports = {
  getSimilarProducts : (request, response) => {
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
    const reqBody = request.body;
    const idQuery = `SELECT productid FROM maxids WHERE category = ? allow filtering`
    client.execute(idQuery, [b.category], {prepare: true})
    .then(result => {
      const rows = result.first();
      const productId = rows.productid + 1;
      const catId = getCatId(b.category);
      const updateQuery = `UPDATE maxids SET productid = ? WHERE id = ?`
      const insertQuery = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const queries = [
        {query: updateQuery, params:[productId, catId]},
        {query: insertQuery, params: [productId, reqBody.name, reqBody.category, reqBody.price, reqBody.rating, reqBody.imageUrl, reqBody.onSale]}
      ]
      return client.batch(queries, {prepare: true})
    })
    .then((result) => {
      console.log("created new product and updated maxIds");
      response.sendStatus(201)
    })
    .catch(err => {
      console.error("create query failed: ", err.stack);
      response.sendStatus(400)
    })
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
    const reqBody = request.body;
    var productId = request.params.id;
    const values = [reqBody.name, reqBody.price, reqBody.rating, reqBody.imageUrl, reqBody.onSale, productId]
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


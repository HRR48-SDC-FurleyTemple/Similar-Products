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

const getEight = (productId) => {
  const query = `SELECT * FROM products WHERE productid = ?`;
  const start = new Date().getTime();
  client.execute(query, [productId], {prepare: true})
  .then(result => {
    const row = result.rows[0];
    const low = parseInt(row.price) - 50;
    const high = parseInt(row.price) + 50;
    const values = getRange(productId, null).concat(low, high);
    const query = `SELECT * FROM products WHERE productid >= ? AND productid <= ? AND price >= ? AND price <= ? limit 8 allow filtering`;
    client.execute(query, values, {prepare: true})
    .then(result => {
      const end = new Date().getTime();
      console.log(
        `cassandra query for 8 products similar to requested product
        time to complete query: ${end - start} ms`
      );
    })
  })
  .catch(err => {
    console.error(err.stack);
  })
}

const remove = (productId) =>{
  const query = `DELETE FROM products WHERE productid = ?`
  const start = new Date().getTime();
  client.execute(query, [productId], {prepare: true})
  .then((result) => {
    var end = new Date().getTime();
    console.log(
      `cassandra query to remove requested product
      time to complete query: ${end - start} ms`
    );
  })
  .catch((err) => {
    console.error(err.stack);
  })
}

const create = (createObj) =>{
  const idQuery = `SELECT productid FROM maxids WHERE category = ? allow filtering`
  var start = new Date().getTime();
  client.execute(idQuery, [createObj.category], {prepare: true})
  .then(result => {
    const rows = result.first();
    const productId = rows.productid + 1;
    const catId = getCatId(createObj.category);
    const updateQuery = `UPDATE maxids SET productid = ? WHERE id = ?`
    const insertQuery = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const queries = [
      {query: updateQuery, params:[productId, catId]},
      {query: insertQuery, params: [productId, createObj.name, createObj.category, createObj.price, createObj.rating, createObj.imageUrl, createObj.onSale]}
    ]
    return client.batch(queries, {prepare: true})
  })
  .then((result) => {
    var end = new Date().getTime();
    console.log(
      `cassandra query to add one product
      time to complete query: ${end - start} ms`
    );
  })
  .catch(err => {
    console.error('inside insert query: ', err);
  })
}

const update = (updateArray) =>{
  var start = new Date().getTime();
  const query = `
    UPDATE products
    SET name = ?,
        price = ?,
        rating = ?,
        imageurl = ?,
        onsale = ?
    WHERE productid = ?`;
  client.execute(query, updateArray, {prepare: true})
  .then((result) => {
    var end = new Date().getTime();
    console.log(
      `cassandra query update requested product
      time to complete query: ${end - start} ms`
      );
  })
  .catch(err => {
    console.error(err);
  })
}

const createValues = {name:'lost snack finder', category: 'laundry', price: 35, rating: 2.5, imageUrl: 'https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture1.jpg', onSale: true}

const updateValues = ['lost sock finder', 100, 3, 'https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture1.jpg', false, 14056978]

client.connect()
update(updateValues)
getEight(14057999)
remove(14060011)
create(createValues)


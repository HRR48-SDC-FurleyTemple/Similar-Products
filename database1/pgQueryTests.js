const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  database: 'similar_prod'
});


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

const getEight = (productId) => {
  const priceText = `SELECT price FROM products WHERE productid = ${productId}`;
  var start = new Date().getTime();
  client.query(priceText)
  .then((result) => {
    const price = result.rows[0].price
    const productsText = `SELECT * FROM products WHERE ${getRange(productId, null)} AND price <= ${price + 50} AND price >= ${price - 50} LIMIT 8`;
    return client.query(productsText)
  })
  .then((result) => {
    var end = new Date().getTime();
    console.log(
      `postgres query for 8 products similar to requested product
      time to complete query: ${end - start} ms`
    );
  })
  .catch((err) => {
    console.error(err.stack);
  })
}

const remove = (productId) =>{
  const deleteText = `DELETE FROM products WHERE productid = ${productId} RETURNING *`;
  var start = new Date().getTime();
  client.query(deleteText)
  .then((result) => {
    var end = new Date().getTime();
    const deletedRow = result.rows[0]
    console.log(
      `postgres query to delete requested product
      time to complete query: ${end - start} ms`
      );
  })
  .catch((err) => {
    console.error(err.stack);
  })
}

const create = (createObj) =>{
  const idText = `SELECT MAX(productid) FROM products WHERE ${getRange(null, createObj.category)}`;
  var start = new Date().getTime();
  client.query(idText)
  .then((result) => {
    const productId = result.rows[0].max + 1;
    let values = Object.values(createObj);
    values.unshift(productId)
    const insertText = `INSERT INTO products (productid, name, category, price, rating, imageurl, onsale) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    return client.query(insertText, values)
  })
  .then((result) => {
    var end = new Date().getTime();
    console.log(
      `postgres query to add product
      time to complete query: ${end - start} ms`
      );
  })
  .catch(err => {
    console.error('inside insert query: ', err);
  })
}

const update = (updateArray) =>{
  const updateText = `
    UPDATE products
    SET name = $1,
        price = $2,
        rating = $3,
        imageurl = $4,
        onsale = $5
    WHERE productid = $6
    RETURNING *`;
  var start = new Date().getTime();
  client.query(updateText, updateArray)
  .then((result) => {
    var end = new Date().getTime();
    console.log(
      `postgres to update requested product
      time to complete query: ${end - start} ms`
      );
  })
  .catch(err => {
    console.error(err);
  })
}

const createValues = {name:'lost snack finder', category: 'laundry', price: 35, rating: 2.5, imageUrl: 'https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture1.jpg', onSale: true};

const updateValues = ['lost sock finder', 23, 3, 'https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture1.jpg', false, 14056978];

client.connect();
update(updateValues)
getEight(14057999)
remove(14060011)
create(createValues)


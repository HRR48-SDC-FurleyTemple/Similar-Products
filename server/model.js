const Furniture = require('../database-mongodb/Furniture');

module.exports = {
  createItem: (requestBody, callback) => {
    Furniture.find({}).sort({id: -1}).limit(1)
    .then((res) => {
      requestBody.id = res[0].id + 1;
      Furniture.create(requestBody)
      .then((result) => {
        callback(result, null)
      })
    })
    .catch((error) => {
      callback(null, error)
    })
  },

  updateItem: (id, name, body, callback) => {
    Furniture.updateOne({id: id, name: name}, {
      name: body.name,
      category: body.category,
      price: body.price,
      rating: body.rating,
      imageUrl: body.imageUrl,
      onSale: body.onSale
    })
    .then((result) => {
      callback(result, null);
    })
    .catch((error) => {
      callback(null, error);
    })
  },

  deleteSimilarItems: (id, callback) => {
    Furniture.deleteMany({id: id})
    .then((result) => {
      callback(result, null);
    })
    .catch((error) => {
      callback(null, result);
    })
  }
}
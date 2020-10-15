const faker = require('faker');

const furnitureArr = [];

//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;
//At 1 million there is about 1 second delay to execute function. Plan to seed db in increments of 1m to start --> run createProductEntry to generate 1m, seed db, run createProductEntry again to reach 10m
const createProductEntry = () => {
  var photoIndex = 1
  for (var i = 1; i < 1000001; i ++) {
    let sampleFurniture = {
      id: i,
      name: faker.commerce.productName(),
      category: faker.commerce.product(),
      price: faker.random.number({min: 20, max: 1000}),
      rating: faker.random.number({min: 1, max: 5, precision: 0.5}),
      imageUrl: `https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture${photoIndex}.jpg`,
      onSale: faker.random.boolean()
    }
    if (photoIndex === photoLibrarySize) {
      photoIndex = 1;
    } else {
      photoIndex += 1;
    }
    furnitureArr.push(sampleFurniture);
  }
  return furnitureArr;
}

const seedData = createProductEntry();

module.exports = seedData;

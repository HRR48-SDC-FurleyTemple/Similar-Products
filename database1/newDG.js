const faker = require('faker');
const fs = require('fs');

//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;
let dataWriter = fs.createWriteStream(`data/primary-records.csv`);

dataWriter.write('name,category,price,rating,imageUrl,onSale');
const max = 20000000;

var i = 0;

const createProductEntries = () => {
  var ok = true;
  var photoIndex = 1

  do {
    let values = {
      name: faker.commerce.productName(),
      price: faker.random.number({min: 20, max: 1000}),
      rating: faker.random.number({min: 1, max: 5, precision: 0.5}),
      imageUrl: `https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture${photoIndex}.jpg`,
      onSale: faker.random.boolean(),
      //onSale: faker.random.number({min: 0, max: 1}),
      category: faker.random.number({min: 1, max: 8})
    }
    if (photoIndex === photoLibrarySize) {
      photoIndex = 1;
    } else {
      photoIndex += 1;
    }
    let furnitureString = `\n${values.name},${values.category},${values.price},${values.rating},${values.imageUrl},${values.onSale}`;

    i++;

    if (i === max) {
      dataWriter.write(furnitureString);
    } else {
      ok = dataWriter.write(furnitureString);
    }
  } while (i <= max && ok);
  if (i <= max) {
      dataWriter.once('drain', createProductEntries);
  }
}

createProductEntries();


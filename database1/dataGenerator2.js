const faker = require('faker');
const fs = require('fs');

//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;
let dataWriter = fs.createWriteStream(`data/primary-records.csv`);

dataWriter.write('productId, name, category, price, rating, imageUrl, onSale');

const max = 14000000;

var i = 1;

//Creates 1.44 mill records for a category
//INDEXES/PRODUCT ID's
    //'living-room': 1 - 1440000,
    // 'kitchen': 1440000 - 2880000,
    // 'dining'2880001 - 4320000,
    // 'bedroom' 4320001 - 5760000,
    // 'bathroom' 5760001 - 7200000,
    // 'closet': 7200001 - 8640000,
    // 'laundry': 8640001 - 10080000


const createProductEntries = () => {
  var ok = true;
  var photoIndex = 1

  const setCategory = (i) => {
    if ( i > 12000000) {
      return 'laundry';
    } else if (i > 10000000) {
      return 'closet';
    } else if (i > 8000000) {
      return 'bathroom';
    } else if (i > 6000000) {
      return 'bedroom';
    } else if (i > 4000000) {
      return 'dining';
    } else if (i > 2000000) {
      return 'kitchen';
    } else {
      return 'living';
    }
  }

  do {
    let values = {
      productId: i,
      name: faker.commerce.productName(),
      price: faker.random.number({min: 20, max: 1000}),
      rating: faker.random.number({min: 1, max: 5, precision: 0.5}),
      imageUrl: `https://cem-sdc.s3.us-east-2.amazonaws.com/ph0t0s/furniture${photoIndex}.jpg`,
      onSale: faker.random.boolean(),
      category: setCategory(i)
    }
    if (photoIndex === photoLibrarySize) {
      photoIndex = 1;
    } else {
      photoIndex += 1;
    }
    let furnitureString = `\n${values.productId}, ${values.name}, ${values.category}, ${values.price}, ${values.rating}, ${values.imageUrl}, ${values.onSale}`
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


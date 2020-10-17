const faker = require('faker');
const fs = require('fs');

//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;
let dataWriter = fs.createWriteStream(`data/primary-records.csv`);

dataWriter.write('productId, name, category, price, rating, imageUrl, onSale');

const max = 14000000;

var i = 1;

//Creates 14 mill records, 2 mill for each category
//INDEXES/PRODUCT ID's
    //'living-room': 1 - 2000000,
    // 'kitchen': 2000001 - 4000000,
    // 'dining'4000001 - 6000000,
    // 'bedroom' 6000001 - 8000000,
    // 'bathroom' 8000001 - 10000000,
    // 'closet': 10000001 - 12000000,
    // 'laundry': 12000001 - 14000000


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


const faker = require('faker');
const fs = require('fs');

//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;
let dataWriter = fs.createWriteStream(`data/primary-records.csv`);

dataWriter.write('productId,name,category,price,rating,imageUrl,onSale');
//Leaves 10000 ids open per category to avoid having to shift all the product ids when a new one is added
const max = 14060000;

var i = 1;

//Creates 14 mill records, 2 mill for each category
//INDEXES/PRODUCT ID's
    //'living-room': 1 - 2010000,
    // 'kitchen': 2010001 - 4020000,
    // 'dining'4020001 - 6030000,
    // 'bedroom' 6030001 - 804000,
    // 'bathroom' 8040001 - 10050000,
    // 'closet': 10050001 - 12060000,
    // 'laundry': 12060001 - 14070000


const createProductEntries = () => {
  var ok = true;
  var photoIndex = 1

  const setCategory = (i) => {
    if ( i > 12060000) {
      return 'laundry';
    } else if (i > 10050000) {
      return 'closet';
    } else if (i > 8040000) {
      return 'bathroom';
    } else if (i > 6030000) {
      return 'bedroom';
    } else if (i > 4020000) {
      return 'dining';
    } else if (i > 2010000) {
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
      //onSale: faker.random.number({min: 0, max: 1}),
      category: setCategory(i)
    }
    if (photoIndex === photoLibrarySize) {
      photoIndex = 1;
    } else {
      photoIndex += 1;
    }
    let furnitureString = `\n${values.productId},${values.name},${values.category},${values.price},${values.rating},${values.imageUrl},${values.onSale}`;

    if (i === 2000000 || i === 4010000 || i === 6020000 || i === 8030000 || i === 10040000 || i === 12050000) {
      i += 10001
    } else {
      i++;
    }

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

const createMaxIdTable = () => {
  let maxIdWriter = fs.createWriteStream(`data/max-ids.csv`)
  const categories = ['living', 'kitchen', 'dining', 'bedroom', 'bathroom', 'closet', 'laundry'];
  const maxIds = [2000000, 4010000, 6020000, 8030000, 10040000, 12050000, 14060000];
  let csvString = 'id,category,productId\n';
  for (var i = 0; i < categories.length; i++) {
    csvString += `${i + 1},${categories[i]},${maxIds[i]}\n`
  }
  console.log(csvString)
  maxIdWriter.write(csvString);
}
//createProductEntries();
createMaxIdTable()

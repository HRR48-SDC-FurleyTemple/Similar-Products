const faker = require('faker');
const fs = require('fs');

const furnitureArr = [];




//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;
//At 1 million there is about 1 second delay to execute function. Plan to seed db in increments of 1m to start --> run createProductEntry to generate 1m, seed db, run createProductEntry again to reach 10m
//OJO!! if you are going to run this multiple times you need to handle id number
//let primaryRecWriter = fs.createWriteStream(`primaryRecs/`)
  //open stream to write csv headers:
  //products table
  //id, category
    //category (living, kitchen, dining, bedroom, bathroom, closet, laundry)
const createProductEntry = (category, indexStart) => {
  let categoriesWriter = fs.createWriteStream(`csvFiles/categories/${category}.csv`)
  categoriesWriter.write('productId, price, rating, imageUrl, onSale');
  var photoIndex = 1
  for (var i = indexStart; i < indexStart + 1440000; i ++) {
    let values = {
      productId: i,
      name: faker.commerce.productName(),
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
    let furnitureString = `\n${values.productId}, ${values.price}, ${values.rating}, ${values.imageUrl}, ${values.onSale}`
    categoriesWriter.write(furnitureString);
    //furnitureArr.push(sampleFurniture);
  }
  return furnitureArr;
}



//create a csv file path
//create a file writer function
//in file writer, create headers for keys
//in file appender, add object as string with commas to file
const categories = ['living-room', 'kitchen', 'dining', 'bedroom', 'bathroom', 'closet', 'laundry']
const generateData = (fileNames) => {
  var index = 1
  for (var i = 0; i < categories.length; i ++){
    createProductEntry(categories[i], index);
    index += 1440000;
  }
}

generateData(categories);

//module.exports = seedData;

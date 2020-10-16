const faker = require('faker');
const fs = require('fs');

//current S3 library holds 101 photos. Will adapt variable when I have more photos.
const photoLibrarySize = 101;

//Creates 1.44 mill records for a category
//INDEXES/PRODUCT ID's
    //'living-room': 1 - 1440000,
    // 'kitchen': 1440000 - 2880000,
    // 'dining'2880001 - 4320000,
    // 'bedroom' 4320001 - 5760000,
    // 'bathroom' 5760001 - 7200000,
    // 'closet': 7200001 - 8640000,
    // 'laundry': 8640001 - 10080000

const createProductEntry = (category, indexStart) => {
  let categoriesWriter = fs.createWriteStream(`primary-records/${category}.csv`)
  categoriesWriter.write('productId, name, category, price, rating, imageUrl, onSale');
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
    let furnitureString = `\n${values.productId}, ${values.name}, ${category}, ${values.price}, ${values.rating}, ${values.imageUrl}, ${values.onSale}`
    categoriesWriter.write(furnitureString);
  }
}
//loops over each category, invoking createProductEntry for each and incrementing index to the next group of ids
const generateData = (fileNames) => {
  var index = 1
  for (var i = 0; i < categories.length; i ++){
    createProductEntry(categories[i], index);
    index += 1440000;
  }
}
const categories = ['living-room', 'kitchen', 'dining', 'bedroom', 'bathroom', 'closet', 'laundry'];

generateData(categories);


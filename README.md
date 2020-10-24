# Similar-Products

> This module requests similar products from the database for a product and displays them in a carousel below product view and information

## Related Projects


## Usage
> To begin install dependencies: npm install
>
> To load seeded database, you will need PostgreSQL installed on your machine.
>
> Generate data to a csv file with the following command in the terminal from SimilarProducts root folder : npm run generate
>
> Then follow these steps in the psql terminal:

>   1. Make db:
> Copy this into the terminal and enter:
>
> CREATE DATABASE similar_prod;
>
>   2. Make table:
> Copy this into the terminal and enter:
>
> CREATE TABLE products (productId INT PRIMARY KEY, name VARCHAR(200) NOT NULL, category VARCHAR(200) NOT NULL, price REAL NOT NULL, rating REAL, imageurl VARCHAR(200), onSale BOOLEAN DEFAULT false);
>
>   3. Seed table:
> Copy this into the terminal and enter:
>
> COPY products(productid, name, category, price, rating, imageurl, onSale) from '/Users/clairemelbourne/Desktop/ProjectPhase/SDC/SimilarProducts/data/primary-records.csv' DELIMITER ',' CSV HEADER;

To activate development version of site:

> In their own terminals:

> Start server: npm run server-dev

> webpack bundle watch for development: npm run react-dev

> To access in browser, visit http://localhost:3001


CRUD operations accessed at the following endpoints:

GET /api/similarProducts/products/:id - Returns all similar products for a given id
POST /api/similarProducts/products - Creates a new product at a new id
DELETE /api/similarProducts/products/:id - Deletes all similar product listings for a product
PUT /api/similarProducts/products/:id/:name - Updates an individual similar product by name, for the product at the given id

## Requirements

- Node v12.18.3




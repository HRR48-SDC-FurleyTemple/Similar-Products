# Similar-Products

> This module requests similar products from the database for a product and displays them in a carousel below product view and information

## Related Projects


## Usage

> From root directory:

> Install dependencies: npm install


> Seed mongodb database: npm run db:setup

> In their own terminals:

> Start server: npm run server-dev

> webpack bundle watch for development: npm run react-dev

> To access in browser, visit http://localhost:3001

All products in the database are designated to a primary product's id. As such, a GET request retrieves all products designated with the primary product. However, a PUT request targets a specific product by the primary product id and the specific product name. 

CRUD operations accessed at the following endpoints:

GET /api/similarProducts/products/:id - Returns all similar products for a given id
POST /api/similarProducts/products - Creates a new product at a new id
DELETE /api/similarProducts/products/:id - Deletes all similar product listings for a product
PUT /api/similarProducts/products/:id/:name - Updates an individual similar product by name, for the product at the given id

## Requirements

- Node v12.18.3




const mongoose = require('mongoose');
const request = require('supertest');
const { response } = require('../server/app');
const app = require('../server/app');

describe('Server Tests', () => {
    let server;

    beforeAll(async (done) => {
        await mongoose.connect('mongodb://localhost/mykea');
        server = app.listen(3000, () => {
          global.agent = request.agent(server);
          done();
        });
    });

    afterAll(async () => {
        await server.close();
        await mongoose.disconnect();
    });

    test('Server should respond to GET request', () => {
        return request(app)
          .get('/api/similarProducts/products/2000000')
          .then(response => {
              expect(response.statusCode).toBe(200);
          });
    });
});
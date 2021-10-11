require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todos', async() => {

      const expectation = [
        {
          'id': expect.any(Number),
          'job': expect.any(String),
          'status': false,
          'due': expect.any(String),
          'owner_id': expect.any(Number)
        }
      ];

      const data = await fakeRequest(app)
        .post('/api/todoLists')
        .send(
          {
            'id': expect.any(Number),
            'job': expect.any(String),
            'status': false,
            'due': expect.any(String),
            'owner_id': expect.any(Number)
          }
        )
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('get todos', async() => {

      const expectation = [
        {
          'id': expect.any(Number),
          'job': expect.any(String),
          'status': false,
          'due': expect.any(String),
          'owner_id': expect.any(Number)
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todoLists/')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('update todos', async() => {

      const expectation = [{
        'id': expect.any(Number),
        'job': expect.any(String),
        'status': true,
        'due': expect.any(String),
        'owner_id': expect.any(Number)
      }];

      const data = await fakeRequest(app)
        .put('/api/todoLists/2')
        .send({
          job: expect.any(String),
          status: true,
          due: expect.any(String)
        }
        )
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});

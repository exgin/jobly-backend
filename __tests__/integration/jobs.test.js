const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

// import our config
const { beforeEachFn, TEST_DATA } = require('./config-tests');

beforeEach(async function () {
  await beforeEachFn(TEST_DATA);
});

describe('GET /jobs', function () {
  test('show all jobs', async function () {
    const result = await request(app).get('/jobs');
    // should be only 1 since we're only making 1 test job | jobs.body is empty?
    console.log(result.body);
  });
});

afterEach(async function () {
  try {
    await db.query('TRUNCATE jobs');
  } catch (error) {
    console.error(error);
  }
});

afterAll(async function () {
  try {
    await db.end();
  } catch (error) {
    console.error(error);
  }
});

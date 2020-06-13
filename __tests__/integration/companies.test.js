const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

// import our config
const { beforeEachFn, TEST_DATA } = require('./config-tests');

beforeEach(async function () {
  await beforeEachFn(TEST_DATA);
});

describe('GET /companies', function () {
  test('show all companies', async function () {
    const result = await request(app).get('/companies');
    // should be only 1 since we're only making 1 test company
    expect(result.body.companies).toHaveLength(1);
    expect(result.body.companies[0]).toHaveProperty('handle');
  });
});

describe('GET /companies/:handle', function () {
  test('get a specific comapny', async function () {
    const result = await request(app).get(`/companies/${TEST_DATA.currCompany.handle}`);
    expect(result.body.company.handle).toBe('test');
  });

  //   test('return error when getting an unknown :handle', async function () {
  //     const result = await request(app).get(`companies/sadsadw`);
  //     expect(result.statusCode).toBe(404);
  //   });
});

describe('POST /companies', function () {
  test('should create a new company', async function () {
    const result = await request(app).post('/companies').send({ handle: 'test', name: 'Test' });
    expect(result.statusCode).toBe(200);
    expect(result.body.company).toHaveProperty('handle');
  });
});

describe('PATCH /companies/:handle', function () {
  test('should update a company', async function () {
    const result = await request(app)
      .patch(`/companies/${TEST_DATA.currCompany.handle}`)
      .send({ company: { name: 'notest' } });
    //  was just passsing, not sure while failing now
    expect(result.body.company.name).toBe('notest');
    expect(result.body.company).toHaveProperty('handle');
  });
});

describe('DELETE /companies/:handle', function () {
  test('should delete a company', async function () {
    const result = await request(app).delete(`/companies/${TEST_DATA.currCompany.handle}`);
    expect(result.statusCode).toBe(200);
  });
});

afterEach(async function () {
  try {
    await db.query('TRUNCATE companies');
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

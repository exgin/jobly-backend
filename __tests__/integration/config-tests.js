const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../db');

const TEST_DATA = {};

// used to find each respective token for every route
async function beforeEachFn(TEST_DATA) {
  try {
    // create a query for our companies test db
    const companyResult = await db.query(
      `INSERT INTO companies (handle, name, num_employees)
                                 VALUES ($1, $2, $3) RETURNING *`,
      ['test', 'Test Company', 6999]
    );
    // set to our global object
    TEST_DATA.currCompany = companyResult.rows[0];

    // create a query for our jobs test db
    const jobsResult = await db.query(
      `INSET INTO jobs (title, salary, equity, company_handle)
                                     VALUES ($1, $2, $3, $4) RETURNING *`,
      ['sde', 10.25, 0.5, TEST_DATA.currCompany.handle]
    );

    // set to our global object
    TEST_DATA.job = jobsResult.rows[0];
  } catch (error) {
    return console.error(error);
  }
}

module.exports = { beforeEachFn, TEST_DATA };

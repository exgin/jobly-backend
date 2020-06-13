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
    const result = await db.query(
      `INSERT INTO companies (handle, name, num_employees)
                                 VALUES ($1, $2, $3) RETURNING *`,
      ['test', 'Test Company', 6999]
    );
    // set to our global object
    TEST_DATA.currCompany = result.rows[0];
  } catch (error) {
    return console.log(error);
  }
}

module.exports = { beforeEachFn, TEST_DATA };

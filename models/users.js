const db = require('../db');
const ExpressError = require('../helpers/ExpressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const bcrypt = require('bcrypt');

const BCRYPT_WORK_FACTOR = 10;

class User {
  // authenticate a user for logging in
  static async authenticate(data) {
    const result = await db.query(
      `SELECT username, password, first_name, last_name, email, photo_url, is_admin
                                   FROM users
                                   WHERE username = $1`,
      [data.username]
    );

    const user = result.rows[0];

    // make sure the password is correct
    if (user) {
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (isValidPassword) {
        return user;
      } else {
        throw new ExpressError(`Invalid username/password. Try again.`, 401);
      }
    }
  }

  // show all users
  static async findAll() {
    const result = await db.query(`SELECT username, first_name, last_name, email, photo_url, is_admin
                                   FROM users`);
    const users = result.rows;
    return users;
  }

  // show a specific user
  static async find(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, photo_url 
                                   FROM users
                                   WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (user === undefined) {
      throw new ExpressError(`${username} not found. Try a different username`, 404);
    }

    const jobResult = await db.query(
      `SELECT j.title, j.company_handle, a.state, a.created_at
                                      FROM applications AS a
                                      JOIN jobs as j ON j.id = a.job_id
                                      WHERE username = $1`,
      [username]
    );

    user.jobs = jobResult.rows;

    return user;
  }

  // create a user
  static async create(data) {
    // check if there are duplicate usernames
    const isDuplicate = await db.query(`SELECT username FROM users WHERE username = $1`, [data.username]);

    if (isDuplicate.rows[0]) {
      throw new ExpressError(`Username already exists with: ${data.username}`, 404);
    }

    // hash our password
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    // insert our data into the db
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, photo_url)
                                   VALUES ($1, $2, $3, $4, $5, $6)
                                   RETURNING *`,
      [data.username, hashedPassword, data.first_name, data.last_name, data.email, data.photo_url]
    );

    const user = result.rows[0];

    return user;
  }

  // patch a user
  static async update(username, data) {
    let { query, values } = sqlForPartialUpdate('users', data, 'username', username);
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (user === undefined) {
      throw new ExpressError(`Can not update unknown user: ${username}`, 404);
    }

    return user;
  }

  // delete a user
  static async remove(username) {
    const result = await db.query(`DELETE FROM users WHERE username = $1`, [username]);

    const user = result.rows[0];

    if (user === undefined) {
      throw new ExpressError(`Can not delete unknown user ${username}`, 404);
    }
  }
}

module.exports = User;

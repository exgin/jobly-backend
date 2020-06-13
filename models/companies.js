const db = require('../db');
const ExpressError = require('../helpers/ExpressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class Company {
  constructor({ handle, name, num_employees, description, logo_url, jobs }) {
    this.handle = handle;
    this.name = name;
    this.num_employees = num_employees;
    this.description = description;
    this.logo_url = logo_url;
    this.jobs = jobs;
  }

  // find all companies
  static async findAll() {
    const results = await db.query(`SELECT handle, name FROM companies`);

    // since we're working on instacnes, we make each one & return it
    // , also could just 'return result.rows'
    return results.rows.map((company) => new Company(company));
  }

  // make a company object to handle as an instance
  static create(companyData) {
    const company = new Company(companyData);

    return company;
  }

  static async find(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
                                    FROM companies
                                    WHERE handle = $1`,
      [handle]
    );

    const company = result.rows[0];

    if (company === undefined) {
      const error = new ExpressError(`No company found with handle: ${handle}`);
      error.status = 404;
      throw error;
    }

    const jobsResult = await db.query(
      `SELECT id, title, salary, equity
                                       FROM jobs
                                       WHERE company_handle = $1`,
      [handle]
    );

    // set a new property on company | apply EVERY job.
    company.jobs = jobsResult.rows;

    return new Company(company);
  }

  // update a company
  async update(name, num_employees, description, logo_url) {
    // pass in our params, this = the company with it's req.params handle
    let companyData = {
      name: name,
      num_employees: num_employees,
      description: description,
      logo_url: logo_url,
    };

    let data = sqlForPartialUpdate('companies', companyData, 'handle', this.handle);

    // get out our values from data
    let { query, values } = data;

    try {
      const result = await db.query(query, values);

      const company = result.rows[0];

      if (company === undefined) {
        const error = new ExpressError(`No company found with handle: ${this.handle}`);
        error.status = 404;
        throw error;
      }
    } catch (error) {
      return new ExpressError(error);
    }
  }

  // delete an existing company
  async remove() {
    // since i'm already looking for a company using .find(), not need for try/catch
    await db.query(`DELETE FROM companies WHERE handle = $1`, [this.handle]);
  }

  // create a new company
  async add() {
    try {
      await db.query(
        `INSERT INTO companies (handle, name, num_employees, description, logo_url)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING *`,
        [this.handle, this.name, this.num_employees, this.description, this.logo_url]
      );
    } catch (error) {
      return new ExpressError(error);
    }
  }
}

module.exports = Company;

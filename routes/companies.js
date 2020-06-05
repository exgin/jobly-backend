const Router = require('express').Router;
const router = new Router();
const Company = require('../models/companies');

// return all companies in the db
router.get('/', async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    return res.json({ companies });
  } catch (error) {
    return next(error);
  }
});

// find a specific company
router.get('/:handle', async function (req, res, next) {
  try {
    const company = await Company.find(req.params.handle);
    return res.json({ company });
  } catch (error) {
    return next(error);
  }
});

// create a new company
router.post('/', async function (req, res, next) {
  try {
    // make company
    const company = await Company.create(req.body);
    // save & insert into db
    await company.add();
    return res.json({ company });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

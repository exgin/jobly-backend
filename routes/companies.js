const Router = require('express').Router;
const router = new Router();
const Company = require('../models/companies');
const { validate } = require('jsonschema');
const companyNew = require('../schemas/companyNew.json');
const companyUpdate = require('../schemas/companyUpdate.json');
const { authRequired, checkAdmin } = require('../middleware/middleAuth');

// return all companies in the db
router.get('/', authRequired, async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    return res.json({ companies });
  } catch (error) {
    return next(error);
  }
});

// find a specific company
router.get('/:handle', authRequired, async function (req, res, next) {
  try {
    const company = await Company.find(req.params.handle);
    return res.json({ company });
  } catch (error) {
    return next(error);
  }
});

// create a new company
// res.body must be:
// {
//   "company": {
//     "name": "Pozing!",
//     ..etc...
//   }
// }
router.post('/', checkAdmin, async function (req, res, next) {
  try {
    const validation = validate(req.body, companyNew);

    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }
    // make company
    const company = await Company.create(req.body);
    // save & insert into db
    await company.add();
    return res.json({ company });
  } catch (error) {
    return next(error);
  }
});

// update an exisiting company
router.patch('/:handle', checkAdmin, async function (req, res, next) {
  try {
    if ('handle' in req.body) {
      throw new ExpressError(`You can't change a company's handle!`, 400);
    }

    const validation = validate(req.body, companyUpdate);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }

    // find our company
    const { handle } = req.params;
    const company = await Company.find(handle);

    let { name, num_employees, description, logo_url } = req.body.company;
    // update with those values
    await company.update(name, num_employees, description, logo_url);

    return res.json({ company });
  } catch (error) {
    return next(error);
  }
});

// delete an existing company
router.delete('/:handle', checkAdmin, async function (req, res, next) {
  try {
    // company not being deleted?
    // -> fixed when added 'handle' in the find() Company model method
    const { handle } = req.params;

    const company = await Company.find(handle);
    await company.remove();
    return res.send({ message: 'Company removed' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

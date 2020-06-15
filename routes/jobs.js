const Router = require('express').Router;
const router = new Router();
const Job = require('../models/jobs');
const ExpressError = require('../helpers/ExpressError');
const { validate } = require('jsonschema');
const jobsNew = require('../schemas/jobsNew.json');
const jobsUpdate = require('../schemas/jobsUpdate.json');
const { authRequired, checkAdmin } = require('../middleware/middleAuth');

// get all jobs
router.get('/', authRequired, async function (req, res, next) {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (error) {
    return next(error);
  }
});

// get a specific job
router.get('/:id', authRequired, async function (req, res, next) {
  try {
    const job = await Job.find(req.params.id);
    return res.json({ job });
  } catch (error) {
    return next(error);
  }
});

// create a job
router.post('/', checkAdmin, async function (req, res, next) {
  try {
    // validate our json
    const validation = validate(req.body, jobsNew);
    if (!validation.valid) {
      // show our errors from the schema
      throw new ExpressError(
        validation.errors.map((el) => el.stack),
        404
      );
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (error) {
    return next(error);
  }
});

// create a specific job application, must have an auth to do this
router.post('/:id/apply', authRequired, async function (req, res, next) {
  try {
    // select the state from the json body
    const state = req.body.state || 'applied';
    // apply the id | to the specific username | of the currenty state
    await Job.apply(req.params.id, req.user.username, state);
    return res.json({ message: state });
  } catch (error) {
    return next(error);
  }
});

// update a job
router.patch('/:id', checkAdmin, async function (req, res, next) {
  try {
    // disallow user from changing our primary key
    if ('id' in req.body) {
      throw new ExpressError(`You can't change a job's ID!`, 400);
    }

    // validate our json
    const validation = validate(req.body, jobsUpdate);
    if (!validation.valid) {
      // show our errors from the schema
      throw new ExpressError(
        validation.errors.map((el) => el.stack),
        404
      );
    }

    const updatedJob = await Job.update(req.params.id, req.body);
    return res.json({ updatedJob });
  } catch (error) {
    return next(error);
  }
});

// delete a job
router.delete('/:id', checkAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ message: 'Job successfully deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

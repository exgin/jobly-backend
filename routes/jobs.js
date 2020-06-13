const Router = require('express').Router;
const router = new Router();
const Job = require('../models/jobs');

// get all jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (error) {
    return next(error);
  }
});

// get a specific job
router.get('/:id', async function (req, res, next) {
  try {
    const job = await Job.find(req.params.id);
    return res.json({ job });
  } catch (error) {
    return next(error);
  }
});

// create a job
router.post('/', async function (req, res, next) {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

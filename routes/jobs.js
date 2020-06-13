const Router = require('express').Router;
const router = new Router();
const Job = require('../models/jobs');

router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const job = await Job.find(req.params.handle);
    return res.json({ job });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

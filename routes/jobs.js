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

module.exports = router;

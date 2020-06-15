const Router = require('express').Router;
const router = new Router();
const User = require('../models/users');
const { validate } = require('jsonschema');
const createToken = require('../helpers/createToken');
const ExpressError = require('../helpers/ExpressError');

// show all users
router.get('/', async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

// show a specific user
router.get('/:username', async function (req, res, next) {
  try {
    const user = await User.find(req.params.username);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

// create a user
router.post('/', async function (req, res, next) {
  try {
    // add schema validation

    const user = await User.create(req.body);
    const token = createToken(user);
    return res.status(201).json({ token });
  } catch (error) {
    return next(error);
  }
});

// update a user's info, even their password
router.patch('/:username', async function (req, res, next) {
  try {
    if ('username' in req.body) {
      throw new ExpressError(`You can't change your username!`, 400);
    }

    // add schema validation

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

// delete a user
router.delete('/:username', async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ msg: 'User deleted!' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

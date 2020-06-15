const User = require('../models/users');
const express = require('express');
const router = new express.Router();
const createToken = require('../helpers/createToken');

// authenticate user & return a web token. token contains username & is_admin
router.post('/login', async function (req, res, next) {
  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user);

    return res.json({ token });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

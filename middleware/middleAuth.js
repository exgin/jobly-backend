const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const ExpressError = require('../helpers/ExpressError');

function authRequired(req, res, next) {
  try {
    let verifiedPayload = jwt.verify(req.body._token, SECRET_KEY);
    req.user = verifiedPayload; // create a current user
    return next();
  } catch (error) {
    return next(new ExpressError('Please be logged in to view this', 401));
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    // if there is not current user, not allows
    if (!req.user) {
      throw new ExpressError('Unauthorized', 401);
    }

    // if username in url is same as user iwthin the global token
    if (req.params.username !== req.user.username) {
      throw new ExpressError('Unauthorized', 401);
    }

    return next();
  } catch (error) {
    return next();
  }
}

function checkAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw new ExpressError('Unauthorized', 401);
    }

    if (!req.user.is_admin) {
      throw new ExpressError('Unauthorized, must be an admin', 401);
    }

    return next();
  } catch (error) {
    return next();
  }
}

module.exports = { authRequired, ensureCorrectUser, checkAdmin };

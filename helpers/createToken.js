const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

function createToken(user) {
  // create the payload
  let payload = { username: user.username, is_admin: user.is_admin };

  // returning our token
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = createToken;

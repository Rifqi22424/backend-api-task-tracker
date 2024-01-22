const jsonwebtoken = require('jsonwebtoken');
const { expressjwt: jwt } = require("express-jwt");

const secretKey = 'just1';

function generateToken(userId) {
  return jsonwebtoken.sign({ userId }, secretKey);
}

const validateToken = jwt({ secret: secretKey, algorithms: ['HS256'] });

module.exports = {
  generateToken,
  validateToken,
};

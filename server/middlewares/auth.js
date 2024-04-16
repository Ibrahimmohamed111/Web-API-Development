const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateJWT = (req, res, next) => {
  console.log("req cookies : ", req.cookies)
  console.log("req auth : ", req.isAuthenticated())
  if(!req.isAuthenticated()){
    return res.status(401).json({ message: 'Session expired' });
  }
  const token = req.cookies.token; // Extract token from cookies
  if (!token) {
    return res.status(401).json({ message: 'Token missing in cookies' });
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    console.log("return 200: ", token)
    return res.status(200).json({ token: token });
  });
};

module.exports = { authenticateJWT };

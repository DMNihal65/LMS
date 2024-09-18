const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  console.log('Entering authenticateToken middleware');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('No token found');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }
    console.log('Token verified, user:', user);
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error('No user found in request');
      return res.sendStatus(401);
    }
    console.log('User role:', req.user.role); // Add this line for debugging
    console.log('Allowed roles:', roles); // Add this line for debugging
    if (roles.includes(req.user.role)) {
      next();
    } else {
      console.error('User not authorized');
      res.sendStatus(403);
    }
  };
};

module.exports = { authenticateToken, authorizeRole };
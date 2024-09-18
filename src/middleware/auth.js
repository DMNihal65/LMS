const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log('Authenticated user:', user); // Add this line for debugging
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
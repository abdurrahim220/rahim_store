const jwt = require('jsonwebtoken');
// Your JWT secret should be stored in a secure config file

const verifyToken = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header('Authorization');

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the decoded user information to the request object for later use in controllers
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;

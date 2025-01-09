const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach the decoded user info to the request

    next(); // Continue to the next middleware/controller
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

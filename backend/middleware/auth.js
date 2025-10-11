const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Enhanced admin authentication with additional security checks
function adminAuth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Additional security checks
    if (!decoded.id || !decoded.username) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    
    // Check token expiration (already handled by jwt.verify, but double-checking)
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Token verification failed' });
  }
}

module.exports = { auth, adminAuth };
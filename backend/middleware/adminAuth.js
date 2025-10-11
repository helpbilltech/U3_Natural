const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const Admin = require('../models/Admin');

async function adminAuth(req, res, next) {
  try {
    // Extract token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if admin exists in database
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    
    // Attach admin to request object
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Admin authentication error:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
}

// Middleware to check if admin is super admin (if needed for future enhancements)
async function superAdminAuth(req, res, next) {
  try {
    await adminAuth(req, res, () => {
      // Additional check for super admin privileges
      // This would require a 'role' field in the Admin model
      if (req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Super admin required.' });
      }
      next();
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { adminAuth, superAdminAuth };
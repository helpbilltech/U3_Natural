const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Register admin (run once, or protect with a secret)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const admin = new Admin({ username, password });
  await admin.save();
  res.json({ message: 'Admin registered' });
});

// Login admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
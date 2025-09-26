const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// For demo, use session cart (replace with user auth in production)
let cart = [];

// Get cart
router.get('/', (req, res) => {
  res.json(cart);
});

// Add to cart
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.json(cart);
});

// Update item quantity
router.put('/update', (req, res) => {
  const { productId, quantity } = req.body;
  cart = cart.map(item => item.productId === productId ? { ...item, quantity } : item);
  res.json(cart);
});

// Remove item
router.delete('/remove/:productId', (req, res) => {
  cart = cart.filter(item => item.productId !== req.params.productId);
  res.json(cart);
});

// Clear cart
router.delete('/clear', (req, res) => {
  cart = [];
  res.json(cart);
});

module.exports = router;
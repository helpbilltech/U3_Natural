const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Public: Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Public: Get single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// Admin: Create product
router.post('/', auth, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Admin: Update product
router.put('/:id', auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Admin: Delete product
router.delete('/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// Seed route for creating test products
router.post('/seed', async (req, res) => {
  try {
    const testProduct = new Product({
      name: 'Test Natural Face Mask',
      price: 299,
      description: 'A premium natural face mask for glowing skin',
      category: 'Masks',
      benefits: ['Hydrates skin', 'Reduces acne', 'Natural ingredients'],
      usage: 'Apply to clean face, leave for 15 minutes, rinse with warm water',
      image: '/api/products/uploads/test-mask.jpg'
    });
    
    await testProduct.save();
    res.json({ message: 'Test product created', product: testProduct });
  } catch (error) {
    console.error('Error creating test product:', error);
    res.status(500).json({ message: 'Failed to create test product' });
  }
});

module.exports = router;
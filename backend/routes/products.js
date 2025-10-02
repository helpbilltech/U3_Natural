const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save in uploads/
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

// Serve images statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// LIST all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Returning products:', products);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Products API is working!', timestamp: new Date() });
});

// Seed endpoint for testing
router.post('/seed', async (req, res) => {
  try {
    const testProduct = new Product({
      name: 'Test Face Mask',
      price: 25.99,
      description: 'A natural face mask for glowing skin',
      category: 'Masks',
      benefits: ['Hydrates skin', 'Reduces acne', 'Natural ingredients'],
      usage: 'Apply to clean face, leave for 15 minutes, rinse with warm water',
      image: ''
    });
    await testProduct.save();
    res.json({ message: 'Test product created', product: testProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CREATE new product with image upload (admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('File uploaded:', req.file);
    
    const { name, price, description, category, benefits, usage } = req.body;
    const benefitsArr = benefits ? benefits.split('\n') : [];
    const imageUrl = req.file ? `/api/products/uploads/${req.file.filename}` : '';
    
    console.log('Processed data:', { name, price, description, category, benefitsArr, usage, imageUrl });
    
    const product = new Product({ 
      name, 
      price: parseFloat(price), 
      description, 
      category, 
      benefits: benefitsArr, 
      usage, 
      image: imageUrl 
    });
    await product.save();
    
    console.log('Product saved successfully:', product);
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product with optional image upload (admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, benefits, usage } = req.body;
    const benefitsArr = benefits ? benefits.split('\n') : [];
    const updateFields = { name, price: parseFloat(price), description, category, benefits: benefitsArr, usage };
    if (req.file) {
      updateFields.image = `/api/products/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
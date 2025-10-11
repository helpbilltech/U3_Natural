const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const { adminAuth } = require('../middleware/adminAuth');
const router = express.Router();

// Configure multer for image uploads with file size and type restrictions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Serve images statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// LIST all products (public route)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
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

// GET single product (public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CREATE new product with image upload (admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, benefits, usage } = req.body;
    
    // Validate required fields
    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: 'Name, price, description, and category are required' });
    }
    
    const benefitsArr = benefits ? benefits.split('\n').filter(b => b.trim() !== '') : [];
    const imageUrl = req.file ? `/api/products/uploads/${req.file.filename}` : '';
    
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
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product with optional image upload (admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, benefits, usage } = req.body;
    
    const updateFields = {};
    
    if (name) updateFields.name = name;
    if (price) updateFields.price = parseFloat(price);
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (benefits) updateFields.benefits = benefits.split('\n').filter(b => b.trim() !== '');
    if (usage) updateFields.usage = usage;
    if (req.file) updateFields.image = `/api/products/uploads/${req.file.filename}`;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updateFields, 
      { new: true, runValidators: true }
    );
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
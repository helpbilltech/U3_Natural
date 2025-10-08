const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Configure multer for payment screenshot uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

// Serve payment screenshots
router.use('/payments', express.static(path.join(__dirname, '../uploads/payments')));

// Place order with payment screenshot
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { cart, customerInfo } = req.body;
    
    // Parse cart and customerInfo if they are strings
    const cartData = typeof cart === 'string' ? JSON.parse(cart) : cart;
    const customerData = typeof customerInfo === 'string' ? JSON.parse(customerInfo) : customerInfo;
    
    // Calculate total from cart items
    let total = 0;
    const orderProducts = cartData.map(item => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      total += itemTotal;
      return { 
        product: item._id, 
        quantity: item.quantity || 1,
        name: item.name || 'Product',
        price: item.price || 0
      };
    });

    const order = new Order({ 
      products: orderProducts, 
      total,
      customerInfo: customerData,
      paymentScreenshot: req.file ? `/api/orders/payments/${req.file.filename}` : null
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order by ID (public for tracking)
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id.trim(); // Remove any leading/trailing spaces
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id.trim(); // Remove any leading/trailing spaces
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
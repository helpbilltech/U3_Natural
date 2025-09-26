const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get sales analytics (admin only)
router.get('/sales', auth, async (req, res) => {
  const orders = await Order.find().populate('products.product');
  // Calculate total sales and best sellers
  let totalSales = 0;
  const salesMap = {};
  for (const order of orders) {
    totalSales += order.total;
    for (const item of order.products) {
      const id = item.product._id.toString();
      salesMap[id] = (salesMap[id] || 0) + item.quantity;
    }
  }
  // Get best selling products
  const products = await Product.find();
  const bestSellers = products
    .map(p => ({
      ...p._doc,
      sold: salesMap[p._id.toString()] || 0
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  res.json({ totalSales, bestSellers });
});

module.exports = router;
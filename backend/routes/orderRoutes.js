const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Place order
router.post('/', async (req, res) => {
  const { cart } = req.body;
  const productIds = cart.map(item => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  let total = 0;
  const orderProducts = cart.map(item => {
    const product = products.find(p => p._id.toString() === item.productId);
    total += product.price * item.quantity;
    return { product: product._id, quantity: item.quantity };
  });
  const order = new Order({ products: orderProducts, total });
  await order.save();
  res.status(201).json(order);
});

// Get all orders (admin only)
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('products.product');
  res.json(orders);
});

module.exports = router;
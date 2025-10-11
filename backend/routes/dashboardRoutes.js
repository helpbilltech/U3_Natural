const express = require('express');
const { adminAuth } = require('../middleware/adminAuth');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get dashboard sales data (admin only)
router.get('/sales', adminAuth, async (req, res) => {
  try {
    // Get total sales
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Get recent orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    
    // Get product count
    const productCount = await Product.countDocuments();
    
    // Get order count by status
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalSales,
      recentOrders,
      productCount,
      orderStats
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get analytics data (admin only)
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // Get sales by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalSold: { $sum: '$products.quantity' },
          productName: { $first: '$products.name' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      monthlySales,
      topProducts
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
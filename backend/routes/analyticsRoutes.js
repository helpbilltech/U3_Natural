const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/adminAuth');

// Get comprehensive analytics data
router.get('/', adminAuth, async (req, res) => {
  try {
    // Get all confirmed/delivered orders (all-time data)
    const orders = await Order.find({
      status: { $in: ['confirmed', 'delivered'] }
    }).populate('products.product');
    
    // Calculate total sales (only confirmed/delivered orders)
    const totalSales = orders.reduce((sum, order) => {
      return sum + order.products.reduce((orderSum, item) => {
        return orderSum + (item.product ? item.product.price * item.quantity : 0);
      }, 0);
    }, 0);

    // Calculate total orders (only confirmed/delivered)
    const totalOrders = orders.length;

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get sales by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const salesByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      
      const monthSales = monthOrders.reduce((sum, order) => {
        return sum + order.products.reduce((orderSum, item) => {
          return orderSum + (item.product ? item.product.price * item.quantity : 0);
        }, 0);
      }, 0);
      
      salesByMonth.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthSales
      });
    }

    // Get best sellers
    const productSales = {};
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product) {
          const productId = item.product._id.toString();
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.product.name,
              sales: 0,
              revenue: 0
            };
          }
          productSales[productId].sales += item.quantity;
          productSales[productId].revenue += item.product.price * item.quantity;
        }
      });
    });

    const bestSellers = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    // Get orders by status
    const ordersByStatus = {
      pending: orders.filter(order => order.status === 'pending').length,
      confirmed: orders.filter(order => order.status === 'confirmed').length,
      shipped: orders.filter(order => order.status === 'shipped').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length
    };

    // Get recent orders (last 5)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order._id,
        customer: order.customerInfo?.name || 'Unknown',
        amount: order.products.reduce((sum, item) => {
          return sum + (item.product ? item.product.price * item.quantity : 0);
        }, 0),
        status: order.status,
        createdAt: order.createdAt
      }));

    // Get daily sales for the last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate < dayEnd;
      });
      
      const daySales = dayOrders.reduce((sum, order) => {
        return sum + order.products.reduce((orderSum, item) => {
          return orderSum + (item.product ? item.product.price * item.quantity : 0);
        }, 0);
      }, 0);
      
      dailySales.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales,
        orders: dayOrders.length
      });
    }

    // Get product categories performance
    const categorySales = {};
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product && item.product.category) {
          const category = item.product.category;
          if (!categorySales[category]) {
            categorySales[category] = {
              sales: 0,
              revenue: 0,
              orders: 0
            };
          }
          categorySales[category].sales += item.quantity;
          categorySales[category].revenue += item.product.price * item.quantity;
        }
      });
    });

    const categoryPerformance = Object.entries(categorySales)
      .map(([category, data]) => ({
        category,
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json({
      totalSales,
      totalOrders,
      avgOrderValue,
      salesByMonth,
      bestSellers,
      ordersByStatus,
      recentOrders,
      dailySales,
      categoryPerformance
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
import React, { useEffect, useState } from 'react';
import { getSalesAnalytics } from '../../utils/api';
import { getToken } from '../../utils/auth';

export default function AdminDashboard() {
  const [data, setData] = useState({ totalSales: 0, bestSellers: [] });

  useEffect(() => {
    async function load() {
      const res = await getSalesAnalytics(getToken());
      setData(res);
    }
    load();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total Sales: ${data.totalSales}</div>
      <h3>Best Sellers</h3>
      <ul>
        {data.bestSellers.map(product => (
          <li key={product._id}>{product.name} - Sold: {product.sold}</li>
        ))}
      </ul>
    </div>
  );
}
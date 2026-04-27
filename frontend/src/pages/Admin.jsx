import React from 'react';
import { BarChart3, Users, ShoppingCart, DollarSign, Plus, MoreHorizontal } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const stats = [
    { title: 'Total Sales', value: '$45,280', icon: <DollarSign size={24} />, color: '#4caf50' },
    { title: 'New Orders', value: '128', icon: <ShoppingCart size={24} />, color: '#2196f3' },
    { title: 'Customers', value: '1,240', icon: <Users size={24} />, color: '#ff9800' },
    { title: 'Avg Order', value: '$35.40', icon: <BarChart3 size={24} />, color: '#9c27b0' },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="btn-premium"><Plus size={18} /> Add Product</button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <span>{stat.title}</span>
                <h3>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Product Management Table */}
        <div className="admin-section">
          <div className="section-title">
            <h2>Product Management</h2>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="table-product">
                      <img src="https://images.unsplash.com/photo-1599390725350-255d6100790d?q=80&w=50" alt="item" />
                      <span>Ceylon Cinnamon</span>
                    </div>
                  </td>
                  <td>Spices</td>
                  <td>$24.99</td>
                  <td>45 Units</td>
                  <td><span className="status-badge in-stock">In Stock</span></td>
                  <td><button className="action-dots"><MoreHorizontal size={18} /></button></td>
                </tr>
                <tr>
                  <td>
                    <div className="table-product">
                      <img src="https://images.unsplash.com/photo-1615485242273-04287840130d?q=80&w=50" alt="item" />
                      <span>Premium Saffron</span>
                    </div>
                  </td>
                  <td>Premium</td>
                  <td>$89.99</td>
                  <td>12 Units</td>
                  <td><span className="status-badge low-stock">Low Stock</span></td>
                  <td><button className="action-dots"><MoreHorizontal size={18} /></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Panel */}
        <div className="admin-section">
          <div className="section-title">
            <h2>Recent Orders</h2>
          </div>
          <div className="orders-panel">
            <div className="order-row">
              <div className="order-main">
                <strong>John Doe</strong>
                <span>j.doe@example.com</span>
              </div>
              <div className="order-items">3 items</div>
              <div className="order-total">$124.50</div>
              <div className="order-action"><button className="btn-outline btn-sm">Manage</button></div>
            </div>
            <div className="order-row">
              <div className="order-main">
                <strong>Sarah Jenkins</strong>
                <span>sarah.j@example.com</span>
              </div>
              <div className="order-items">1 item</div>
              <div className="order-total">$45.00</div>
              <div className="order-action"><button className="btn-outline btn-sm">Manage</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

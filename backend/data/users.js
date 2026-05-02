const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@spice.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    city: 'Kandy',
    town: 'Peradeniya',
    country: 'Sri Lanka'
  },
  {
    name: 'Store Owner',
    email: 'owner@spice.com',
    password: 'owner123',
    role: 'owner',
    avatar: 'https://i.pravatar.cc/150?u=owner',
    city: 'Colombo',
    town: 'Kollupitiya',
    country: 'Sri Lanka'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=john',
    city: 'Galle',
    town: 'Unawatuna',
    country: 'Sri Lanka'
  }
];

module.exports = users;

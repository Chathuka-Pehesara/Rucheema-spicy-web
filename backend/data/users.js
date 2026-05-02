const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@spice.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    name: 'Store Owner',
    email: 'owner@spice.com',
    password: 'owner123',
    role: 'owner',
    avatar: 'https://i.pravatar.cc/150?u=owner'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=john'
  }
];

module.exports = users;

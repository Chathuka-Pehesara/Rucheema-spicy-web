const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Auto-seed Admin if they use the hardcoded credentials and don't exist
  if (email === 'admin@rucheema.com' && password === 'admin123') {
    const adminExists = await User.findOne({ email });
    if (!adminExists) {
      await User.create({ name: 'Super Admin', email: 'admin@rucheema.com', password: 'admin123', role: 'admin' });
    }
  }

  // Auto-seed Owner if they use the hardcoded credentials and don't exist
  if (email === 'owner@rucheema.com' && password === 'owner123') {
    const ownerExists = await User.findOne({ email });
    if (!ownerExists) {
      await User.create({ name: 'Business Owner', email: 'owner@rucheema.com', password: 'owner123', role: 'owner' });
    }
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      city: user.city,
      town: user.town,
      country: user.country,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, city, town, country } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    city: city || '',
    town: town || '',
    country: country || 'Sri Lanka',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      city: user.city,
      town: user.town,
      country: user.country,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.city = req.body.city || user.city;
    user.town = req.body.town || user.town;
    user.country = req.body.country || user.country;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      city: updatedUser.city,
      town: updatedUser.town,
      country: updatedUser.country,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user statistics for owner dashboard
// @route   GET /api/users/stats
// @access  Private/Owner
const getUserStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    
    // Simple query with robust regex
    const slUsers = await User.find({
      country: { $regex: 'sri lanka', $options: 'i' }
    }).select({ city: 1, town: 1, country: 1 });
    
    const cityMap = {};
    slUsers.forEach(u => {
      const c = (u.city || '').trim();
      if (c) cityMap[c] = (cityMap[c] || 0) + 1;
    });

    let liveUsers = 0;
    try {
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      liveUsers = await User.countDocuments({
        lastActive: { $gte: fifteenMinsAgo }
      });
    } catch (e) {
      liveUsers = 0;
    }

    res.json({
      totalUsers,
      slUsers: slUsers.length,
      liveUsers,
      cityBreakdown: cityMap,
    });
  } catch (err) {
    console.error('getUserStats error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserStats,
};

const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json(settings);
});

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = new Settings(req.body);
  } else {
    settings.shippingRates = req.body.shippingRates || settings.shippingRates;
    settings.baseLocation = req.body.baseLocation || settings.baseLocation;
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

module.exports = {
  getSettings,
  updateSettings,
};

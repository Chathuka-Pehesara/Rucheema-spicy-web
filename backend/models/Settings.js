const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    shippingRates: {
      internationalBase: { type: Number, default: 50 },
      internationalPerKm: { type: Number, default: 0.5 },
      localBase: { type: Number, default: 0 },
      localPerKm: { type: Number, default: 2 }, // Default $2 per km in SL
    },
    baseLocation: {
      city: { type: String, default: 'Colombo' },
      country: { type: String, default: 'Sri Lanka' },
      lat: { type: Number, default: 6.9271 },
      lng: { type: Number, default: 79.8612 },
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

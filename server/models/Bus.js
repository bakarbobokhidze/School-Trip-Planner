const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  image: { type: String, required: false },
  driverName: { type: String, required: true },
  rating: { type: Number, default: 5 },
  pricePerKm: { type: Number, required: true },
  features: [String]
});

module.exports = mongoose.model('Bus', busSchema);
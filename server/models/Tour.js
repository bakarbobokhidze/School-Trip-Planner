const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  rating: Number,
  duration: String,
  description: String,
  tags: [String],
  image: String
});

module.exports = mongoose.model('Tour', tourSchema);
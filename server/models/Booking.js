const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tourId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tour',
    required: true
  },
  participants: {
    students: Number,
    parents: Number,
    teachers: Number
  },
  foodSelection: {
    menuType: String,
    totalFoodPrice: Number
  },
  totalPrice: Number,
  bus: {
    name: String,
    driver: String,
    capacity: Number
  },
  contactDetails: {
    name: String,
    phone: String
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'rejected']
  },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('booking', bookingSchema);
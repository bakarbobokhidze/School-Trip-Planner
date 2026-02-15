const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  image: String,
  role: { type: String, default: 'member', enum: ['member', 'admin'] }
});

module.exports = mongoose.model('User', userSchema);
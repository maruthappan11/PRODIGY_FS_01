const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true // KEY!
  },
  email: {
    type: String,
    unique: true,
    sparse: true // KEY!
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);

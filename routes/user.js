const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const User = require('c:/Users/Maruthu/auth-backend/routes/user.js');

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

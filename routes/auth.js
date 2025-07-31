const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ========== SIGNUP ==========
router.post('/signup', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUserData = { password: hashedPassword };

  try {
    if (emailRegex.test(identifier)) {
      newUserData.email = identifier;

      const existing = await User.findOne({ email: identifier });
      if (existing) {
        return res.status(400).json({ msg: 'Email already exists' });
      }

    } else {
      newUserData.username = identifier;

      const existing = await User.findOne({ username: identifier });
      if (existing) {
        return res.status(400).json({ msg: 'Username already exists' });
      }
    }

    const newUser = new User(newUserData);
    await newUser.save();

    res.status(201).json({ msg: 'User created successfully' });

  } catch (err) {
    console.error('🔥 SIGNUP ERROR:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    console.error('🔥 LOGIN ERROR:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;

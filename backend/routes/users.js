const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - get all users (for assigning tasks)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('name email role createdAt');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;

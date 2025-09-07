const express = require('express');
const Journal = require('../models/Journal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all journals for authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const journals = await Journal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Journal.countDocuments({ userId: req.user._id });

    res.json({
      journals,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJournals: total
    });
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({ message: 'Server error fetching journals' });
  }
});

// Get single journal
router.get('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.json(journal);
  } catch (error) {
    console.error('Get journal error:', error);
    res.status(500).json({ message: 'Server error fetching journal' });
  }
});

// Create new journal
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const journal = await Journal.create({
      userId: req.user._id,
      title,
      content,
      mood: mood || 'neutral'
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ message: 'Server error creating journal' });
  }
});

// Update journal
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, content, mood },
      { new: true, runValidators: true }
    );

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.json(journal);
  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({ message: 'Server error updating journal' });
  }
});

// Delete journal
router.delete('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({ message: 'Server error deleting journal' });
  }
});

module.exports = router;
const express = require('express');
const Mood = require('../models/Mood');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all mood entries for authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month'
    let startDate = new Date();
    
    // Set start date based on period filter
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30); // Default to 30 days
    }

    const moods = await Mood.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    res.json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error fetching moods' });
  }
});

// Get mood statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month'
    let startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1); // Default to month
    }

    const moodStats = await Mood.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$moodType',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(moodStats);
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ message: 'Server error fetching mood statistics' });
  }
});

// Create new mood entry
router.post('/', protect, async (req, res) => {
  try {
    const { moodType, intensity, note, tags } = req.body;

    if (!moodType) {
      return res.status(400).json({ message: 'Please provide mood type' });
    }

    const mood = await Mood.create({
      userId: req.user._id,
      moodType,
      intensity: intensity || 5,
      note,
      tags: tags || []
    });

    res.status(201).json(mood);
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ message: 'Server error creating mood entry' });
  }
});

// Update mood entry
router.put('/:id', protect, async (req, res) => {
  try {
    const { moodType, intensity, note, tags } = req.body;

    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { moodType, intensity, note, tags },
      { new: true, runValidators: true }
    );

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json(mood);
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error updating mood entry' });
  }
});

// Delete mood entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: 'Server error deleting mood entry' });
  }
});

module.exports = router;
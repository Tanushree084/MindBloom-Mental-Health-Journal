const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total journal entries count
    const totalEntries = await JournalEntry.countDocuments({ user: userId });
    
    // Get entries from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEntries = await JournalEntry.countDocuments({
      user: userId,
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get mood statistics (example)
    const moodStats = await JournalEntry.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalEntries,
      recentEntries,
      moodStats
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
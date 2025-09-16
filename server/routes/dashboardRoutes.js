const express = require('express');
const expressRouter = express.Router();  // Use Express's Router
const auth = require('../middleware/auth');
const Mood = require('../models/Mood');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get mood entries
    const moodEntries = await Mood.find({ user: userId }).sort({ date: 1 });
    
    // Calculate statistics
    const stats = {
      avgMood: calculateAverageMood(moodEntries),
      currentStreak: calculateCurrentStreak(moodEntries),
      maxStreak: calculateMaxStreak(moodEntries),
      totalEntries: moodEntries.length,
      moodDistribution: calculateMoodDistribution(moodEntries)
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
function calculateAverageMood(entries) {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, entry) => sum + entry.moodLevel, 0);
  return total / entries.length;
}

function calculateCurrentStreak(entries) {
  if (entries.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Sort entries by date descending
  const sortedEntries = [...entries].sort((a, b) => b.date - a.date);
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateMaxStreak(entries) {
  if (entries.length === 0) return 0;
  
  let maxStreak = 0;
  let currentStreak = 1;
  const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
  
  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1].date);
    const currDate = new Date(sortedEntries[i].date);
    
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
    } else if (diffDays > 1) {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(maxStreak, currentStreak);
}

function calculateMoodDistribution(entries) {
  const distribution = {
    'Very Happy': 0,
    'Happy': 0,
    'Neutral': 0,
    'Sad': 0,
    'Very Sad': 0
  };
  
  entries.forEach(entry => {
    if (entry.moodLevel >= 4.5) distribution['Very Happy']++;
    else if (entry.moodLevel >= 3.5) distribution['Happy']++;
    else if (entry.moodLevel >= 2.5) distribution['Neutral']++;
    else if (entry.moodLevel >= 1.5) distribution['Sad']++;
    else distribution['Very Sad']++;
  });
  
  return distribution;
}

module.exports = expressRouter;
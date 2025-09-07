const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodType: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'anxious', 'excited', 'angry', 'tired', 'calm', 'stressed']
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 5
  },
  note: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    maxlength: 20
  }]
}, {
  timestamps: true
});

// Index for faster queries on user moods
moodSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', moodSchema);
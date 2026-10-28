const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Movie description is required']
  },
  genres: [{
    type: String,
    trim: true
  }],
  durationMinutes: {
    type: Number,
    required: [true, 'Duration in minutes is required']
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    default: 'English'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 8.0
  },
  ageRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'PG-13'
  },
  posterUrl: {
    type: String,
    required: [true, 'Movie poster URL is required']
  },
  backdropUrl: {
    type: String
  },
  trailerUrl: {
    type: String
  },
  cast: [{
    type: String
  }],
  director: {
    type: String
  },
  isNowPlaying: {
    type: Boolean,
    default: true
  },
  isUpcoming: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);

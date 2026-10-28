const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theaterName: {
    type: String,
    required: true,
    default: 'Grand IMAX Cinema'
  },
  screenNumber: {
    type: String,
    required: true,
    default: 'Screen 1'
  },
  showDate: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  startTime: {
    type: String, // Format: '19:30'
    required: true
  },
  endTime: {
    type: String
  },
  priceStandard: {
    type: Number,
    required: true,
    default: 12
  },
  priceVIP: {
    type: Number,
    required: true,
    default: 18
  },
  totalSeats: {
    type: Number,
    default: 60 // 6 rows (A to F), 10 seats each
  },
  bookedSeats: [{
    type: String // e.g. "A1", "B4"
  }],
  lockedSeats: [{
    seatNumber: String,
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lockedAt: {
      type: Date,
      default: Date.now,
      expires: 600 // Expire automatically after 10 mins if not checked out
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Showtime', showtimeSchema);

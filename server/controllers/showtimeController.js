const Showtime = require('../models/Showtime');

// @desc    Get showtimes for a movie or date
// @route   GET /api/showtimes
// @access  Public
exports.getShowtimes = async (req, res, next) => {
  try {
    const { movieId, date } = req.query;
    let query = {};

    if (movieId) query.movie = movieId;
    if (date) query.showDate = date;

    const showtimes = await Showtime.find(query)
      .populate('movie', 'title posterUrl durationMinutes ageRating')
      .sort({ showDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime with seat status
// @route   GET /api/showtimes/:id
// @access  Public
exports.getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie');
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Clean up expired locks
    const now = new Date();
    showtime.lockedSeats = showtime.lockedSeats.filter(
      lock => (now - new Date(lock.lockedAt)) < 10 * 60 * 1000
    );
    await showtime.save();

    res.status(200).json({
      success: true,
      data: showtime
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new showtime
// @route   POST /api/showtimes
// @access  Private/Admin
exports.createShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json({
      success: true,
      data: showtime
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Temporarily lock seats during checkout (Hold for 10 mins)
// @route   POST /api/showtimes/:id/lock-seats
// @access  Private
exports.lockSeats = async (req, res, next) => {
  try {
    const { seats } = req.body; // array of seat numbers ['A1', 'A2']
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Filter out expired locks
    const now = new Date();
    showtime.lockedSeats = showtime.lockedSeats.filter(
      lock => (now - new Date(lock.lockedAt)) < 10 * 60 * 1000
    );

    // Check if any seat is already booked or locked by someone else
    const alreadyBooked = seats.some(seat => showtime.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats have already been booked.'
      });
    }

    const lockedByOthers = showtime.lockedSeats.some(
      lock => seats.includes(lock.seatNumber) && lock.lockedBy.toString() !== req.user.id
    );

    if (lockedByOthers) {
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats are temporarily held by another customer.'
      });
    }

    // Add lock for this user
    seats.forEach(seat => {
      const existing = showtime.lockedSeats.find(l => l.seatNumber === seat);
      if (existing) {
        existing.lockedAt = new Date();
      } else {
        showtime.lockedSeats.push({
          seatNumber: seat,
          lockedBy: req.user.id,
          lockedAt: new Date()
        });
      }
    });

    await showtime.save();

    res.status(200).json({
      success: true,
      message: 'Seats locked for 10 minutes.',
      lockedSeats: showtime.lockedSeats
    });
  } catch (error) {
    next(error);
  }
};

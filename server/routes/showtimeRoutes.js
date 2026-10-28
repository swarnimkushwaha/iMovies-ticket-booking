const express = require('express');
const router = express.Router();
const {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  lockSeats
} = require('../controllers/showtimeController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getShowtimes)
  .post(protect, authorize('admin'), createShowtime);

router.route('/:id')
  .get(getShowtimeById);

router.route('/:id/lock-seats')
  .post(protect, lockSeats);

module.exports = router;

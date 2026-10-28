const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsAdmin
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my', getUserBookings);
router.get('/admin/all', authorize('admin'), getAllBookingsAdmin);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

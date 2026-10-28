const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// Helper to generate a unique booking reference
const generateRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'IMV-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Create a new booking / Reserve seats
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seats, paymentMethod } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one seat.' });
    }

    const showtime = await Showtime.findById(showtimeId).populate('movie');
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found.' });
    }

    const seatNumbers = seats.map(s => s.seatNumber);

    // Verify seats are not already booked
    const conflict = seatNumbers.some(seat => showtime.bookedSeats.includes(seat));
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats were just booked. Please select other seats.'
      });
    }

    // Calculate total price based on seat tiers
    let totalAmount = 0;
    const formattedSeats = seats.map(seat => {
      // Row A & B are VIP, rest are Standard
      const isVip = seat.seatNumber.startsWith('A') || seat.seatNumber.startsWith('B');
      const tier = isVip ? 'VIP' : 'Standard';
      const price = isVip ? showtime.priceVIP : showtime.priceStandard;
      totalAmount += price;
      return {
        seatNumber: seat.seatNumber,
        tier,
        price
      };
    });

    // Generate unique booking reference
    let bookingReference = generateRef();
    let existingRef = await Booking.findOne({ bookingReference });
    while (existingRef) {
      bookingReference = generateRef();
      existingRef = await Booking.findOne({ bookingReference });
    }

    // Create the booking
    const booking = await Booking.create({
      bookingReference,
      user: req.user.id,
      movie: showtime.movie._id,
      showtime: showtime._id,
      seats: formattedSeats,
      totalAmount,
      paymentMethod: paymentMethod || 'Credit Card (Simulated)',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed'
    });

    // Update Showtime: append bookedSeats and remove from lockedSeats
    showtime.bookedSeats.push(...seatNumbers);
    showtime.lockedSeats = showtime.lockedSeats.filter(
      lock => !seatNumbers.includes(lock.seatNumber)
    );
    await showtime.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl durationMinutes ageRating')
      .populate('showtime', 'showDate startTime theaterName screenNumber');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of logged in user
// @route   GET /api/bookings/my
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title posterUrl durationMinutes genres rating ageRating')
      .populate('showtime', 'showDate startTime theaterName screenNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by reference or ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('showtime')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check ownership or admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket.' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Release seats in Showtime
    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      const seatNumbers = booking.seats.map(s => s.seatNumber);
      showtime.bookedSeats = showtime.bookedSeats.filter(
        seat => !seatNumbers.includes(seat)
      );
      await showtime.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and seats released successfully.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: get all bookings
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
exports.getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('movie', 'title')
      .populate('user', 'name email')
      .populate('showtime', 'showDate startTime screenNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

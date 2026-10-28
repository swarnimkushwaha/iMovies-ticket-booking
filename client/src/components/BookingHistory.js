import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

const BookingHistory = ({ localBookings, onCancelBooking }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(localBookings || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiRequest('/bookings/my');
        if (res && res.data) {
          setBookings(res.data);
        }
      } catch (err) {
        // Use local state if offline preview
        setBookings(localBookings || []);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [localBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Seats will be made available to other users.')) {
      return;
    }

    try {
      await apiRequest(`/bookings/${bookingId}/cancel`, { method: 'PUT' });
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' } : b));
    } catch (err) {
      // Local fallback
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' } : b));
      if (onCancelBooking) onCancelBooking(bookingId);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">My Movie Tickets</h2>
          <p className="text-secondary mb-0">View your active reservations, booking history, and e-tickets.</p>
        </div>
        <span className="badge bg-danger px-3 py-2 rounded-pill">
          {bookings.length} Total Bookings
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-5 bg-dark border border-secondary rounded-4 my-4">
          <i className="bi bi-ticket-perforated text-secondary display-3 mb-3"></i>
          <h4 className="text-white">No Bookings Found</h4>
          <p className="text-secondary">You haven't reserved any movie tickets yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map(booking => {
            const isCancelled = booking.bookingStatus === 'cancelled';
            return (
              <div key={booking._id} className="col-12 col-lg-6">
                <div className={`p-4 rounded-4 border bg-dark shadow-sm position-relative ${isCancelled ? 'border-secondary opacity-60' : 'border-secondary'}`}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className={`badge mb-2 ${isCancelled ? 'bg-secondary' : 'bg-success'}`}>
                        {isCancelled ? 'Cancelled & Refunded' : 'Confirmed'}
                      </span>
                      <h4 className="fw-bold text-white mb-1">{booking.movie.title}</h4>
                      <p className="text-secondary small mb-0">
                        {booking.showtime.theaterName} • {booking.showtime.screenNumber}
                      </p>
                    </div>
                    <div className="text-end">
                      <small className="text-secondary d-block">Reference</small>
                      <span className="fw-bold text-warning font-monospace fs-6">
                        {booking.bookingReference}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary-subtle rounded-3 mb-3 border border-secondary">
                    <div className="row text-center g-2">
                      <div className="col-4 border-end border-secondary">
                        <small className="text-secondary d-block">Date</small>
                        <strong className="text-white small">{booking.showtime.showDate}</strong>
                      </div>
                      <div className="col-4 border-end border-secondary">
                        <small className="text-secondary d-block">Time</small>
                        <strong className="text-white small">{booking.showtime.startTime}</strong>
                      </div>
                      <div className="col-4">
                        <small className="text-secondary d-block">Seats</small>
                        <strong className="text-danger small">
                          {booking.seats.map(s => s.seatNumber).join(', ')}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-secondary">Amount Paid</small>
                      <div className="fw-bold text-white fs-5">${booking.totalAmount.toFixed(2)}</div>
                    </div>

                    {!isCancelled && (
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;

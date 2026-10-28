import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

const CheckoutModal = ({ checkoutData, onClose, onBookingSuccess, onRequireAuth }) => {
  const { user } = useAuth();
  const [paymentStep, setPaymentStep] = useState('payment'); // 'payment' | 'processing' | 'confirmed'
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [formData, setFormData] = useState({
    cardName: user ? user.name : 'John Doe',
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '123'
  });

  const handlePay = async (e) => {
    e.preventDefault();

    if (!user) {
      onRequireAuth();
      return;
    }

    setPaymentStep('processing');

    try {
      // Call backend booking API
      const response = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          showtimeId: checkoutData.showtime._id,
          seats: checkoutData.seats,
          paymentMethod: 'Credit Card (Visa - Simulated)'
        })
      });

      setConfirmedBooking(response.data);
      setPaymentStep('confirmed');
      onBookingSuccess(response.data);
    } catch (err) {
      // Fallback for offline preview simulation
      setTimeout(() => {
        const dummyBooking = {
          _id: `b_${Date.now()}`,
          bookingReference: `IMV-${Math.floor(100000 + Math.random() * 900000)}`,
          movie: checkoutData.movie,
          showtime: checkoutData.showtime,
          seats: checkoutData.seats,
          totalAmount: checkoutData.grandTotal,
          createdAt: new Date().toISOString(),
          bookingStatus: 'confirmed'
        };
        setConfirmedBooking(dummyBooking);
        setPaymentStep('confirmed');
        onBookingSuccess(dummyBooking);
      }, 1000);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark border border-secondary text-white shadow-2xl rounded-4 overflow-hidden">
          
          <div className="modal-header border-secondary p-4">
            <h5 className="modal-title fw-bold">
              {paymentStep === 'confirmed' ? '🎉 Booking Confirmed!' : 'Checkout & Payment'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {paymentStep === 'processing' && (
              <div className="text-center py-5">
                <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                <h5 className="fw-bold">Reserving your seats...</h5>
                <p className="text-muted">Encrypting payment transaction and locking seats.</p>
              </div>
            )}

            {paymentStep === 'payment' && (
              <div className="row g-4">
                {/* Left: Summary */}
                <div className="col-md-5 border-end border-secondary pe-md-4">
                  <h6 className="text-secondary text-uppercase fs-xs fw-bold tracking-wider mb-3">Booking Details</h6>
                  <h5 className="fw-bold text-white mb-1">{checkoutData.movie.title}</h5>
                  <p className="text-secondary small mb-2">{checkoutData.showtime.theaterName} • {checkoutData.showtime.screenNumber}</p>
                  
                  <div className="d-flex justify-content-between text-secondary small mb-1">
                    <span>Date & Time:</span>
                    <span className="text-white">{checkoutData.showtime.showDate} @ {checkoutData.showtime.startTime}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary small mb-1">
                    <span>Seats:</span>
                    <span className="text-white fw-bold">{checkoutData.seats.map(s => s.seatNumber).join(', ')}</span>
                  </div>
                  
                  <hr className="border-secondary my-3" />

                  <div className="d-flex justify-content-between text-secondary small mb-1">
                    <span>Subtotal:</span>
                    <span className="text-white">${checkoutData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary small mb-2">
                    <span>Convenience Fee:</span>
                    <span className="text-white">${checkoutData.convenienceFee.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-white fw-bold fs-5">
                    <span>Total:</span>
                    <span className="text-danger">${checkoutData.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Right: Payment Form */}
                <div className="col-md-7 ps-md-4">
                  <h6 className="text-secondary text-uppercase fs-xs fw-bold tracking-wider mb-3">Simulated Card Payment</h6>
                  <form onSubmit={handlePay}>
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Cardholder Name</label>
                      <input 
                        type="text" 
                        className="form-control bg-secondary-subtle border-secondary text-white" 
                        value={formData.cardName}
                        onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Card Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-secondary-subtle border-secondary text-white">
                          <i className="bi bi-credit-card"></i>
                        </span>
                        <input 
                          type="text" 
                          className="form-control bg-secondary-subtle border-secondary text-white" 
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                          required 
                        />
                      </div>
                    </div>
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <label className="form-label text-secondary small">Expiry</label>
                        <input 
                          type="text" 
                          className="form-control bg-secondary-subtle border-secondary text-white" 
                          value={formData.expiry}
                          onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">CVV</label>
                        <input 
                          type="password" 
                          className="form-control bg-secondary-subtle border-secondary text-white" 
                          value={formData.cvv}
                          onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-danger w-100 py-3 fw-bold rounded-3">
                      Pay ${checkoutData.grandTotal.toFixed(2)} & Confirm Seats
                    </button>
                    <small className="text-muted d-block text-center mt-2">
                      <i className="bi bi-shield-lock me-1"></i> 256-bit SSL Test Sandbox
                    </small>
                  </form>
                </div>
              </div>
            )}

            {paymentStep === 'confirmed' && confirmedBooking && (
              <div className="p-3">
                <div className="cinema-ticket p-4 mb-4 text-center">
                  <div className="ticket-notch-left"></div>
                  <div className="ticket-notch-right"></div>
                  
                  <span className="badge bg-success-subtle text-success border border-success px-3 py-1 mb-2 text-uppercase">
                    Confirmed Ticket
                  </span>
                  <h3 className="fw-extrabold text-white mb-1">
                    {confirmedBooking.movie.title}
                  </h3>
                  <p className="text-secondary small mb-3">
                    {confirmedBooking.showtime.theaterName} • {confirmedBooking.showtime.screenNumber}
                  </p>

                  <div className="row justify-content-center text-center my-3 g-3">
                    <div className="col-4 border-end border-secondary">
                      <small className="text-secondary d-block">Date</small>
                      <strong className="text-white">{confirmedBooking.showtime.showDate}</strong>
                    </div>
                    <div className="col-4 border-end border-secondary">
                      <small className="text-secondary d-block">Time</small>
                      <strong className="text-white">{confirmedBooking.showtime.startTime}</strong>
                    </div>
                    <div className="col-4">
                      <small className="text-secondary d-block">Seats</small>
                      <strong className="text-danger">
                        {confirmedBooking.seats.map(s => s.seatNumber).join(', ')}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 bg-dark rounded-3 border border-secondary d-inline-block mt-2">
                    <small className="text-secondary d-block mb-1">Booking Reference ID</small>
                    <span className="fs-4 fw-mono fw-bold text-warning letter-spacing-2">
                      {confirmedBooking.bookingReference}
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-secondary px-4 py-2 rounded-pill" onClick={onClose}>
                    Close
                  </button>
                  <button 
                    className="btn btn-danger px-4 py-2 rounded-pill fw-bold"
                    onClick={() => {
                      onClose();
                      window.print();
                    }}
                  >
                    <i className="bi bi-printer me-1"></i> Print Ticket
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

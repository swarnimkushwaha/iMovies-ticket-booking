import React, { useState } from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SeatGrid = ({ movie, showtimes, onBack, onProceedToCheckout }) => {
  // Filter showtimes for this movie
  const movieShowtimes = showtimes.filter(s => s.movieId === movie._id || (s.movie && s.movie._id === movie._id));
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(
    movieShowtimes.length > 0 ? movieShowtimes[0]._id : null
  );
  const [selectedSeats, setSelectedSeats] = useState([]); // array of seat numbers ['A1', 'C4']

  const activeShowtime = movieShowtimes.find(s => s._id === selectedShowtimeId) || movieShowtimes[0];

  const bookedSeats = activeShowtime ? (activeShowtime.bookedSeats || []) : [];
  const vipPrice = activeShowtime ? (activeShowtime.priceVIP || 20) : 20;
  const standardPrice = activeShowtime ? (activeShowtime.priceStandard || 14) : 14;

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Calculate pricing breakdown
  const seatDetails = selectedSeats.map(seat => {
    const isVip = seat.startsWith('A') || seat.startsWith('B');
    return {
      seatNumber: seat,
      tier: isVip ? 'VIP' : 'Standard',
      price: isVip ? vipPrice : standardPrice
    };
  });

  const subtotal = seatDetails.reduce((sum, item) => sum + item.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? (selectedSeats.length * 1.5) : 0;
  const grandTotal = subtotal + convenienceFee;

  return (
    <div className="container py-4">
      {/* Back Button & Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button className="btn btn-outline-secondary text-white rounded-pill px-3" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i> Back to Movies
        </button>
        <span className="text-secondary small">
          Step 1: Choose Showtime & Select Seats
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Movie Info & Showtime Selector */}
        <div className="col-lg-4">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm mb-4">
            <div className="d-flex gap-3 mb-3">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="rounded-3 shadow"
                style={{ width: '90px', height: '125px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="text-white fw-bold mb-1">{movie.title}</h5>
                <p className="text-secondary small mb-2">
                  <i className="bi bi-clock me-1"></i>{movie.durationMinutes} mins • {movie.ageRating || 'PG-13'}
                </p>
                <div className="d-flex flex-wrap gap-1">
                  {movie.genres && movie.genres.map((g, i) => (
                    <span key={i} className="badge bg-secondary-subtle text-light border border-secondary small">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-secondary my-3" />

            <h6 className="text-white fw-bold mb-3">
              <i className="bi bi-calendar-event me-2 text-danger"></i>Select Showtime
            </h6>

            {movieShowtimes.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {movieShowtimes.map(st => (
                  <button
                    key={st._id}
                    className={`btn text-start p-3 rounded-3 border d-flex justify-content-between align-items-center ${selectedShowtimeId === st._id ? 'btn-danger border-danger' : 'btn-outline-dark border-secondary text-white'}`}
                    onClick={() => {
                      setSelectedShowtimeId(st._id);
                      setSelectedSeats([]); // reset selection on showtime change
                    }}
                  >
                    <div>
                      <div className="fw-bold">{st.startTime}</div>
                      <small className="opacity-75">{st.theaterName} • {st.screenNumber}</small>
                    </div>
                    <div className="text-end">
                      <div className="small fw-semibold">${st.priceStandard} / ${st.priceVIP}</div>
                      <small className="opacity-75">Std / VIP</small>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning py-2 small">
                No active showtimes currently scheduled for this title.
              </div>
            )}
          </div>

          {/* Pricing & Booking Summary Card */}
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <h6 className="text-white fw-bold mb-3">
              <i className="bi bi-receipt me-2 text-danger"></i>Order Summary
            </h6>

            {selectedSeats.length > 0 ? (
              <>
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-secondary small mb-1">
                    <span>Selected Seats ({selectedSeats.length}):</span>
                    <span className="text-white fw-bold">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary small mb-1">
                    <span>Seats Subtotal:</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary small">
                    <span>Convenience Fee:</span>
                    <span className="text-white">${convenienceFee.toFixed(2)}</span>
                  </div>
                </div>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-white fs-5">Total Amount:</span>
                  <span className="fw-bold text-danger fs-4">${grandTotal.toFixed(2)}</span>
                </div>

                <button 
                  className="btn btn-danger w-100 py-3 fw-bold rounded-3 shadow"
                  onClick={() => onProceedToCheckout({
                    movie,
                    showtime: activeShowtime,
                    seats: seatDetails,
                    subtotal,
                    convenienceFee,
                    grandTotal
                  })}
                >
                  Proceed to Checkout <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </>
            ) : (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-hand-index-thumb fs-3 mb-2 d-block"></i>
                <span>Please pick your seats from the layout to view pricing.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Seat Layout Visualizer */}
        <div className="col-lg-8">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm text-center">
            {/* Cinema Screen Visual */}
            <div className="screen-container">
              <div className="curved-screen"></div>
              <span className="screen-text">All Eyes This Way • Cinema Screen</span>
            </div>

            {/* Seat Grid */}
            <div className="d-inline-block p-3 overflow-auto mw-100">
              {ROWS.map(row => {
                const isVipRow = row === 'A' || row === 'B';
                return (
                  <div key={row} className="d-flex align-items-center justify-content-center mb-1">
                    <span className="text-secondary fw-bold me-3" style={{ width: '20px' }}>
                      {row}
                    </span>

                    <div className="d-flex">
                      {COLS.map(col => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        let seatClass = 'seat-button ';
                        if (isBooked) {
                          seatClass += 'seat-booked';
                        } else if (isSelected) {
                          seatClass += 'seat-selected';
                        } else if (isVipRow) {
                          seatClass += 'seat-vip';
                        } else {
                          seatClass += 'seat-standard';
                        }

                        return (
                          <React.Fragment key={seatId}>
                            {col === 6 && <div style={{ width: '20px' }}></div>}
                            <div 
                              className={seatClass}
                              onClick={() => toggleSeat(seatId)}
                              title={isBooked ? `Seat ${seatId} (Booked)` : `Seat ${seatId} (${isVipRow ? 'VIP' : 'Standard'} - $${isVipRow ? vipPrice : standardPrice})`}
                            >
                              {col}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <span className="text-secondary fw-bold ms-3" style={{ width: '20px' }}>
                      {row}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <hr className="border-secondary my-4" />
            <div className="d-flex flex-wrap justify-content-center gap-4 text-secondary small">
              <div>
                <span className="legend-dot" style={{ backgroundColor: 'var(--seat-available)', border: '1px solid #475569' }}></span>
                <span>Standard (${standardPrice})</span>
              </div>
              <div>
                <span className="legend-dot" style={{ backgroundColor: 'var(--seat-vip)', border: '1px solid var(--seat-vip-border)' }}></span>
                <span>VIP Recliner (${vipPrice})</span>
              </div>
              <div>
                <span className="legend-dot" style={{ backgroundColor: 'var(--seat-selected)' }}></span>
                <span>Selected</span>
              </div>
              <div>
                <span className="legend-dot" style={{ backgroundColor: 'var(--seat-booked)' }}></span>
                <span>Reserved / Sold</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;

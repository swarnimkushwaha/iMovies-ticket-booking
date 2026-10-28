import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import SeatGrid from './components/SeatGrid';
import CheckoutModal from './components/CheckoutModal';
import BookingHistory from './components/BookingHistory';
import AdminDashboard from './components/AdminDashboard';
import AuthModals from './components/AuthModals';
import { INITIAL_MOVIES, INITIAL_SHOWTIMES } from './api';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('movies'); // 'movies' | 'seats' | 'bookings' | 'admin'
  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [showtimes, setShowtimes] = useState(INITIAL_SHOWTIMES);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'register' | null

  // Handle movie selection to view showtimes and seats
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setActiveView('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = (data) => {
    setCheckoutData(data);
  };

  // Handle successful reservation
  const handleBookingSuccess = (newBooking) => {
    setBookings([newBooking, ...bookings]);

    // Mark seats as booked locally in the showtime
    const seatNums = newBooking.seats.map(s => s.seatNumber);
    setShowtimes(prev => prev.map(st => {
      if (st._id === newBooking.showtime._id) {
        return {
          ...st,
          bookedSeats: [...(st.bookedSeats || []), ...seatNums]
        };
      }
      return st;
    }));
  };

  // Add movie from Admin
  const handleAddMovie = (newMovie) => {
    setMovies([newMovie, ...movies]);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navigation */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenAuth={(mode) => setAuthModalMode(mode)} 
      />

      {/* Main View Router */}
      <main className="flex-grow-1">
        {activeView === 'movies' && (
          <MovieList 
            movies={movies} 
            onSelectMovie={handleSelectMovie} 
          />
        )}

        {activeView === 'seats' && selectedMovie && (
          <SeatGrid 
            movie={selectedMovie} 
            showtimes={showtimes} 
            onBack={() => setActiveView('movies')}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {activeView === 'bookings' && (
          <BookingHistory 
            localBookings={bookings} 
            onCancelBooking={(bookingId) => {
              setBookings(bookings.map(b => b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b));
            }}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard 
            movies={movies} 
            onAddMovie={handleAddMovie} 
          />
        )}
      </main>

      {/* Checkout Modal */}
      {checkoutData && (
        <CheckoutModal 
          checkoutData={checkoutData}
          onClose={() => setCheckoutData(null)}
          onBookingSuccess={handleBookingSuccess}
          onRequireAuth={() => setAuthModalMode('login')}
        />
      )}

      {/* Authentication Modal */}
      {authModalMode && (
        <AuthModals 
          authMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {/* Footer */}
      <footer className="py-4 bg-dark border-top border-secondary text-secondary mt-auto">
        <div className="container text-center small">
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <span className="badge brand-badge px-2 py-1 rounded">iM</span>
            <span className="fw-bold text-white">The IMovies Cinema Platform</span>
          </div>
          <p className="mb-0">
            Powered by Express.js, MongoDB, React, Bootstrap & JWT Authentication.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

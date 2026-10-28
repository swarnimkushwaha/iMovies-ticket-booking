import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeView, setActiveView, onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cinema-navbar sticky-top py-3">
      <div className="container">
        <a 
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white" 
          href="#home"
          onClick={(e) => { e.preventDefault(); setActiveView('movies'); }}
        >
          <span className="badge brand-badge px-2 py-1 rounded">iM</span>
          <span>The IMovies</span>
        </a>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#cinemaNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="cinemaNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link text-decoration-none ${activeView === 'movies' ? 'active text-danger fw-bold' : 'text-light'}`}
                onClick={() => setActiveView('movies')}
              >
                <i className="bi bi-film me-1"></i> Movies & Showtimes
              </button>
            </li>
            {user && (
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link text-decoration-none ${activeView === 'bookings' ? 'active text-danger fw-bold' : 'text-light'}`}
                  onClick={() => setActiveView('bookings')}
                >
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </button>
              </li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link text-decoration-none ${activeView === 'admin' ? 'active text-warning fw-bold' : 'text-warning'}`}
                  onClick={() => setActiveView('admin')}
                >
                  <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                </button>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 rounded-pill"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="badge bg-warning text-dark ms-1">Admin</span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                  <li><h6 className="dropdown-header">{user.email}</h6></li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setActiveView('bookings')}
                    >
                      <i className="bi bi-ticket-detailed me-2"></i> My Tickets
                    </button>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <button 
                        className="dropdown-item text-warning" 
                        onClick={() => setActiveView('admin')}
                      >
                        <i className="bi bi-gear-wide-connected me-2"></i> Manage Cinema
                      </button>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-light px-3 py-2 rounded-pill fw-medium"
                  onClick={() => onOpenAuth('login')}
                >
                  Sign In
                </button>
                <button 
                  className="btn btn-danger px-3 py-2 rounded-pill fw-medium shadow-sm"
                  onClick={() => onOpenAuth('register')}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

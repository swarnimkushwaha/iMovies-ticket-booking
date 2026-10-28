import React from 'react';

const MovieCard = ({ movie, onSelectMovie }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="movie-card h-100 d-flex flex-column">
        <div className="poster-wrapper">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="poster-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="rating-pill">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {movie.rating ? movie.rating.toFixed(1) : '8.5'}
          </div>
        </div>

        <div className="p-3 d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="badge bg-secondary-subtle text-light border border-secondary text-uppercase fs-xs">
              {movie.ageRating || 'PG-13'}
            </span>
            <small className="text-secondary">
              <i className="bi bi-clock me-1"></i>{movie.durationMinutes} min
            </small>
          </div>

          <h5 className="card-title fw-bold text-white mb-2 text-truncate" title={movie.title}>
            {movie.title}
          </h5>

          <p className="card-text text-muted small flex-grow-1" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.description}
          </p>

          <div className="mb-3 d-flex flex-wrap gap-1">
            {movie.genres && movie.genres.slice(0, 2).map((g, idx) => (
              <span key={idx} className="badge bg-dark border border-secondary text-secondary small">
                {g}
              </span>
            ))}
          </div>

          <button 
            className="btn btn-danger w-100 fw-semibold rounded-3 py-2 mt-auto d-flex align-items-center justify-content-center gap-2"
            onClick={() => onSelectMovie(movie)}
          >
            <i className="bi bi-ticket-perforated-fill"></i>
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

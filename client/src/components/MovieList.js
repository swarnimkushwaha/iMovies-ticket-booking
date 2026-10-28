import React, { useState, useMemo } from 'react';
import MovieCard from './MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Crime'];

const MovieList = ({ movies, onSelectMovie }) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState('nowPlaying'); // 'nowPlaying' or 'upcoming'

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchGenre = selectedGenre === 'All' || (movie.genres && movie.genres.includes(selectedGenre));
      const matchSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (movie.description && movie.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTab = viewTab === 'nowPlaying' ? movie.isNowPlaying !== false : movie.isUpcoming === true;
      return matchGenre && matchSearch && matchTab;
    });
  }, [movies, selectedGenre, searchQuery, viewTab]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner text-center text-white mb-5">
        <div className="container py-4">
          <span className="badge bg-danger px-3 py-2 text-uppercase mb-3 tracking-wider">
            Now Screening in IMAX & Dolby Atmos
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            Experience Cinema Like Never Before
          </h1>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
            Book your favorite movies with live interactive seat reservation, real-time availability, and instant digital tickets.
          </p>

          {/* Search bar */}
          <div className="col-12 col-md-8 col-lg-6 mx-auto">
            <div className="input-group shadow-lg">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control form-control-lg bg-dark text-white border-secondary"
                placeholder="Search movies, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="btn btn-dark border-secondary text-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container pb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          {/* Tab Filter */}
          <div className="btn-group p-1 bg-dark rounded-pill border border-secondary">
            <button 
              className={`btn btn-sm rounded-pill px-4 ${viewTab === 'nowPlaying' ? 'btn-danger' : 'text-light'}`}
              onClick={() => setViewTab('nowPlaying')}
            >
              Now Playing
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-4 ${viewTab === 'upcoming' ? 'btn-danger' : 'text-light'}`}
              onClick={() => setViewTab('upcoming')}
            >
              Coming Soon
            </button>
          </div>

          {/* Genre Pills */}
          <div className="d-flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                className={`btn btn-sm rounded-pill px-3 ${selectedGenre === genre ? 'btn-light fw-bold text-dark' : 'btn-outline-secondary text-light'}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="row">
            {filteredMovies.map(movie => (
              <MovieCard 
                key={movie._id} 
                movie={movie} 
                onSelectMovie={onSelectMovie} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-5 my-5">
            <i className="bi bi-film text-secondary display-1 mb-3"></i>
            <h4 className="text-white">No Movies Found</h4>
            <p className="text-muted">Try adjusting your search terms or genre filter.</p>
            <button 
              className="btn btn-outline-danger mt-2"
              onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;

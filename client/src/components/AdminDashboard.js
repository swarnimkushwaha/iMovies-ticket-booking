import React, { useState } from 'react';

const AdminDashboard = ({ movies, onAddMovie }) => {
  const [formData, setFormData] = useState({
    title: '',
    genres: 'Action, Sci-Fi',
    durationMinutes: 140,
    rating: 8.5,
    ageRating: 'PG-13',
    posterUrl: '',
    description: '',
    isNowPlaying: true
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMovie = {
      _id: `m_${Date.now()}`,
      title: formData.title,
      genres: formData.genres.split(',').map(s => s.trim()),
      durationMinutes: Number(formData.durationMinutes),
      rating: Number(formData.rating),
      ageRating: formData.ageRating,
      posterUrl: formData.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      description: formData.description,
      isNowPlaying: formData.isNowPlaying
    };

    onAddMovie(newMovie);
    setSuccessMsg(`Movie "${formData.title}" added to theater catalog successfully!`);
    setFormData({
      title: '',
      genres: 'Action, Sci-Fi',
      durationMinutes: 140,
      rating: 8.5,
      ageRating: 'PG-13',
      posterUrl: '',
      description: '',
      isNowPlaying: true
    });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">Cinema Management Console</h2>
          <p className="text-secondary mb-0">Control center for screening schedules, titles, and seating analytics.</p>
        </div>
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
          Administrator Mode
        </span>
      </div>

      {/* KPI Stats Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <div className="text-secondary small mb-1">Active Movies</div>
            <h3 className="fw-bold text-white">{movies.length}</h3>
            <span className="badge bg-success-subtle text-success small">Catalog Live</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <div className="text-secondary small mb-1">Screening Rooms</div>
            <h3 className="fw-bold text-white">4 Screens</h3>
            <span className="badge bg-info-subtle text-info small">IMAX & Dolby Atmos</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <div className="text-secondary small mb-1">Avg Ticket Price</div>
            <h3 className="fw-bold text-white">$15.50</h3>
            <span className="badge bg-primary-subtle text-primary small">Standard & VIP</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <div className="text-secondary small mb-1">Seat Occupancy</div>
            <h3 className="fw-bold text-white">82%</h3>
            <span className="badge bg-warning-subtle text-warning small">High Demand</span>
          </div>
        </div>
      </div>

      {/* Add Movie Form */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <h4 className="fw-bold text-white mb-3">
              <i className="bi bi-plus-circle me-2 text-danger"></i>Add New Movie Release
            </h4>

            {successMsg && (
              <div className="alert alert-success py-2">{successMsg}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Movie Title</label>
                <input 
                  type="text" 
                  className="form-control bg-secondary-subtle border-secondary text-white" 
                  placeholder="e.g. Gladiator II" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Genres (comma separated)</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary-subtle border-secondary text-white" 
                    value={formData.genres} 
                    onChange={(e) => setFormData({...formData, genres: e.target.value})} 
                    required 
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-secondary small">Duration (mins)</label>
                  <input 
                    type="number" 
                    className="form-control bg-secondary-subtle border-secondary text-white" 
                    value={formData.durationMinutes} 
                    onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})} 
                    required 
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-secondary small">Age Rating</label>
                  <select 
                    className="form-select bg-secondary-subtle border-secondary text-white"
                    value={formData.ageRating}
                    onChange={(e) => setFormData({...formData, ageRating: e.target.value})}
                  >
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Poster Image URL</label>
                <input 
                  type="url" 
                  className="form-control bg-secondary-subtle border-secondary text-white" 
                  placeholder="https://images.unsplash.com/..." 
                  value={formData.posterUrl} 
                  onChange={(e) => setFormData({...formData, posterUrl: e.target.value})} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small">Synopsis / Description</label>
                <textarea 
                  className="form-control bg-secondary-subtle border-secondary text-white" 
                  rows="3" 
                  placeholder="Brief synopsis..." 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  required 
                ></textarea>
              </div>

              <button type="submit" className="btn btn-danger py-2 px-4 rounded-pill fw-bold">
                Publish Movie to Cinema Schedule
              </button>
            </form>
          </div>
        </div>

        {/* Existing Catalog List */}
        <div className="col-lg-5">
          <div className="p-4 rounded-4 bg-dark border border-secondary shadow-sm">
            <h5 className="fw-bold text-white mb-3">Live Movie Catalog ({movies.length})</h5>
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '480px' }}>
              {movies.map(m => (
                <div key={m._id} className="d-flex align-items-center gap-3 p-2 rounded-3 bg-secondary-subtle border border-secondary">
                  <img 
                    src={m.posterUrl} 
                    alt={m.title} 
                    style={{ width: '45px', height: '65px', objectFit: 'cover' }} 
                    className="rounded" 
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="text-white fw-bold mb-0 text-truncate">{m.title}</h6>
                    <small className="text-secondary">{m.durationMinutes} min • {m.ageRating}</small>
                  </div>
                  <span className="badge bg-success small">Playing</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

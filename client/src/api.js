const API_BASE = 'http://localhost:5000/api';

// Helper for making API requests with JWT Auth header
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('imovies_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    console.warn(`[API] Failed to call ${endpoint}, fallback to local state if applicable`, err);
    throw err;
  }
};

// Initial local sample data for instant frontend preview
export const INITIAL_MOVIES = [
  {
    _id: 'm1',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    durationMinutes: 166,
    language: 'English',
    rating: 8.6,
    ageRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    director: 'Denis Villeneuve',
    isNowPlaying: true
  },
  {
    _id: 'm2',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    durationMinutes: 169,
    language: 'English',
    rating: 8.7,
    ageRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
    isNowPlaying: true
  },
  {
    _id: 'm3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.',
    genres: ['Action', 'Crime', 'Drama'],
    durationMinutes: 152,
    language: 'English',
    rating: 9.0,
    ageRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    director: 'Christopher Nolan',
    isNowPlaying: true
  },
  {
    _id: 'm4',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genres: ['Animation', 'Action', 'Adventure'],
    durationMinutes: 140,
    language: 'English',
    rating: 8.8,
    ageRating: 'PG',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    director: 'Joaquim Dos Santos',
    isNowPlaying: true
  }
];

export const INITIAL_SHOWTIMES = [
  {
    _id: 's1',
    movieId: 'm1',
    theaterName: 'Grand IMAX Theater',
    screenNumber: 'Screen 1',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '14:30',
    priceStandard: 14,
    priceVIP: 22,
    bookedSeats: ['A3', 'A4', 'C4', 'C5']
  },
  {
    _id: 's2',
    movieId: 'm1',
    theaterName: 'Grand IMAX Theater',
    screenNumber: 'Screen 1',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    priceStandard: 16,
    priceVIP: 25,
    bookedSeats: ['B2', 'B3', 'D1', 'D2']
  },
  {
    _id: 's3',
    movieId: 'm2',
    theaterName: 'Dolby Atmos Cinema',
    screenNumber: 'Screen 2',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    priceStandard: 12,
    priceVIP: 18,
    bookedSeats: ['A1', 'E5']
  },
  {
    _id: 's4',
    movieId: 'm3',
    theaterName: 'Standard Screen 3',
    screenNumber: 'Screen 3',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '20:30',
    priceStandard: 12,
    priceVIP: 17,
    bookedSeats: ['C1', 'C2', 'F7']
  },
  {
    _id: 's5',
    movieId: 'm4',
    theaterName: 'Dolby Atmos Cinema',
    screenNumber: 'Screen 2',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    priceStandard: 11,
    priceVIP: 16,
    bookedSeats: ['F3', 'F4']
  }
];

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

dotenv.config();

const movies = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    durationMinutes: 166,
    language: 'English',
    rating: 8.6,
    ageRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    isNowPlaying: true
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    durationMinutes: 169,
    language: 'English',
    rating: 8.7,
    ageRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
    isNowPlaying: true
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    genres: ['Action', 'Crime', 'Drama'],
    durationMinutes: 152,
    language: 'English',
    rating: 9.0,
    ageRating: 'PG-13',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    director: 'Christopher Nolan',
    isNowPlaying: true
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genres: ['Animation', 'Action', 'Adventure'],
    durationMinutes: 140,
    language: 'English',
    rating: 8.8,
    ageRating: 'PG',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    director: 'Joaquim Dos Santos',
    isNowPlaying: true
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genres: ['Biography', 'Drama', 'History'],
    durationMinutes: 180,
    language: 'English',
    rating: 8.9,
    ageRating: 'R',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    isNowPlaying: false,
    isUpcoming: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies_db');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany();
    await Movie.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing collections.');

    // Create Admin and Customer Users
    const admin = await User.create({
      name: 'Admin Manager',
      email: 'admin@imovies.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 555-0199'
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'user@imovies.com',
      password: 'password123',
      role: 'customer',
      phone: '+1 555-0123'
    });
    console.log('Seeded Users: admin@imovies.com & user@imovies.com (pass: password123)');

    // Insert Movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`Seeded ${createdMovies.length} Movies.`);

    // Today and tomorrow dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const showtimes = [
      {
        movie: createdMovies[0]._id, // Dune 2
        theaterName: 'IMAX Cinema Hall 1',
        screenNumber: 'Screen 1',
        showDate: today,
        startTime: '14:00',
        endTime: '16:50',
        priceStandard: 14,
        priceVIP: 22,
        bookedSeats: ['A3', 'A4', 'C5', 'C6']
      },
      {
        movie: createdMovies[0]._id, // Dune 2
        theaterName: 'IMAX Cinema Hall 1',
        screenNumber: 'Screen 1',
        showDate: today,
        startTime: '19:30',
        endTime: '22:20',
        priceStandard: 16,
        priceVIP: 25,
        bookedSeats: ['B1', 'B2', 'D4', 'D5', 'D6']
      },
      {
        movie: createdMovies[1]._id, // Interstellar
        theaterName: 'Dolby Atmos Screen 2',
        screenNumber: 'Screen 2',
        showDate: today,
        startTime: '17:00',
        endTime: '19:50',
        priceStandard: 12,
        priceVIP: 18,
        bookedSeats: ['A1', 'A2', 'E5']
      },
      {
        movie: createdMovies[2]._id, // The Dark Knight
        theaterName: 'Standard Screen 3',
        screenNumber: 'Screen 3',
        showDate: tomorrow,
        startTime: '20:00',
        endTime: '22:35',
        priceStandard: 11,
        priceVIP: 17,
        bookedSeats: ['C1', 'C2', 'C3']
      },
      {
        movie: createdMovies[3]._id, // Across the Spider-Verse
        theaterName: 'Dolby Atmos Screen 2',
        screenNumber: 'Screen 2',
        showDate: today,
        startTime: '13:30',
        endTime: '15:50',
        priceStandard: 12,
        priceVIP: 18,
        bookedSeats: ['F1', 'F2']
      }
    ];

    await Showtime.insertMany(showtimes);
    console.log('Seeded Showtimes with pre-reserved seats.');

    console.log('\n✅ Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();

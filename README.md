# 🎬 The IMovies - Cinema Booking & Reservation Platform

**The IMovies** is a full-stack web application designed to deliver a modern cinema booking experience. Users can explore trending and now-playing films, check screening times, select seats on an interactive layout with live availability tracking, and reserve tickets with real-time locking and confirmation.

Built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js), styled with **Bootstrap 5**, and secured using **JSON Web Tokens (JWT)**.

---

## 🚀 Key Features

- **Movie Discovery & Filtering**: Search by title/actor, filter by genres (Action, Sci-Fi, Drama, etc.), and view age ratings and runtimes.
- **Interactive Seat Map**:
  - Distinct tiered seating: VIP Recliners (Rows A–B) vs Standard Seats (Rows C–F).
  - Real-time status: Available, Selected, and Sold/Reserved.
  - Temporary seat hold mechanism to prevent double bookings.
- **Dynamic Price Calculation**: Live subtotal computation based on seat tiers + convenience fees.
- **Booking & Digital Pass**: Instant generation of unique booking reference codes (e.g., `IMV-987421`) and digital passes.
- **Role-Based Access (RBAC)**:
  - **Customer**: Browse catalog, reserve seats, manage active tickets.
  - **Admin**: Add new movies, monitor theater occupancy, and schedule showtimes.

---

## 📊 Project Epics & Tasks (6 Epics, 19 Tasks)

| Epic | Tasks Included | Scope |
| :--- | :--- | :--- |
| **Epic 1: Project Setup & Core Architecture** | Tasks 1–3 | Monorepo structure, Express server, Mongoose connection, CORS, and centralized error handling middleware. |
| **Epic 2: User Authentication & Role Authorization** | Tasks 4–6 | User model with password hashing (`bcrypt`), JWT login/registration endpoints, and React AuthContext. |
| **Epic 3: Movie Catalog & Showtime Scheduling** | Tasks 7–10 | Movie & Showtime models, REST APIs for catalog queries, genre filters, and React movie card grid. |
| **Epic 4: Interactive Seat Map & Availability** | Tasks 11–13 | Seat layout matrix, seat locking engine to avoid race conditions, and visual seat selector UI. |
| **Epic 5: Booking Engine & Ticket Generation** | Tasks 14–16 | Booking model, transaction controller, simulated card checkout, and e-ticket pass display. |
| **Epic 6: Dashboards, Admin Tools & Testing** | Tasks 17–19 | User booking history & cancellation, Admin cinema management panel, and database seed script. |

---

## 🗂 Project Structure

```
imovies/
├── demo.html               # ⚡ Standalone zero-dependency interactive demo
├── package.json            # Root workspace scripts
├── README.md               # Documentation & setup guide
├── server/                 # Express.js & MongoDB Backend
│   ├── .env                # Environment variables
│   ├── server.js           # Express app entrypoint
│   ├── config/db.js        # MongoDB connection
│   ├── models/             # User, Movie, Showtime, Booking schemas
│   ├── middleware/         # auth.js (JWT) & errorHandler.js
│   ├── controllers/        # auth, movie, showtime, booking logic
│   ├── routes/             # REST API routers
│   └── seed/seedData.js    # Database seeder with sample movies & showtimes
└── client/                 # React.js Frontend
    ├── public/index.html   # Bootstrap 5 and Icons
    └── src/
        ├── App.js          # Main app & view router
        ├── App.css         # Custom cinema styles & seat matrix
        ├── api.js          # API client with token injector & fallback data
        ├── context/        # AuthContext for session management
        └── components/     # Navbar, MovieList, SeatGrid, Checkout, etc.
```

---

## ⚙️ Quick Start Guide

### 1. Instant Interactive Preview (No setup required!)
You can open `demo.html` in any web browser (Chrome, Edge, Firefox) right now:
- Double click `demo.html` or drag it into your browser.
- Test movie filtering, interactive seat picking, checkout simulation, and admin movie creation immediately.

### 2. Running Full-Stack with Node.js & MongoDB

#### Prerequisites:
1. **Node.js (v18+)**: [Download Node.js](https://nodejs.org/)
2. **MongoDB**: Local MongoDB Community Server [Download MongoDB](https://www.mongodb.com/try/download/community) or a free MongoDB Atlas URI.

#### Step 1: Install Dependencies
Open a terminal in the `imovies` directory:
```bash
npm run install-all
```

#### Step 2: Seed the Database
Populate sample movies, showtimes, and default users:
```bash
npm run seed
```
*Default accounts created:*
- **Customer**: `user@imovies.com` (password: `password123`)
- **Admin**: `admin@imovies.com` (password: `password123`)

#### Step 3: Start the Backend Server
```bash
npm run server
```
Server runs at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

#### Step 4: Start the React Frontend
In a separate terminal window:
```bash
npm run client
```
Client runs at `http://localhost:3000`.

CinemaVerse

CinemaVerse is a personal full-stack web application focused on the world of cinema, built to practice modern web development with Next.js, React, TypeScript, MongoDB, and Mongoose.

The goal is to create an experience inspired by streaming platforms and movie databases, combining movie discovery, authentication, personal lists, reviews, and cinema reservations.

🚀 Tech Stack
Next.js 16 — App Router
React 19
TypeScript
Tailwind CSS 4
MongoDB
Mongoose
JWT — authentication through HTTP-only cookies
REST API — Next.js Route Handlers
Vercel — planned deployment
✨ Features
Movie Catalog
Browse the movie catalog
Search movies by title
Debounced search
Filter movies by genre
Server-side pagination
Infinite scroll
Movie cards with key information
Movie detail pages
Personal Lists

Authenticated users can:

Add movies to favorites
Remove movies from favorites
Add movies to a watchlist
Remove movies from the watchlist
Filter the catalog based on their personal lists
Authentication
User registration
Login
Logout
JWT-based sessions
HTTP-only authentication cookies
Server-side retrieval of the authenticated user
Profile

The profile section is designed to provide:

Account information
Favorite movies
Watchlist
Reservation history
Reviews

Some of these features are still under development.

Reservations

The reservation system is planned to support:

Cinema selection
Movie selection
Showtime selection
Seat selection
Booking summary
🏗️ Architecture

The project uses the Next.js App Router and separates the UI layer from server-side application logic.

The API follows this structure:

Route Handler
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Mongoose Model
     ↓
MongoDB

Route Handlers are mainly responsible for receiving requests and returning responses, while application logic is kept inside dedicated server layers.

Main project structure:

src/
├── app/
│   ├── api/
│   ├── film/
│   ├── prenotazioni/
│   ├── profilo/
│   └── page.tsx
│
├── components/
│   ├── layout/
│   └── movies/
│
├── context/
├── hooks/
├── lib/
├── types/
│
├── server/
│   ├── auth/
│   ├── common/
│   └── modules/
│       ├── favorite/
│       ├── movie/
│       ├── movie-list-user/
│       ├── persona/
│       ├── genere/
│       ├── reservation/
│       ├── review/
│       └── user/
│
└── scripts/

🎞️ IMDb Dataset

CinemaVerse uses IMDb datasets as a source for importing movie, person, crew, and cast information.

Before running the IMDb import, the required .tsv files must be placed inside the project's data folder:

data/
├── name.basics.tsv
├── title.basics.tsv
├── title.crew.tsv
└── title.principals.tsv

The required IMDb datasets are:

name.basics.tsv — information about people
title.basics.tsv — basic information about titles
title.crew.tsv — directors and writers associated with titles
title.principals.tsv — principal cast and crew members

After placing the files in the data folder, run the IMDb import script:

npm run import:imdb

The script executed by this command is:

tsx scripts/imdb/import-imdb.ts

The import process reads the IMDb datasets and populates the CinemaVerse database with the required movie and people data.

The IMDb dataset files are not included in the repository and must be downloaded separately.

🔐 Environment Variables

Local environment files are not committed to the repository.

Copy .env.example to .env.local:

cp .env.example .env.local

On Windows, .env.local can also be created manually using .env.example as a template.

Example:

MONGODB_URI=mongodb://127.0.0.1:27017/cinemaverse

DEBUG_ENABLE=true
NEXT_PUBLIC_DEBUG_ENABLE=true

DEBUG_LEVEL=4
NEXT_PUBLIC_DEBUG_LEVEL=4

JWT_SECRET=your-jwt-secret-here

Never commit real secrets, passwords, database credentials, or API keys to the repository.
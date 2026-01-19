# DarbSound Film Database

A modern, searchable film database management system with automatic TMDB integration for effortless collection management.

## 🎬 Overview

DarbSound Film Database is a custom-built web application designed to manage a personal film collection of 2,500+ films. The system eliminates manual data entry by automatically pulling film metadata, posters, and ratings from The Movie Database (TMDB) API.

## ✨ Key Features

### 🔍 Intelligent Search

- Real-time search across your entire film collection
- Instant results as you type
- Search by film title with partial matching

### 🎯 TMDB Integration

- **One-click film addition** - Search TMDB and add films with complete metadata
- Automatic poster and backdrop image retrieval
- Pulls ratings, release dates, summaries, and more
- **Eliminates 100% of manual data entry**

### 📊 Database Management

- 2,485+ films currently cataloged
- PostgreSQL database via Supabase
- Tracks: title, director, year, format, genre, ratings, posters, and more
- Support for personal notes and watched status

### 🎨 Modern UI

- Clean, responsive design inspired by streaming platforms
- Dark theme optimized for viewing
- Movie poster grid layout
- Smooth animations and transitions

## 🛠️ Technology Stack

**Frontend:**

- HTML5, CSS3, JavaScript (ES6+)
- Ionicons for UI elements
- Google Fonts (Poppins)

**Backend:**

- Supabase (PostgreSQL database)
- TMDB API v3 for film metadata
- RESTful API architecture

**Hosting:**

- GitHub Pages / Netlify (frontend)
- Supabase (database and API)

## 📦 Project Structure

```
darbsound-film-db/
├── components/
│   ├── index.html          # Main application page
│   └── movie-details.html  # Individual film details
├── css/
│   └── style.css          # Application styles
├── js/
│   └── script.js          # Application logic & API integration
├── Images/                # Local assets (logos, placeholders)
├── data/                  # Data files (FileMaker exports)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for TMDB API and Supabase)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/SummerJyl/darbsound-film-db.git
cd darbsound-film-db
```

1. **Configure API keys:**

   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Get a TMDB API key at [themoviedb.org](https://www.themoviedb.org/settings/api)
   - Update `script.js` with your credentials:

   ```javascript
   const SUPABASE_URL = "your-supabase-url";
   const SUPABASE_ANON_KEY = "your-supabase-anon-key";
   const TMDB_API_KEY = "your-tmdb-api-key";
   ```

2. **Set up the database:**

   - Run the SQL schema provided in the project documentation
   - Import existing film data (if available)

3. **Launch the application:**
   - Open `components/index.html` in your browser
   - OR deploy to GitHub Pages / Netlify

## 💡 How to Use

### Searching for Films

1. Click the **search icon** in the header
2. Type a film title in the search box
3. Press **Enter** or click **Search**
4. Results from your database appear instantly

### Adding New Films

1. Search for a film (e.g., "Inception")
2. If not in your database, click **"Search TMDB for [title]"**
3. Browse TMDB results with posters and ratings
4. Click **"Add to Database"** on the film you want
5. Film is instantly added with all metadata!

### Viewing Your Collection

- Browse films on the homepage
- Films display with posters, ratings, and year
- Click any film for full details

## 📈 Database Statistics

- **Total Films:** 2,485+
- **Films with Posters:** 2,312 (93%)
- **Films with TMDB Data:** 2,312
- **Average Rating:** Various (pulled from TMDB)
- **Years Covered:** 1920s - 2020s

## 🔧 Development

### Key Files

- `script.js` - Core application logic

  - Supabase integration
  - TMDB API calls
  - Search functionality
  - Film rendering

- `style.css` - Complete styling
  - Responsive grid layouts
  - Dark theme variables
  - Animation keyframes

### API Functions

```javascript
// Search local database
searchFilms(query);

// Search TMDB API
searchTMDB(query);

// Add film from TMDB to database
addFilmToDatabase(tmdbFilm);

// Fetch films with pagination
fetchFilms(limit, offset);
```

## 🎯 Future Enhancements

- [ ] Advanced filtering (by year, genre, director, format)
- [ ] Bulk import from CSV
- [ ] Export collection to PDF/Excel
- [ ] Movie poster shop integration for purchasing prints
- [ ] User authentication (admin vs viewer roles)
- [ ] Watched/unwatched tracking
- [ ] Personal ratings and reviews
- [ ] Collection statistics dashboard

## 📝 Credits

**Developer:** Jylian Summers  
**Client:** DarbSound  
**TMDB:** This product uses the TMDB API but is not endorsed or certified by TMDB  
**Design Inspiration:** Modern streaming platforms

## 📄 License

Private project - All rights reserved

## 🤝 Contact

For questions or support, contact the developer through GitHub.

---

**Built with ❤️ for film enthusiasts**


## 🤝 Contact

For questions or support, contact the developer through GitHub.

---

**Built with ❤️ for film enthusiasts**

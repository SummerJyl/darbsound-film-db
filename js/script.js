"use strict";

// Supabase Configuration
const SUPABASE_URL = "https://ugmfigoubyfynxgbfktr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnbWZpZ291YnlmeW54Z2Jma3RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYzMzQ5MywiZXhwIjoyMDg0MjA5NDkzfQ.LOhbRdEXy5NPzkBcNg_lMxY6uFHLDH9aVw6kJ9a5AOw";
// Use the publishable/anon key

// Initialize Supabase client using CDN version
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TMDB_API_KEY = "7152f100f52ea2055f940b9621867267"; // Your TMDB key

/**
 * Fetch films from Supabase
 */
async function fetchFilms(limit = 20, offset = 0) {
  try {
    const { data, error } = await supabaseClient
      .from("films")
      .select("*")
      .order("year", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching films:", error);
    return [];
  }
}

/**
 * Search functionality
 */
function initSearchWithFilter() {
  const searchBtn = document.querySelector(".search-btn");
  const searchModal = document.getElementById("searchModal");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const closeSearchBtn = document.getElementById("closeSearch");
  const runSearchBtn = document.getElementById("runSearchBtn");
  const searchFilterSelect = document.getElementById("searchFilter");
  console.log("✅ searchFilterSelect defined:", searchFilterSelect);
  console.log("runSearchBtn:", runSearchBtn);

  // Open search modal
  searchBtn.addEventListener("click", () => {
    searchModal.style.display = "block";
    searchInput.focus();
  });

  // Close search modal
  closeSearchBtn.addEventListener("click", () => {
    searchModal.style.display = "none";
    searchInput.value = "";
    searchResults.innerHTML = "";
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal.style.display === "block") {
      searchModal.style.display = "none";
      searchInput.value = "";
      searchResults.innerHTML = "";
    }
  });
  // -----------------------------
  // Open search modal
  // -----------------------------
  searchBtn.addEventListener("click", () => {
    searchModal.style.display = "block";
    searchInput.focus();
  });

  // -----------------------------
  // Search listener for runSearchBtn
  // -----------------------------
  runSearchBtn.addEventListener("click", async (e) => {
    console.log("🚨 BUTTON CLICKED!");
    e.preventDefault();
    e.stopPropagation();

    const query = searchInput.value.trim();
    console.log("searchFilterSelect before use:", searchFilterSelect);
    const filterType = searchFilterSelect.value;

    console.log("SEARCH START:", query, filterType);
    console.log("Raw query:", query, "Filter:", filterType);

    if (!query) {
      searchResults.innerHTML = "<p>Please enter a search term.</p>";
      return;
    }

    // Use enhanced search instead of basic search
    console.log("CALLING enhancedSearchWithFilter");
    await enhancedSearchWithFilter(query, filterType);
    console.log("SEARCH COMPLETE");
  });

  // Enter key listener (SEPARATE, OUTSIDE!)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      runSearchBtn.click();
    }
  });

  // -----------------------------
  // Close modal
  // -----------------------------
  closeSearchBtn.addEventListener("click", () => {
    console.log("Search modal CLOSED");
    searchModal.style.display = "none";
    searchInput.value = "";
    searchResults.innerHTML = "";
  });
  // Search as user types (debounced)
  //   let searchTimeout;
  //   searchInput.addEventListener("input", (e) => {
  //     console.log("Input event fired, value:", e.target.value);
  //     clearTimeout(searchTimeout);
  //     const query = e.target.value.trim();

  //     if (query.length < 2) {
  //       searchResults.innerHTML = "";
  //       return;
  //     }

  //     searchTimeout = setTimeout(async () => {
  //       const films = await searchFilms(query);
  //       displaySearchResults(films);
  //     }, 300); // Wait 300ms after user stops typing
  //   });
}

/**
 * Display search results
 */
function displaySearchResults(films) {
  const searchResults = document.getElementById("searchResults");

  if (films.length === 0) {
    searchResults.innerHTML =
      '<p style="color: white; text-align: center; padding: 2rem;">No films found.</p>';
    return;
  }

  const html = `
    <ul class="movies-list">
      ${films.map((film) => renderFilmCard(film)).join("")}
    </ul>
  `;

  searchResults.innerHTML = html;
}

/**
 * Search films by title
 */
async function searchFilms(query) {
  try {
    const { data, error } = await supabaseClient
      .from("films")
      .select("*")
      .textSearch("title", query, { type: "plain" }) // Handles partial matches
      .order("year", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error searching films:", error);
    return [];
  }
}

/**
 * Get featured/random film for hero section
 */
async function getFeaturedFilm() {
  try {
    // Get a random film with poster
    const { data, error } = await supabaseClient
      .from("films")
      .select("*")
      .not("poster_url", "is", null)
      .not("rating", "is", null)
      .limit(100); // Get 100 films

    if (error) throw error;

    // Return random film from the 100
    return data[Math.floor(Math.random() * data.length)];
  } catch (error) {
    console.error("Error fetching featured film:", error);
    return null;
  }
}

/**
 * Render film card
 */
function renderFilmCard(film) {
  const posterUrl = film.poster_url || "../Images/no-poster.jpeg";
  const rating = film.rating ? film.rating.toFixed(1) : "N/A";
  const year = film.year || "Unknown";
  const imdblink = film.imdb_link || "#"; // If IMDB link available

  return `
    <li>
      <div class="movie-card">
        <figure class="poster-box card-banner">
          <img src="${posterUrl}" alt="${film.title}" class="img-cover" loading="lazy" onerror="this.src='../Images/no-poster.jpeg'">
        </figure>
        <h4 class="title">${film.title}</h4>
        <div class="meta-list">
          <div class="meta-item">
            <ion-icon name="star"></ion-icon> 
            <span class="span">${rating}</span>
          </div>
          <div class="meta-item card-badge">${year}</div>
        </div>
        <a href="${imdblink}" target="_blank" class="card-btn" title="View on IMDB">
          <ion-icon name="link-outline"></ion-icon>
        </a>
      </div>
    </li>
  `;
}

/**
 * Search TMDB for films by title
 */
async function searchTMDB(query) {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("🎬 TMDB search results:", data.results);
    return data.results || [];
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
}

/**
 * Add film from TMDB to Supabase database
 */
async function addFilmToDatabase(tmdbFilm) {
  try {
    // Prepare film data for Supabase
    const filmData = {
      title: tmdbFilm.title,
      year: tmdbFilm.release_date
        ? parseInt(tmdbFilm.release_date.split("-")[0])
        : null,
      summary: tmdbFilm.overview || null,
      tmdb_id: tmdbFilm.id,
      poster_url: tmdbFilm.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbFilm.poster_path}`
        : null,
      backdrop_url: tmdbFilm.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbFilm.backdrop_path}`
        : null,
      rating: tmdbFilm.vote_average || null,
      language: tmdbFilm.original_language || null,
      category: "Movie", // Default category
      notes: null,
      // Additional fields can be filled manually later
      director: null,
      format: null,
      running_time: null,
    };

    const { data, error } = await supabaseClient
      .from("films")
      .insert([filmData])
      .select();

    if (error) throw error;

    console.log("✅ Film added to database:", data);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("❌ Error adding film to database:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Render TMDB film card with "Add" button
 */
function renderTMDBFilmCard(tmdbFilm) {
  const posterUrl = tmdbFilm.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdbFilm.poster_path}`
    : "../Images/placeholder-poster.jpg";
  const rating = tmdbFilm.vote_average
    ? tmdbFilm.vote_average.toFixed(1)
    : "N/A";
  const year = tmdbFilm.release_date
    ? tmdbFilm.release_date.split("-")[0]
    : "Unknown";

  return `
    <li>
      <div class="movie-card tmdb-result">
        <figure class="poster-box card-banner">
          <img src="${posterUrl}" alt="${tmdbFilm.title}" class="img-cover" loading="lazy">
        </figure>
        <h4 class="title">${tmdbFilm.title}</h4>
        <div class="meta-list">
          <div class="meta-item">
            <ion-icon name="star"></ion-icon>
            <span class="span">${rating}</span>
          </div>
          <div class="meta-item card-badge">${year}</div>
        </div>
        <button class="btn btn-primary add-film-btn" data-tmdb-id="${tmdbFilm.id}" style="margin-top: 1rem;">
          <ion-icon name="add-circle-outline"></ion-icon>
          Add to Database
        </button>
      </div>
    </li>
  `;
}

/**
 * Display TMDB search results
 */
function displayTMDBResults(tmdbFilms) {
  const searchResults = document.getElementById("searchResults");

  if (tmdbFilms.length === 0) {
    searchResults.innerHTML +=
      '<p style="color: white; text-align: center; padding: 2rem;">No TMDB results found.</p>';
    return;
  }

  const html = `
    <div style="margin-top: 2rem;">
      <h3 style="color: var(--yellow-green-crayola); text-align: center; margin-bottom: 1rem;">
        Results from TMDB (Click to Add)
      </h3>
      <ul class="movies-list">
        ${tmdbFilms.map((film) => renderTMDBFilmCard(film)).join("")}
      </ul>
    </div>
  `;

  searchResults.innerHTML += html;

  // Add click handlers for "Add to Database" buttons
  const addButtons = document.querySelectorAll(".add-film-btn");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const tmdbId = e.currentTarget.getAttribute("data-tmdb-id");
      const tmdbFilm = tmdbFilms.find((f) => f.id == tmdbId);

      if (!tmdbFilm) return;

      try {
        // Disable button and show loading
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.innerHTML =
          '<ion-icon name="hourglass-outline"></ion-icon> Adding...';

        const result = await addFilmToDatabase(tmdbFilm);

        if (result.success) {
          btn.innerHTML =
            '<ion-icon name="checkmark-circle"></ion-icon> Added!';
          btn.style.background = "green";

          // Show success message
          alert(`✅ "${tmdbFilm.title}" has been added to your database!`);
        } else {
          btn.innerHTML = '<ion-icon name="close-circle"></ion-icon> Error';
          btn.style.background = "red";
          alert(`❌ Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Add button error:", error);
      }
    });
  });
}

/**
 * Enhanced search that checks both DB and TMDB
 */
async function enhancedSearchWithFilter(query, filterType = "title") {
  const searchResults = document.getElementById("searchResults");

  // Build query based on filter type
  let dbQuery = supabaseClient
    .from("films")
    .select("*")
    .order("year", { ascending: false })
    .limit(50);

  // Apply filter based on selection
  switch (filterType) {
    case "title":
      dbQuery = dbQuery.ilike("title", `%${query}%`);
      break;
    case "director":
      dbQuery = dbQuery.ilike("director", `%${query}%`);
      break;
    case "genre":
      dbQuery = dbQuery.ilike("category", `%${query}%`);
      break;
  }

  const { data, error } = await dbQuery;

  // Display database results
  if (data && data.length > 0) {
    searchResults.innerHTML = `
      <h3 style="color: white; text-align: center; margin-bottom: 1rem;">
        Films in Your Database (${data.length})
      </h3>
      <ul class="movies-list">
        ${data.map((film) => renderFilmCard(film)).join("")}
      </ul>
    `;
  } else {
    searchResults.innerHTML =
      '<p style="color: white; text-align: center; padding: 2rem;">No films found in your database.</p>';
  }

  // Add "Search TMDB" button
  searchResults.innerHTML += `
    <div style="text-align: center; margin: 2rem 0;">
      <button id="searchTMDBBtn" class="btn btn-primary">
        <ion-icon name="search-outline"></ion-icon>
        Search TMDB for "${query}"
      </button>
    </div>
  `;

  // Handle TMDB search button
  document
    .getElementById("searchTMDBBtn")
    .addEventListener("click", async () => {
      const tmdbResults = await searchTMDB(query);

      // Remove the TMDB button
      document.getElementById("searchTMDBBtn").parentElement.remove();

      // Display TMDB results
      displayTMDBResults(tmdbResults);
    });
}

/**
 * Render films to a container
 */
function renderFilms(films, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (films.length === 0) {
    container.innerHTML = '<p class="no-results">No films found.</p>';
    return;
  }

  container.innerHTML = films.map((film) => renderFilmCard(film)).join("");
}

/**
 * Initialize homepage
 */
async function initHomepage() {
  console.log("🎬 Loading films from database...");

  // Load featured film for hero
  const featured = await getFeaturedFilm();
  if (featured) {
    updateHeroSection(featured);
  }

  // Load upcoming/recent films
  const recentFilms = await fetchFilms(20);
  renderFilms(recentFilms, "upcoming-movies-list");

  console.log("✅ Films loaded!");
}

/**
 * Fetch and display top-rated films
 */
async function loadTopRatedFilms() {
  try {
    const { data, error } = await supabaseClient
      .from("films")
      .select("*")
      .not("rating", "is", null)
      .order("rating", { ascending: false })
      .limit(10);

    if (error) throw error;

    // Render to Top Rated container
    const container = document.getElementById("top-rated-list");
    if (container && data) {
      container.innerHTML = data.map((film) => renderFilmCard(film)).join("");
    }
  } catch (error) {
    console.error("Error loading top rated films:", error);
  }
}
/**
 * Update hero section with featured film
 */
function updateHeroSection(film) {
  const heroTitle = document.querySelector(".hero-title");
  const heroText = document.querySelector(".hero-text");
  const heroYear = document.querySelector(".hero .meta-item:nth-child(3)");
  const heroBanner = document.querySelector(".hero-banner img");

  if (heroTitle) heroTitle.textContent = film.title;
  if (heroText && film.summary) heroText.textContent = film.summary;
  if (heroYear) heroYear.textContent = film.year;
  if (heroBanner && film.backdrop_url) heroBanner.src = film.backdrop_url;
}

/**
 * Normalize a string for search
 * - lowercase
 * - collapse extra spaces
 * - decode &amp; to &
 * - trim leading/trailing spaces
 */
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ") // collapse multiple spaces
    .replace(/&amp;/g, "&") // decode HTML entity
    .trim();
}

/**
 * Initialize search functionality
 */
// function initSearchWithFilter() {
//   console.log("initSearch called");

// Get elements
const searchBtn = document.querySelector(".search-btn");
const searchModal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const closeSearchBtn = document.getElementById("closeSearch");
const runSearchBtn = document.getElementById("runSearchBtn");

// -----------------------------
// Open search modal
// -----------------------------
searchBtn.addEventListener("click", () => {
  searchModal.style.display = "block";
  searchInput.focus();
});

// -----------------------------
// Search listener for runSearchBtn
// -----------------------------
runSearchBtn.addEventListener("click", async (e) => {
  console.log("🚨 BUTTON CLICKED!");
  e.preventDefault();
  e.stopPropagation();

  const query = searchInput.value.trim();
  console.log("searchFilterSelect before use:", searchFilterSelect);
  const filterType = searchFilterSelect.value;

  console.log("SEARCH START:", query, filterType);
  console.log("Raw query:", query, "Filter:", filterType);

  if (!query) {
    searchResults.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  // Use enhanced search instead of basic search
  console.log("CALLING enhancedSearchWithFilter");
  await enhancedSearchWithFilter(query, filterType);
  console.log("SEARCH COMPLETE");
});

// Enter key listener (SEPARATE, OUTSIDE!)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    runSearchBtn.click();
  }
});

// -----------------------------
// Close modal
// -----------------------------
closeSearchBtn.addEventListener("click", () => {
  console.log("Search modal CLOSED");
  searchModal.style.display = "none";
  searchInput.value = "";
  searchResults.innerHTML = "";
});

document.addEventListener("DOMContentLoaded", () => {
  initHomepage();
  loadTopRatedFilms();
  initSearchWithFilter();
});

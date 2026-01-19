// TMDB Film Enrichment Script
// Enriches Supabase films with TMDB data (posters, ratings, metadata)
// Run: node enrich-tmdb.js

const { createClient } = require("@supabase/supabase-js");
const https = require("https");

// CONFIGURATION
const SUPABASE_URL = "https://ugmfigoubyfynxgbfktr.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnbWZpZ291YnlmeW54Z2Jma3RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYzMzQ5MywiZXhwIjoyMDg0MjA5NDkzfQ.LOhbRdEXy5NPzkBcNg_lMxY6uFHLDH9aVw6kJ9a5AOw";
const TMDB_API_KEY = "7152f100f52ea2055f940b9621867267";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to make TMDB API requests
function tmdbRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `https://api.themoviedb.org/3${path}${path.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`;

    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// Extract IMDB ID from IMDB URL
function extractImdbId(url) {
  if (!url) return null;
  const match = url.match(/tt\d+/);
  return match ? match[0] : null;
}

// Find TMDB movie by IMDB ID
async function findTmdbByImdb(imdbId) {
  try {
    const result = await tmdbRequest(`/find/${imdbId}?external_source=imdb_id`);
    return result.movie_results?.[0] || null;
  } catch (error) {
    console.error(`Error finding TMDB for ${imdbId}:`, error.message);
    return null;
  }
}

// Enrich a single film
async function enrichFilm(film) {
  const imdbId = extractImdbId(film.imdb_link);

  if (!imdbId) {
    console.log(`⚠️  No IMDB ID for: ${film.title}`);
    return { success: false, reason: "no_imdb_id" };
  }

  const tmdbData = await findTmdbByImdb(imdbId);

  if (!tmdbData) {
    console.log(`⚠️  No TMDB match for: ${film.title} (${imdbId})`);
    return { success: false, reason: "no_tmdb_match" };
  }

  // Prepare update data
  const updateData = {
    tmdb_id: tmdbData.id,
    poster_url: tmdbData.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
      : null,
    backdrop_url: tmdbData.backdrop_path
      ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
      : null,
    rating: tmdbData.vote_average || null,
    country: tmdbData.origin_country?.[0] || null,
    language: tmdbData.original_language || null,
  };

  // Only update summary if current one is empty
  if (!film.summary && tmdbData.overview) {
    updateData.summary = tmdbData.overview;
  }

  // Update in Supabase
  const { error } = await supabase
    .from("films")
    .update(updateData)
    .eq("id", film.id);

  if (error) {
    console.error(`❌ Error updating ${film.title}:`, error.message);
    return { success: false, reason: "update_error" };
  }

  console.log(`✅ Enriched: ${film.title}`);
  return { success: true };
}

// Main enrichment process
async function enrichAllFilms() {
  console.log("🎬 Starting TMDB enrichment...\n");

  // Fetch all films (with pagination to handle 2000+ records)
  let films = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("id")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error("❌ Error fetching films:", error);
      return;
    }

    if (data.length === 0) break;

    films = films.concat(data);
    console.log(`📥 Fetched ${films.length} films so far...`);

    if (data.length < pageSize) break; // Last page
    page++;
  }

  console.log(`📊 Found ${films.length} films to enrich\n`);

  let enriched = 0;
  let noImdb = 0;
  let noTmdb = 0;
  let errors = 0;

  // Process films with rate limiting (40 requests per 10 seconds = TMDB limit)
  for (let i = 0; i < films.length; i++) {
    const film = films[i];

    const result = await enrichFilm(film);

    if (result.success) {
      enriched++;
    } else if (result.reason === "no_imdb_id") {
      noImdb++;
    } else if (result.reason === "no_tmdb_match") {
      noTmdb++;
    } else {
      errors++;
    }

    // Rate limiting: pause every 35 requests
    if ((i + 1) % 35 === 0) {
      console.log(
        `\n⏸️  Rate limit pause (processed ${i + 1}/${films.length})...\n`,
      );
      await new Promise((resolve) => setTimeout(resolve, 11000)); // 11 second pause
    }

    // Progress update every 50 films
    if ((i + 1) % 50 === 0) {
      console.log(`\n📈 Progress: ${i + 1}/${films.length} films processed\n`);
    }
  }

  console.log("\n🎉 Enrichment complete!");
  console.log(`   ✅ Enriched: ${enriched} films`);
  console.log(`   ⚠️  No IMDB ID: ${noImdb} films`);
  console.log(`   ⚠️  No TMDB match: ${noTmdb} films`);
  console.log(`   ❌ Errors: ${errors} films`);
}

enrichAllFilms().catch(console.error);

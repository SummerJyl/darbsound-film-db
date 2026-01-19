const https = require("https");

const TMDB_API_KEY = "7152f100f52ea2055f940b9621867267";
const imdbId = "tt0078721"; // The movie "10"

const url = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`;

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log(JSON.parse(data));
  });
});

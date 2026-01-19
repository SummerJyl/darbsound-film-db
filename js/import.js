// Film Import Script - Parse FileMaker HTML and Import to Supabase
// Run: node import.js

const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// CONFIGURATION - Replace with your values
const SUPABASE_URL = "https://ugmfigoubyfynxgbfktr.supabase.co"; // e.g., https://xxxxx.supabase.co
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnbWZpZ291YnlmeW54Z2Jma3RyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYzMzQ5MywiZXhwIjoyMDg0MjA5NDkzfQ.LOhbRdEXy5NPzkBcNg_lMxY6uFHLDH9aVw6kJ9a5AOw"; // Your anon/public key
const HTML_FILE_PATH = "../data/DarbMedia_12_31_25.htm"; // Path to your HTML file

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse HTML table to extract film data
function parseHTMLTable(html) {
  const films = [];

  // Match all table rows (excluding header)
  const rowRegex =
    /<TR>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>\s*<TD>(.*?)<\/TD>/gi;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const [
      _,
      title,
      director,
      year,
      format,
      boxSet,
      lentTo,
      summary,
      comments,
      recordNumber,
      publisher,
      category,
      link,
      runningTime,
    ] = match;

    // Clean up HTML entities and empty values
    const clean = (str) => {
      if (!str || str === "<BR>" || str.trim() === "") return null;
      return str.replace(/<BR>/gi, "").trim();
    };

    films.push({
      title: clean(title),
      director: clean(director),
      year: clean(year) ? parseInt(clean(year)) : null,
      format: clean(format),
      box_set: clean(boxSet),
      lent_to: clean(lentTo),
      summary: clean(summary),
      comments: clean(comments),
      record_number: clean(recordNumber) ? parseInt(clean(recordNumber)) : null,
      publisher: clean(publisher),
      category: clean(category),
      imdb_link: clean(link),
      running_time: clean(runningTime) ? parseInt(clean(runningTime)) : null,
    });
  }

  return films;
}

// Import films to Supabase
async function importFilms(films) {
  console.log(`\nImporting ${films.length} films to Supabase...`);

  // Import in batches of 100 to avoid timeout
  const batchSize = 100;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < films.length; i += batchSize) {
    const batch = films.slice(i, i + batchSize);

    const { data, error } = await supabase.from("films").insert(batch);

    if (error) {
      console.error(`Error importing batch ${i / batchSize + 1}:`, error);
      errors += batch.length;
    } else {
      imported += batch.length;
      console.log(
        `Imported batch ${i / batchSize + 1}: ${imported} films total`,
      );
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Successful: ${imported} films`);
  console.log(`   Errors: ${errors} films`);
}

// Main execution
async function main() {
  try {
    console.log("📁 Reading HTML file...");
    const html = fs.readFileSync(HTML_FILE_PATH, "utf-8");

    console.log("🔍 Parsing film data...");
    const films = parseHTMLTable(html);

    console.log(`\n📊 Found ${films.length} films`);
    console.log(`\nSample film:`, films[0]);

    // Ask for confirmation before importing
    console.log("\n⚠️  Ready to import to Supabase.");
    console.log(
      "   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n",
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await importFilms(films);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();

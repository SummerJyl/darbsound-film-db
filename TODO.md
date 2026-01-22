## To do

1/20/2025
Check Supabase for:
✅ Films that do not have a genre
✅ Can we pull any/all films that have C.(comments column), director, year, title, record #?

DarbSound | Film
Add functionality to add/remove C. to film \*denotes whether it's been watched
Add Review and Podcast blog style layouts
Transfer all films, images, etc. Jeff has added to his FTP database to film site

Create layout for film page

🔌 Part 1: Bringing FileMaker Pro Database into VS Code
👣 Your Options:
You can't directly “import” a live FileMaker Pro database into VS Code, but you can connect to or export from it. Here are three realistic paths:

✅ Option 1: Export FileMaker Records as JSON or CSV
Best for: Static or semi-dynamic websites
You can export film data from FileMaker like this:

Open FileMaker Pro
→ Go to your Films layout

File → Export Records...

Choose JSON or CSV

Select the fields you want: Title, Genre, Year, Length, Rating, etc.

Save it as films.json (preferred)

Move that films.json into your VSC project folder, like:

pgsql
Copy
Edit
/my-film-site
├── index.html
├── films.html
├── css/
├── js/
└── data/
└── films.json
Use fetch() in JavaScript to load and display the film data in your "Film Database" page.

⚙️ Option 2: Use FileMaker’s Data API
Best for: Dynamic websites that always show current data
You’ll need:

FileMaker Server with the Data API enabled

Credentials & endpoint like:
<https://your-server.com/fmi/data/v1/databases/myDB/layouts/Films/records>

You can then use fetch() or Axios from JS to pull in data directly.

Let me know if you want help setting this up.

🎨 Part 2: Designing Your Film Database Page Layout
Here’s a layout recommendation with modern, responsive styling:

✨ Layout: Film Database
bash
Copy
Edit
Page: /films.html
🎬 Header
"Film Collection" — Bold H1 title

Filter bar (optional): by Genre, Year, Rating, Format

🎞️ Grid of Cards
Each film gets a “card” with:

Poster image

Title

Blu-Ray | Genre | Year | Length | Rating

Hover effect: blur, scale, or button: "Details" or "Watch"

💡 Sample HTML Structure
html
Copy
Edit

<section class="film-db">
  <h1>Film Collection</h1>
  <div class="film-grid">
    <!-- Film card template -->
    <div class="film-card">
      <img src="path/to/poster.jpg" alt="Film Title poster">
      <div class="film-info">
        <h3>Film Title</h3>
        <p>Blu-Ray | Horror | 1977 | 110 min | R</p>
      </div>
    </div>
    <!-- More film cards -->
  </div>
</section>
💻 Example CSS Snippet
css
Copy
Edit
.film-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.film-card {
background: #111;
color: #eee;
border-radius: 10px;
overflow: hidden;
box-shadow: 0 4px 15px rgba(0,0,0,0.2);
transition: transform 0.3s ease;
}

.film-card:hover {
transform: scale(1.03);
}
🧱 Tech Stack Setup
To connect everything, here’s what you’ll want to install:

✅ Minimal Static Stack
VS Code
Live Server extension (you already have this)

Your project folders: /css, /js, /data

🔥 Optional (for JSON/data use)
Node.js (to run local servers, automate tasks later)
Express (if building a backend API later)
Git + GitHub (for version control)

---

# Film Database Project - Summary & To Do

## ✅ Completed

- Created initial HTML structure for Home, Film, Reviews, Podcast, Contact pages
- Set up local project folders and files:
  - `CSS/style.css`
  - `js/script.js`
  - `data/films.csv` imported from FileMaker Pro
  - Images and Icons organized under `/Images` and `/Icons`
- Tested CSV import to load film data into the site (proof of concept)
- Developed and tested a movie detail section layout with HTML and Ionicons
- Created reusable components plan (header, footer, nav-bar) to modularize HTML
- Linked CSS and JS files correctly in HTML pages
- Installed VS Code extensions to improve development experience (Emmet, Live Server, Stylelint)
- Began Emmet configuration and testing for faster coding

---

## 🚧 To Do

- Finalize component modularization (split header, footer, nav-bar into separate files)
- Implement dynamic loading of components via JavaScript (header/footer injection)
- Complete film database page layout with full movie grid and interactive elements
- Optimize assets (images, icons) for performance and web use
- Set up form handling for Contact page
- Integrate search/filter functionality for films
- Implement "Watch Now" snippets and media playback
- Add SEO meta tags and accessibility improvements
- Prepare documentation for project setup and deployment

---

## 📌 Notes

- Consider moving to a JavaScript framework (React/Vue) for better state management in the future
- Backup and archive FileMaker Pro data regularly before syncing
- Plan next project: portfolio migration from WordPress

---

_Last updated: [07182025]_

01-18-2025
Enable search by Director, Genre

<!-- *********************************

1. Work Locally, Stay Live
When you click "Go Live" in VS Code now, your local site is talking to the real Supabase database.
Safe Testing: You can see all the films the client adds while you're still designing the layout.
Danger Zone: Be careful—if you delete a film while testing your "Delete" button locally, it will disappear from his live database too.
2. Layout Enhancements to Consider
Since you're in "enhancement mode," here are three quick wins for a film DB:
Sorting: Add a dropdown to sort by "Year" or "Alphabetical."
Image Gallery: If you aren't already, try pulling movie posters using the OMDb API—it makes the database look high-end.
Filter Chips: Buttons for "Sci-Fi," "Horror," or "Comedy" so the client doesn't always have to type in the search bar.
3. The "Update" Ritual
Every time you finish a new layout feature (like a new CSS style or a better search bar):
Open your project folder.
Go to the Netlify Deploys tab.
Drag and Drop the folder into that "Production" box.
Refresh: The client will see the new design immediately when they refresh their browser. -->

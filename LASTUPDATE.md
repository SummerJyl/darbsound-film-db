<!-- 📁 Legacy Data Migration Guide (FileMaker to Supabase)

 1. Identify New Records in FileMaker Pro 7
   Before updating the cloud, you must isolate only the records the client added since your last sync.
   Method A (Sort by ID): If your FileMaker records use serial numbers (IDs), sort the database by that field. The highest numbers at the bottom are the newest entries.
   Method B (The Omit Trick):
   Select all "old" records you already have in Supabase.
   Go to Records > Omit Multiple.
   Go to Records > Show Omitted Only. This leaves only the new films visible.
    2. Export to CSV
   Once only the new films are visible in FileMaker:
   Go to File > Export Records.
   Choose CSV (Comma Separated Values) or Merge (.mer) as the file type.
   Name the file (e.g., new_films_jan_2026.csv).
   Field Order: Ensure you select the fields (Title, Year, Director, etc.) in the same order they appear in your Supabase table.
3. Import to Supabase (The Cloud)
   You don't need code for this—use the Supabase Dashboard.
   Open your Table Editor and select your films table.
   Click Insert > Import Data from CSV.
   Drag your new_films_jan_2026.csv file into the box.
   Map Columns: Verify that the "CSV Column" matches your "Database Column."
   Click Save.
4. Verify on Netlify
   Open your live website link (e.g., https://darbsound-film-db.netlify.app).
   Search for one of the new films. If it appears, the sync is successful.
   🚀 Ongoing Workflow (No more thumb drives)
   Now that the "Add" feature is live on the website, the client's workflow changes:
   Direct Entry: The client should use the "Add to Database" button on the live Netlify link. This saves data directly to the cloud.
   Real-time Updates: You no longer need to "sync" or "import" anything he does through the website. It is live instantly.
   Backups: To keep a physical copy, go to Supabase once a month and click Export Table as CSV. You can save this to a thumb drive for the client’s peace of mind.
   🛠️ Developer Maintenance (VS Code)
   If you make changes to the look or search features in VS Code:
   Save your changes.
   Go to your Netlify Deploys page.
   Drag and drop your project folder into the "Update site" box.
   Note: This updates the website code but will never delete the film data he has added to Supabase.

Note: This updates the website code but will never delete the film data he has added to Supabase. -->

**After CSV import:** New films will appear in the database but won't have posters/ratings yet. The client can:
- Use the website's "Search TMDB for [title]" feature to add metadata
- OR you can run the enrichment script to batch-process them

**IMPORTANT:** Once the website is live, the client should STOP using FileMaker Pro for new entries. All additions should go through the website's "Add to Database" feature.

🛠️ Developer Maintenance (Git + Netlify)

If you make changes to the look or search features:
1. Save your changes in VS Code
2. Commit to Git: `git add . && git commit -m "Update description"`
3. Push to GitHub: `git push`
4. Netlify automatically deploys the update (linked to your GitHub repo)

Note: Code updates never affect the film data in Supabase—that's stored separately in the cloud database.
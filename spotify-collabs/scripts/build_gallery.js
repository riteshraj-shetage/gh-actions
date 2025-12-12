const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Utility: read links from a file, clean + deduplicate
function readLinks(file) {
  const fullPath = path.join(__dirname, "..", "data", file);
  if (!fs.existsSync(fullPath)) {
    console.error("Missing file:", fullPath);
    return [];
  }
  const lines = fs.readFileSync(fullPath, "utf-8")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && l.startsWith("https://open.spotify.com/"));

  return [...new Set(lines)]; // deduplicate
}

// Build a section (Tracks or Artists)
async function buildSection(file, title) {
  const links = readLinks(file);
  let html = `<section><h2>${title}</h2><div class="grid">`;

  for (const url of links) {
    try {
      const res = await axios.get("https://open.spotify.com/oembed", {
        params: { url }
      });
      html += `<div class="card">${res.data.html}</div>`;
    } catch (err) {
      html += `<div class="card error"><p>Error fetching: ${url}</p></div>`;
    }
  }

  html += "</div></section>";
  return html;
}

// Main builder
(async () => {
  const head = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="./styles.css">
      <title>Collaborative Playlist</title>
    </head>
    <body>
      <h1>Collaborative Playlist Wall</h1>
  `;
  const foot = "<script src="./one_play.js"></script></body></html>";

  let html = head;
  html += await buildSection("tracks.txt", "Tracks");
  html += await buildSection("artists.txt", "Artists");
  html += foot;

  const outPath = path.join(__dirname, "..", "index.html");
  fs.writeFileSync(outPath, html);
  console.log("Gallery built:", outPath);
})();

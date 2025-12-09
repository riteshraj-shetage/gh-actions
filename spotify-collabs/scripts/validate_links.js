const fs = require("fs");

// Clean and validate links in a file
function processFile(file) {
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  let valid = true;

  const cleaned = lines
    .map(line => line.trim())
    .filter(Boolean) // remove empty lines
    .map(line => {
      // strip ?si= suffix if present
      return line.includes("?") ? line.split("?")[0] : line;
    })
    .map(line => {
      if (!line.startsWith("https://open.spotify.com/")) {
        console.error(`Invalid link in ${file}: ${line}`);
        valid = false;
      }
      return line;
    });

  // overwrite file with cleaned links
  fs.writeFileSync(file, cleaned.join("\n") + "\n");

  return valid;
}

const trackValid = processFile("data/tracks.txt");
const artistValid = processFile("data/artists.txt");

if (!trackValid || !artistValid) {
  process.exit(1); // fail workflow if invalid links found
}

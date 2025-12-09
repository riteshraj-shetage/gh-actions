const fs = require("fs");

function validate(file) {
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  let valid = true;
  lines.forEach((line, i) => {
    if (line.trim() && !line.startsWith("https://open.spotify.com/")) {
      console.error(`Invalid link at ${file}:${i + 1} → ${line}`);
      valid = false;
    }
  });
  return valid;
}

const trackValid = validate("experiments/spotify-collab-playlist/data/tracks.txt");
const artistValid = validate("experiments/spotify-collab-playlist/data/artists.txt");

if (!trackValid || !artistValid) {
  process.exit(1); // fail workflow
}

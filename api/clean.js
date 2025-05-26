// functions/clean.js
const fs = require('fs');
const path = require('path');

const libPath = path.join(__dirname, 'lib');

if (fs.existsSync(libPath)) {
  try {
    fs.rmSync(libPath, { recursive: true, force: true });
    console.log(`Successfully removed ${libPath}`);
  } catch (err) {
    console.error(`Error removing ${libPath}:`, err);
  }
} else {
  console.log(`${libPath} does not exist. Nothing to clean.`);
}
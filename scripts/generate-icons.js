import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDirectory = path.join(process.cwd(), 'public', 'icons');

// Create the icons directory if it doesn't exist
if (!fs.existsSync(iconDirectory)) {
  fs.mkdirSync(iconDirectory, { recursive: true });
}

// Base icon (you'll need to create this)
const baseIcon = path.join(process.cwd(), 'public', 'icon.png');

async function generateIcons() {
  try {
    // Check if base icon exists
    if (!fs.existsSync(baseIcon)) {
      console.error('Base icon not found. Please create public/icon.png first.');
      process.exit(1);
    }

    // Generate icons for each size
    for (const size of sizes) {
      await sharp(baseIcon)
        .resize(size, size)
        .toFile(path.join(iconDirectory, `icon-${size}x${size}.png`));

      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

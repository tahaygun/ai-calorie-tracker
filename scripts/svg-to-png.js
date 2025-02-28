import path from 'path';
import sharp from 'sharp';

const inputSvg = path.join(process.cwd(), 'public', 'icon.svg');
const outputPng = path.join(process.cwd(), 'public', 'icon.png');

async function convertSvgToPng() {
  try {
    await sharp(inputSvg).resize(512, 512).png().toFile(outputPng);

    console.log('SVG converted to PNG successfully!');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convertSvgToPng();

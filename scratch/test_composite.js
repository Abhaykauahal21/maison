const sharp = require('sharp');

async function test() {
  // Let's test the photo placed on the card:
  // Card bounds:
  // Width: approx 380px, Height: approx 535px
  // Rotation: approx 5 degrees
  // Position: top-left ~ (430, 142)
  
  // Resize photo to fit inside card with slight bleed/border
  const photo = await sharp('public/images/close-chapter-photo.webp')
    .resize(360, 500, { fit: 'cover' })
    .toBuffer();

  // Create an SVG / composite
  // Or transform photo with sharp
  const rotatedPhoto = await sharp(photo)
    .rotate(5, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const photoMeta = await sharp(rotatedPhoto).metadata();

  // Composite onto the frame
  await sharp('public/images/photoFrameclosechapter.webp')
    .composite([
      {
        input: rotatedPhoto,
        top: 145,
        left: 410,
        blend: 'over'
      }
    ])
    .toFile('scratch/test_composite.png');

  console.log('Saved scratch/test_composite.png');
}
test();

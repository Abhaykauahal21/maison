const sharp = require('sharp');

async function test() {
  const photo = await sharp('public/images/close-chapter-photo.webp')
    .resize(365, 800, { fit: 'cover' })
    .rotate(5.2, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp('public/images/photoFrameclosechapter.webp')
    .composite([{ input: photo, top: 142, left: 418 }])
    .toFile('scratch/test_optC.png');

  console.log('Saved optC');
}
test();

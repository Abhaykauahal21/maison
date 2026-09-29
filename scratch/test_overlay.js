const sharp = require('sharp');

async function test() {
  // Inner photo area where the photo sits inside the scalloped card:
  // Top-left: x=430, y=140
  // Top-right: x=810, y=175
  // Bottom-right: x=750, y=675
  // Bottom-left: x=375, y=640
  const svg = Buffer.from(`
    <svg width="1096" height="1436" xmlns="http://www.w3.org/2000/svg">
      <polygon points="432,142 805,175 758,675 385,642" fill="rgba(0,100,255,0.4)" stroke="cyan" stroke-width="3"/>
    </svg>
  `);
  
  await sharp('public/images/photoFrameclosechapter.webp')
    .composite([{ input: svg }])
    .toFile('scratch/test_overlay2.png');
  console.log('Saved scratch/test_overlay2.png');
}
test();

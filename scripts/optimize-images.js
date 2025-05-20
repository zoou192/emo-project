const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../src/assets/images');
const targetDir = path.join(__dirname, '../src/assets/images/optimized');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 优化 PNG 图片
async function optimizePNG(filename) {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);
  
  await sharp(sourcePath)
    .resize(800) // 限制最大宽度为 800px
    .png({ quality: 80 }) // 降低质量到 80%
    .toFile(targetPath);
  
  console.log(`Optimized ${filename}`);
}

// 优化 SVG 图片
async function optimizeSVG(filename) {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);
  
  await sharp(sourcePath)
    .resize(200) // SVG 通常用于图标，限制最大宽度为 200px
    .toFile(targetPath);
  
  console.log(`Optimized ${filename}`);
}

// 优化 WebP 图片
async function optimizeWebP(filename) {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);
  
  await sharp(sourcePath)
    .resize(800) // 限制最大宽度为 800px
    .webp({ quality: 80 }) // 降低质量到 80%
    .toFile(targetPath);
  
  console.log(`Optimized ${filename}`);
}

// 主函数
async function optimizeImages() {
  try {
    // 优化 PNG 图片
    await optimizePNG('yqmfs.png');
    await optimizePNG('bottle.png');
    
    // 优化 SVG 图片
    await optimizeSVG('工作.svg');
    await optimizeSVG('生活.svg');
    await optimizeSVG('社交.svg');
    await optimizeSVG('send_normal.svg');
    await optimizeSVG('send_select.svg');
    
    // 优化 WebP 图片
    await optimizeWebP('cd.webp');
    await optimizeWebP('logo.webp');
    
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 
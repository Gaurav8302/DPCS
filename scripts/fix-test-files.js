// Utility script to update all test files with correct session keys and API URLs
// Run this script to fix all test files at once

const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, '../frontend/src/pages/tests');

const testFiles = [
  'cube-copy.tsx',
  'clock-drawing.tsx',
  'naming.tsx',
  'attention-forward.tsx',
  'attention-backward.tsx',
  'attention-vigilance.tsx',
  'sentence-repetition.tsx',
  'verbal-fluency.tsx',
  'abstraction.tsx',
  'delayed-recall.tsx',
  'orientation.tsx'
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix session storage keys
  content = content.replace(/sessionStorage\.getItem\('session_id'\)/g, "sessionStorage.getItem('session_id')");
  content = content.replace(/sessionStorage\.getItem\('user_id'\)/g, "sessionStorage.getItem('user_id')");
  content = content.replace(/sessionStorage\.getItem\('sessionId'\)/g, "sessionStorage.getItem('session_id')");
  content = content.replace(/sessionStorage\.getItem\('userId'\)/g, "sessionStorage.getItem('user_id')");
  
  // Fix API URL
  content = content.replace(
    /process\.env\.NEXT_PUBLIC_API_URL/g,
    "(process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com')"
  );
  
  // Fix BACKEND_URL if present
  content = content.replace(
    /process\.env\.NEXT_PUBLIC_BACKEND_URL/g,
    "(process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com')"
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${path.basename(filePath)}`);
}

console.log('Updating test files...\n');

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  if (fs.existsSync(filePath)) {
    updateFile(filePath);
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

console.log('\nDone! All test files have been updated.');

#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Build Next.js standalone application
 * This script builds the application and copies necessary files
 */

function copyDirectory(source, destination) {
  try {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      const stat = fs.statSync(sourcePath);

      if (stat.isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  } catch (error) {
    console.error(
      `Error copying directory ${source} to ${destination}:`,
      error.message
    );
    process.exit(1);
  }
}

function main() {
  console.log('Building Next.js standalone application...');

  try {
    // Run next build first
    console.log('Running next build...');
    execSync('next build', { stdio: 'inherit' });
    console.log('Next.js build completed successfully.');

    // Copy public directory to standalone
    console.log('Copying public directory to .next/standalone/...');
    copyDirectory('./public', './.next/standalone/public');

    // Copy static files to standalone
    console.log('Copying static files to .next/standalone/.next/...');
    const staticSource = './.next/static';
    const staticDest = './.next/standalone/.next/static';

    if (fs.existsSync(staticSource)) {
      copyDirectory(staticSource, staticDest);
    } else {
      console.error(
        'Error: .next/static directory not found after build. Build may have failed.'
      );
      process.exit(1);
    }

    console.log('Build process completed successfully!');
    console.log('You can now start the server with: npm run app:start');
  } catch (error) {
    console.error('Error during build process:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, copyDirectory };

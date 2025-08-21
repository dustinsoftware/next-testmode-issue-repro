#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Start Next.js standalone application
 * This script loads environment variables and starts the production server
 */

function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Environment file ${filePath} not found, skipping...`);
      return;
    }

    const envContent = fs.readFileSync(filePath, 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      // Parse KEY=VALUE format
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, equalIndex).trim();
      let value = trimmedLine.slice(equalIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Only set if not already defined in process.env
      if (process.env[key] === undefined) {
        process.env[key] = value;
        console.log(`Loaded environment variable: ${key}`);
      }
    }
  } catch (error) {
    console.error(`Error reading environment file ${filePath}:`, error.message);
  }
}

function main() {
  console.log('Starting Next.js standalone server...');

  // Load environment variables from .env.local
  console.log('Loading environment variables from .env.local...');
  loadEnvFile('./.env.local');

  try {
    // Check if standalone server exists
    if (!fs.existsSync('./.next/standalone/server.js')) {
      console.error(
        'Error: .next/standalone/server.js not found. Please run "npm run app:build" first.'
      );
      process.exit(1);
    }

    // Start the production server
    console.log('Starting production server on port 3000...');
    process.env.NODE_ENV = 'production';
    process.env.PORT = '3000';

    execSync('node .next/standalone/server.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, loadEnvFile };

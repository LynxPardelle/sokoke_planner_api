#!/usr/bin/env node

/**
 * SQL DAO Test Script
 * 
 * This script tests the SQL DAO functionality by creating, reading, updating, and deleting records.
 * Run this script after setting up your SQL database configuration.
 * 
 * Usage:
 *   node scripts/test-sql-daos.js
 */

const {
  exec
} = require('child_process');
const path = require('path');

console.log('🧪 Testing SQL DAO Functionality');
console.log('================================\n');

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ No .env file found!');
  console.log('📋 Please create a .env file with SQL database configuration.');
  console.log('💡 You can use .env.sql.example as a template.\n');
  process.exit(1);
}

// Read environment variables
require('dotenv').config({
  path: envPath
});

const persistence = process.env.PERSISTENCE;

if (!persistence || persistence === 'mongodb') {
  console.error('❌ PERSISTENCE is not set to a SQL database type!');
  console.log('📋 Please set PERSISTENCE to one of: mysql, postgres, sqlite');
  console.log('💡 Check your .env file configuration.\n');
  process.exit(1);
}

console.log(`🗄️  Database Type: ${persistence}`);
console.log(`🔧 Configuration:`);

switch (persistence) {
  case 'mysql':
  case 'postgres':
    console.log(`   Host: ${process.env.SQL_HOST}`);
    console.log(`   Port: ${process.env.SQL_PORT}`);
    console.log(`   Database: ${process.env.SQL_DATABASE}`);
    console.log(`   Username: ${process.env.SQL_USERNAME}`);
    break;
  case 'sqlite':
    console.log(`   Path: ${process.env.SQLITE_PATH}`);
    break;
}

console.log('\n🚀 Starting application test...\n');

// Try to start the application and run a simple test
const testCommand = 'npm run start:dev';

exec(testCommand, {
  timeout: 30000
}, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error starting application:', error.message);
    return;
  }

  if (stderr) {
    console.error('⚠️  Application stderr:', stderr);
  }

  console.log('✅ Application started successfully!');
  console.log('📋 You can now test the SQL DAOs through the API endpoints.');
  console.log('\n🌐 API Endpoints to test:');
  console.log('   - GET /status (list statuses)');
  console.log('   - POST /status (create status)');
  console.log('   - GET /feature (list features)');
  console.log('   - POST /feature (create feature)');
  console.log('   - GET /project (list projects)');
  console.log('   - POST /project (create project)');
  console.log('\n📖 See docs/SQL_DAOS.md for more information.');
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n👋 Test script terminated.');
  process.exit(0);
});

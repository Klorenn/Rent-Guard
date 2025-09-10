#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting RentGuard...\n');

// Start backend server
const backend = spawn('node', ['src/server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start frontend development server
const frontend = spawn('npm', ['start'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, 'frontend'),
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down RentGuard...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down RentGuard...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Handle errors
backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('✅ RentGuard is running!');
console.log('🌐 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:3001');
console.log('📚 API Docs: http://localhost:3001/health');
console.log('\nPress Ctrl+C to stop');

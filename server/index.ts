// Frontend-only server using Vite directly
import { spawn } from 'child_process';

async function startFrontendOnly() {
  console.log('🚀 Starting Frontend-Only Application...');
  console.log('📦 Using Vite development server');
  console.log('🔗 Webhook-based architecture (No Express backend)');
  
  // Start vite directly from root (to maintain aliases)
  const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (error) => {
    console.error('❌ Failed to start Vite:', error);
    process.exit(1);
  });

  viteProcess.on('close', (code) => {
    console.log(`👋 Vite process exited with code ${code}`);
    process.exit(code);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Gracefully shutting down frontend server...');
    viteProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    viteProcess.kill('SIGTERM');
  });
}

startFrontendOnly().catch((error) => {
  console.error('💥 Startup error:', error);
  process.exit(1);
});
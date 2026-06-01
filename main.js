#!/usr/bin/env node

/**
 * Dark Angel - Hosting Server Management Panel Bot
 * Main Entry Point
 * Author: deadnote
 * 
 * This is the core initialization file that starts the bot and web server
 */

const chalk = require('chalk');
const figlet = require('figlet');
require('dotenv').config();

// Import main app
const { DarkAngelApp } = require('./app.js');

// Create app instance
const app = new DarkAngelApp();

// Display startup banner
console.clear();
console.log(
  chalk.cyanBright(
    figlet.textSync('Dark Angel', {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      font: 'Standard',
    })
  )
);

console.log(chalk.greenBright('╔════════════════════════════════════════════════════╗'));
console.log(chalk.greenBright('║   Dark Angel - Hosting Server Management Panel     ║'));
console.log(chalk.greenBright('║              Author: deadnote                      ║'));
console.log(chalk.greenBright('║          Powerful Server Control Bot               ║'));
console.log(chalk.greenBright('╚════════════════════════════════════════════════════╝'));
console.log('');

// Log startup information
console.log(chalk.blueBright('📋 Configuration:'));
console.log(chalk.white(`   • Environment: ${process.env.NODE_ENV || 'development'}`));
console.log(chalk.white(`   • Discord Prefix: ${process.env.PREFIX || '!'}`));
console.log(chalk.white(`   • Web Port: ${process.env.PORT || 3000}`));
console.log('');

// Initialize application
app.initialize()
  .then(() => {
    console.log(chalk.greenBright('✓ Dark Angel initialized successfully'));
    console.log(chalk.cyanBright(`✓ Bot started at ${new Date().toLocaleString()}`));
    console.log('');
    console.log(chalk.yellowBright('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.greenBright('✓ Dark Angel is online and ready to manage servers!'));
    console.log(chalk.yellowBright('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
  })
  .catch((error) => {
    console.error(chalk.redBright('✗ Failed to initialize Dark Angel:'), error.message);
    console.error(chalk.redBright('Stack Trace:'), error.stack);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.redBright('❌ Unhandled Rejection at:'), promise);
  console.error(chalk.redBright('Reason:'), reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(chalk.redBright('❌ Uncaught Exception:'), error.message);
  console.error(chalk.redBright('Stack:'), error.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellowBright('\n⚠️  Shutting down Dark Angel gracefully...'));
  app.shutdown()
    .then(() => {
      console.log(chalk.greenBright('✓ Dark Angel shutdown complete'));
      process.exit(0);
    })
    .catch((error) => {
      console.error(chalk.redBright('✗ Error during shutdown:'), error.message);
      process.exit(1);
    });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log(chalk.yellowBright('\n⚠️  SIGTERM received - shutting down...'));
  app.shutdown()
    .then(() => {
      console.log(chalk.greenBright('✓ Dark Angel shutdown complete'));
      process.exit(0);
    })
    .catch((error) => {
      console.error(chalk.redBright('✗ Error during shutdown:'), error.message);
      process.exit(1);
    });
});

// Export for testing
module.exports = app;

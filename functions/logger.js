/**
 * Dark Angel Bot - Logger Utility
 * Handles logging to console and files
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    fs.ensureDirSync(this.logsDir);
  }

  /**
   * Info level log
   */
  info(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const formatted = chalk.blue(`[${timestamp}] ℹ ${message}`);
    console.log(formatted);
    this.writeToFile('info', message);
  }

  /**
   * Success level log
   */
  success(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const formatted = chalk.green(`[${timestamp}] ✓ ${message}`);
    console.log(formatted);
    this.writeToFile('success', message);
  }

  /**
   * Warning level log
   */
  warn(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const formatted = chalk.yellow(`[${timestamp}] ⚠ ${message}`);
    console.log(formatted);
    this.writeToFile('warn', message);
  }

  /**
   * Error level log
   */
  error(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const formatted = chalk.red(`[${timestamp}] ✗ ${message}`);
    console.log(formatted);
    this.writeToFile('error', message);
  }

  /**
   * Debug level log
   */
  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      const formatted = chalk.magenta(`[${timestamp}] 🐛 ${message}`);
      console.log(formatted);
      this.writeToFile('debug', message);
    }
  }

  /**
   * Write log to file
   */
  writeToFile(level, message) {
    try {
      const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      const logFile = path.join(this.logsDir, `${moment().format('YYYY-MM-DD')}.log`);
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
      fs.appendFileSync(logFile, logMessage);
    } catch (error) {
      console.error('Error writing to log file:', error.message);
    }
  }

  /**
   * Clear old logs
   */
  clearOldLogs(daysToKeep = 7) {
    try {
      const files = fs.readdirSync(this.logsDir);
      files.forEach((file) => {
        const filePath = path.join(this.logsDir, file);
        const stat = fs.statSync(filePath);
        const age = Date.now() - stat.mtime.getTime();
        const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
        if (age > maxAge) {
          fs.removeSync(filePath);
        }
      });
    } catch (error) {\n      this.error(`Error clearing old logs: ${error.message}`);\n    }\n  }\n}\n\nmodule.exports = new Logger();\n
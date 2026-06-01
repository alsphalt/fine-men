/**
 * Dark Angel Bot - Helper Functions
 * General utility functions
 */

const moment = require('moment');

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format uptime
 */
function formatUptime(milliseconds) {
  const duration = moment.duration(milliseconds);
  return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;
}

/**
 * Get time ago
 */
function getTimeAgo(date) {
  return moment(date).fromNow();
}

/**
 * Sleep/delay
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create embed
 */
function createEmbed(options = {}) {
  return {
    color: options.color || 0x000000,
    title: options.title || null,
    description: options.description || null,
    fields: options.fields || [],
    image: options.image || null,
    thumbnail: options.thumbnail || null,
    footer: options.footer || null,
    timestamp: options.timestamp || new Date(),
  };
}

/**
 * Add field to embed
 */
function addField(embed, name, value, inline = false) {
  embed.fields.push({ name, value, inline });
  return embed;
}

/**
 * Parse command arguments
 */
function parseArgs(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter((arg) => arg.length > 0);
}

module.exports = {
  formatBytes,
  formatUptime,
  getTimeAgo,
  sleep,
  createEmbed,
  addField,
  parseArgs,
};

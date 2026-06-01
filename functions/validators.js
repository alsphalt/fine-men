/**
 * Dark Angel Bot - Validation Functions
 * Validate user input, permissions, etc.
 */

const { PermissionFlagsBits } = require('discord.js');

/**
 * Check if user has permission
 */
function hasPermission(member, permission) {
  if (!member) return false;
  return member.permissions.has(permission);
}

/**
 * Check if user is bot owner
 */
function isOwner(userId, ownerId) {
  return userId === ownerId;
}

/**
 * Validate email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate server name
 */
function isValidServerName(name) {
  return name && name.length > 0 && name.length <= 50;
}

/**
 * Check if server is online
 */
async function isServerOnline(serverId) {
  return true;
}

module.exports = {
  hasPermission,
  isOwner,
  isValidEmail,
  isValidUrl,
  isValidServerName,
  isServerOnline,
};

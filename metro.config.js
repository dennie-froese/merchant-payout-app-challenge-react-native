const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Prevent Metro from bundling test files.
// Test files in app/ would be picked up by expo-router as routes, and their
// imports (msw/node → async_hooks) are Node.js-only and unavailable at runtime.
config.resolver.blockList = [
  /\.test\.(ts|tsx|js|jsx)$/,
  /jest\.setup\.js$/,
];

module.exports = config;

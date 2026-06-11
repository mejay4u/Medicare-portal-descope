const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all source files across the monorepo
config.watchFolders = [workspaceRoot];

// Tell Metro where to look for node_modules — project-local first, then root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Expose workspace packages so Metro resolves them without symlink issues
config.resolver.extraNodeModules = {
  '@medicare/shared': path.resolve(workspaceRoot, 'packages/shared'),
  '@medicare/ui':     path.resolve(workspaceRoot, 'packages/ui'),
};

// NOTE: disableHierarchicalLookup intentionally removed.
// That flag prevented Metro from walking up to root node_modules to hash
// @expo/cli internals, which caused the SHA-1 "file not watched" error.

module.exports = config;

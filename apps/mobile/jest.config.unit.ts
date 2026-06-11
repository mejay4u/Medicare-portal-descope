import type { Config } from 'jest';

const config: Config = {
  displayName: 'unit',
  rootDir: '.',
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // MSW requires TextEncoder in the jest-node env
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@sentry/.*|posthog-react-native)',
  ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/components/**/*.tsx',
    '!src/**/__tests__/**',
    '!src/**/*.test.*',
  ],
  coverageThreshold: {
    global: { lines: 60 },
  },
};

export default config;

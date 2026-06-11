import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  testMatch: ['<rootDir>/e2e/steps/**/*.steps.ts'],
  testTimeout: 120_000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: [
    'detox/runners/jest/reporter',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'mobile-results.xml',
    }],
  ],
  verbose: true,
  testEnvironment: 'detox/runners/jest/testEnvironment',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'e2e/tsconfig.json' }],
  },
};

export default config;

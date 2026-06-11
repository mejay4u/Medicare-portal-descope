import type { Config } from 'jest';

const config: Config = {
  displayName: 'shared',
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: true, esModuleInterop: true } }],
  },
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
};

export default config;

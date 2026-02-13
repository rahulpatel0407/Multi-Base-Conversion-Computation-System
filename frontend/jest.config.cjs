module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@binary/conversion$': '<rootDir>/../shared/src/conversion.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  setupFiles: ['<rootDir>/setupEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  maxWorkers: 1,
};

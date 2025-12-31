module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/backend"],
  setupFiles: ["<rootDir>/setupEnv.js"],
  moduleNameMapper: {
    "^@backend/(.*)$": "<rootDir>/src/backend/$1",
    "^@frontend/(.*)$": "<rootDir>/src/frontend/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  maxWorkers: 1,
  testPathIgnorePatterns: ["<rootDir>/src/frontend/"],
};

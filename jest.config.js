module.exports = {
  // preset: 'ts-jest',
  testEnvironment: 'node',
  silent: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    // "**/?(*.)+(spec|test).[tj]s?(x)"
    '**/**/tests/*.[t]s?(x)',
  ],
  testTimeout: 15000,
  verbose: true,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc-node/jest',
  },
};

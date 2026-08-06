module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'clover'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@apps/web(.*)$': '<rootDir>/apps/web$1',
    '^@packages/core(.*)$': '<rootDir>/packages/core$1',
  },
  testMatch: ['**/__tests__/**/*.(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['node_modules', 'coverage'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  verbose: true,
};
globalThis.console = {
  ...globalThis.console,
  warn: jest.fn(),
  error: jest.fn(),
};
globalThis.fetch = jest.fn();
globalThis.window = {
  location: {
    href: '',
  },
};
globalThis.document = {
  createElement: jest.fn(),
  querySelector: jest.fn(),
};
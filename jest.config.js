/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@server/(.*)$': '<rootDir>/lib/apollo/server/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/e2e/'],
};

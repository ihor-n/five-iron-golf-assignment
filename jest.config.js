/** @type {import('jest').Config} */
const config = {
  roots: ['<rootDir>'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
  preset: 'ts-jest'
}

export default config

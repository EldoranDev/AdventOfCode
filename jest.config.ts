import type { Config } from '@jest/types';
const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper,
  collectCoverageFrom: [
    'src/lib/**'
  ],
  coveragePathIgnorePatterns: [
    'index.ts'
  ]
};

export default config;
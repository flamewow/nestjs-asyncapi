import { JestConfigWithTsJest } from 'ts-jest';

export const baseConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '#lib(|/.*)$': '<rootDir>/lib/$1',
    '#sample(|/.*)$': '<rootDir>/sample/$1',
    '#test(|/.*)$': '<rootDir>/test/$1',
  },
};

export default baseConfig;

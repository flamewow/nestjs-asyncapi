import { JestConfigWithTsJest } from 'ts-jest';
import { baseConfig } from './jest-base.config';

export const e2eConfig: JestConfigWithTsJest = {
  ...baseConfig,
  testRegex: '.\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        astTransformers: {
          before: ['test/configs/jest-swagger-plugin.js'],
        },
      },
    ],
  },
};

export default e2eConfig;

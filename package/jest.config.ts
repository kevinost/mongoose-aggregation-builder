import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './test/jest-setup.ts',
    globalTeardown: './test/jest-teardown.ts',
};

export default config;

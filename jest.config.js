/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 15 * 1000,
    setupFiles: ['<rootDir>/tests/setup.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setupAfterEnv.ts'],
};

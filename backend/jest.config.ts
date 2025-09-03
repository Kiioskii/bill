import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$', // Szuka plików testów *.spec.ts
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // Obsługa TypeScript w Jest
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node', // Dla NestJS najlepiej node
  setupFiles: ['<rootDir>/jest.setup.ts'], // <--- dodamy obsługę .env
};

export default config;

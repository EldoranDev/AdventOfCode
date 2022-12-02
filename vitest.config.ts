// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'c8',
            all: true,
            src: ['./src/lib/**'],
        },
    },
});

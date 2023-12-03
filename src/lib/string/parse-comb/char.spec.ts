import { describe, it, expect } from 'vitest';

import { char } from './char';
import { SuccessResult } from './combinator';

describe('Char combinator', () => {
    it('detects equal character', () => {
        const result = char('A')('ABC') as SuccessResult;

        expect(result.success).toBe(true);
        expect(result.value).toBe('A');
        expect(result.rest).toBe('BC');
    });

    it('Fails on non matching character', () => {
        const result = char('A')('BC');

        expect(result.success).toBe(false);
    });
});

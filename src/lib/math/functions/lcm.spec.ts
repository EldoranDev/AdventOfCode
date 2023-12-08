import { describe, it, expect } from 'vitest';

import { LCM } from './lcm';

describe('Math function: LCM', () => {
    it('Detect least common mulitple', () => {
        expect(LCM(21, 6)).toBe(42);
    });
});

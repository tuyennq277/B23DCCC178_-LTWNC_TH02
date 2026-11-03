import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';
describe('Định dạng thời lượng', () => {
  it.each([
    [0, '0:00'],
    [67, '1:07'],
    [120, '2:00'],
    [30, '0:30'],
  ])('đổi %i giây thành %s', (seconds, expected) =>
    expect(formatDuration(seconds)).toBe(expected),
  );
});

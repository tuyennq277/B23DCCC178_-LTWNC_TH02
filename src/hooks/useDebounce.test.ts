import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';
describe('Tìm kiếm có debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('giữ giá trị cũ trước 300ms và cập nhật sau 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: '' } },
    );
    rerender({ value: 'đẩy' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('đẩy');
  });
  it('hủy bộ đếm cũ khi tiếp tục gõ và dọn dẹp khi unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } },
    );
    rerender({ value: 1 });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

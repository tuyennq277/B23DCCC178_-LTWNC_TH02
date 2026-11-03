import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { useSessionStore } from './useSessionStore';
import SessionBar from './SessionBar';
describe('Thanh đồng hồ', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });
  afterEach(() => vi.useRealTimers());
  it('hiện trạng thái chưa bắt đầu và khóa nút điều khiển', () => {
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });
  it('đếm đúng giây, tạm dừng, tiếp tục, chuyển bài và dọn interval', () => {
    useSessionStore.getState().startSession(EXERCISES.slice(0, 3), 1);
    const { unmount } = render(<SessionBar />);
    expect(screen.getByText(/Đang tập: Kéo tạ đơn 1/)).toBeInTheDocument();
    expect(screen.getByText('1:07')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }));
    expect(screen.getByText('1:44')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(screen.getByText('1:07')).toBeInTheDocument();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

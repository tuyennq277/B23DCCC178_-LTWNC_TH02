import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import LibraryPage from './LibraryPage';
describe('Kho 10000 bài tập', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('ảo hóa chỉ khoảng 10–15 dòng trong DOM', () => {
    const { container } = renderWithProviders(<LibraryPage />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Tìm thấy 10000 bài tập',
    );
    expect(
      container.querySelectorAll('[data-exercise-id]').length,
    ).toBeGreaterThanOrEqual(10);
    expect(
      container.querySelectorAll('[data-exercise-id]').length,
    ).toBeLessThanOrEqual(15);
    expect(
      screen.getAllByRole('button', { name: '+ Giáo án' })[0],
    ).toBeDisabled();
  });
  it('debounce 300ms, kết hợp nhóm cơ, tìm HLV và trạng thái không có kết quả', () => {
    renderWithProviders(<LibraryPage />);
    const input = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(input, { target: { value: 'đẩy' } });
    act(() => vi.advanceTimersByTime(299));
    expect(screen.getByRole('status')).toHaveTextContent('10000');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('status')).toHaveTextContent('1250');
    fireEvent.change(screen.getByLabelText('Nhóm cơ'), {
      target: { value: 'Vai' },
    });
    expect(screen.getByRole('status')).toHaveTextContent('250');
    fireEvent.change(screen.getByLabelText('Nhóm cơ'), {
      target: { value: '' },
    });
    fireEvent.change(input, { target: { value: 'đức anh' } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole('status')).toHaveTextContent('1000');
    fireEvent.change(input, { target: { value: 'xyz' } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText('Không tìm thấy bài tập nào.')).toBeInTheDocument();
  });
  it('sắp xếp tên tiếng Việt và thời lượng trên bản sao', () => {
    const { container } = renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Sắp xếp'), {
      target: { value: 'name' },
    });
    expect(container.querySelector('.exercise-name')).toHaveTextContent(
      'Bật chậm 1',
    );
    fireEvent.change(screen.getByLabelText('Sắp xếp'), {
      target: { value: 'duration' },
    });
    expect(container.querySelector('.duration')).toHaveTextContent('0:30');
    fireEvent.change(screen.getByLabelText('Sắp xếp'), {
      target: { value: 'default' },
    });
    expect(container.querySelector('.exercise-name')).toHaveTextContent(
      'Đẩy tạ đơn 1',
    );
  });
  it('bắt đầu từ danh sách đã lọc, lưu bài và thêm vào buổi tập', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'đẩy' },
    });
    act(() => vi.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByRole('button', { name: 'Bắt đầu' })[1]);
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().queue).toHaveLength(1250);
    useSessionStore.getState().next();
    expect(useSessionStore.getState().queue[2].name).toContain('Đẩy');
    fireEvent.click(screen.getAllByRole('button', { name: 'Lưu bài tập' })[0]);
    expect(useSavedStore.getState().ids).toEqual(['e1']);
    act(() => useSessionStore.setState({ queue: [] }));
    fireEvent.click(screen.getAllByRole('button', { name: '+ Buổi tập' })[0]);
    expect(useSessionStore.getState().queue[0].id).toBe('e1');
  });
  it('thêm vào đúng giáo án được chọn và bỏ qua bài trùng', () => {
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([
        { id: 'r1', name: 'Ngày ngực', exerciseIds: [] },
        { id: 'r2', name: 'Ngày chân', exerciseIds: [] },
      ]),
    );
    const { container } = renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Giáo án đang chọn'), {
      target: { value: 'r2' },
    });
    const firstRow = container.querySelector(
      '[data-exercise-id="e1"]',
    ) as HTMLElement;
    fireEvent.click(
      within(firstRow).getByRole('button', { name: '+ Giáo án' }),
    );
    fireEvent.click(
      within(firstRow).getByRole('button', { name: '+ Giáo án' }),
    );
    expect(
      JSON.parse(localStorage.getItem('workout-routines') ?? '[]')[1]
        .exerciseIds,
    ).toEqual(['e1']);
    expect(console.log).toHaveBeenCalledWith(
      '[routine] addExercise',
      expect.objectContaining({
        before: expect.any(Array),
        after: expect.any(Array),
      }),
    );
  });
});

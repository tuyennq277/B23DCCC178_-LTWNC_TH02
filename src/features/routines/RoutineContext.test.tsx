import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  RoutineProvider,
  useRoutineDispatch,
  useRoutines,
} from './RoutineContext';
import { withLogger } from './withLogger';
function Consumer() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  return (
    <>
      <span>Số giáo án: {routines.length}</span>
      <button
        onClick={() => dispatch({ type: 'create', id: 'r1', name: 'Sáng' })}
      >
        Tạo mới
      </button>
    </>
  );
}
describe('Context giáo án và logger', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());
  it('báo lỗi rõ ràng khi dùng hai hook ngoài Provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const suppressExpectedError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', suppressExpectedError);
    try {
      expect(() => renderHook(() => useRoutines())).toThrow(
        'useRoutines phải được dùng bên trong RoutineProvider',
      );
      expect(() => renderHook(() => useRoutineDispatch())).toThrow(
        'useRoutineDispatch phải được dùng bên trong RoutineProvider',
      );
    } finally {
      window.removeEventListener('error', suppressExpectedError);
    }
  });
  it.each(['{sai-json', '{}', '[{"id":1}]'])(
    'khôi phục an toàn khi dữ liệu lưu không hợp lệ: %s',
    (stored) => {
      localStorage.setItem('workout-routines', stored);
      render(
        <RoutineProvider>
          <Consumer />
        </RoutineProvider>,
      );
      expect(screen.getByText('Số giáo án: 0')).toBeInTheDocument();
    },
  );
  it('component chỉ dispatch không render lại khi danh sách đổi', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const renders = vi.fn();
    function DispatchOnly() {
      const dispatch = useRoutineDispatch();
      renders();
      return (
        <button
          onClick={() => dispatch({ type: 'create', id: 'r1', name: 'Sáng' })}
        >
          Chỉ tạo
        </button>
      );
    }
    render(
      <RoutineProvider>
        <DispatchOnly />
        <Consumer />
      </RoutineProvider>,
    );
    expect(renders).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Chỉ tạo' }));
    expect(screen.getByText('Số giáo án: 1')).toBeInTheDocument();
    expect(renders).toHaveBeenCalledTimes(1);
  });
  it('logger trả đúng kết quả reducer và chỉ ghi log trong DEV', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const reducer = withLogger(
      (state: number, action: { type: string; amount: number }) =>
        state + action.amount,
    );
    expect(reducer(2, { type: 'add', amount: 3 })).toBe(5);
    expect(log).toHaveBeenCalledWith('[routine] add', { before: 2, after: 5 });
    vi.stubEnv('DEV', false);
    log.mockClear();
    expect(reducer(2, { type: 'add', amount: 1 })).toBe(3);
    expect(log).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});

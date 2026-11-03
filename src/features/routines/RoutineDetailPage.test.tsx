import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { useSessionStore } from '../session/useSessionStore';
import RoutineDetailPage from './RoutineDetailPage';
function renderDetail(id = 'r1') {
  return renderWithProviders(
    <Routes>
      <Route path="/routines/:id" element={<RoutineDetailPage />} />
    </Routes>,
    [`/routines/${id}`],
  );
}
describe('Chi tiết giáo án', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());
  it('báo không tìm thấy với id không tồn tại', () => {
    renderDetail('missing');
    expect(screen.getByText('Không tìm thấy giáo án.')).toBeInTheDocument();
  });
  it('hiện tổng 1 phút 37 giây, tập tất cả và bỏ bài', async () => {
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([
        { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
      ]),
    );
    const user = userEvent.setup();
    renderDetail();
    expect(
      screen.getByText(/Tổng thời gian: 1 phút 37 giây/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(
      useSessionStore.getState().queue.map((exercise) => exercise.id),
    ).toEqual(['e1', 'e2']);
    expect(useSessionStore.getState().currentIndex).toBe(0);
    await user.click(screen.getByRole('button', { name: 'Bỏ Đẩy tạ đơn 1' }));
    expect(
      screen.getByText(/Tổng thời gian: 1 phút 7 giây/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Bỏ Kéo tạ đơn 1' }));
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
    expect(screen.getByText('Thêm những bước đầu tiên.')).toBeInTheDocument();
  });
  it('đổi tên có kiểm tra trống, trùng tên và lưu tên hợp lệ', async () => {
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([
        { id: 'r1', name: 'Ngày ngực', exerciseIds: [] },
        { id: 'r2', name: 'Ngày chân', exerciseIds: [] },
      ]),
    );
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByRole('button', { name: 'Đổi tên' }));
    const input = screen.getByLabelText('Tên mới');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tên giáo án không được để trống',
    );
    await user.type(input, 'ngày CHÂN');
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tên giáo án đã tồn tại',
    );
    await user.clear(input);
    await user.type(input, 'Buổi sáng');
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));
    expect(
      screen.getByRole('heading', { name: 'Buổi sáng' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByLabelText('Tên mới')).not.toBeInTheDocument(),
    );
  });
});

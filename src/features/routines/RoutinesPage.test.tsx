import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import RoutinesPage from './RoutinesPage';
describe('Trang giáo án', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());
  it('bấm Tạo khi trống hiện lỗi, nhập tên rồi tạo thì xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tên giáo án không được để trống',
    );
    await user.type(screen.getByLabelText('Tên giáo án'), 'Ngày ngực');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('link', { name: 'Ngày ngực' })).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem('workout-routines') ?? '[]'),
    ).toMatchObject([{ name: 'Ngày ngực' }]);
  });
  it('chặn tên trùng không phân biệt hoa thường và xóa giáo án', async () => {
    localStorage.setItem(
      'workout-routines',
      JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]),
    );
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.type(screen.getByLabelText('Tên giáo án'), 'ngày NGỰC');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tên giáo án đã tồn tại',
    );
    expect(
      within(screen.getByRole('article')).getByText('0 bài'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Xóa Ngày ngực' }));
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});

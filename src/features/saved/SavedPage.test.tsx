import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { EXERCISES } from '../../data/exercises';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from './useSavedStore';
import SavedPage from './SavedPage';
describe('Bài tập đã lưu', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    });
  });
  it('hiện trạng thái trống và liên kết kho bài tập', () => {
    renderWithProviders(<SavedPage />);
    expect(screen.getByText('Bạn chưa lưu bài tập nào.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
  });
  it('lưu bền vững, tập tất cả, bắt đầu đúng bài, thêm buổi tập và bỏ lưu', async () => {
    useSavedStore.getState().toggle('e1');
    useSavedStore.getState().toggle('e3');
    expect(
      JSON.parse(localStorage.getItem('workout-saved') ?? '{}').state.ids,
    ).toEqual(['e1', 'e3']);
    useSavedStore.setState({ ids: [] });
    // Restore the saved payload before simulating a fresh storage hydration.
    localStorage.setItem(
      'workout-saved',
      JSON.stringify({ state: { ids: ['e1', 'e3'] }, version: 0 }),
    );
    await useSavedStore.persist.rehydrate();
    renderWithProviders(<SavedPage />);
    expect(screen.getByText(EXERCISES[2].name)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(
      useSessionStore.getState().queue.map((exercise) => exercise.id),
    ).toEqual(['e1', 'e3']);
    fireEvent.click(screen.getAllByRole('button', { name: 'Bắt đầu' })[1]);
    expect(useSessionStore.getState().currentIndex).toBe(1);
    act(() => useSessionStore.setState({ queue: [] }));
    fireEvent.click(screen.getAllByRole('button', { name: '+ Buổi tập' })[0]);
    expect(useSessionStore.getState().queue).toHaveLength(1);
    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ lưu' })[0]);
    expect(useSavedStore.getState().ids).toEqual(['e3']);
  });
});

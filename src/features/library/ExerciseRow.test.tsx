import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { useSavedStore } from '../saved/useSavedStore';
import { ExerciseRow } from './ExerciseRow';
describe('Dòng bài tập', () => {
  beforeEach(() => useSavedStore.setState({ ids: [] }));
  it('hiện tên và 0:30, bấm Bắt đầu gọi mock với đúng bài', () => {
    const start = vi.fn();
    render(
      <ExerciseRow
        exercise={EXERCISES[0]}
        index={0}
        onStart={start}
        onSave={vi.fn()}
        onAdd={vi.fn()}
      />,
    );
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    expect(start).toHaveBeenCalledWith(EXERCISES[0]);
  });
  it('gọi đúng thao tác lưu, thêm buổi tập và giáo án', () => {
    const save = vi.fn();
    const add = vi.fn();
    const routine = vi.fn();
    render(
      <ExerciseRow
        exercise={EXERCISES[0]}
        index={0}
        onStart={vi.fn()}
        onSave={save}
        onAdd={add}
        onAddRoutine={routine}
        routineSelected
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Lưu bài tập' }));
    expect(save).toHaveBeenCalledWith('e1');
    fireEvent.click(screen.getByRole('button', { name: '+ Buổi tập' }));
    expect(add).toHaveBeenCalledWith(EXERCISES[0]);
    fireEvent.click(screen.getByRole('button', { name: '+ Giáo án' }));
    expect(routine).toHaveBeenCalledWith(EXERCISES[0]);
  });
  it('hiện sao đã lưu và khóa thêm giáo án khi chưa chọn', () => {
    render(
      <ExerciseRow
        exercise={EXERCISES[0]}
        index={0}
        saved
        onStart={vi.fn()}
        onSave={vi.fn()}
        onAdd={vi.fn()}
        onAddRoutine={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Bỏ lưu' })).toHaveTextContent(
      '★',
    );
    expect(screen.getByRole('button', { name: '+ Giáo án' })).toBeDisabled();
  });
});

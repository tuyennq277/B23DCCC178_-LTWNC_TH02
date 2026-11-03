import { describe, expect, it } from 'vitest';
import type { Routine } from '../../types';
import { routineReducer, validateRoutineName } from './routineReducer';
const initial: Routine[] = [
  { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
];
describe('Reducer giáo án', () => {
  it('tạo giáo án với tên đã cắt khoảng trắng', () =>
    expect(
      routineReducer([], { type: 'create', id: 'r1', name: ' Ngày ngực ' }),
    ).toEqual([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]));
  it('không thêm bài trùng và không sửa state cũ', () => {
    expect(
      routineReducer(initial, {
        type: 'addExercise',
        id: 'r1',
        exerciseId: 'e1',
      }),
    ).toEqual(initial);
    const result = routineReducer(initial, {
      type: 'addExercise',
      id: 'r1',
      exerciseId: 'e2',
    });
    expect(result[0].exerciseIds).toEqual(['e1', 'e2']);
    expect(initial[0].exerciseIds).toEqual(['e1']);
  });
  it('bỏ bài tập khỏi đúng giáo án', () =>
    expect(
      routineReducer(initial, {
        type: 'removeExercise',
        id: 'r1',
        exerciseId: 'e1',
      })[0].exerciseIds,
    ).toEqual([]));
  it('xóa giáo án không tồn tại giữ nguyên dữ liệu', () =>
    expect(routineReducer(initial, { type: 'remove', id: 'missing' })).toEqual(
      initial,
    ));
  it('xóa giáo án tồn tại', () =>
    expect(routineReducer(initial, { type: 'remove', id: 'r1' })).toEqual([]));
  it('đổi tên giáo án và chặn tên trống hoặc trùng', () => {
    expect(
      routineReducer(initial, {
        type: 'rename',
        id: 'r1',
        name: ' Buổi sáng ',
      })[0].name,
    ).toBe('Buổi sáng');
    expect(
      routineReducer(initial, { type: 'rename', id: 'r1', name: ' ' }),
    ).toEqual(initial);
    expect(validateRoutineName(initial, 'ngày NGỰC')).toBe(
      'Tên giáo án đã tồn tại',
    );
    expect(validateRoutineName(initial, '')).toBe(
      'Tên giáo án không được để trống',
    );
    expect(validateRoutineName(initial, 'Ngày ngực', 'r1')).toBe('');
  });
  it('chặn tạo tên trùng và id trùng', () => {
    expect(
      routineReducer(initial, { type: 'create', id: 'r2', name: 'ngày NGỰC' }),
    ).toEqual(initial);
    expect(
      routineReducer(initial, { type: 'create', id: 'r1', name: 'Ngày chân' }),
    ).toEqual(initial);
  });
});

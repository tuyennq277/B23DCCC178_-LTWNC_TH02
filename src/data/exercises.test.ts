import { describe, expect, it } from 'vitest';
import { generateExercises } from './exercises';
describe('Dữ liệu bài tập', () => {
  it('sinh đúng 10000 bài có id duy nhất và thời lượng từ 30 đến 120 giây', () => {
    const exercises = generateExercises(10000);
    expect(exercises).toHaveLength(10000);
    expect(new Set(exercises.map((exercise) => exercise.id)).size).toBe(10000);
    expect(
      exercises.every(
        (exercise) => exercise.duration >= 30 && exercise.duration <= 120,
      ),
    ).toBe(true);
  });
  it('sinh dữ liệu cố định và đúng ba bài mẫu', () => {
    expect(generateExercises(3)).toEqual([
      {
        id: 'e1',
        name: 'Đẩy tạ đơn 1',
        trainer: 'Minh Khang',
        group: 'Ngực',
        duration: 30,
      },
      {
        id: 'e2',
        name: 'Kéo tạ đơn 1',
        trainer: 'Phương Anh',
        group: 'Chân',
        duration: 67,
      },
      {
        id: 'e3',
        name: 'Gập tạ đơn 1',
        trainer: 'Đức Anh',
        group: 'Tay',
        duration: 104,
      },
    ]);
  });
});

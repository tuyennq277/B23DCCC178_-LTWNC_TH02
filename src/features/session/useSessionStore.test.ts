import { beforeEach, describe, expect, it } from 'vitest';
import { generateExercises } from '../../data/exercises';
import { useSessionStore } from './useSessionStore';
const exercises = generateExercises(3);
const state = useSessionStore.getState;
describe('Store buổi tập', () => {
  beforeEach(() =>
    useSessionStore.setState({
      queue: [],
      currentIndex: -1,
      isRunning: false,
      elapsed: 0,
    }),
  );
  it('bắt đầu từ đúng bài và đặt lại thời gian', () => {
    state().startSession(exercises, 1);
    expect(state()).toMatchObject({
      queue: exercises,
      currentIndex: 1,
      elapsed: 0,
      isRunning: true,
    });
    expect(state().queue).not.toBe(exercises);
  });
  it('tick ở giây cuối tự sang bài tiếp theo', () => {
    state().startSession(exercises, 0);
    useSessionStore.setState({ elapsed: 29 });
    state().tick();
    expect(state()).toMatchObject({
      currentIndex: 1,
      elapsed: 0,
      isRunning: true,
    });
  });
  it('next ở bài cuối dừng đồng hồ', () => {
    state().startSession(exercises, 2);
    state().next();
    expect(state()).toMatchObject({
      currentIndex: 2,
      elapsed: 104,
      isRunning: false,
    });
  });
  it('tạm dừng không tăng giây và tiếp tục từ thời gian cũ', () => {
    state().startSession(exercises, 0);
    state().tick();
    state().toggleRun();
    state().tick();
    expect(state().elapsed).toBe(1);
    expect(state().isRunning).toBe(false);
    state().toggleRun();
    state().tick();
    expect(state().elapsed).toBe(2);
  });
  it('prev sau hơn 3 giây chỉ đặt lại bài, còn 3 giây thì lùi bài', () => {
    state().startSession(exercises, 1);
    useSessionStore.setState({ elapsed: 4 });
    state().prev();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0 });
    useSessionStore.setState({ elapsed: 3 });
    state().prev();
    expect(state().currentIndex).toBe(0);
    state().prev();
    expect(state()).toMatchObject({ currentIndex: 0, elapsed: 0 });
  });
  it('thêm vào cuối và bỏ qua bài đã có', () => {
    state().addToSession(exercises[0]);
    state().addToSession(exercises[0]);
    state().addToSession(exercises[1]);
    expect(state().queue).toEqual(exercises.slice(0, 2));
    expect(state().isRunning).toBe(false);
    state().toggleRun();
    expect(state()).toMatchObject({ currentIndex: 0, isRunning: true });
  });
  it('bỏ qua thao tác khi chưa có buổi tập và xử lý vị trí không hợp lệ', () => {
    state().tick();
    state().toggleRun();
    state().next();
    state().prev();
    expect(state()).toMatchObject({ currentIndex: -1, isRunning: false });
    state().startSession([], 0);
    state().startSession(exercises, -1);
    state().startSession(exercises, 3);
    expect(state().queue).toEqual([]);
  });
  it('bài cuối hoàn thành tự dừng và có thể tập lại', () => {
    state().startSession(exercises, 2);
    useSessionStore.setState({ elapsed: 103 });
    state().tick();
    expect(state().isRunning).toBe(false);
    state().toggleRun();
    expect(state()).toMatchObject({
      currentIndex: 2,
      isRunning: true,
      elapsed: 0,
    });
  });
});

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EXERCISES } from '../../data/exercises';
import { formatDuration } from '../../utils/format';
import { useSessionStore } from '../session/useSessionStore';
import { useRoutineDispatch, useRoutines } from './RoutineContext';
import { validateRoutineName } from './routineReducer';

const exerciseById = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));
export default function RoutineDetailPage() {
  const { id } = useParams();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((state) => state.startSession);
  const routine = routines.find((item) => item.id === id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const exercises = useMemo(() => routine?.exerciseIds.flatMap((exerciseId) => { const exercise = exerciseById.get(exerciseId); return exercise ? [exercise] : []; }) ?? [], [routine]);
  const total = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
  if (!routine) return <div className="empty-state"><h1>Không tìm thấy giáo án.</h1><Link to="/routines">Về danh sách giáo án</Link></div>;
  function rename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateRoutineName(routines, name, id);
    setError(message);
    if (message || !id) return;
    dispatch({ type: 'rename', id, name }); setEditing(false);
  }
  return <section className="content-page"><Link className="back-link" to="/routines">← Tất cả giáo án</Link><div className="section-title"><div><p className="eyebrow">KẾ HOẠCH TẬP LUYỆN</p><h1>{routine.name}</h1><p className="muted">{exercises.length} bài · Tổng thời gian: {Math.floor(total / 60)} phút {total % 60} giây</p></div><div className="detail-actions"><button onClick={() => { setEditing(!editing); setName(routine.name); setError(''); }}>Đổi tên</button><button className="primary-button" disabled={!exercises.length} onClick={() => startSession(exercises, 0)}>Tập tất cả</button></div></div>
    {editing && <form className="routine-form panel" onSubmit={rename}><label>Tên mới<input value={name} onChange={(event) => setName(event.target.value)} /></label><button type="submit">Lưu tên</button>{error && <p className="form-error" role="alert">{error}</p>}</form>}
    {exercises.length ? <ol className="routine-exercises panel">{exercises.map((exercise, index) => <li key={exercise.id}><span className="row-number">{String(index + 1).padStart(2, '0')}</span><div><strong>{exercise.name}</strong><span>HLV {exercise.trainer} · {exercise.group}</span></div><span className="duration">{formatDuration(exercise.duration)}</span><button aria-label={`Bỏ ${exercise.name}`} onClick={() => dispatch({ type: 'removeExercise', id: routine.id, exerciseId: exercise.id })}>Bỏ</button></li>)}</ol> : <div className="empty-state panel"><span>＋</span><h3>Thêm những bước đầu tiên.</h3><p>Chọn giáo án này trong kho và bấm + Giáo án ở bài bạn muốn tập.</p><Link className="text-link" to="/">Đến kho bài tập →</Link></div>}
  </section>;
}

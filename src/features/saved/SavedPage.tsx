import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { ExerciseRow } from '../library/ExerciseRow';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from './useSavedStore';

export default function SavedPage() {
  const ids = useSavedStore((state) => state.ids);
  const toggle = useSavedStore((state) => state.toggle);
  const startSession = useSessionStore((state) => state.startSession);
  const addToSession = useSessionStore((state) => state.addToSession);
  const exercises = useMemo(() => { const saved = new Set(ids); return EXERCISES.filter((exercise) => saved.has(exercise.id)); }, [ids]);
  const onStart = useCallback((exercise: Exercise) => startSession(exercises, exercises.findIndex((item) => item.id === exercise.id)), [exercises, startSession]);
  const onSave = useCallback((id: string) => toggle(id), [toggle]);
  const onAdd = useCallback((exercise: Exercise) => addToSession(exercise), [addToSession]);
  return (
    <section className="content-page"><div className="section-title"><div><p className="eyebrow">DÀNH RIÊNG CHO BẠN</p><h1>Bài tập đã lưu</h1><p className="muted">Những bài tập yêu thích, sẵn sàng khi bạn cần.</p></div><button className="primary-button" disabled={!exercises.length} onClick={() => startSession(exercises, 0)}>Tập tất cả</button></div>
      {exercises.length ? <div className="exercise-table">{exercises.map((exercise, index) => <ExerciseRow key={exercise.id} exercise={exercise} index={index} saved onStart={onStart} onSave={onSave} onAdd={onAdd} />)}</div> : <div className="empty-state panel"><span>☆</span><h3>Bạn chưa lưu bài tập nào.</h3><p>Chạm ngôi sao bên cạnh bài tập để lưu vào đây.</p><Link className="text-link" to="/">Khám phá kho bài tập →</Link></div>}
    </section>
  );
}

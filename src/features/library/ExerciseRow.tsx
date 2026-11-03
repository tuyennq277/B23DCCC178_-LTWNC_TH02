import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';
export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style?: CSSProperties;
  onStart: (exercise: Exercise) => void;
  onSave: (id: string) => void;
  onAdd: (exercise: Exercise) => void;
  saved?: boolean;
  onAddRoutine?: (exercise: Exercise) => void;
  routineSelected?: boolean;
}
export const ExerciseRow = memo(function ExerciseRow({ exercise, index, style, onStart, onSave, onAdd, saved = false, onAddRoutine, routineSelected = false }: ExerciseRowProps) {
  return (
    <div className="exercise-row" style={style} data-exercise-id={exercise.id}>
      <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
      <strong className="exercise-name">{exercise.name}</strong><span className="trainer">{exercise.trainer}</span>
      <span><span className={`group-badge group-${exercise.group}`}>{exercise.group}</span></span>
      <span className="duration">{formatDuration(exercise.duration)}</span>
      <div className="row-actions">
        <button className="start-button" onClick={() => onStart(exercise)}>Bắt đầu</button>
        <button className={`save-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Bỏ lưu' : 'Lưu bài tập'} aria-pressed={saved} onClick={() => onSave(exercise.id)}>{saved ? '★' : '☆'}</button>
        <button className="subtle-button" onClick={() => onAdd(exercise)}>+ Buổi tập</button>
        {onAddRoutine && <button className="subtle-button" disabled={!routineSelected} onClick={() => onAddRoutine(exercise)}>+ Giáo án</button>}
      </div>
    </div>
  );
});

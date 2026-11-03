import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRoutineDispatch, useRoutines } from './RoutineContext';
import { validateRoutineName } from './routineReducer';

const CreateRoutineForm = memo(function CreateRoutineForm({
  validate,
}: {
  validate: (name: string) => string;
}) {
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validate(name);
    setError(message);
    if (message) return;
    dispatch({ type: 'create', id: crypto.randomUUID(), name });
    setName('');
  }
  return (
    <form className="routine-form panel" onSubmit={handleSubmit} noValidate>
      <label>
        Tên giáo án
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          placeholder="Ví dụ: Ngày ngực, Buổi tập sáng…"
          aria-invalid={!!error}
          aria-describedby={error ? 'routine-error' : undefined}
        />
      </label>
      <button className="primary-button" type="submit">
        Tạo
      </button>
      {error && (
        <p className="form-error" id="routine-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
});

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const routinesRef = useRef(routines);
  useEffect(() => {
    routinesRef.current = routines;
  }, [routines]);
  const validate = useCallback(
    (name: string) => validateRoutineName(routinesRef.current, name),
    [],
  );
  return (
    <section className="content-page">
      <div className="section-title">
        <div>
          <p className="eyebrow">TẬP LUYỆN CÓ KẾ HOẠCH</p>
          <h1>Giáo án của bạn</h1>
          <p className="muted">
            Một kế hoạch nhỏ. Một phiên bản tốt hơn mỗi ngày.
          </p>
        </div>
        <span className="count-pill">{routines.length} giáo án</span>
      </div>
      <CreateRoutineForm validate={validate} />
      {routines.length ? (
        <div className="routine-grid">
          {routines.map((routine, index) => (
            <article className="routine-card panel" key={routine.id}>
              <span className="routine-number">
                GIÁO ÁN / {String(index + 1).padStart(2, '0')}
              </span>
              <h2>
                <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
              </h2>
              <p>{routine.exerciseIds.length} bài</p>
              <div className="routine-card-actions">
                <Link className="text-link" to={`/routines/${routine.id}`}>
                  Xem chi tiết →
                </Link>
                <button
                  className="delete-button"
                  aria-label={`Xóa ${routine.name}`}
                  onClick={() => dispatch({ type: 'remove', id: routine.id })}
                >
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>▤</span>
          <h3>Giáo án đầu tiên đang chờ bạn.</h3>
          <p>Đặt tên ở trên, rồi chọn bài tập từ kho để xây dựng buổi tập.</p>
        </div>
      )}
    </section>
  );
}

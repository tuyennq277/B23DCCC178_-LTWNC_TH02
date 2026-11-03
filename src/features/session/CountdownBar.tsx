import { formatDuration } from '../../utils/format';
import { useSessionStore } from './useSessionStore';

export default function CountdownBar() {
  const elapsed = useSessionStore((state) => state.elapsed);
  const duration = useSessionStore(
    (state) => state.queue[state.currentIndex]?.duration ?? 0,
  );
  const percent = duration ? Math.min(100, (elapsed / duration) * 100) : 0;
  return (
    <div className="countdown">
      <div className="countdown-label">
        <span>
          Còn lại:{' '}
          <strong>{formatDuration(Math.max(0, duration - elapsed))}</strong>
        </span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Tiến trình bài tập"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <div style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

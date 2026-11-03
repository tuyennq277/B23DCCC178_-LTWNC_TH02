import { useEffect } from 'react';
import CountdownBar from './CountdownBar';
import { useSessionStore } from './useSessionStore';

export default function SessionBar() {
  const current = useSessionStore((state) => state.queue[state.currentIndex]);
  const count = useSessionStore((state) => state.queue.length);
  const isRunning = useSessionStore((state) => state.isRunning);
  const tick = useSessionStore((state) => state.tick);
  const toggleRun = useSessionStore((state) => state.toggleRun);
  const next = useSessionStore((state) => state.next);
  const prev = useSessionStore((state) => state.prev);
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);
  return (
    <footer className="session-bar" aria-label="Đồng hồ buổi tập">
      <div className={`session-icon ${isRunning ? 'running' : ''}`}>ϟ</div>
      <div className="session-info">
        <p className="eyebrow">BUỔI TẬP CỦA BẠN</p>
        <p className="session-name">
          {current
            ? `Đang tập: ${current.name} – HLV ${current.trainer}`
            : 'Chưa bắt đầu buổi tập'}
        </p>
        <span>Buổi tập: {count} bài</span>
      </div>
      <CountdownBar />
      <div className="session-controls">
        <button disabled={!current} onClick={prev}>
          Trước
        </button>
        <button
          className="primary-button"
          disabled={!count}
          onClick={toggleRun}
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button disabled={!current} onClick={next}>
          Sau
        </button>
      </div>
    </footer>
  );
}

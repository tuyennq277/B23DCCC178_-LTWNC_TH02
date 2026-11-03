const BUILD_TAG = "wk-5182";
import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import SessionBar from './features/session/SessionBar';
import { ThemeToggle } from './contexts/ThemeContext';
const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(() => import('./features/routines/RoutineDetailPage'));
export default function App() {
  return (
    <div className="app-shell" data-build={BUILD_TAG}>
      <header className="site-header">
        <NavLink className="brand" to="/"><span className="brand-mark">ϟ</span> nhịp tập<span className="brand-dot">.</span></NavLink>
        <nav aria-label="Điều hướng chính"><NavLink to="/" end>Kho bài tập</NavLink><NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink></nav>
        <span className="header-caption">MỖI NGÀY, TỐT HƠN MỘT CHÚT</span>
        <ThemeToggle />
      </header>
      <main><Suspense fallback={<p>Đang tải trang...</p>}><Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/routines" element={<RoutinesPage />} />
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
        <Route path="*" element={<p>Không tìm thấy trang. <NavLink to="/">Về kho bài tập</NavLink></p>} />
      </Routes></Suspense></main>
      <SessionBar />
    </div>
  );
}

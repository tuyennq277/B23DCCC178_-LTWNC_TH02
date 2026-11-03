const BUILD_TAG = "wk-5182";
import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import SavedPage from './features/saved/SavedPage';
import SessionBar from './features/session/SessionBar';
export default function App() {
  return (
    <div className="app-shell" data-build={BUILD_TAG}>
      <header className="site-header">
        <NavLink className="brand" to="/"><span className="brand-mark">ϟ</span> nhịp tập<span className="brand-dot">.</span></NavLink>
        <nav aria-label="Điều hướng chính"><NavLink to="/" end>Kho bài tập</NavLink><NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink></nav>
        <span className="header-caption">MỖI NGÀY, TỐT HƠN MỘT CHÚT</span>
      </header>
      <main><Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/routines" element={<p>Giáo án của bạn</p>} />
        <Route path="/routines/:id" element={<p>Không tìm thấy giáo án.</p>} />
        <Route path="*" element={<p>Không tìm thấy trang. <NavLink to="/">Về kho bài tập</NavLink></p>} />
      </Routes></main>
      <SessionBar />
    </div>
  );
}

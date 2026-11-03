import { memo, useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList, areEqual } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import { useDebounce } from '../../hooks/useDebounce';
import type { Exercise, MuscleGroup } from '../../types';
import { ExerciseRow } from './ExerciseRow';
interface RowData {
  exercises: Exercise[];
  onStart: (exercise: Exercise) => void;
  onSave: (id: string) => void;
  onAdd: (exercise: Exercise) => void;
}
const VirtualRow = memo(function VirtualRow({ index, style, data }: ListChildComponentProps<RowData>) {
  return <ExerciseRow exercise={data.exercises[index]} index={index} style={style} onStart={data.onStart} onSave={data.onSave} onAdd={data.onAdd} />;
}, areEqual);
const itemKey = (index: number, data: RowData) => data.exercises[index].id;
export default function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState<MuscleGroup | ''>('');
  const [sort, setSort] = useState('default');
  const debouncedKeyword = useDebounce(keyword, 300);
  const exercises = useMemo(() => {
    const query = debouncedKeyword.trim().toLocaleLowerCase('vi');
    const filtered = EXERCISES.filter((exercise) => (!group || exercise.group === group) && (exercise.name.toLocaleLowerCase('vi').includes(query) || exercise.trainer.toLocaleLowerCase('vi').includes(query)));
    if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (sort === 'duration') return [...filtered].sort((a, b) => a.duration - b.duration);
    return filtered;
  }, [debouncedKeyword, group, sort]);
  const handleKeywordShift = useCallback((event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value), []);
  const onStart = useCallback((exercise: Exercise) => { void exercise; }, []);
  const onSave = useCallback((id: string) => { void id; }, []);
  const onAdd = useCallback((exercise: Exercise) => { void exercise; }, []);
  const itemData = useMemo(() => ({ exercises, onStart, onSave, onAdd }), [exercises, onStart, onSave, onAdd]);
  return (
    <>
      <section className="hero"><div><p className="eyebrow">KHỞI ĐỘNG MỘT THÓI QUEN TỐT</p><h1>Mỗi nhịp tập.<br /><span>Một bước tiến.</span></h1><p className="hero-description">Chọn bài tập, tạo giáo án và bắt đầu theo nhịp của bạn.</p></div><div className="hero-stat"><span className="stat-orbit">↗</span><strong>10.000</strong><span>bài tập · 5 nhóm cơ · 1 mục tiêu</span></div></section>
      <section className="library-section" aria-labelledby="library-heading">
        <div className="section-title"><div><p className="eyebrow">KHÁM PHÁ & TẬP LUYỆN</p><h2 id="library-heading">Kho bài tập</h2></div><span className="section-note">Một khởi đầu cho mọi buổi tập.</span></div>
        <div className="filters">
          <label className="search-field">Tìm kiếm<input value={keyword} onChange={handleKeywordShift} placeholder="Tên bài tập hoặc huấn luyện viên…" type="search" /></label>
          <label>Nhóm cơ<select value={group} onChange={(event) => setGroup(event.target.value as MuscleGroup | '')}><option value="">Tất cả</option>{GROUPS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Sắp xếp<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Mặc định</option><option value="name">Tên A–Z</option><option value="duration">Thời lượng tăng dần</option></select></label>
        </div>
        <p className="result-count" role="status">Tìm thấy <strong>{exercises.length}</strong> bài tập</p>
        <div className="exercise-table"><div className="table-heading"><span>#</span><span>BÀI TẬP</span><span>HUẤN LUYỆN VIÊN</span><span>NHÓM CƠ</span><span>THỜI GIAN</span><span>THAO TÁC</span></div>
          {exercises.length ? <FixedSizeList height={560} itemSize={56} width="100%" itemCount={exercises.length} itemData={itemData} itemKey={itemKey} overscanCount={2}>{VirtualRow}</FixedSizeList> : <div className="empty-state"><span>⌕</span><h3>Không tìm thấy bài tập nào.</h3><p>Thử một từ khóa hoặc nhóm cơ khác nhé.</p></div>}
        </div>
      </section>
      <p className="page-footnote">TIẾN BỘ BẮT ĐẦU TỪ VIỆC XUẤT HIỆN. HẸN BẠN Ở BUỔI TẬP HÔM NAY.</p>
    </>
  );
}

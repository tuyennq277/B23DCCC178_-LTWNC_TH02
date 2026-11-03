# B23DCCC178_-LTWNC_TH02

Bài thực hành 02 — Lập trình Web nâng cao: ứng dụng Bấm giờ tập luyện.

Mã sinh viên: B23DCCC178.

## Chạy ứng dụng

Yêu cầu Node.js **22.12 trở lên**, dùng Node 22 hoặc 24 LTS. Dự án đặt ngay ở gốc repo.

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite in ra, mặc định `http://127.0.0.1:5173`.

```bash
npm run build
npm test
npm run coverage
npm run preview
```

`build` kiểm tra TypeScript rồi xuất ứng dụng vào `dist/`. `test` chạy một lần và thoát. Báo cáo coverage HTML ở `coverage/index.html`; ảnh chụp bảng kết quả ở [coverage.png](coverage.png).

## Chức năng theo đề

| Phần | Nội dung đã triển khai                                                                                                                                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Kho 10.000 bài cố định; `FixedSizeList` cao 560px, dòng 56px; key là id; debounce generic 300ms; tìm tên/HLV không phân biệt hoa thường; lọc nhóm cơ; sắp xếp tên tiếng Việt/thời lượng; `memo`, `useMemo`, `useCallback`.        |
| 2    | Zustand quản lý buổi tập; tự chuyển bài; tạm dừng/tiếp tục; quy tắc Trước sau 3 giây; chống thêm trùng; thanh đồng hồ cố định; riêng `CountdownBar` đọc elapsed; lưu bài bằng persist key `workout-saved`.                        |
| 3    | Giáo án bằng reducer thuần với 5 action; Context state/dispatch riêng; logger chỉ ở DEV; lưu key `workout-routines`; kiểm tra tên trống/trùng; thêm/bỏ bài; đổi tên/xóa; tổng thời lượng; ThemeContext riêng; lazy load ba trang. |
| 4    | Vitest, React Testing Library, userEvent, fake timers, renderHook, mock function; test đặt cạnh file nguồn, tên tiếng Việt; ngưỡng Lines 70% được kiểm tra tự động.                                                               |

`src/App.tsx` bắt đầu chính xác bằng `const BUILD_TAG = "wk-5182";`. Hàm nhập từ khóa tên `handleKeywordShift`. Không dùng Redux Toolkit, `any` hay `enum`.

## Các trang

| URL             | Nội dung                                              |
| --------------- | ----------------------------------------------------- |
| `/`             | Kho bài tập, tìm kiếm/lọc, chọn giáo án nhận bài      |
| `/saved`        | Bài đã lưu và Tập tất cả                              |
| `/routines`     | Tạo, xem, xóa giáo án                                 |
| `/routines/:id` | Chi tiết, tổng thời gian, đổi tên, bỏ bài, Tập tất cả |

Chọn Bắt đầu trên một dòng sẽ tạo buổi tập từ **toàn bộ danh sách đang lọc và sắp xếp**, bắt đầu tại dòng đó. `+ Buổi tập` chỉ thêm vào cuối; nếu chưa bắt đầu, dùng nút Bắt đầu ở thanh dưới. `+ Giáo án` thêm vào giáo án đang chọn và bỏ qua bài trùng. Trên màn hình hẹp, cuộn ngang bảng để xem đủ các cột và thao tác.

Giáo án và bài đã lưu tồn tại sau khi tải lại trang. Đồng hồ là state trong bộ nhớ, bắt đầu lại khi tải lại trang. Hết bài cuối thì dừng tại 100%; nhấn Bắt đầu để tập lại bài cuối. Giao diện sáng/tối đổi độc lập với dữ liệu giáo án.

## Cấu trúc

```text
src/
├── App.tsx, main.tsx, types.ts, setupTests.ts
├── data/exercises.ts
├── utils/format.ts
├── hooks/useDebounce.ts
├── contexts/ThemeContext.tsx
├── test/renderWithProviders.tsx
└── features/
    ├── library/   LibraryPage.tsx, ExerciseRow.tsx
    ├── session/   useSessionStore.ts, SessionBar.tsx, CountdownBar.tsx
    ├── saved/     useSavedStore.ts, SavedPage.tsx
    └── routines/  routineReducer.ts, withLogger.ts, RoutineContext.tsx,
                  RoutinesPage.tsx, RoutineDetailPage.tsx
```

Các file `*.test.ts` / `*.test.tsx` nằm cạnh mã nguồn tương ứng. Form tạo giáo án chỉ đọc DispatchContext; callback kiểm tra tên giữ ổn định để không render lại khi danh sách giáo án đổi. Các component dùng Zustand đăng ký selector cho đúng phần state cần đọc.

## Kết quả kiểm tra

- `npm run build`: thành công, ba trang SavedPage, RoutinesPage, RoutineDetailPage có bundle JavaScript riêng.
- `npm test`: 48 test thành công trong 13 file.
- `npm run coverage`: Lines 100%, Statements 100%, Functions 100%, Branches 97,77% cho phạm vi `src/features/**` và `src/utils/**`.
- Kiểm tra trên Edge: khoảng 10–15 dòng ở DOM; lọc “đẩy” → 1250, thêm nhóm Vai → 250; bài đã lưu và giáo án giữ sau tải lại; thêm e1/e2/e1 chỉ có 2 bài và tổng 1 phút 37 giây; chuyển bài trên đồng hồ; sáng/tối; màn hình 390px không tràn ngang toàn trang.
- Repo public, nhánh `main`; commit theo các mốc `Phan 1`, `Phan 2`, `Phan 3`, `Phan 4`.

React 18 được dùng để tương thích với `react-window@1`. Giữ React Router v6 theo yêu cầu bắt buộc; npm audit hiện báo 2 cảnh báo mức moderate thuộc nhánh thư viện này. Ứng dụng dùng BrowserRouter ở trình duyệt, không dùng SSR; các URL điều hướng đều do ứng dụng tự tạo.

Khi tự triển khai lên hosting, cấu hình fallback mọi route về `index.html` để mở trực tiếp `/saved` và `/routines/:id`.

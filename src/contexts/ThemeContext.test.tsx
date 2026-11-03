import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider, ThemeToggle, useTheme } from './ThemeContext';
describe('Giao diện sáng tối', () => {
  it('đổi theme độc lập và cập nhật nhãn nút', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Giao diện tối' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Giao diện sáng' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
  it('báo lỗi khi dùng ngoài Provider', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const suppressExpectedError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', suppressExpectedError);
    try {
      expect(() => renderHook(() => useTheme())).toThrow(
        'useTheme phải được dùng bên trong ThemeProvider',
      );
    } finally {
      window.removeEventListener('error', suppressExpectedError);
      error.mockRestore();
    }
  });
});

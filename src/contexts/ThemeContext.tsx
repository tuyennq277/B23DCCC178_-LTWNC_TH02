import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
type Theme = 'light' | 'dark';
interface ThemeValue { theme: Theme; toggleTheme: () => void }
export const ThemeContext = createContext<ThemeValue | undefined>(undefined);
export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = useCallback(() => setTheme((current) => current === 'light' ? 'dark' : 'light'), []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme phải được dùng bên trong ThemeProvider');
  return context;
}
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}</button>;
}

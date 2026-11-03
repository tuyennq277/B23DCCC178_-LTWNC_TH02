import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { RoutineProvider } from '../features/routines/RoutineContext';
import { ThemeProvider } from '../contexts/ThemeContext';
export function renderWithProviders(ui: ReactElement, initialEntries = ['/']) {
  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ThemeProvider>
        <RoutineProvider>{ui}</RoutineProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

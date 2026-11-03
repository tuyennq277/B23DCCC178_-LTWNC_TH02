import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, PropsWithChildren } from 'react';
import type { Routine } from '../../types';
import { routineReducer } from './routineReducer';
import type { RoutineAction } from './routineReducer';
import { withLogger } from './withLogger';

export const RoutineStateContext = createContext<Routine[] | undefined>(
  undefined,
);
export const RoutineDispatchContext = createContext<
  Dispatch<RoutineAction> | undefined
>(undefined);
function loadRoutines(): Routine[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem('workout-routines') ?? '[]',
    );
    if (!Array.isArray(stored)) return [];
    return stored.filter(
      (item): item is Routine =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        Array.isArray(item.exerciseIds) &&
        item.exerciseIds.every((id: unknown) => typeof id === 'string'),
    );
  } catch {
    return [];
  }
}
export function RoutineProvider({ children }: PropsWithChildren) {
  const [routines, dispatch] = useReducer(
    withLogger(routineReducer),
    undefined,
    loadRoutines,
  );
  useEffect(() => {
    localStorage.setItem('workout-routines', JSON.stringify(routines));
  }, [routines]);
  // Both values already have stable identities; wrapping them in new objects would defeat the split.
  return (
    <RoutineDispatchContext.Provider value={dispatch}>
      <RoutineStateContext.Provider value={routines}>
        {children}
      </RoutineStateContext.Provider>
    </RoutineDispatchContext.Provider>
  );
}
export function useRoutines(): Routine[] {
  const context = useContext(RoutineStateContext);
  if (context === undefined)
    throw new Error('useRoutines phải được dùng bên trong RoutineProvider');
  return context;
}
export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const context = useContext(RoutineDispatchContext);
  if (context === undefined)
    throw new Error(
      'useRoutineDispatch phải được dùng bên trong RoutineProvider',
    );
  return context;
}

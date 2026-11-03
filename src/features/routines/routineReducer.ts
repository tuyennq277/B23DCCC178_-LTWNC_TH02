import type { Routine } from '../../types';
export type RoutineAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addExercise'; id: string; exerciseId: string }
  | { type: 'removeExercise'; id: string; exerciseId: string };

export function validateRoutineName(routines: Routine[], name: string, exceptId?: string): string {
  if (!name.trim()) return 'Tên giáo án không được để trống';
  if (routines.some((routine) => routine.id !== exceptId && routine.name.toLocaleLowerCase('vi') === name.trim().toLocaleLowerCase('vi'))) return 'Tên giáo án đã tồn tại';
  return '';
}
export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create':
      if (validateRoutineName(state, action.name) || state.some((routine) => routine.id === action.id)) return state;
      return [...state, { id: action.id, name: action.name.trim(), exerciseIds: [] }];
    case 'rename':
      if (validateRoutineName(state, action.name, action.id)) return state;
      return state.map((routine) => routine.id === action.id ? { ...routine, name: action.name.trim() } : routine);
    case 'remove':
      return state.filter((routine) => routine.id !== action.id);
    case 'addExercise':
      return state.map((routine) => routine.id === action.id && !routine.exerciseIds.includes(action.exerciseId) ? { ...routine, exerciseIds: [...routine.exerciseIds, action.exerciseId] } : routine);
    case 'removeExercise':
      return state.map((routine) => routine.id === action.id ? { ...routine, exerciseIds: routine.exerciseIds.filter((id) => id !== action.exerciseId) } : routine);
  }
}

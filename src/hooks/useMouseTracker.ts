import { useMousePosition } from '@/context/MouseContext';

/**
 * Hook that returns the current normalized mouse position `{ x, y }` in the -1..1 range.
 *
 * This is a thin alias for `useMousePosition` from `MouseContext`.
 * - Use `useMousePosition()` when importing directly from `@/context/MouseContext` (preferred for context consumers).
 * - Use `useMouseTracker()` when importing from `@/hooks/useMouseTracker` (follows hooks/ convention per architecture.md).
 *
 * Both return identical values. Only one `mousemove` listener exists project-wide (in `MouseProvider`).
 */
export { useMousePosition as useMouseTracker };


import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MouseProvider, useMousePosition } from '@/context/MouseContext';

describe('MouseContext', () => {
  it('provides default position { x: 0, y: 0 } before any mousemove', () => {
    const { result } = renderHook(() => useMousePosition(), {
      wrapper: MouseProvider,
    });
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it('normalizes mousemove to -1..1 range relative to viewport center', () => {
    // jsdom defaults: innerWidth = 1024, innerHeight = 768
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

    const { result } = renderHook(() => useMousePosition(), {
      wrapper: MouseProvider,
    });

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 1024, clientY: 768 }),
      );
    });

    // right-bottom corner → x=+1, y=+1
    expect(result.current.x).toBeCloseTo(1, 5);
    expect(result.current.y).toBeCloseTo(1, 5);
  });

  it('normalizes top-left corner to { x: -1, y: -1 }', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

    const { result } = renderHook(() => useMousePosition(), {
      wrapper: MouseProvider,
    });

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 0, clientY: 0 }),
      );
    });

    expect(result.current.x).toBeCloseTo(-1, 5);
    expect(result.current.y).toBeCloseTo(-1, 5);
  });

  it('normalizes viewport center to { x: 0, y: 0 }', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

    const { result } = renderHook(() => useMousePosition(), {
      wrapper: MouseProvider,
    });

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 512, clientY: 384 }),
      );
    });

    expect(result.current.x).toBeCloseTo(0, 5);
    expect(result.current.y).toBeCloseTo(0, 5);
  });

  it('registers only one mousemove listener (no duplication on mount)', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => useMousePosition(), { wrapper: MouseProvider });

    const mousemoveListeners = addSpy.mock.calls.filter(
      ([event]: [string, ...unknown[]]) => event === 'mousemove',
    );
    expect(mousemoveListeners).toHaveLength(1);
    addSpy.mockRestore();
  });

  it('removes the mousemove listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useMousePosition(), {
      wrapper: MouseProvider,
    });

    unmount();

    const removedMousemove = removeSpy.mock.calls.some(
      ([event]: [string, ...unknown[]]) => event === 'mousemove',
    );
    expect(removedMousemove).toBe(true);
    removeSpy.mockRestore();
  });
});

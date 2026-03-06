import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmotionProvider, useEmotionState, useEmotionDispatch } from '@/context/EmotionContext';

describe('EmotionContext', () => {
  it('provides initial state idle', () => {
    const { result } = renderHook(() => useEmotionState(), { wrapper: EmotionProvider });
    expect(result.current).toBe('idle');
  });

  it('updates state to typing when SET_TYPING is dispatched', () => {
    const { result } = renderHook(() => {
      return {
        state: useEmotionState(),
        dispatch: useEmotionDispatch()
      };
    }, { wrapper: EmotionProvider });

    act(() => {
      result.current.dispatch({ type: 'SET_TYPING' });
    });

    expect(result.current.state).toBe('typing');
  });

  it('updates state to password-visible when SET_PASSWORD_VISIBLE is dispatched', () => {
    const { result } = renderHook(() => {
      return {
        state: useEmotionState(),
        dispatch: useEmotionDispatch()
      };
    }, { wrapper: EmotionProvider });

    act(() => {
      result.current.dispatch({ type: 'SET_PASSWORD_VISIBLE' });
    });

    expect(result.current.state).toBe('password-visible');
  });

  it('updates state to success when SET_SUCCESS is dispatched', () => {
    const { result } = renderHook(() => {
      return {
        state: useEmotionState(),
        dispatch: useEmotionDispatch()
      };
    }, { wrapper: EmotionProvider });

    act(() => {
      result.current.dispatch({ type: 'SET_SUCCESS' });
    });

    expect(result.current.state).toBe('success');
  });

  it('returns to idle when SET_IDLE is dispatched from another state', () => {
    const { result } = renderHook(() => {
      return {
        state: useEmotionState(),
        dispatch: useEmotionDispatch()
      };
    }, { wrapper: EmotionProvider });

    act(() => {
      result.current.dispatch({ type: 'SET_TYPING' });
    });
    expect(result.current.state).toBe('typing');

    act(() => {
      result.current.dispatch({ type: 'SET_IDLE' });
    });
    expect(result.current.state).toBe('idle');
  });

  it('throws an error if useEmotionState is used outside EmotionProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useEmotionState())).toThrow('useEmotionState must be used inside EmotionProvider');
    consoleSpy.mockRestore();
  });

  it('throws an error if useEmotionDispatch is used outside EmotionProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useEmotionDispatch())).toThrow('useEmotionDispatch must be used inside EmotionProvider');
    consoleSpy.mockRestore();
  });
});

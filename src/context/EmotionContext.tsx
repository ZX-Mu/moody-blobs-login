import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { EmotionState, EmotionAction } from '@/types';

// Split context pattern: prevents unnecessary re-renders in dispatch-only consumers
const EmotionStateContext = createContext<EmotionState | null>(null);
const EmotionDispatchContext = createContext<Dispatch<EmotionAction> | null>(null);

function emotionReducer(state: EmotionState, action: EmotionAction): EmotionState {
  switch (action.type) {
    case 'SET_IDLE':            return 'idle';
    case 'SET_TYPING':          return 'typing';
    case 'SET_PASSWORD_VISIBLE': return 'password-visible';
    case 'SET_SUCCESS':         return 'success';
    default:                    return state;
  }
}

export const EmotionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(emotionReducer, 'idle');
  return (
    <EmotionStateContext.Provider value={state}>
      <EmotionDispatchContext.Provider value={dispatch}>
        {children}
      </EmotionDispatchContext.Provider>
    </EmotionStateContext.Provider>
  );
};

/**
 * Returns the current emotion state. Must be used inside EmotionProvider.
 * Used by character components to read current emotion and render accordingly.
 */
export const useEmotionState = (): EmotionState => {
  const ctx = useContext(EmotionStateContext);
  if (ctx === null) throw new Error('useEmotionState must be used inside EmotionProvider');
  return ctx;
};

/**
 * Returns the dispatch function. Must be used inside EmotionProvider.
 * Used by LoginForm (and future input components) to trigger emotion changes.
 */
export const useEmotionDispatch = (): Dispatch<EmotionAction> => {
  const ctx = useContext(EmotionDispatchContext);
  if (ctx === null) throw new Error('useEmotionDispatch must be used inside EmotionProvider');
  return ctx;
};

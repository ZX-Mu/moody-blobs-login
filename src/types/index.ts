export type EmotionState = 'idle' | 'typing' | 'password-visible' | 'success';

export type EmotionAction =
  | { type: 'SET_IDLE' }
  | { type: 'SET_TYPING' }
  | { type: 'SET_PASSWORD_VISIBLE' }
  | { type: 'SET_SUCCESS' };

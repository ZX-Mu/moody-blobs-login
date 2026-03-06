/**
 * 黑色胶囊角色 — 最冷静克制
 *
 * Pupil tracking weight: 0.9× (calm, subtle response)
 * Max pupil offset: 6px (white r=12, pupil r=6 → 12-6 = 6px clamp)
 */
import { motion } from 'framer-motion';
import { useMousePosition } from '@/context/MouseContext';
import { useEmotionState } from '@/context/EmotionContext';
import { 
  animationConfig, 
  pupilTransition,
  typingStateValues
} from '@/config/animation';

const { characterWeights, pupilMaxOffset } = animationConfig;
const WEIGHT = characterWeights.blackBar;
const MAX_OFFSET = pupilMaxOffset.blackBar;

const BlackBar = () => {
  const { x, y } = useMousePosition();
  const emotion = useEmotionState();
  const isTyping = emotion === 'typing';

  // Apply weight then clamp to MAX_OFFSET.
  // BlackBar weight 0.9×: max raw = 0.9 × 6 = 5.4px; clamp boundary (6px) is never reached — defensive guard only.
  const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * MAX_OFFSET * WEIGHT));
  const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * MAX_OFFSET * WEIGHT));

  return (
    <svg width="75" height="200" viewBox="0 0 80 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      <rect x="5" y="5" width="70" height="160" rx="35" ry="35" fill="#2D2D2D" />
      {/* Left eye */}
      <circle cx="24" cy="62" r="12" fill="white" />
      {/* cy=65: eye-white center (62) + 3px intentional downward resting gaze */}
      <motion.circle
        r={6}
        fill="#1a1a1a"
        animate={{ 
          cx: 24 + offsetX, 
          cy: 65 + offsetY,
          scale: isTyping ? typingStateValues.blackBar.pupilScale : 1
        }}
        transition={pupilTransition}
      />
      {/* Right eye */}
      <circle cx="56" cy="62" r="12" fill="white" />
      {/* cy=65: eye-white center (62) + 3px resting gaze */}
      <motion.circle
        r={6}
        fill="#1a1a1a"
        animate={{ 
          cx: 56 + offsetX, 
          cy: 65 + offsetY,
          scale: isTyping ? typingStateValues.blackBar.pupilScale : 1
        }}
        transition={pupilTransition}
      />
      <line x1="32" y1="108" x2="48" y2="108" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export default BlackBar;

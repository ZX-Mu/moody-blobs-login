/**
 * 紫色长方体角色 — 情绪主导者，最高最大
 *
 * Pupil tracking weight: 0.8× (most reserved)
 * Max pupil offset: 9px (white r=18, pupil r=9 → 18-9 = 9px clamp)
 */
import { motion } from 'framer-motion';
import { useMousePosition } from '@/context/MouseContext';
import { useEmotionState } from '@/context/EmotionContext';
import { 
  animationConfig, 
  pupilTransition,
  emotionTransition
} from '@/config/animation';
import { characterPaths } from '@/config/characters';

const { characterWeights, pupilMaxOffset } = animationConfig;
const WEIGHT = characterWeights.purpleRect;
const MAX_OFFSET = pupilMaxOffset.purpleRect;

const PurpleRect = () => {
  const { x, y } = useMousePosition();
  const emotion = useEmotionState();
  const isTyping = emotion === 'typing';

  // Base bounding size: width 110, height 200
  // Default rect: M 23,5 (top-left) to 87,5 (top-right) 
  // Bottom row at y=195. Left edge 23, Right edge 87.
  const bodyPaths = {
    idle: 'M 23,5 L 87,5 C 97,5 105,13 105,23 C 105,74 105,126 105,177 C 105,187 97,195 87,195 L 23,195 C 13,195 5,187 5,177 C 5,126 5,74 5,23 C 5,13 13,5 23,5 Z',
    // The bend leaves the bottom (y=195) completely stationary.
    // The top (y=5) is shifted left by 15px.
    // The middle control points bow left gracefully.
    typing: 'M 8,5 L 72,5 C 82,5 90,13 90,23 C 98,74 105,126 105,177 C 105,187 97,195 87,195 L 23,195 C 13,195 5,187 5,177 C -5,126 -10,74 -10,23 C -10,13 -2,5 8,5 Z'
  };

  const eyeShift = isTyping ? -11 : 0;
  const mouthShift = isTyping ? -6 : 0;

  // Apply weight then clamp to MAX_OFFSET.
  // PurpleRect weight 0.8×: max raw = 0.8 × 9 = 7.2px; clamp boundary (9px) is never reached — defensive guard only.
  const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * MAX_OFFSET * WEIGHT));
  const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * MAX_OFFSET * WEIGHT));

  // The base SVG is 110x200, scaled arbitrarily via width/height.
  // We restore original width/height so it aligns properly with its siblings in the flex container,
  // but allow overflow to show the bend.
  return (
    <svg width="130" height="260" viewBox="0 0 110 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <motion.path
        animate={{ d: isTyping ? bodyPaths.typing : bodyPaths.idle }}
        transition={emotionTransition}
        fill="#7B5EA7"
      />
      <motion.g animate={{ x: eyeShift }} transition={emotionTransition}>
        {/* Left eye */}
        <circle cx="34" cy="70" r="18" fill="white" />
        {/* cy=73: eye-white center (70) + 3px intentional downward resting gaze */}
        <motion.circle
          r={9}
          fill="#1a1a1a"
          animate={{ cx: 34 + offsetX, cy: 73 + offsetY }}
          transition={pupilTransition}
        />
        {/* Right eye */}
        <circle cx="76" cy="70" r="18" fill="white" />
        {/* cy=73: eye-white center (70) + 3px resting gaze */}
        <motion.circle
          r={9}
          fill="#1a1a1a"
          animate={{ cx: 76 + offsetX, cy: 73 + offsetY }}
          transition={pupilTransition}
        />
        </motion.g>
        <motion.path 
          animate={{ 
            d: isTyping ? characterPaths.purpleRect.typing : characterPaths.purpleRect.idle,
            x: mouthShift 
          }} 
          stroke="#1a1a1a" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
          transition={emotionTransition}
        />
    </svg>
  );
};

export default PurpleRect;

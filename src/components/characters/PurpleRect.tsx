/**
 * 紫色长方体角色 — 情绪主导者，最高最大
 *
 * Pupil tracking weight: 0.8× (most reserved)
 * Max pupil offset: 9px (white r=18, pupil r=9 → 18-9 = 9px clamp)
 */
import { motion } from 'framer-motion';
import { useMousePosition } from '@/context/MouseContext';
import { animationConfig, pupilTransition } from '@/config/animation';

const { characterWeights, pupilMaxOffset } = animationConfig;
const WEIGHT = characterWeights.purpleRect;
const MAX_OFFSET = pupilMaxOffset.purpleRect;

const PurpleRect = () => {
  const { x, y } = useMousePosition();

  // Apply weight then clamp to MAX_OFFSET.
  // PurpleRect weight 0.8×: max raw = 0.8 × 9 = 7.2px; clamp boundary (9px) is never reached — defensive guard only.
  const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * MAX_OFFSET * WEIGHT));
  const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * MAX_OFFSET * WEIGHT));

  return (
    <svg width="130" height="260" viewBox="0 0 110 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      <rect x="5" y="5" width="100" height="190" rx="18" ry="18" fill="#7B5EA7" />
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
      <line x1="40" y1="125" x2="70" y2="125" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export default PurpleRect;

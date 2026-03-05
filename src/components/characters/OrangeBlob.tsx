/**
 * 橙色半圆角色 — 最活泼，反应幅度最大
 *
 * Pupil tracking weight: 1.2× (most reactive)
 * Max pupil offset: 7px (white r=14, pupil r=7 → 14-7 = 7px clamp)
 */
import { motion } from 'framer-motion';
import { useMousePosition } from '@/context/MouseContext';
import { animationConfig } from '@/config/animation';

const { pupilTracking, characterWeights, pupilMaxOffset } = animationConfig;
const WEIGHT = characterWeights.orangeBlob;
const MAX_OFFSET = pupilMaxOffset.orangeBlob;
const TRANSITION = {
  type: 'spring' as const,
  stiffness: pupilTracking.stiffness,
  damping: pupilTracking.damping,
};

const OrangeBlob = () => {
  const { x, y } = useMousePosition();

  // Apply weight then clamp to MAX_OFFSET.
  // For OrangeBlob (weight 1.2×), the clamp actively prevents overflow (max raw = 8.4px → clamped to 7px).
  // For weight ≤ 1.0 characters the clamp is a defensive safety guard — it never fires under normal use.
  const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * MAX_OFFSET * WEIGHT));
  const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * MAX_OFFSET * WEIGHT));

  return (
    <svg width="150" height="90" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      <ellipse cx="60" cy="80" rx="58" ry="62" fill="#FF8C42" />
      {/* Left eye */}
      <circle cx="36" cy="30" r="14" fill="white" />
      {/* cy=32: eye-white center (30) + 3px intentional downward resting gaze */}
      <motion.circle
        r={7}
        fill="#1a1a1a"
        animate={{ cx: 36 + offsetX, cy: 32 + offsetY }}
        transition={TRANSITION}
      />
      {/* Right eye */}
      <circle cx="74" cy="30" r="14" fill="white" />
      {/* cy=32: eye-white center (30) + 3px resting gaze */}
      <motion.circle
        r={7}
        fill="#1a1a1a"
        animate={{ cx: 74 + offsetX, cy: 32 + offsetY }}
        transition={TRANSITION}
      />
      <path d="M48,56 Q60,60 72,56" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

export default OrangeBlob;

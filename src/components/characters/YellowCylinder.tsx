/**
 * 黄色拱形角色 — 视线灵敏，反应适中
 *
 * Pupil tracking weight: 1.0× (standard reference weight)
 * Max pupil offset: 9px (white r=18, pupil r=9 → 18-9 = 9px clamp)
 */
import { motion } from 'framer-motion';
import { useMousePosition } from '@/context/MouseContext';
import { animationConfig, pupilTransition } from '@/config/animation';

const { characterWeights, pupilMaxOffset } = animationConfig;
const WEIGHT = characterWeights.yellowCylinder;
const MAX_OFFSET = pupilMaxOffset.yellowCylinder;

const YellowCylinder = () => {
  const { x, y } = useMousePosition();

  // Apply weight then clamp to MAX_OFFSET.
  // YellowCylinder weight 1.0×: max raw = 1.0 × 9 = 9px exactly equals the boundary — clamp is a safety guard, never active in practice.
  const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * MAX_OFFSET * WEIGHT));
  const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * MAX_OFFSET * WEIGHT));

  return (
    <svg width="120" height="180" viewBox="0 0 110 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      <ellipse cx="55" cy="55" rx="50" ry="50" fill="#F5C842" />
      <rect x="5" y="55" width="100" height="100" fill="#F5C842" />
      {/* Left eye */}
      <circle cx="32" cy="52" r="18" fill="white" />
      {/* cy=55: eye-white center (52) + 3px intentional downward resting gaze */}
      <motion.circle
        r={9}
        fill="#1a1a1a"
        animate={{ cx: 32 + offsetX, cy: 55 + offsetY }}
        transition={pupilTransition}
      />
      {/* Right eye */}
      <circle cx="74" cy="52" r="18" fill="white" />
      {/* cy=55: eye-white center (52) + 3px resting gaze */}
      <motion.circle
        r={9}
        fill="#1a1a1a"
        animate={{ cx: 74 + offsetX, cy: 55 + offsetY }}
        transition={pupilTransition}
      />
      <circle cx="55" cy="95" r="5" fill="#1a1a1a" />
    </svg>
  );
};

export default YellowCylinder;

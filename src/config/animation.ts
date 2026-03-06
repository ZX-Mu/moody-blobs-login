// All animation parameters live here. Components must NOT hardcode these values.
// Populated in Story 2.2 (mouse tracking) and Story 3.x (emotion animations)

export const animationConfig = {
  /**
   * Pupil spring tracking animation parameters.
   * Used by all 4 character components for mouse-following pupil motion.
   */
  pupilTracking: {
    stiffness: 200,
    damping: 20,
  },

  /**
   * Per-character pupil offset weight multipliers.
   * A higher weight means the character reacts more strongly to mouse movement.
   * OrangeBlob (1.2×) is the most animated; PurpleRect (0.8×) is the most reserved.
   */
  characterWeights: {
    orangeBlob: 1.2,
    yellowCylinder: 1.0,
    blackBar: 0.9,
    purpleRect: 0.8,
  },

  /**
   * Maximum pixel travel for each character's pupil (eye_white_radius - pupil_radius).
   * This is the clamp boundary applied AFTER the weight multiplier to prevent overflow
   * outside the white eye circle.
   *
   * orangeBlob:      white r=14, pupil r=7  → 14-7 = 7px
   * yellowCylinder:  white r=18, pupil r=9  → 18-9 = 9px
   * blackBar:        white r=12, pupil r=6  → 12-6 = 6px
   * purpleRect:      white r=18, pupil r=9  → 18-9 = 9px
   */
  pupilMaxOffset: {
    orangeBlob: 7,
    yellowCylinder: 9,
    blackBar: 6,
    purpleRect: 9,
  },
};

/**
 * Pre-built Framer Motion spring transition for pupil tracking.
 * Shared across all 4 character components — change here, applies everywhere.
 */
export const pupilTransition = {
  type: 'spring' as const,
  stiffness: animationConfig.pupilTracking.stiffness,
  damping: animationConfig.pupilTracking.damping,
};

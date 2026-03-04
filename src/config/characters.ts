// All SVG Path strings live here. Components must NOT inline path data.

export const characterPaths = {
  orangeBlob: {
    idle: 'M10,20 Q15,18 20,20',
  },
  purpleRect: {
    idle: 'M8,20 L22,20',  // short straight line (same as blackBar, per reference)
  },
  blackBar: {
    idle: 'M8,20 L22,20',
  },
  yellowCylinder: {
    idle: 'M15,20 m-1,0 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0',
  },
} as const;

// TODO Story 3.x — add emotion paths per character:
// orangeBlob.typing: downward curve (worried)
// orangeBlob.passwordVisible: body rotates -8°, peek offset
// orangeBlob.success: large smile
// purpleRect.typing: 'M10,20 Q15,25 20,20'
// purpleRect.passwordVisible: 'M10,20 Q12,18 15,20 Q18,22 20,20'
// purpleRect.success: 'M8,18 Q15,25 22,18'
// blackBar.typing / passwordVisible / success: restrained variants
// yellowCylinder.typing / passwordVisible / success: moderate variants

export type CharacterName = keyof typeof characterPaths;

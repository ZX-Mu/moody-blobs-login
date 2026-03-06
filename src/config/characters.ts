// All SVG Path strings live here. Components must NOT inline path data.

export const characterPaths = {
  orangeBlob: {
    idle: 'M48,56 Q60,60 72,56',
    typing: 'M48,56 Q60,50 72,56', // downward curve (worried)
  },
  purpleRect: {
    idle: 'M40,125 Q55,125 70,125', // straight line
    typing: 'M40,125 Q55,115 70,125', // downward curve (worried, matching AC 'down curve')
  },
  blackBar: {
    idle: 'M32,108 L48,108',
    typing: 'M32,108 L48,108', // restrained variant
  },
  yellowCylinder: {
    idle: 'M 50,95 C 50,92 52.5,90 55,90 C 57.5,90 60,92 60,95 C 60,98 57.5,100 55,100 C 52.5,100 50,98 50,95 Z', // circle r=5
    typing: 'M 48,95 C 48,88 51,85 55,85 C 59,85 62,88 62,95 C 62,103 59,106 55,106 C 51,106 48,103 48,95 Z', // dropped jaw "O"
  },
} as const;

// TODO Story 3.x — add emotion paths per character:
// orangeBlob.passwordVisible: body rotates -8°, peek offset
// orangeBlob.success: large smile
// purpleRect.passwordVisible: ...
// purpleRect.success: ...
// blackBar.passwordVisible / success: restrained variants
// yellowCylinder.passwordVisible / success: moderate variants

export type CharacterName = keyof typeof characterPaths;

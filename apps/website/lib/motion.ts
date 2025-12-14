export const EASE_QUIET = [0.16, 1, 0.3, 1] as const;

export const MOTION = {
  reveal: { duration: 0.26, ease: EASE_QUIET },
  hover: { duration: 0.16, ease: EASE_QUIET },
  panel: { duration: 0.22, ease: EASE_QUIET },
  slide: { duration: 0.32, ease: EASE_QUIET },
} as const;


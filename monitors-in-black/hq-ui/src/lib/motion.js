// Single source of truth for the entire motion vocabulary (plan-ui.md §4).
// Components import from here; no inline variant literals.

export const EASE_OUT = [0.16, 1, 0.3, 1]
export const EASE_IN = [0.7, 0, 0.84, 0]

export const DUR = {
  page: 0.3,
  pageExit: 0.15,
  flicker: 0.18,
  hover: 0.15,
  ping: 0.8,
  shake: 0.28,
  alertBorder: 1.2,
  silhouette: 0.4
}

// §4.1 — page transition. Body is #050505, so crossfade IS fade-through-black.
export const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DUR.page, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DUR.pageExit, ease: EASE_IN } }
}

// §4.3a — glitch shake on the content wrapper.
export const shakeVariants = {
  still: { x: 0, y: 0 },
  shake: {
    x: [0, -6, 5, -2, 0],
    y: [0, 2, -3, 1, 0],
    transition: { duration: DUR.shake, times: [0, 0.2, 0.5, 0.8, 1], ease: 'linear' }
  }
}

// §4.3b — red breach border. Survives reduced motion (opacity only).
export const alertBorderVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 0.35, 1, 0],
    transition: { duration: DUR.alertBorder, times: [0, 0.15, 0.45, 0.7, 1], ease: 'easeOut' }
  }
}

// §4.4 — radar blip. Idle pulse runs forever; spawn slam + ping fire once.
export const blipIdleVariants = {
  idle: {
    scale: [1, 1.6, 1],
    opacity: [1, 0.4, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
  }
}

export const blipSpawnVariants = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } }
}

export const pingVariants = {
  initial: { scale: 0.5, opacity: 0.8 },
  animate: { scale: 3, opacity: 0, transition: { duration: DUR.ping, ease: 'easeOut' } }
}

// §4.5 — chatter flicker-in. New lines only; history renders static.
export const flickerVariants = {
  hidden: { opacity: 0, x: -4 },
  animate: {
    opacity: [0, 1, 0.3, 1],
    x: 0,
    transition: { duration: DUR.flicker, times: [0, 0.4, 0.7, 1], ease: 'linear' }
  }
}

// §4.6 — NEURALYZED stamp. Overshoot is the slam; do not soften the spring.
export const stampVariants = {
  initial: { opacity: 0, scale: 2.4, rotate: -18 },
  animate: {
    opacity: 0.9,
    scale: 1,
    rotate: -12,
    transition: { type: 'spring', stiffness: 320, damping: 18, mass: 0.9 }
  }
}

// §4.9 — registry card hover: lift on the card, one flicker on the silhouette.
export const cardHoverVariants = {
  initial: { y: 0 },
  hover: { y: -4, transition: { duration: DUR.hover, ease: EASE_OUT } }
}

export const silhouetteVariants = {
  initial: { opacity: 1 },
  hover: {
    opacity: [1, 0.55, 1, 0.75, 1],
    transition: { duration: DUR.silhouette, ease: 'linear' }
  }
}

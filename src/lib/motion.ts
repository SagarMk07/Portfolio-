export const motionEase = [0.22, 1, 0.36, 1] as const

export const motionDuration = {
  fast: 0.18,
  normal: 0.38,
  emphasis: 0.72,
  project: 0.68,
} as const

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: motionDuration.normal, ease: motionEase } },
}

export const revealItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: motionDuration.normal, ease: motionEase } },
}

export const staggerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.04, staggerChildren: 0.085 } },
}

export const lineContainerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.04, staggerChildren: 0.11 } },
}

export const lineItemVariants = {
  hidden: { y: '110%', opacity: 0.9 },
  visible: { y: '0%', opacity: 1, transition: { duration: motionDuration.emphasis, ease: motionEase } },
}

export const imageRevealVariants = {
  hidden: { opacity: 0, scale: 1.045 },
  visible: { opacity: 1, scale: 1, transition: { duration: motionDuration.project, ease: motionEase } },
}

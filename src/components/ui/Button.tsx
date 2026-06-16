import { motion, type HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'danger' | 'ghost'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-amber-400 to-orange-500 text-studio-950 shadow-stamp hover:from-amber-300 hover:to-orange-400',
  danger:
    'bg-studio-700 text-zinc-200 border border-studio-500 hover:bg-studio-600 hover:text-white',
  ghost: 'bg-transparent text-zinc-300 hover:text-white',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`select-none rounded-xl px-6 py-3.5 font-display text-base uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

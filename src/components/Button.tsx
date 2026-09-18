import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const styles: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white active:bg-brand-800 disabled:bg-brand-300',
  secondary: 'bg-white text-slate-900 border border-slate-300 active:bg-slate-100',
  ghost: 'bg-transparent text-brand-700 active:bg-brand-50',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`w-full min-h-12 rounded-xl px-4 font-semibold text-base transition-colors ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

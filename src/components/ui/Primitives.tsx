import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  cor?: string
  tamanho?: 'sm' | 'md'
}

export function Badge({ cor = '#53e515', tamanho = 'sm', className, children, style, ...resto }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wide',
        tamanho === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
      style={{
        borderColor: `${cor}55`,
        backgroundColor: `${cor}1f`,
        color: cor,
        ...style,
      }}
      {...resto}
    >
      {children}
    </span>
  )
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const PADDING = { none: '', sm: 'p-3', md: 'p-4 sm:p-5', lg: 'p-5 sm:p-6' }

export function Card({ hover, padding = 'md', className, children, ...resto }: CardProps) {
  return (
    <div
      className={cn(
        'pgz-surface rounded-2xl border shadow-card',
        PADDING[padding],
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:border-neon/35 hover:shadow-lift',
        className,
      )}
      {...resto}
    >
      {children}
    </div>
  )
}

interface SectionTitleProps {
  titulo: string
  subtitulo?: string
  acao?: ReactNode
  icone?: ReactNode
  className?: string
}

export function SectionTitle({ titulo, subtitulo, acao, icone, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-100 sm:text-xl">
          {icone}
          {titulo}
        </h2>
        {subtitulo ? <p className="mt-0.5 text-sm text-neutral-400">{subtitulo}</p> : null}
      </div>
      {acao ? <div className="shrink-0">{acao}</div> : null}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-t border-base-600', className)} />
}
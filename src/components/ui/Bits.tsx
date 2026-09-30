import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn, iniciais } from '@/lib/utils'
import { CATEGORIES, type GroupCategory } from '@/types'

export function Avatar({
  nome,
  url,
  tamanho = 40,
  anel = false,
  className,
}: {
  nome: string
  url?: string
  tamanho?: number
  anel?: boolean
  className?: string
}) {
  const estilo: React.CSSProperties = {
    width: tamanho,
    height: tamanho,
    fontSize: Math.max(10, Math.round(tamanho * 0.36)),
  }

  if (url) {
    return (
      <img
        src={url}
        alt={nome}
        loading="lazy"
        decoding="async"
        style={estilo}
        className={cn('shrink-0 rounded-full border border-base-600 object-cover', anel && 'ring-2 ring-neon/70', className)}
      />
    )
  }

  return (
    <span
      aria-hidden
      style={estilo}
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-support font-bold uppercase text-neon',
        'border border-neon/30',
        anel && 'ring-2 ring-neon/70 ring-offset-2 ring-offset-base',
        className,
      )}
    >
      {iniciais(nome)}
    </span>
  )
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ativo?: boolean
  icone?: ReactNode
  total?: number
}

export function Chip({ ativo, icone, total, className, children, ...resto }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
        'active:scale-[0.97]',
        ativo
          ? 'border-neon bg-neon/15 text-neon shadow-neon-sm'
          : 'border-base-600 bg-base-800/60 text-neutral-300 hover:border-neon/40 hover:text-neutral-100',
        className,
      )}
      aria-pressed={ativo}
      {...resto}
    >
      {icone}
      {children}
      {typeof total === 'number' ? (
        <span className={cn('rounded-full px-1.5 text-[10px]', ativo ? 'bg-neon/20' : 'bg-base-700')}>{total}</span>
      ) : null}
    </button>
  )
}

export function CategoriaBadge({ categoria, tamanho = 'sm' }: { categoria: GroupCategory; tamanho?: 'sm' | 'md' }) {
  const meta = CATEGORIES.find((c) => c.value === categoria) ?? CATEGORIES[CATEGORIES.length - 1]!
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        tamanho === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      )}
      style={{ backgroundColor: `${meta.cor}1f`, color: meta.cor }}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  )
}

export function StatPill({ icone, valor, rotulo }: { icone: ReactNode; valor: ReactNode; rotulo: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
      {icone}
      <span className="font-semibold text-neutral-200">{valor}</span>
      <span className="sr-only">{rotulo}</span>
    </span>
  )
}

export function ProgresoBar({
  valor,
  maximo = 100,
  className,
  rotulo,
}: {
  valor: number
  maximo?: number
  className?: string
  rotulo?: string
}) {
  const pct = Math.min(100, Math.max(0, Math.round((valor / Math.max(1, maximo)) * 100)))
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-base-700', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rotulo}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-neon-deep to-neon transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function IconTile({ children, className }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon/25 bg-neon/10 text-neon',
        className,
      )}
    >
      {children}
    </span>
  )
}
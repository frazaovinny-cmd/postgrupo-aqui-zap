import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SearchX } from 'lucide-react'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} aria-hidden />
}

export function SkeletonCard() {
  return (
    <div className="pgz-surface overflow-hidden rounded-2xl border">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/5" />
        </div>
      </div>
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ quantidade = 6 }: { quantidade?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Carregando grupos"
    >
      {Array.from({ length: quantidade }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
      <span className="sr-only">Carregando conteudo…</span>
    </div>
  )
}

interface EmptyStateProps {
  titulo: string
  descricao: string
  icone?: ReactNode
  acao?: ReactNode
  className?: string
}

export function EmptyState({ titulo, descricao, icone, acao, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'pgz-surface flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-neon/10 text-neon">
        {icone ?? <SearchX className="h-7 w-7" aria-hidden />}
      </div>
      <h3 className="text-base font-bold text-neutral-100">{titulo}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-neutral-400">{descricao}</p>
      {acao ? <div className="mt-5">{acao}</div> : null}
    </div>
  )
}

interface ErrorStateProps {
  titulo?: string
  descricao?: string
  aoTentarNovamente?: () => void
}

export function ErrorState({
  titulo = 'Algo deu errado',
  descricao = 'Nao conseguimos carregar os dados agora. Tente novamente em instantes.',
  aoTentarNovamente,
}: ErrorStateProps) {
  return (
    <div className="pgz-surface flex flex-col items-center justify-center rounded-2xl border border-red-500/25 px-6 py-14 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 text-red-400">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 8v5M12 17h.01" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-neutral-100">{titulo}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-neutral-400">{descricao}</p>
      {aoTentarNovamente ? (
        <button
          type="button"
          onClick={aoTentarNovamente}
          className="mt-5 rounded-xl border border-neon/45 px-5 py-2.5 text-sm font-semibold text-neon transition hover:bg-neon/10"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
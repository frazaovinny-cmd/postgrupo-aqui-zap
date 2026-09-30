import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variante = 'primario' | 'secundario' | 'contorno' | 'fantasma' | 'perigo'
type Tamanho = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamanho?: Tamanho
  carregando?: boolean
  tamanhoIcone?: boolean
  cheio?: boolean
}

const VARIANTES: Record<Variante, string> = {
  primario:
    'bg-primary text-neon border-primary hover:bg-primary-500 hover:shadow-neon-sm disabled:hover:bg-primary',
  secundario:
    'bg-support text-neutral-100 border-support-500 hover:bg-support-400 hover:border-neon/40',
  contorno: 'bg-transparent text-neon border-neon/45 hover:bg-neon/10 hover:border-neon',
  fantasma: 'bg-transparent text-neutral-300 border-transparent hover:bg-base-700 hover:text-neon',
  perigo: 'bg-red-600/90 text-white border-red-500 hover:bg-red-500',
}

const TAMANHOS: Record<Tamanho, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-2xl py-3.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variante = 'primario',
    tamanho = 'md',
    carregando = false,
    tamanhoIcone = false,
    cheio = false,
    className,
    children,
    disabled,
    type = 'button',
    ...resto
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center border font-semibold tracking-tight',
        'transition-all duration-200 active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-55',
        VARIANTES[variante],
        TAMANHOS[tamanho],
        tamanhoIcone && 'h-11 w-11 p-0',
        cheio && 'w-full',
        className,
      )}
      {...resto}
    >
      {carregando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
})
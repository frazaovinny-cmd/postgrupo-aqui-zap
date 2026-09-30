import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CampoBase {
  label?: string
  erro?: string
  dica?: string
  obrigatorio?: boolean
  icone?: ReactNode
  className?: string
}

export interface InputProps extends CampoBase, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  containerClassName?: string
}

const base =
  'w-full rounded-xl border bg-base-800/70 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 transition-colors duration-200 focus:border-neon/60 focus:bg-base-800 focus:outline-none focus:ring-2 focus:ring-neon/25 disabled:cursor-not-allowed disabled:opacity-60 html.light:bg-white html.light:text-neutral-900'

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, erro, dica, obrigatorio, icone, className, containerClassName, id, ...resto },
  ref,
) {
  const gerado = useId()
  const campoId = id ?? gerado

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label htmlFor={campoId} className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-neutral-300">
          {label}
          {obrigatorio ? <span className="text-neon">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {icone ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            {icone}
          </span>
        ) : null}
        <input
          ref={ref}
          id={campoId}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${campoId}-erro` : dica ? `${campoId}-dica` : undefined}
          className={cn(
            base,
            'h-11',
            icone && 'pl-11',
            erro && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/25',
            className,
          )}
          {...resto}
        />
      </div>

      {erro ? (
        <p id={`${campoId}-erro`} className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          {erro}
        </p>
      ) : dica ? (
        <p id={`${campoId}-dica`} className="mt-1.5 text-xs text-neutral-500">
          {dica}
        </p>
      ) : null}
    </div>
  )
})

export interface TextareaProps extends CampoBase, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, erro, dica, obrigatorio, className, containerClassName, id, rows = 4, ...resto },
  ref,
) {
  const gerado = useId()
  const campoId = id ?? gerado

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label htmlFor={campoId} className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-neutral-300">
          {label}
          {obrigatorio ? <span className="text-neon">*</span> : null}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={campoId}
        rows={rows}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${campoId}-erro` : dica ? `${campoId}-dica` : undefined}
        className={cn(
          base,
          'resize-y py-3 leading-relaxed',
          erro && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/25',
          className,
        )}
        {...resto}
      />

      {erro ? (
        <p id={`${campoId}-erro`} className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          {erro}
        </p>
      ) : dica ? (
        <p id={`${campoId}-dica`} className="mt-1.5 text-xs text-neutral-500">
          {dica}
        </p>
      ) : null}
    </div>
  )
})
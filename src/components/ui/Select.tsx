import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size'> {
  label?: string
  erro?: string
  opcoes: Array<{ value: string; label: string }>
  placeholder?: string
  containerClassName?: string
  className?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, erro, opcoes, placeholder, containerClassName, className, id, ...resto },
  ref,
) {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? <span className="mb-1.5 block text-xs font-semibold text-neutral-300">{label}</span> : null}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-base-600 bg-base-800/70 pl-4 pr-10 text-sm text-neutral-100',
            'transition-colors focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/25',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'html.light:bg-white html.light:text-neutral-900',
            erro && 'border-red-500/70',
            className,
          )}
          {...resto}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {opcoes.map((opcao) => (
            <option key={opcao.value} value={opcao.value} className="bg-base-700 text-neutral-100">
              {opcao.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          aria-hidden
        />
      </div>
      {erro ? <p className="mt-1.5 text-xs text-red-400">{erro}</p> : null}
    </div>
  )
})
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  aberto: boolean
  aoFechar: () => void
  titulo?: string
  descricao?: string
  children: ReactNode
  tamanho?: 'sm' | 'md' | 'lg'
  rodape?: ReactNode
}

const TAMANHOS = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ aberto, aoFechar, titulo, descricao, children, tamanho = 'md', rodape }: ModalProps) {
  const caixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
    }

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', aoTeclar)
    caixa.current?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto, aoFechar])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {aberto ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={aoFechar}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden
          />

          <motion.div
            key="modal"
            ref={caixa}
            role="dialog"
            aria-modal="true"
            aria-label={titulo ?? 'Janela'}
            tabIndex={-1}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={cn(
              'pgz-surface relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border shadow-lift sm:rounded-3xl',
              TAMANHOS[tamanho],
            )}
          >
            {titulo ? (
              <div className="flex items-start justify-between gap-4 border-b border-base-600 p-5">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-neutral-100">{titulo}</h2>
                  {descricao ? <p className="mt-1 text-sm text-neutral-400">{descricao}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={aoFechar}
                  className="-m-1.5 rounded-xl p-1.5 text-neutral-400 transition hover:bg-base-700 hover:text-neon"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>

            {rodape ? (
              <div className="flex flex-wrap justify-end gap-2 border-t border-base-600 p-4">{rodape}</div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
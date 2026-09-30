import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { uid } from '@/lib/utils'
import type { ToastMessage } from '@/types'

type Tipo = ToastMessage['tipo']

interface ToastContextValue {
  toasts: ToastMessage[]
  sucesso: (titulo: string, descricao?: string) => void
  erro: (titulo: string, descricao?: string) => void
  info: (titulo: string, descricao?: string) => void
  aviso: (titulo: string, descricao?: string) => void
  remover: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DURACAO = 4200

const ESTILO: Record<Tipo, { icone: typeof Info; cor: string }> = {
  sucesso: { icone: CheckCircle2, cor: 'text-neon' },
  erro: { icone: XCircle, cor: 'text-red-400' },
  aviso: { icone: AlertTriangle, cor: 'text-amber-400' },
  info: { icone: Info, cor: 'text-sky-400' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const remover = useCallback((id: string) => {
    setToasts((lista) => lista.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const adicionar = useCallback(
    (tipo: Tipo, titulo: string, descricao?: string) => {
      const id = uid('tst')
      setToasts((lista) => [...lista.slice(-3), { id, tipo, titulo, ...(descricao ? { descricao } : {}) }])
      const timer = setTimeout(() => remover(id), DURACAO)
      timers.current.set(id, timer)
    },
    [remover],
  )

  useEffect(() => {
    const mapa = timers.current
    return () => {
      mapa.forEach((timer) => clearTimeout(timer))
      mapa.clear()
    }
  }, [])

  const valor = useMemo<ToastContextValue>(
    () => ({
      toasts,
      remover,
      sucesso: (t, d) => adicionar('sucesso', t, d),
      erro: (t, d) => adicionar('erro', t, d),
      info: (t, d) => adicionar('info', t, d),
      aviso: (t, d) => adicionar('aviso', t, d),
    }),
    [toasts, adicionar, remover],
  )

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const { icone: Icone, cor } = ESTILO[toast.tipo]
          return (
            <div
              key={toast.id}
              className="pgz-surface pointer-events-auto flex w-full max-w-sm animate-scale-in items-start gap-3 rounded-2xl border p-3.5 shadow-lift"
            >
              <Icone className={`mt-0.5 h-5 w-5 shrink-0 ${cor}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.titulo}</p>
                {toast.descricao ? (
                  <p className="mt-0.5 break-words text-xs text-neutral-400">{toast.descricao}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remover(toast.id)}
                className="-m-1 rounded-lg p-1 text-neutral-500 transition hover:text-neutral-200"
                aria-label="Fechar aviso"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>')
  return ctx
}
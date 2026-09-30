import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Home, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  aoReiniciar?: () => void
}

interface Estado {
  erro: Error | null
}

export class ErrorBoundary extends Component<Props, Estado> {
  override state: Estado = { erro: null }

  static getDerivedStateFromError(erro: Error): Estado {
    return { erro }
  }

  override componentDidCatch(erro: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', erro, info.componentStack)
  }

  private readonly reiniciar = (): void => {
    this.setState({ erro: null })
    this.props.aoReiniciar?.()
  }

  override render(): ReactNode {
    const { erro } = this.state
    if (!erro) return this.props.children

    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="pgz-surface w-full max-w-md rounded-3xl border p-8 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 text-3xl">
            <span aria-hidden>😵</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">Quebrou algo por aqui</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Encontramos um erro inesperado ao carregar esta pagina. Seus dados estao salvos — pode recarregar com
            seguranca.
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-xl bg-base-700 p-3 text-left text-[11px] text-red-300">
            {erro.message}
          </pre>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.reiniciar}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neon/45 bg-primary px-5 text-sm font-semibold text-neon transition hover:bg-primary-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Tentar novamente
            </button>
            <a
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-base-600 px-5 text-sm font-semibold text-neutral-300 transition hover:text-neon"
            >
              <Home className="h-4 w-4" aria-hidden />
              Ir para o inicio
            </a>
          </div>
        </div>
      </div>
    )
  }
}
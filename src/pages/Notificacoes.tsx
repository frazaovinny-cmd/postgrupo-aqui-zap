import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, BellOff, Check, CheckCheck, Heart, MessageSquare, Sparkles, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Primitives'
import { EmptyState } from '@/components/ui/States'
import type { NotificationKind } from '@/types'
import { cn, tempoRelativo } from '@/lib/utils'

const ICONES: Record<NotificationKind, { icone: typeof Bell; cor: string; fundo: string }> = {
  aprovacao: { icone: Check, cor: '#53e515', fundo: '#53e5151f' },
  rejeicao: { icone: BellOff, cor: '#f87171', fundo: '#f871711f' },
  curtida: { icone: Heart, cor: '#f472b6', fundo: '#f472b61f' },
  comentario: { icone: MessageSquare, cor: '#38bdf8', fundo: '#38bdf81f' },
  clique: { icone: Zap, cor: '#f59e0b', fundo: '#f59e0b1f' },
  pagamento: { icone: Sparkles, cor: '#a78bfa', fundo: '#a78bfa1f' },
  sistema: { icone: Bell, cor: '#94a3b8', fundo: '#94a3b81f' },
}

export default function Notificacoes() {
  useSeo({ titulo: 'Notificacoes', caminho: '/notificacoes', noindex: true })

  const { usuario, autenticado } = useAuth()
  const { notificacoesDoUsuario, marcarLida, marcarTodasLidas, naoLidas } = useData()

  const lista = useMemo(() => (usuario ? notificacoesDoUsuario(usuario.id) : []), [notificacoesDoUsuario, usuario])

  if (!autenticado || !usuario) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          titulo="Entre para ver suas notificacoes"
          descricao="Assim que voce entrar com sua conta Gmail, avisaremos sobre cliques, comentarios e aprovacoes aqui."
          icone={<Bell className="h-6 w-6" aria-hidden />}
          acao={
            <Link to="/entrar?destino=/notificacoes">
              <Button>Entrar com Gmail</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neon">Central de avisos</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Notificacoes</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {naoLidas > 0 ? `${naoLidas} nao ${naoLidas === 1 ? 'lida' : 'lidas'}` : 'Tudo em dia por aqui'}
          </p>
        </div>
        {naoLidas > 0 ? (
          <Button variante="contorno" tamanho="sm" onClick={() => marcarTodasLidas(usuario.id)}>
            <CheckCheck className="h-3.5 w-3.5" aria-hidden />
            Marcar todas como lidas
          </Button>
        ) : null}
      </header>

      {lista.length === 0 ? (
        <EmptyState
          titulo="Nenhuma notificacao por aqui"
          descricao="Quando seus grupos receberem cliques, comentarios ou aprovacoes, voce veria tudo nesta tela."
          icone={<BellOff className="h-6 w-6" aria-hidden />}
          acao={
            <Link to="/publicar">
              <Button>Publicar meu grupo</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {lista.map((notificacao) => (
            <li key={notificacao.id}>
              <Card
                padding="sm"
                className={cn(
                  'transition',
                  notificacao.lida ? 'opacity-70' : 'border-neon/25 bg-neon/[0.04]',
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                    style={{
                      backgroundColor: ICONES[notificacao.tipo].fundo,
                      color: ICONES[notificacao.tipo].cor,
                    }}
                  >
                    {(() => {
                      const Icone = ICONES[notificacao.tipo].icone
                      return <Icone className="h-5 w-5" aria-hidden />
                    })()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-neutral-100">{notificacao.titulo}</p>
                      {!notificacao.lida ? (
                        <span className="h-2 w-2 rounded-full bg-neon" aria-label="Nao lida" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">{notificacao.texto}</p>
                    <p className="mt-1 text-[10px] text-neutral-500">{tempoRelativo(notificacao.criadoEm)}</p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1.5">
                    {!notificacao.lida ? (
                      <Button
                        variante="fantasma"
                        tamanho="sm"
                        onClick={() => marcarLida(notificacao.id)}
                        aria-label="Marcar como lida"
                      >
                        <Check className="h-4 w-4" aria-hidden />
                      </Button>
                    ) : null}
                    {notificacao.link ? (
                      <Link
                        to={notificacao.link}
                        onClick={() => marcarLida(notificacao.id)}
                        className="rounded-lg px-2 py-1 text-[11px] font-semibold text-neon hover:underline"
                      >
                        Abrir
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
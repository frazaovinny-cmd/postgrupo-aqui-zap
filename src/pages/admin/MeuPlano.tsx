import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  CalendarClock,
  Check,
  Crown,
  Info,
  MessageSquare,
  Megaphone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ProgresoBar } from '@/components/ui/Bits'
import { PLAN } from '@/types'
import { cn, formatarData, formatarMoeda, mascaraCelularBR, somenteDigitos } from '@/lib/utils'

const RECURSOS = [
  { icone: MessageSquare, titulo: 'Grupos ilimitados', texto: 'Publique quantos grupos quiser na sua conta.' },
  { icone: Sparkles, titulo: 'Destaque automatico', texto: 'Seu grupo aparece primeiro nas buscas da cidade.' },
  { icone: Megaphone, titulo: 'Anuncios proprios', texto: 'Crie propagandas e acompanhe impressoes e cliques.' },
  { icone: BarChartFallback, titulo: 'Estatisticas', texto: 'Painel com cliques, membros e engajamento.' },
  { icone: BadgeCheck, titulo: 'Perfil verificado', texto: 'Selo de anunciante verificado no card.' },
  { icone: ShieldCheck, titulo: 'Suporte prioritario', texto: 'Atendimento direto pelo WhatsApp do Vinny.' },
]

function BarChartFallback(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden>
      <path d="M3 3v18h18M7 15l4-5 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MeuPlano() {
  useSeo({ titulo: 'Meu plano', caminho: '/admin/plano', noindex: true })

  const { usuario, ativarPlano } = useAuth()
  const { gruposDoDono, notificar } = useData()
  const { sucesso, erro } = useToast()

  const [modalAberto, setModalAberto] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix')
  const [telefone, setTelefone] = useState('')

  const meus = useMemo(() => (usuario ? gruposDoDono(usuario.id) : []), [gruposDoDono, usuario])


  const faltamDias = useMemo(() => {
    if (!usuario?.planoVenceEm) return 0
    const restante = new Date(usuario.planoVenceEm).getTime() - Date.now()
    return Math.max(0, Math.ceil(restante / 86_400_000))
  }, [usuario])

  const confirmarPagamento = async (): Promise<void> => {
    if (!usuario) return
    if (metodo === 'cartao' && somenteDigitos(telefone).length < 10) {
      erro('Telefone incompleto', 'Informe DDD + numero para gerar o link de pagamento.')
      return
    }

    setProcessando(true)
    await new Promise((r) => setTimeout(r, 900))
    ativarPlano()
    notificar(
      usuario.id,
      'pagamento',
      'Pagamento confirmado!',
      `Seu plano Admin de R$ ${PLAN.precoMensal}/mes esta ativo por 30 dias.`,
      '/admin/plano',
    )
    setProcessando(false)
    setModalAberto(false)
    sucesso('Plano ativado!', 'Seus grupos agora aparecem em destaque.')
  }

  if (!usuario) return null

  const vencendo = usuario.planoAtivo && faltamDias <= 7

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Assinatura</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Meu plano</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Cada administrador tem seu proprio plano e seu proprio painel.
        </p>
      </header>

      {vencendo ? (
        <Card padding="md" className="border-amber-400/35 bg-amber-500/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
              <div>
                <p className="text-sm font-bold text-neutral-100">
                  Seu plano vence em {faltamDias} {faltamDias === 1 ? 'dia' : 'dias'}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  Renove agora para nao perder o destaque dos seus grupos.
                </p>
              </div>
            </div>
            <Button tamanho="sm" onClick={() => setModalAberto(true)}>
              Renovar agora
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card padding="md">
            <SectionTitle
              titulo="O que vem no plano Admin"
              subtitulo={`R$ ${PLAN.precoMensal} por mes, por administrador`}
              icone={<Crown className="h-5 w-5 text-amber-300" aria-hidden />}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {RECURSOS.map((recurso) => (
                <div key={recurso.titulo} className="flex items-start gap-3 rounded-xl border border-base-600 p-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon">
                    <recurso.icone className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-100">{recurso.titulo}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">{recurso.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <SectionTitle
              titulo="Situacao atual"
              icone={<Receipt className="h-5 w-5 text-neon" aria-hidden />}
            />
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-neutral-400">Status</dt>
                <dd>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                      usuario.planoAtivo ? 'bg-neon/15 text-neon' : 'bg-amber-500/15 text-amber-300',
                    )}
                  >
                    {usuario.planoStatus}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-400">Grupos publicados</dt>
                <dd className="font-semibold text-neutral-100">
                  {meus.length} {usuario.planoAtivo ? '' : `/ ${PLAN.maxGruposGratis}`}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-400">Valor mensal</dt>
                <dd className="font-semibold text-neutral-100">{formatarMoeda(PLAN.precoMensal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-400">Proxima cobranca</dt>
                <dd className="font-semibold text-neutral-100">
                  {usuario.planoVenceEm ? formatarData(usuario.planoVenceEm) : '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-400">Conta responsavel</dt>
                <dd className="max-w-[220px] truncate font-semibold text-neutral-100">{usuario.email}</dd>
              </div>
            </dl>

            {!usuario.planoAtivo && meus.length > 0 ? (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Uso do plano gratuito</span>
                  <span className="font-bold text-amber-300">
                    {meus.length}/{PLAN.maxGruposGratis}
                  </span>
                </div>
                <ProgresoBar valor={meus.length} maximo={PLAN.maxGruposGratis} className="mt-1.5" rotulo="Uso do plano gratuito" />
              </div>
            ) : null}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card padding="lg" className="relative overflow-hidden border-neon/30 bg-gradient-to-b from-primary/70 to-base-800">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon/10 blur-2xl" aria-hidden />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-neon">
              <Crown className="h-3 w-3" aria-hidden />
              Plano Admin
            </span>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-neon">{formatarMoeda(PLAN.precoMensal)}</span>
              <span className="text-sm text-neutral-400">/mes</span>
            </p>
            <p className="mt-1.5 text-xs text-neutral-400">por administrador, sem taxa de adesao.</p>

            <ul className="mt-5 space-y-2">
              {['Grupos ilimitados', 'Destaque na cidade', 'Anuncios com medicao', 'Painel individual'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-neutral-200">
                  <Check className="h-3.5 w-3.5 shrink-0 text-neon" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              cheio
              tamanho="lg"
              className="mt-6"
              onClick={() => setModalAberto(true)}
              carregando={processando}
            >
              {usuario.planoAtivo ? 'Renovar plano' : 'Ativar plano agora'}
            </Button>
            <p className="mt-2.5 text-center text-[10px] text-neutral-500">
              Cancele quando quiser, sem multa.
            </p>
          </Card>

          <Card padding="sm" className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden />
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Precisa de grupos em varias cidades? Cada administrador tem o proprio plano — chame no WhatsApp
              (61) 99887-5920.
            </p>
          </Card>

          <Card padding="sm" className="flex items-start gap-2.5">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Sem plano voce pode publicar ate {PLAN.maxGruposGratis} grupos usando sua conta Gmail.
            </p>
          </Card>
        </aside>
      </div>

      <Card padding="md" className="text-center">
        <p className="text-xs text-neutral-400">
          Ainda nao tem conta de administrador?{' '}
          <Link to="/entrar?destino=/admin/plano" className="text-neon hover:underline">
            Entre com seu Gmail
          </Link>
        </p>
      </Card>

      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo={usuario.planoAtivo ? 'Renovar plano' : 'Ativar plano Admin'}
        descricao={`Cobranca unica de ${formatarMoeda(PLAN.precoMensal)} com validade de 30 dias.`}
        rodape={
          <>
            <Button variante="fantasma" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void confirmarPagamento()} carregando={processando}>
              Confirmar pagamento
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-base-600 p-4">
            <p className="text-xs text-neutral-400">Total a pagar</p>
            <p className="mt-1 text-2xl font-extrabold text-neon">{formatarMoeda(PLAN.precoMensal)}</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">Renovacao automatica em 30 dias. Cancele quando quiser.</p>
          </div>

          <div className="space-y-2">
            {([
              { valor: 'pix', rotulo: 'Pix', descricao: 'Aprovacao em segundos' },
              { valor: 'cartao', rotulo: 'Cartao de credito', descricao: 'Visa, Master, Elo' },
            ] as const).map((opcao) => (
              <label
                key={opcao.valor}
                className={cn(
                  'flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 transition',
                  metodo === opcao.valor ? 'border-neon/50 bg-neon/10' : 'border-base-600 hover:border-neon/30',
                )}
              >
                <input
                  type="radio"
                  name="metodo"
                  checked={metodo === opcao.valor}
                  onChange={() => setMetodo(opcao.valor)}
                  className="h-4 w-4 accent-[#53e515]"
                />
                <span>
                  <span className="block text-sm font-semibold text-neutral-100">{opcao.rotulo}</span>
                  <span className="block text-[11px] text-neutral-400">{opcao.descricao}</span>
                </span>
              </label>
            ))}
          </div>

          {metodo === 'cartao' ? (
            <Input
              label="Telefone para o link de pagamento"
              value={telefone}
              onChange={(e) => setTelefone(mascaraCelularBR(e.target.value))}
              placeholder="(61) 99887-5920"
              inputMode="numeric"
              dica="Enviamos o link seguro de pagamento para este numero."
            />
          ) : null}

          <p className="flex items-start gap-2 rounded-xl border border-base-600 bg-base-800/50 p-3 text-[11px] leading-relaxed text-neutral-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden />
            Esta e uma demonstracao: nenhum dado de cartao e coletado e a ativacao e imediata. Em producao, este passo e
            integrado a um gateway de pagamento.
          </p>

          <p className="text-center text-[10px] text-neutral-500">
            Ao confirmar voce aceita os{' '}
            <Link to="/termos" className="text-neon hover:underline">
              termos de uso
            </Link>
            .
          </p>
        </div>
      </Modal>
    </div>
  )
}
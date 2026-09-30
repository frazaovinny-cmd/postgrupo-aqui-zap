import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Info, LogIn, Mail, ShieldCheck, Sparkles, UserPlus, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { useData } from '@/context/DataContext'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Bits'
import { Card } from '@/components/ui/Primitives'
import { Logo } from '@/components/layout/Layout'
import { CONTAS_DEMO, googleConfigurado, obterTokenGoogle, type PerfilGoogle } from '@/lib/googleAuth'
import { cn, mascaraCelularBR } from '@/lib/utils'
import { PLAN } from '@/types'

export default function Entrar() {
  useSeo({
    titulo: 'Entrar com Gmail',
    descricao: 'Entre com sua conta Gmail para publicar grupos e acessar seu painel de administrador.',
    caminho: '/entrar',
    noindex: true,
  })

  const navegar = useNavigate()
  const [params] = useSearchParams()
  const { entrarComo, autenticado, carregando: carregandoAuth } = useAuth()
  const { notificar } = useData()
  const { sucesso } = useToast()

  const [carregando, setCarregando] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<PerfilGoogle>(CONTAS_DEMO[0] as PerfilGoogle)
  const [formAberto, setFormAberto] = useState(false)
  const destino = params.get('destino') ?? '/admin'

  const temGoogle = useMemo(() => googleConfigurado(), [])

  // Carrega o Google Identity Services e desenha o botao oficial quando o
  // VITE_GOOGLE_CLIENT_ID esta configurado.
  useEffect(() => {
    if (!temGoogle) return
    void obterTokenGoogle()
  }, [temGoogle])

  useEffect(() => {
    if (!carregandoAuth && autenticado) navegar(destino, { replace: true })
  }, [autenticado, carregandoAuth, destino, navegar])

  const finalizar = (perfil: PerfilGoogle): void => {
    setCarregando(perfil.email)
    window.setTimeout(() => {
      const usuario = entrarComo(perfil)
      notificar(
        usuario.id,
        'sistema',
        'Bem-vindo de volta!',
        `Sua sessao foi iniciada com ${usuario.email}.`,
        '/admin',
      )
      sucesso('Login realizado', `Ola, ${usuario.nome.split(' ')[0]}!`)
      navegar(destino, { replace: true })
    }, 650)
  }

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 rounded-full bg-neon/10 blur-3xl" aria-hidden />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="hidden flex-col justify-center lg:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Area do administrador
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight">
            Cada admin tem o <span className="gradient-text">seu proprio painel</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
            Entre com sua conta Gmail para publicar seus grupos de WhatsApp, adicionar seus anuncios e acompanhar
            cliques em tempo real. Cada administrador enxerga apenas os grupos e anuncios dele.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              'Painel individual por administrador',
              'Publicacao ilimitada de grupos',
              'Anuncios próprios com medicao de cliques',
              `Plano a partir de R$ ${PLAN.precoMensal}/mes`,
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-neon/15 text-neon">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pgz-surface rounded-3xl border p-6 shadow-lift sm:p-7"
        >
          <div className="lg:hidden">
            <Logo />
          </div>

          <h2 className="mt-5 text-xl font-extrabold tracking-tight text-neutral-100 lg:mt-0">Entrar</h2>
          <p className="mt-1.5 text-sm text-neutral-400">Use sua conta Gmail para acessar o painel.</p>

          <div id="google-signin-helper" className="mt-5 flex justify-center" />

          {temGoogle ? (
            <p className="mt-2.5 text-center text-[10px] leading-relaxed text-neutral-500">
              Use o botao oficial do Google acima. Sua senha nunca e solicitada.
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => finalizar(CONTAS_DEMO[0] as PerfilGoogle)}
                disabled={carregando !== null}
                className="mt-1 flex min-h-[48px] w-full items-center justify-center gap-3 rounded-xl border border-base-600 bg-white px-4 text-sm font-bold text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
                  <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
                  <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
                </svg>
                Continuar como Vinny (demo)
              </button>

              <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />
                <p className="text-[10px] leading-relaxed text-amber-200/80">
                  Ambiente de demonstracao. O login real com Google e ativado ao definir{' '}
                  <code className="rounded bg-black/30 px-1 py-0.5">VITE_GOOGLE_CLIENT_ID</code> no arquivo{' '}
                  <code className="rounded bg-black/30 px-1 py-0.5">.env</code>.
                </p>
              </div>
            </>
          )}

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-base-600" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
              {temGoogle ? 'ou escolha uma conta' : 'ou entre com uma conta de teste'}
            </span>
            <span className="h-px flex-1 bg-base-600" aria-hidden />
          </div>

          <ul className="space-y-2">
            {CONTAS_DEMO.map((conta) => {
              const ativo = selecionado.googleId === conta.googleId
              return (
                <li key={conta.googleId}>
                  <button
                    type="button"
                    onClick={() => setSelecionado(conta)}
                    className={cn(
                      'flex min-h-[60px] w-full items-center gap-3 rounded-xl border px-3.5 text-left transition',
                      ativo ? 'border-neon/55 bg-neon/10' : 'border-base-600 hover:border-neon/30',
                    )}
                    aria-pressed={ativo}
                  >
                    <Avatar nome={conta.nome} url={conta.foto} tamanho={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-neutral-100">{conta.nome}</span>
                      <span className="block truncate text-[11px] text-neutral-500">{conta.email}</span>
                    </span>
                    {conta.perfil?.planoAtivo ? (
                      <span className="rounded-full bg-neon/15 px-2 py-0.5 text-[9px] font-bold uppercase text-neon">
                        plano ativo
                      </span>
                    ) : (
                      <span className="rounded-full bg-base-700 px-2 py-0.5 text-[9px] font-bold uppercase text-neutral-500">
                        sem plano
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          <Button
            cheio
            tamanho="lg"
            className="mt-4"
            carregando={carregando !== null}
            onClick={() => finalizar(selecionado)}
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Entrar como {selecionado.nome.split(' ')[0]}
          </Button>

          {!formAberto ? (
            <button
              type="button"
              onClick={() => setFormAberto(true)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400 transition hover:text-neon"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Entrar com outra conta (Gmail)
            </button>
          ) : (
            <FormularioConta
              aoCancelar={() => setFormAberto(false)}
              aoEntrar={(perfil) => {
                setFormAberto(false)
                finalizar(perfil)
              }}
            />
          )}

          <div className="mt-6 flex items-start gap-2 rounded-xl border border-base-600 bg-base-800/50 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Nunca pedimos sua senha. O acesso usa apenas o login social do Google e seus dados ficam visiveis apenas
              para voce.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-neutral-500">
            Voce concorda com os{' '}
            <Link to="/termos" className="text-neon hover:underline">
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link to="/privacidade" className="text-neon hover:underline">
              Politica de Privacidade
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function FormularioConta({
  aoEntrar,
  aoCancelar,
}: {
  aoEntrar: (perfil: PerfilGoogle) => void
  aoCancelar: () => void
}) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cidade, setCidade] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  const validar = (): boolean => {
    if (nome.trim().length < 3) {
      setErro('Informe seu nome completo.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErro('Informe um e-mail valido.')
      return false
    }
    if (!/@gmail\.com$/i.test(email.trim())) {
      setErro('Use uma conta Gmail (@gmail.com) para administrar seus grupos.')
      return false
    }
    setErro(null)
    return true
  }

  return (
    <Card padding="sm" className="mt-3 animate-fade-in">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-400">
        Nova conta de administrador (local)
      </p>
      <div className="space-y-2.5">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          aria-label="Nome completo"
          className="h-11 w-full rounded-xl border border-base-600 bg-base-800/70 px-3.5 text-sm focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/25"
        />
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@gmail.com"
            aria-label="E-mail Gmail"
            className="h-11 w-full rounded-xl border border-base-600 bg-base-800/70 pl-11 pr-3.5 text-sm focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/25"
          />
        </div>
        <input
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Sua cidade"
          aria-label="Cidade"
          className="h-11 w-full rounded-xl border border-base-600 bg-base-800/70 px-3.5 text-sm focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/25"
        />
        <input
          value={telefone}
          onChange={(e) => setTelefone(mascaraCelularBR(e.target.value))}
          placeholder="WhatsApp (opcional)"
          aria-label="Telefone"
          inputMode="numeric"
          className="h-11 w-full rounded-xl border border-base-600 bg-base-800/70 px-3.5 text-sm focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/25"
        />
      </div>

      {erro ? <p className="mt-2 text-xs text-red-400">{erro}</p> : null}

      <div className="mt-3 flex gap-2">
        <Button
          tamanho="sm"
          className="flex-1"
          onClick={() => {
            if (!validar()) return
            aoEntrar({
              googleId: `manual-${email.toLowerCase().trim()}`,
              nome: nome.trim(),
              email: email.trim().toLowerCase(),
              foto: '',
              perfil: {
                cidade: cidade.trim(),
                telefone: telefone.replace(/\D/g, ''),
                bio: '',
                role: 'admin',
                planoAtivo: false,
              },
            } as PerfilGoogle)
          }}
        >
          <Zap className="h-3.5 w-3.5" aria-hidden />
          Criar conta e entrar
        </Button>
        <Button tamanho="sm" variante="fantasma" onClick={aoCancelar}>
          Cancelar
        </Button>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-neutral-500">
        Conta criada apenas neste navegador (sem verificacao de e-mail). Ative o plano em “Meu plano” para publicar em
        destaque.
        <button type="button" onClick={aoCancelar} className="ml-1 inline-flex items-center gap-0.5 text-neon hover:underline">
          saber mais <ArrowRight className="h-3 w-3" aria-hidden />
        </button>
      </p>
    </Card>
  )
}
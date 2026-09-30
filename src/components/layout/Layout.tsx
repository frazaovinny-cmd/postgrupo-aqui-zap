import { Link, NavLink } from 'react-router-dom'
import { Home, Compass, Bell, PlusSquare, User, Menu, X, Search, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useTheme } from '@/context/ThemeContext'
import { Avatar } from '@/components/ui/Bits'
import { cn } from '@/lib/utils'

const LINKS = [
  { para: '/', rotulo: 'Inicio', icone: Home, exato: true },
  { para: '/buscar', rotulo: 'Explorar', icone: Compass, exato: false },
  { para: '/publicar', rotulo: 'Publicar grupo', icone: PlusSquare, exato: false, requerAuth: true },
  { para: '/notificacoes', rotulo: 'Notificacoes', icone: Bell, exato: false, requerAuth: true },
]

export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="PostGrupo Aqui Zap — pagina inicial">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-neon/40 bg-primary text-neon transition group-hover:shadow-neon-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm5.3 13.9c-.22.62-1.3 1.2-1.8 1.25-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.9-4.64-4.09-.13-.19-1.1-1.47-1.1-2.8s.7-1.98.95-2.25c.25-.27.54-.34.73-.34h.52c.17 0 .4-.06.62.48.22.55.77 1.9.84 2.04.07.14.12.3.02.49-.1.19-.15.3-.29.47-.14.16-.3.36-.43.49-.14.14-.29.29-.12.57.17.27.74 1.22 1.59 1.98 1.1.98 2.02 1.28 2.3 1.43.28.14.45.12.61-.07.17-.19.7-.82.88-1.1.19-.28.37-.23.62-.14.25.09 1.63.77 1.9.91.28.14.46.21.53.33.07.11.07.64-.15 1.26Z" />
        </svg>
      </span>
      {!compacto ? (
        <span className="text-sm font-extrabold leading-tight tracking-tight text-neon">
          PostGrupo <span className="text-neutral-100">Aqui Zap</span>
        </span>
      ) : null}
    </Link>
  )
}

function BotaoTema() {
  const { tema, alternarTema } = useTheme()
  return (
    <button
      type="button"
      onClick={alternarTema}
      className="grid h-10 w-10 place-items-center rounded-xl border border-base-600 text-neutral-300 transition hover:border-neon/40 hover:text-neon"
      aria-label={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={tema === 'dark' ? 'Modo claro' : 'Modo escuro'}
    >
      {tema === 'dark' ? <Sun className="h-[18px] w-[18px]" aria-hidden /> : <Moon className="h-[18px] w-[18px]" aria-hidden />}
    </button>
  )
}

export function Header() {
  const { autenticado, usuario } = useAuth()
  const { naoLidas } = useData()
  const [menuAberto, setMenuAberto] = useState(false)
  const [termo, setTermo] = useState('')

  useEffect(() => {
    setMenuAberto(false)
  }, [termo])

  return (
    <header className="glass sticky top-0 z-50 border-b border-base-600">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:px-4 lg:px-6">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl text-neutral-300 transition hover:text-neon lg:hidden"
          onClick={() => setMenuAberto((v) => !v)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
        >
          {menuAberto ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>

        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navegacao principal">
          {LINKS.map(({ para, rotulo, icone: Icone, exato, requerAuth }) => {
            if (requerAuth && !autenticado) return null
            return (
              <NavLink
                key={para}
                to={para}
                end={exato}
                className={({ isActive }) =>
                  cn(
                    'relative flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition',
                    isActive ? 'text-neon' : 'text-neutral-300 hover:text-neutral-100',
                  )
                }
              >
                <Icone className="h-[18px] w-[18px]" aria-hidden />
                {rotulo}
                {para === '/notificacoes' && naoLidas > 0 ? (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {naoLidas > 9 ? '9+' : naoLidas}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const limpo = termo.trim()
            if (limpo) window.location.assign(`/buscar?q=${encodeURIComponent(limpo)}`)
          }}
          className="ml-auto hidden max-w-xs flex-1 md:block"
          role="search"
        >
          <label className="sr-only" htmlFor="busca-topo">
            Buscar grupos por cidade ou categoria
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden />
            <input
              id="busca-topo"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar grupo, cidade ou categoria…"
              className="h-10 w-full rounded-xl border border-base-600 bg-base-800/70 pl-10 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/25"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            to="/buscar"
            className="grid h-10 w-10 place-items-center rounded-xl border border-base-600 text-neutral-300 transition hover:border-neon/40 hover:text-neon md:hidden"
            aria-label="Buscar"
          >
            <Search className="h-[18px] w-[18px]" aria-hidden />
          </Link>

          <BotaoTema />

          {autenticado ? (
            <Link
              to="/perfil"
              className="flex h-10 items-center gap-2 rounded-xl border border-base-600 pl-1 pr-2 transition hover:border-neon/40"
              aria-label="Abrir meu perfil"
            >
              <Avatar nome={usuario?.nome ?? '?'} url={usuario?.foto} tamanho={32} />
              <span className="hidden max-w-24 truncate text-xs font-semibold text-neutral-200 sm:block">
                {usuario?.nome.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/entrar"
              className="flex h-10 items-center rounded-xl border border-neon/45 bg-primary px-4 text-xs font-bold text-neon transition hover:bg-primary-500"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {menuAberto ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-base-600 bg-base-800/95 lg:hidden"
            aria-label="Navegacao mobile"
          >
            <ul className="mx-auto max-w-7xl px-3 py-2">
              {LINKS.map(({ para, rotulo, icone: Icone, exato, requerAuth }) => {
                if (requerAuth && !autenticado) return null
                return (
                  <li key={para}>
                    <NavLink
                      to={para}
                      end={exato}
                      onClick={() => setMenuAberto(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                          isActive ? 'bg-neon/10 text-neon' : 'text-neutral-300',
                        )
                      }
                    >
                      <Icone className="h-5 w-5" aria-hidden />
                      {rotulo}
                      {para === '/notificacoes' && naoLidas > 0 ? (
                        <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {naoLidas}
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                )
              })}
              <li>
                <NavLink
                  to="/favoritos"
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                      isActive ? 'bg-neon/10 text-neon' : 'text-neutral-300',
                    )
                  }
                >
                  <Bell className="h-5 w-5" aria-hidden />
                  Meus salvos
                </NavLink>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export function MobileTabBar() {
  const { autenticado, usuario } = useAuth()
  const { naoLidas } = useData()

  const abas = [
    { para: '/', rotulo: 'Inicio', icone: Home, exato: true },
    { para: '/buscar', rotulo: 'Explorar', icone: Compass, exato: false },
    ...(autenticado
      ? [{ para: '/publicar', rotulo: 'Publicar', icone: PlusSquare, exato: false }]
      : []),
    {
      para: autenticado ? '/perfil' : '/entrar',
      rotulo: autenticado ? 'Perfil' : 'Entrar',
      icone: User,
      exato: false,
      avatar: autenticado ? usuario?.nome : undefined,
      foto: autenticado ? usuario?.foto : undefined,
    },
  ]

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-50 border-t border-base-600 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navegacao inferior"
    >
      <ul className="flex items-stretch justify-around">
        {abas.map(({ para, rotulo, icone: Icone, exato, avatar, foto }) => (
          <li key={para} className="flex-1">
            <NavLink
              to={para}
              end={exato}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition',
                  isActive ? 'text-neon' : 'text-neutral-400',
                )
              }
            >
              {avatar !== undefined ? (
                <Avatar nome={avatar} url={foto} tamanho={24} anel={false} />
              ) : (
                <span className="relative">
                  <Icone className="h-6 w-6" aria-hidden />
                  {para === '/publicar' ? (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-neon" />
                  ) : null}
                </span>
              )}
              {rotulo}
            </NavLink>
          </li>
        ))}

        <li className="flex-1">
          <NavLink
            to={autenticado ? '/notificacoes' : '/entrar'}
            className={({ isActive }) =>
              cn(
                'relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition',
                isActive ? 'text-neon' : 'text-neutral-400',
              )
            }
          >
            <Bell className="h-6 w-6" aria-hidden />
            Notificacoes
            {naoLidas > 0 ? (
              <span className="absolute right-3 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {naoLidas > 9 ? '9+' : naoLidas}
              </span>
            ) : null}
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export function Footer() {
  const ano = new Date().getFullYear()
  const colunas = [
    {
      titulo: 'Navegar',
      links: [
        { para: '/', rotulo: 'Inicio' },
        { para: '/buscar', rotulo: 'Explorar grupos' },
        { para: '/vagas', rotulo: 'Grupos de vagas' },
        { para: '/ofertas', rotulo: 'Ofertas do dia' },
      ],
    },
    {
      titulo: 'Cidades',
      links: [
        { para: '/buscar?estado=DF', rotulo: 'Brasilia' },
        { para: '/buscar?estado=SP', rotulo: 'Sao Paulo' },
        { para: '/buscar?estado=RJ', rotulo: 'Rio de Janeiro' },
        { para: '/buscar?estado=BH', rotulo: 'Belo Horizonte' },
      ],
    },
    {
      titulo: 'Anunciantes',
      links: [
        { para: '/publicar', rotulo: 'Publicar meu grupo' },
        { para: '/planos', rotulo: 'Plano Admin' },
        { para: '/anunciar', rotulo: 'Quero anunciar' },
        { para: '/entrar', rotulo: 'Entrar com Gmail' },
      ],
    },
    {
      titulo: 'Institucional',
      links: [
        { para: '/sobre', rotulo: 'Sobre o site' },
        { para: '/contato', rotulo: 'Contato' },
        { para: '/termos', rotulo: 'Termos de uso' },
        { para: '/privacidade', rotulo: 'Privacidade' },
      ],
    },
  ]

  return (
    <footer className="mt-16 border-t border-base-600 bg-base-800/40 pb-24 pt-12 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neon">{coluna.titulo}</h3>
              <ul className="mt-3 space-y-2">
                {coluna.links.map((link) => (
                  <li key={link.para}>
                    <Link to={link.para} className="link-underline text-sm text-neutral-400 hover:text-neutral-100">
                      {link.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-base-600 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {ano} PostGrupo Aqui Zap. Todos os grupos pertencem aos seus respectivos administradores.
          </p>
          <p className="text-xs text-neutral-500">
            Feito com{' '}
            <a
              href="https://wa.me/5561998875920"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neon hover:underline"
            >
              Vinny (61) 99887-5920
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  ChevronRight,
  Crown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Avatar, ProgresoBar } from '@/components/ui/Bits'
import { Button } from '@/components/ui/Button'
import { nivelPorPontos } from '@/lib/utils'
import { PLAN } from '@/types'
import { cn } from '@/lib/utils'

const MENU = [
  { para: '/admin', rotulo: 'Painel', icone: LayoutDashboard, exato: true },
  { para: '/admin/grupos', rotulo: 'Meus grupos', icone: MessageSquare, exato: false },
  { para: '/admin/anuncios', rotulo: 'Meus anuncios', icone: Megaphone, exato: false },
  { para: '/admin/analytics', rotulo: 'Estatisticas', icone: BarChart3, exato: false },
  { para: '/admin/plano', rotulo: 'Meu plano', icone: Crown, exato: false },
  { para: '/admin/configuracoes', rotulo: 'Configuracoes', icone: Settings, exato: false },
]

export default function AdminLayout() {
  const { usuario, sair } = useAuth()
  const { aviso } = useToast()
  const local = useLocation()

  if (!usuario) return null

  const { nivel, faltam, progresso } = nivelPorPontos(usuario.pontos)

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)]" aria-label="Menu do administrador">
        <div className="pgz-surface flex h-full flex-col rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Avatar nome={usuario.nome} url={usuario.foto} tamanho={48} anel />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-neutral-100">{usuario.nome}</p>
              <p className="truncate text-[11px] text-neutral-500">{usuario.email}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neon/20 bg-neon/5 p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 font-bold text-neon">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Nivel {nivel}
              </span>
              <span className="text-neutral-400">{usuario.pontos} pts</span>
            </div>
            <ProgresoBar
              valor={progresso}
              className="mt-2"
              rotulo={`Progresso para o nivel ${nivel + 1}: faltam ${faltam} pontos`}
            />
            <p className="mt-1.5 text-[10px] text-neutral-500">Faltam {faltam} pts para o proximo nivel</p>
          </div>

          <nav className="mt-4 flex-1">
            <ul className="space-y-1">
              {MENU.map(({ para, rotulo, icone: Icone, exato }) => (
                <li key={para}>
                  <NavLink
                    to={para}
                    end={exato}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex min-h-[46px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-neon/12 text-neon'
                          : 'text-neutral-300 hover:bg-base-700 hover:text-neutral-100',
                      )
                    }
                  >
                    <Icone className="h-[18px] w-[18px] shrink-0" aria-hidden />
                    <span className="flex-1">{rotulo}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-60" aria-hidden />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 rounded-xl border border-base-600 p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-neutral-300">Plano Admin</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
                  usuario.planoAtivo ? 'bg-neon/15 text-neon' : 'bg-amber-500/15 text-amber-300',
                )}
              >
                {usuario.planoAtivo ? 'ativo' : 'inativo'}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-neutral-500">
              {(() => {
                if (!usuario.planoAtivo) return `Ative por R$ ${PLAN.precoMensal}/mes`
                if (!usuario.planoVenceEm) return 'Plano ativo'
                const vencimento = new Date(usuario.planoVenceEm)
                if (Number.isNaN(vencimento.getTime())) return 'Plano ativo'
                return `Vence em ${vencimento.toLocaleDateString('pt-BR')}`
              })()}
            </p>
            <NavLink to="/admin/plano" className="mt-2 block">
              <Button tamanho="sm" variante="contorno" cheio>
                {usuario.planoAtivo ? 'Renovar' : 'Ativar plano'}
              </Button>
            </NavLink>
          </div>

          <Button
            variante="fantasma"
            tamanho="sm"
            className="mt-3"
            onClick={() => {
              aviso('Sessao encerrada', 'Volte sempre para postar mais grupos.')
              setTimeout(sair, 400)
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sair da conta
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        <motion.div
          key={local.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export { MENU as MENU_ADMIN }
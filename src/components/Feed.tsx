import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Ad, Group } from '@/types'
import { CATEGORIES } from '@/types'
import { Avatar } from '@/components/ui/Bits'
import { cn, formatarMembros } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

interface Props {
  grupos: Group[]
  anuncios: Ad[]
}

export function StoriesBar({ grupos, anuncios }: Props) {
  const { autenticado } = useAuth()

  return (
    <div className="hide-scrollbar-x -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-4 pb-1">
        {autenticado ? (
          <li>
            <Link
              to="/publicar"
              className="group flex w-16 shrink-0 flex-col items-center gap-1.5"
              aria-label="Publicar um novo grupo"
            >
              <span className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-neon/50 bg-base-800">
                <Plus className="h-5 w-5 text-neon" aria-hidden />
              </span>
              <span className="w-full truncate text-center text-[11px] font-semibold text-neutral-300">Seu grupo</span>
            </Link>
          </li>
        ) : null}

        {anuncios.map((ad) => (
          <li key={ad.id}>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-16 shrink-0 flex-col items-center gap-1.5"
              aria-label={ad.titulo}
            >
              <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-amber-400/70 bg-base-800 p-1 text-[10px] font-bold text-amber-300 transition group-hover:scale-105">
                ANUNCIO
              </span>
              <span className="w-full truncate text-center text-[11px] font-semibold text-neutral-300">{ad.ownerNome}</span>
            </a>
          </li>
        ))}

        {grupos.map((grupo) => {
          const meta = CATEGORIES.find((c) => c.value === grupo.categoria)
          return (
            <li key={grupo.id}>
              <Link
                to={`/grupo/${grupo.id}`}
                className="group flex w-16 shrink-0 flex-col items-center gap-1.5"
                aria-label={`Ver ${grupo.nome}`}
              >
                <span
                  className="relative grid h-16 w-16 place-items-center rounded-full p-[3px] transition group-hover:scale-105"
                  style={{ background: `linear-gradient(140deg, ${grupo.corDestaque}, #101441)` }}
                >
                  <span className="grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-base text-2xl">
                    {meta?.emoji ?? '\u{1F4E6}'}
                  </span>
                </span>
                <span className="w-full truncate text-center text-[11px] font-semibold text-neutral-300">
                  {grupo.nome.split(' ').slice(0, 2).join(' ')}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface AdCardProps {
  ad: Ad
  variante?: 'feed' | 'lateral' | 'banner'
  aoClicar?: () => void
}

export function AdCard({ ad, variante = 'feed', aoClicar }: AdCardProps) {
  const lado = variante === 'lateral'

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={aoClicar}
      className={cn(
        'pgz-surface group relative block overflow-hidden rounded-2xl border border-amber-400/25 transition-all duration-300',
        'hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-lift',
        lado ? 'p-4' : 'p-4 sm:p-5',
      )}
    >
      <span className="absolute right-3 top-3 rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-300">
        Patrocinado
      </span>

      <div className="flex items-center gap-2.5">
        <Avatar nome={ad.ownerNome} tamanho={32} />
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-amber-200">{ad.ownerNome}</p>
          <p className="text-[10px] text-neutral-500">Anunciante verificado</p>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-bold text-neutral-100 transition group-hover:text-neon">{ad.titulo}</h3>
      <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-neutral-400">{ad.descricao}</p>

      <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-400/15 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 transition group-hover:bg-amber-400/25">
        Falar no WhatsApp
      </span>
    </a>
  )
}

export function sponsoredStats(anuncios: Ad[]): { impressoes: number; cliques: number; ctr: number } {
  const impressoes = anuncios.reduce((soma, a) => soma + a.impressoes, 0)
  const cliques = anuncios.reduce((soma, a) => soma + a.cliques, 0)
  const ctr = impressoes > 0 ? Math.round((cliques / impressoes) * 1000) / 10 : 0
  return { impressoes, cliques, ctr }
}

export function SidebarAds({ anuncios }: { anuncios: Ad[] }) {
  const lista = anuncios.filter((a) => a.ativo && a.posicao === 'lateral')
  if (lista.length === 0) return null

  return (
    <aside className="space-y-4" aria-label="Anuncios">
      {lista.map((ad) => (
        <AdCard key={ad.id} ad={ad} variante="lateral" />
      ))}
    </aside>
  )
}

export function CitiesRail({ cidades }: { cidades: Array<{ cidade: string; estado: string; total: number }> }) {
  return (
    <div className="hide-scrollbar-x -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {cidades.map((item) => (
        <Link
          key={`${item.cidade}-${item.estado}`}
          to={`/buscar?cidade=${encodeURIComponent(item.cidade)}&estado=${encodeURIComponent(item.estado)}`}
          className="pgz-surface flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold text-neutral-200 transition hover:border-neon/45 hover:text-neon"
        >
          {item.cidade}
          <span className="rounded-full bg-base-700 px-1.5 text-[10px] text-neon">{item.total}</span>
        </Link>
      ))}
    </div>
  )
}

export function GroupMiniStat({ grupo }: { grupo: Group }) {
  return (
    <Link
      to={`/grupo/${grupo.id}`}
      className="pgz-surface flex min-h-[44px] items-center gap-3 rounded-xl border p-3 transition hover:border-neon/40"
    >
      <Avatar nome={grupo.nome} tamanho={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-neutral-100">{grupo.nome}</p>
        <p className="text-[10px] text-neutral-500">
          {grupo.cidade} - {grupo.estado} · {formatarMembros(grupo.membros)} membros
        </p>
      </div>
    </Link>
  )
}
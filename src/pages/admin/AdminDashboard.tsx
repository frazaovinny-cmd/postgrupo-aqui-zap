import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Eye,
  Heart,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { Avatar, CategoriaBadge, ProgresoBar } from '@/components/ui/Bits'
import { EmptyState, Skeleton } from '@/components/ui/States'
import { BADGES, CATEGORIES } from '@/types'
import { cn, formatarData, formatarMembros, formatarNumero, nivelPorPontos, pluralizar, tempoRelativo } from '@/lib/utils'

export default function AdminDashboard() {
  useSeo({ titulo: 'Painel do administrador', caminho: '/admin', noindex: true })

  const { usuario } = useAuth()
  const { grupos, carregando, comentarios, anuncios, registrarCliqueAnuncio } = useData()

  const meus = useMemo(
    () => grupos.filter((g) => g.ownerId === usuario?.id || g.ownerNome === usuario?.nome),
    [grupos, usuario],
  )
  const meusAnuncios = useMemo(
    () => anuncios.filter((a) => a.ownerId === usuario?.id || a.ownerNome === usuario?.nome),
    [anuncios, usuario],
  )

  const metricas = useMemo(() => {
    const cliques = meus.reduce((s, g) => s + g.cliques, 0)
    const gostei = meus.reduce((s, g) => s + g.gostei, 0)
    const membros = meus.reduce((s, g) => s + g.membros, 0)
    const views = meus.reduce((s, g) => s + g.visualizacoes, 0)
    const meusComents = comentarios.filter((c) => meus.some((g) => g.id === c.grupoId)).length
    return { cliques, gostei, membros, views, meusComents }
  }, [meus, comentarios])

  const impressoesAnuncios = meusAnuncios.reduce((s, a) => s + a.impressoes, 0)
  const cliquesAnuncios = meusAnuncios.reduce((s, a) => s + a.cliques, 0)
  const ctr = impressoesAnuncios > 0 ? Math.round((cliquesAnuncios / impressoesAnuncios) * 1000) / 10 : 0

  const progresso = usuario ? nivelPorPontos(usuario.pontos) : { nivel: 1, faltam: 100, progresso: 0 }

  const conquistas = useMemo(() => {
    if (!usuario) return []
    const cliques = metricas.cliques
    return BADGES.filter((badge) => {
      switch (badge.id) {
        case 'primeiro-post':
          return meus.length >= 1
        case 'dez-grupos':
          return meus.length >= 10
        case 'cem-cliques':
          return cliques >= 100
        case 'vendedor-pro':
          return cliques >= 1000
        case 'perfil-completo':
          return Boolean(usuario.bio && usuario.cidade && usuario.estado)
        case 'assinante':
          return usuario.planoAtivo
        case 'criador-anuncio':
          return meusAnuncios.length >= 1
        default:
          return false
      }
    }).slice(0, 6)
  }, [usuario, meus.length, metricas.cliques, meusAnuncios.length])

  if (!usuario) return null

  if (carregando) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  const cards = [
    { rotulo: 'Cliques nos grupos', valor: metricas.cliques, icone: MousePointerClick, cor: '#53e515', link: '/admin/analytics' },
    { rotulo: 'Grupos publicados', valor: meus.length, icone: MessageSquare, cor: '#38bdf8', link: '/admin/grupos' },
    { rotulo: 'Membros alcancados', valor: metricas.membros, icone: Users, cor: '#a78bfa', link: '/admin/grupos' },
    { rotulo: 'Curtidas', valor: metricas.gostei, icone: Heart, cor: '#f472b6', link: '/admin/grupos' },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neon">Painel do administrador</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">
            Ola, {usuario.nome.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {meus.length === 0
              ? 'Voce ainda nao publicou nenhum grupo. Comece agora.'
              : `${pluralizar(meus.length, 'grupo publicado', 'grupos publicados')} · ${formatarNumero(metricas.cliques)} cliques no total`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/publicar">
            <Button>
              <Plus className="h-4 w-4" aria-hidden />
              Novo grupo
            </Button>
          </Link>
          <Link to="/admin/anuncios">
            <Button variante="contorno">
              <Megaphone className="h-4 w-4" aria-hidden />
              Novo anuncio
            </Button>
          </Link>
        </div>
      </header>

      {!usuario.planoAtivo ? (
        <Card padding="md" className="border-amber-400/35 bg-amber-500/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
              <div>
                <h2 className="text-sm font-bold text-neutral-100">Seu plano esta inativo</h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Ative o plano Admin por R$ 10/mes para destacar seus grupos e criar anuncios.
                </p>
              </div>
            </div>
            <Link to="/admin/plano">
              <Button tamanho="sm">Ativar agora</Button>
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.rotulo}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Link to={card.link} className="block">
              <Card hover className="h-full">
                <div className="flex items-start justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ backgroundColor: `${card.cor}1f`, color: card.cor }}
                  >
                    <card.icone className="h-5 w-5" aria-hidden />
                  </span>
                  <TrendingUp className="h-4 w-4 text-neon/60" aria-hidden />
                </div>
                <p className="mt-3 text-2xl font-extrabold text-neutral-100">
                  {card.rotulo.includes('Membros') ? formatarMembros(card.valor) : formatarNumero(card.valor)}
                </p>
                <p className="text-xs text-neutral-400">{card.rotulo}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card padding="md">
          <SectionTitle
            titulo="Seus grupos"
            subtitulo="Ultimos publicados e atualizados"
            icone={<MessageSquare className="h-5 w-5 text-neon" aria-hidden />}
            acao={
              <Link to="/admin/grupos" className="link-underline inline-flex items-center gap-1 text-xs font-semibold text-neon">
                Ver todos <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          />

          {meus.length === 0 ? (
            <EmptyState
              titulo="Nenhum grupo publicado"
              descricao="Publique seu primeiro grupo de WhatsApp e apareca nas buscas da sua cidade."
              icone={<MessageSquare className="h-6 w-6" aria-hidden />}
              acao={
                <Link to="/publicar">
                  <Button>Publicar meu grupo</Button>
                </Link>
              }
            />
          ) : (
            <ul className="space-y-2.5">
              {meus.slice(0, 5).map((grupo) => (
                <li key={grupo.id}>
                  <Link
                    to={`/grupo/${grupo.id}`}
                    className="flex min-h-[64px] items-center gap-3 rounded-xl border border-base-600 p-3 transition hover:border-neon/40"
                  >
                    <Avatar nome={grupo.nome} tamanho={42} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-neutral-100">{grupo.nome}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                        <span>
                          {grupo.cidade} - {grupo.estado}
                        </span>
                        <CategoriaBadge categoria={grupo.categoria} />
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-sm font-bold text-neon">{formatarNumero(grupo.cliques)}</p>
                      <p className="text-[10px] text-neutral-500">cliques</p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                        grupo.status === 'aprovado'
                          ? 'bg-neon/15 text-neon'
                          : grupo.status === 'pendente'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-red-500/15 text-red-400',
                      )}
                    >
                      {grupo.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card padding="md">
            <SectionTitle
              titulo="Gamificacao"
              subtitulo={`Nivel ${progresso.nivel} · ${usuario.pontos} pontos`}
              icone={<Sparkles className="h-5 w-5 text-neon" aria-hidden />}
            />
            <ProgresoBar valor={progresso.progresso} rotulo={`Progresso para o nivel ${progresso.nivel + 1}`} />
            <p className="mt-2 text-xs text-neutral-400">
              Faltam <span className="font-bold text-neon">{progresso.faltam}</span> pontos para o nivel{' '}
              {progresso.nivel + 1}.
            </p>

            <ul className="mt-4 grid grid-cols-3 gap-2">
              {conquistas.length === 0 ? (
                <li className="col-span-3 rounded-xl border border-dashed border-base-600 p-3 text-center text-[11px] text-neutral-500">
                  Publique um grupo para desbloquear sua primeira insignia.
                </li>
              ) : (
                conquistas.map((badge) => (
                  <li
                    key={badge.id}
                    className="flex flex-col items-center gap-1 rounded-xl border border-neon/20 bg-neon/5 p-2.5 text-center"
                    title={badge.descricao}
                  >
                    <span className="text-lg" aria-hidden>
                      {badge.icone}
                    </span>
                    <span className="text-[10px] font-bold leading-tight text-neutral-200">{badge.nome}</span>
                    <span className="text-[9px] text-neon">+{badge.pontos} pts</span>
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card padding="md">
            <SectionTitle
              titulo="Seus anuncios"
              subtitulo="Performance das suas propagandas"
              icone={<Megaphone className="h-5 w-5 text-amber-300" aria-hidden />}
              acao={
                <Link to="/admin/anuncios" className="link-underline text-xs font-semibold text-neon">
                  Gerenciar
                </Link>
              }
            />

            {meusAnuncios.length === 0 ? (
              <p className="rounded-xl border border-dashed border-base-600 p-4 text-center text-xs text-neutral-500">
                Voce ainda nao criou anuncios.{' '}
                <Link to="/admin/anuncios" className="text-neon hover:underline">
                  Criar agora
                </Link>
              </p>
            ) : (
              <>
                <dl className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-base-600 p-2.5">
                    <dt className="text-[10px] text-neutral-500">Impressoes</dt>
                    <dd className="text-sm font-bold text-neutral-100">{formatarNumero(impressoesAnuncios, true)}</dd>
                  </div>
                  <div className="rounded-xl border border-base-600 p-2.5">
                    <dt className="text-[10px] text-neutral-500">Cliques</dt>
                    <dd className="text-sm font-bold text-neon">{formatarNumero(cliquesAnuncios, true)}</dd>
                  </div>
                  <div className="rounded-xl border border-base-600 p-2.5">
                    <dt className="text-[10px] text-neutral-500">CTR</dt>
                    <dd className="text-sm font-bold text-amber-300">{ctr}%</dd>
                  </div>
                </dl>

                <ul className="mt-3 space-y-2">
                  {meusAnuncios.slice(0, 2).map((ad) => (
                    <li key={ad.id}>
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => registrarCliqueAnuncio(ad.id)}
                        className="flex min-h-[52px] items-center gap-3 rounded-xl border border-amber-400/25 p-2.5 transition hover:border-amber-400/60"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/15 text-amber-300">
                          <Megaphone className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-neutral-100">{ad.titulo}</span>
                          <span className="block text-[10px] text-neutral-500">
                            {formatarNumero(ad.impressoes)} views · {formatarNumero(ad.cliques)} cliques
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </div>
      </div>

      <Card padding="md">
        <SectionTitle
          titulo="Como aumentar seus cliques"
          subtitulo="Dicas praticas para os administradores"
          icone={<BarChart3 className="h-5 w-5 text-neon" aria-hidden />}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icone: Eye,
              titulo: 'Complete a descricao',
              texto: 'Grupos com descricao clara recebem 3x mais cliques.',
            },
            {
              icone: Sparkles,
              titulo: 'Use bom nome',
              texto: 'Inclua a cidade no nome: "Ofertas Goiania - SP".',
            },
            {
              icone: Megaphone,
              titulo: 'Ative um anuncio',
              texto: 'Anunciantes ativos aparecem no topo do feed da cidade.',
            },
          ].map((dica) => (
            <div key={dica.titulo} className="rounded-xl border border-base-600 p-3.5">
              <dica.icone className="h-[18px] w-[18px] text-neon" aria-hidden />
              <p className="mt-2 text-sm font-bold text-neutral-100">{dica.titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">{dica.texto}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="md" className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Users className="h-4 w-4 text-neon" aria-hidden />
          <p className="text-xs text-neutral-400">
            Membro desde {formatarData(usuario.criadoEm)} · ultimo acesso {tempoRelativo(new Date().toISOString())}
          </p>
        </div>
        <Link to="/admin/analytics">
          <Button variante="contorno" tamanho="sm">
            Abrir relatorio completo
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </Link>
      </Card>

      <p className="text-center text-[10px] text-neutral-600">
        Categorias mais usadas pelos administradores: {CATEGORIES.slice(0, 3).map((c) => c.label).join(' · ')}
      </p>
    </div>
  )
}
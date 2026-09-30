import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Flame,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { GroupCard, GroupCardSkeleton } from '@/components/GroupCard'
import { AdCard, CitiesRail, SidebarAds, StoriesBar } from '@/components/Feed'
import { Button } from '@/components/ui/Button'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { Chip, CategoriaBadge, IconTile } from '@/components/ui/Bits'
import { EmptyState } from '@/components/ui/States'
import { CATEGORIES } from '@/types'
import { citiesForFeed } from '@/lib/filters'
import { cn, formatarNumero, pluralizar } from '@/lib/utils'

type Aba = 'recentes' | 'populares' | 'vendas'

export default function Home() {
  useSeo({
    titulo: 'Links de grupos de WhatsApp por cidade',
    descricao:
      'Feed com links de grupos de WhatsApp de vendas, ofertas, vagas e muito mais. Filtre por estado, cidade e categoria e entre em segundos.',
    caminho: '/',
  })

  const { grupos, anuncios, carregando, comentarios } = useData()
  const [aba, setAba] = useState<Aba>('recentes')
  const [categoria, setCategoria] = useState<string>('')

  const comentariosPorGrupo = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const c of comentarios) mapa.set(c.grupoId, (mapa.get(c.grupoId) ?? 0) + 1)
    return mapa
  }, [comentarios])

  const listados = useMemo(() => {
    let lista = grupos.filter((g) => g.status === 'aprovado')
    if (categoria) lista = lista.filter((g) => g.categoria === categoria)

    if (aba === 'populares') lista = [...lista].sort((a, b) => b.cliques - a.cliques)
    else if (aba === 'vendas') lista = lista.filter((g) => g.categoria === 'vendas')
    else
      lista = [...lista].sort((a, b) => {
        if (a.fixado !== b.fixado) return a.fixado ? -1 : 1
        return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      })

    return lista.slice(0, 9)
  }, [grupos, aba, categoria])

  const cidades = useMemo(() => citiesForFeed(grupos), [grupos])
  const cidadesRecentes = useMemo(() => cidades.slice(0, 14), [cidades])
  const anunciosFeed = anuncios.filter((a) => a.ativo && a.posicao === 'feed')
  const totalMembros = grupos.reduce((soma, g) => soma + g.membros, 0)
  const totalCidades = new Set(grupos.map((g) => g.cidade)).size

  return (
    <div className="space-y-12">
      <Hero totalGrupos={grupos.length} totalMembros={totalMembros} totalCidades={totalCidades} />

      <StoriesSection />

      {grupos.length > 0 ? (
        <section aria-labelledby="titulo-categorias">
          <SectionTitle
            titulo="Navegue por categoria"
            subtitulo="Cada categoria reúne os grupos daquele tema no Brasil inteiro"
            icone={<Layers className="h-5 w-5 text-neon" aria-hidden />}
            acao={
              <Link
                to="/buscar"
                className="link-underline hidden items-center gap-1 text-xs font-semibold text-neon sm:inline-flex"
              >
                Ver todas <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          />
          <h2 id="titulo-categorias" className="sr-only">
            Categorias
          </h2>
          <div className="hide-scrollbar-x -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const total = grupos.filter((g) => g.categoria === cat.value && g.status === 'aprovado').length
              return (
                <Link
                  key={cat.value}
                  to={`/buscar?categoria=${cat.value}`}
                  className="pgz-surface flex w-40 shrink-0 flex-col gap-2 rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-neon/40"
                >
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl text-lg"
                    style={{ backgroundColor: `${cat.cor}1f` }}
                    aria-hidden
                  >
                    {cat.emoji}
                  </span>
                  <span className="text-xs font-bold leading-tight text-neutral-100">{cat.label}</span>
                  <span className="text-[10px] text-neutral-500">{pluralizar(total, 'grupo', 'grupos')}</span>
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-labelledby="titulo-feed">
          <SectionTitle
            titulo="Feed de grupos"
            subtitulo="Atualizado com os grupos mais recentes e clicados"
            icone={<Flame className="h-5 w-5 text-neon" aria-hidden />}
            acao={
              <Link to="/buscar">
                <Button variante="contorno" tamanho="sm">
                  Explorar tudo
                </Button>
              </Link>
            }
          />
          <h2 id="titulo-feed" className="sr-only">
            Feed de grupos
          </h2>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            {([
              ['recentes', 'Recentes'],
              ['populares', 'Populares'],
              ['vendas', 'Só vendas'],
            ] as Array<[Aba, string]>).map(([valor, rotulo]) => (
              <Chip
                key={valor}
                ativo={aba === valor}
                onClick={() => setAba(valor)}
                icone={valor === 'populares' ? <TrendingUp className="h-3.5 w-3.5" aria-hidden /> : undefined}
              >
                {rotulo}
              </Chip>
            ))}

            <span className="mx-1 hidden h-5 w-px bg-base-600 sm:block" aria-hidden />

            <div className="hide-scrollbar-x -mx-1 flex gap-2 overflow-x-auto px-1">
              <Chip ativo={categoria === ''} onClick={() => setCategoria('')}>
                Todas
              </Chip>
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Chip key={cat.value} ativo={categoria === cat.value} onClick={() => setCategoria(cat.value)}>
                  {cat.emoji} {cat.label}
                </Chip>
              ))}
            </div>
          </div>

          {carregando ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <GroupCardSkeleton key={i} />
              ))}
            </div>
          ) : listados.length === 0 ? (
            <EmptyState
              titulo="Nenhum grupo por aqui ainda"
              descricao="Ajude a comunidade: publique o seu grupo de WhatsApp e apareca para quem procura."
              acao={
                <Link to="/publicar">
                  <Button>Publicar meu grupo</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listados.map((grupo) => (
                <GroupCard
                  key={grupo.id}
                  grupo={grupo}
                  totalComentarios={comentariosPorGrupo.get(grupo.id) ?? 0}
                />
              ))}
            </div>
          )}

          {listados.length > 0 ? (
            <div className="mt-6 flex justify-center">
              <Link to="/buscar">
                <Button variante="secundario" tamanho="lg">
                  Ver mais grupos
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
            </div>
          ) : null}
        </section>

        <div className="space-y-4">
          {anunciosFeed.length > 0 ? (
            <AdCard ad={anunciosFeed[0]!} variante="feed" />
          ) : null}
          <SidebarAds anuncios={anuncios} />
          <Card padding="md" className="border-neon/25 bg-gradient-to-b from-primary/60 to-base-800/40">
            <div className="flex items-start gap-3">
              <IconTile>
                <Zap className="h-5 w-5" aria-hidden />
              </IconTile>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-neutral-100">Destaque seu grupo</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                  Planos a partir de R$ 10/mês por anunciante. Alcance quem realmente procura grupo na sua cidade.
                </p>
                <Link to="/planos" className="mt-3 inline-block">
                  <Button tamanho="sm" variante="contorno">
                    Ver planos
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {cidadesRecentes.length > 0 ? (
        <section aria-labelledby="titulo-cidades">
          <SectionTitle
            titulo="Grupos por cidade"
            subtitulo={`${formatarNumero(totalCidades)} cidades com grupos cadastrados`}
            icone={<MapPin className="h-5 w-5 text-neon" aria-hidden />}
            acao={
              <Link to="/buscar" className="link-underline hidden items-center gap-1 text-xs font-semibold text-neon sm:inline-flex">
                Ver todas <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          />
          <h2 id="titulo-cidades" className="sr-only">
            Grupos por cidade
          </h2>
          <CitiesRail cidades={cidadesRecentes} />
        </section>
      ) : null}

      <ComoFunciona />
      <ChamadaFinal />
    </div>
  )
}

function StoriesSection() {
  const { gruposDestaque, anuncios } = useData()
  const stories = gruposDestaque().slice(0, 10)
  const patrocinados = anuncios.filter((a) => a.ativo && a.posicao === 'stories')

  if (stories.length === 0 && patrocinados.length === 0) return null

  return (
    <section aria-labelledby="titulo-destaques">
      <h2 id="titulo-destaques" className="sr-only">
        Grupos em destaque
      </h2>
      <StoriesBar grupos={stories} anuncios={patrocinados} />
    </section>
  )
}

function Hero({
  totalGrupos,
  totalMembros,
  totalCidades,
}: {
  totalGrupos: number
  totalMembros: number
  totalCidades: number
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-neon/20 bg-glow-primary">
      <div className="pointer-events-none absolute inset-0 bg-grid-neon bg-grid opacity-60" aria-hidden />
      <div className="relative grid gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:px-10">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Diretorio de WhatsApp
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Encontre <span className="gradient-text">grupos de WhatsApp</span>{' '}
            <span className="text-neutral-100">da sua cidade</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            Vendas, ofertas, vagas e muito mais. Todo mundo posta o seu grupo, voce escolhe a cidade e entra em
            segundos. Sem cadastro, sem advertisement.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Link to="/buscar" className="sm:w-auto">
              <Button tamanho="lg" cheio className="sm:w-auto">
                <Search className="h-[18px] w-[18px]" aria-hidden />
                Buscar grupos agora
              </Button>
            </Link>
            <Link to="/publicar" className="sm:w-auto">
              <Button tamanho="lg" variante="contorno" cheio className="sm:w-auto">
                Quero publicar meu grupo
              </Button>
            </Link>
          </div>

          <dl className="mt-9 grid max-w-lg grid-cols-3 gap-3">
            {[
              { valor: formatarNumero(totalGrupos), rotulo: 'grupos', icone: Layers },
              { valor: formatarNumero(totalMembros, true), rotulo: 'membros', icone: Users },
              { valor: formatarNumero(totalCidades), rotulo: 'cidades', icone: MapPin },
            ].map((item) => (
              <div key={item.rotulo} className="pgz-surface rounded-xl border p-3">
                <item.icone className="h-4 w-4 text-neon" aria-hidden />
                <dd className="mt-1.5 text-lg font-extrabold text-neutral-100">{item.valor}</dd>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-500">{item.rotulo}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pgz-surface relative ml-auto w-full max-w-sm animate-float rounded-3xl border p-6 shadow-lift"
          >
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-neon/70" />
              </span>
              <span className="text-[10px] font-semibold text-neutral-500">postgrupoaquizap.com.br</span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { cidade: 'Brasilia - DF', total: 2, cor: '#53e515' },
                { cidade: 'Sao Paulo - SP', total: 3, cor: '#38bdf8' },
                { cidade: 'Rio de Janeiro - RJ', total: 2, cor: '#f59e0b' },
                { cidade: 'Recife - PE', total: 2, cor: '#f472b6' },
              ].map((linha, i) => (
                <motion.div
                  key={linha.cidade}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.35 }}
                  className="flex items-center gap-3 rounded-xl border border-base-600 bg-base-800/60 p-3"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold" style={{ color: linha.cor, backgroundColor: `${linha.cor}1f` }}>
                    {linha.total}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-neutral-200">{linha.cidade}</p>
                    <p className="text-[10px] text-neutral-500">grupos de vendas e ofertas</p>
                  </div>
                  <span className="text-[10px] font-semibold text-neon">ativo</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-neon/25 bg-neon/10 px-3 py-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-neon" aria-hidden />
              <p className="text-[10px] leading-tight text-neon">
                Links revisados e categorias organizadas por cidade e estado
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ComoFunciona() {
  const passos = [
    {
      icone: Search,
      titulo: 'Busque pela sua cidade',
      texto: 'Escolha o estado, a cidade e a categoria. O filtro funciona na hora.',
    },
    {
      icone: Users,
      titulo: 'Entre no grupo',
      texto: 'Um toque e voce ja esta no WhatsApp, sem instalar aplicativo extra.',
    },
    {
      icone: Sparkles,
      titulo: 'Anuncie e cresca',
      texto: 'Admins pagam R$ 10/mes e deixam o grupo em destaque para a cidade.',
    },
  ]

  return (
    <section aria-labelledby="titulo-como">
      <SectionTitle
        titulo="Como funciona"
        subtitulo="Tres passos para entrar no grupo que voce procura"
        icone={<Zap className="h-5 w-5 text-neon" aria-hidden />}
      />
      <h2 id="titulo-como" className="sr-only">
        Como funciona
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {passos.map((passo, i) => (
          <motion.div
            key={passo.titulo}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <Card hover className="h-full">
              <div className="flex items-center gap-3">
                <IconTile>
                  <passo.icone className="h-5 w-5" aria-hidden />
                </IconTile>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-neon/30 text-[11px] font-bold text-neon">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-100">{passo.titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{passo.texto}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ChamadaFinal() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-neon/25 bg-gradient-to-br from-primary via-primary-600 to-support p-6 sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-grid-neon bg-grid opacity-40" aria-hidden />
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-neon/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-neon">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            Para anunciantes
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-neutral-100 sm:text-3xl">
            Tenha um admin com conta propria, publique ilimitado e receba visitas
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            Entre com sua conta Gmail, publique seus grupos, adicione seus anuncios e acompanhe cliques em um painel
            completo. Cada admin tem acesso individual ao seu painel e aos seus grupos.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <CategoriaBadge key={cat.value} categoria={cat.value} />
            ))}
          </div>
        </div>

        <div className={cn('w-full shrink-0 lg:w-64')}>
          <div className="pgz-surface rounded-2xl border p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Plano Admin</p>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-neon">R$ 10</span>
              <span className="text-sm text-neutral-400">/mes</span>
            </p>
            <ul className="mt-4 space-y-2 text-xs text-neutral-300">
              {['Painel individual', 'Grupos em destaque', 'Anuncios proprios', 'Estatisticas de cliques'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-neon" aria-hidden />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <Link to="/planos" className="mt-5 block">
              <Button cheio>
                Quero anunciar
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
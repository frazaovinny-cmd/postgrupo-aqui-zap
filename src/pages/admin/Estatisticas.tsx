import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Eye, Heart, MessageSquare, MousePointerClick, TrendingUp, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { ProgresoBar } from '@/components/ui/Bits'
import { EmptyState } from '@/components/ui/States'
import { CATEGORIES } from '@/types'
import { cn, diasAtras, formatarMembros, formatarNumero } from '@/lib/utils'

export default function Estatisticas() {
  useSeo({ titulo: 'Estatisticas', caminho: '/admin/analytics', noindex: true })

  const { usuario } = useAuth()
  const { gruposDoDono, anuncios, comentarios } = useData()

  const meus = useMemo(() => (usuario ? gruposDoDono(usuario.id) : []), [gruposDoDono, usuario])
  const meusAnuncios = useMemo(
    () => (usuario ? anuncios.filter((a) => a.ownerId === usuario.id) : []),
    [anuncios, usuario],
  )

  const dados = useMemo(() => {
    if (meus.length === 0) return null

    const cliques = meus.reduce((s, g) => s + g.cliques, 0)
    const views = meus.reduce((s, g) => s + g.visualizacoes, 0)
    const gostei = meus.reduce((s, g) => s + g.gostei, 0)
    const membros = meus.reduce((s, g) => s + g.membros, 0)
    const coments = comentarios.filter((c) => meus.some((g) => g.id === c.grupoId)).length

    const porCategoria = new Map<string, number>()
    for (const g of meus) porCategoria.set(g.categoria, (porCategoria.get(g.categoria) ?? 0) + g.cliques)

    const porCidade = new Map<string, number>()
    for (const g of meus) porCidade.set(g.cidade, (porCidade.get(g.cidade) ?? 0) + g.cliques)

    const porDia = Array.from({ length: 7 }, (_, i) => {
      const alvo = 6 - i
      const cliquesDia = meus
        .filter((g) => diasAtras(g.atualizadoEm) === alvo)
        .reduce((s, g) => s + Math.round(g.cliques / 30), 0)
      return { dia: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'Ontem', 'Hoje'][i] ?? '', cliques: cliquesDia }
    })

    const maxDia = Math.max(...porDia.map((d) => d.cliques), 1)
    const maxCat = Math.max(...porCategoria.values(), 1)
    const maxCidade = Math.max(...porCidade.values(), 1)

    return {
      cliques,
      views,
      gostei,
      membros,
      coments,
      taxaCliques: views > 0 ? Math.round((cliques / views) * 100) : 0,
      categorias: [...porCategoria.entries()]
        .map(([value, total]) => ({
          value,
          total,
          rotulo: CATEGORIES.find((c) => c.value === value)?.label ?? value,
          emoji: CATEGORIES.find((c) => c.value === value)?.emoji ?? '\u{1F4E6}',
        }))
        .sort((a, b) => b.total - a.total),
      cidades: [...porCidade.entries()]
        .map(([cidade, total]) => ({ cidade, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6),
      porDia,
      maxDia,
      maxCat,
      maxCidade,
    }
  }, [meus, comentarios])

  const impressoesAnuncios = meusAnuncios.reduce((s, a) => s + a.impressoes, 0)
  const cliquesAnuncios = meusAnuncios.reduce((s, a) => s + a.cliques, 0)

  if (!usuario) return null

  if (!dados) {
    return (
      <EmptyState
        titulo="Sem dados para mostrar ainda"
        descricao="Publique seu primeiro grupo para comecar a acompanhar cliques, membros e engajamento."
        icone={<BarChart3 className="h-6 w-6" aria-hidden />}
        acao={
          <Link to="/publicar">
            <span className="inline-flex h-11 items-center rounded-xl border border-neon/45 bg-primary px-5 text-sm font-semibold text-neon">
              Publicar meu grupo
            </span>
          </Link>
        }
      />
    )
  }

  const cartoes = [
    { rotulo: 'Cliques', valor: formatarNumero(dados.cliques), icone: MousePointerClick, cor: '#53e515' },
    { rotulo: 'Visualizacoes', valor: formatarNumero(dados.views), icone: Eye, cor: '#38bdf8' },
    { rotulo: 'Membros', valor: formatarMembros(dados.membros), icone: Users, cor: '#a78bfa' },
    { rotulo: 'Curtidas', valor: formatarNumero(dados.gostei), icone: Heart, cor: '#f472b6' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-neon">Desempenho</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Estatisticas</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Como seus grupos e anuncios performam no site.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cartoes.map((item) => (
          <Card key={item.rotulo} padding="md">
            <div className="flex items-start justify-between">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{ backgroundColor: `${item.cor}1f`, color: item.cor }}
              >
                <item.icone className="h-5 w-5" aria-hidden />
              </span>
              <TrendingUp className="h-4 w-4 text-neon/50" aria-hidden />
            </div>
            <p className="mt-3 text-xl font-extrabold text-neutral-100">{item.valor}</p>
            <p className="text-xs text-neutral-400">{item.rotulo}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card padding="md">
          <SectionTitle
            titulo="Clicks nos ultimos 7 dias"
            subtitulo="Distribuicao estimada por dia"
            icone={<TrendingUp className="h-5 w-5 text-neon" aria-hidden />}
          />
          <div className="flex h-40 items-end gap-2">
            {dados.porDia.map((item) => (
              <div key={item.dia} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-300">{item.cliques}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-neon transition-all duration-500"
                  style={{ height: `${Math.max(6, (item.cliques / dados.maxDia) * 100)}%` }}
                  title={`${item.dia}: ${item.cliques} cliques`}
                />
                <span className="text-[10px] text-neutral-500">{item.dia}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <SectionTitle
            titulo="Resumo"
            subtitulo="Indicadores do seu perfil"
            icone={<BarChart3 className="h-5 w-5 text-neon" aria-hidden />}
          />
          <dl className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <dt className="text-neutral-400">Taxa de clique no card</dt>
                <dd className="font-bold text-neon">{dados.taxaCliques}%</dd>
              </div>
              <ProgresoBar
                valor={dados.taxaCliques}
                className="mt-1.5"
                rotulo="Taxa de clique no card do grupo"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <dt className="text-neutral-400">Cliques dos anuncios</dt>
                <dd className="font-bold text-amber-300">{formatarNumero(cliquesAnuncios)}</dd>
              </div>
              <ProgresoBar
                valor={cliquesAnuncios}
                maximo={Math.max(impressoesAnuncios, 1)}
                className="mt-1.5"
                rotulo="Cliques dos anuncios sobre impressoes"
              />
            </div>
            <div className="flex items-center justify-between border-t border-base-600 pt-3 text-xs">
              <dt className="inline-flex items-center gap-1.5 text-neutral-400">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                Comentarios recebidos
              </dt>
              <dd className="font-bold text-neutral-100">{dados.coments}</dd>
            </div>
            <div className="flex items-center justify-between text-xs">
              <dt className="inline-flex items-center gap-1.5 text-neutral-400">
                <Users className="h-3.5 w-3.5" aria-hidden />
                Grupos publicados
              </dt>
              <dd className="font-bold text-neutral-100">{meus.length}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card padding="md">
          <SectionTitle titulo="Cliques por categoria" />
          {dados.categorias.length === 0 ? (
            <p className="text-sm text-neutral-500">Sem dados.</p>
          ) : (
            <ul className="space-y-3">
              {dados.categorias.map((cat) => (
                <li key={cat.value}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">
                      {cat.emoji} {cat.rotulo}
                    </span>
                    <span className="font-bold text-neutral-100">{formatarNumero(cat.total)}</span>
                  </div>
                  <ProgresoBar
                    valor={cat.total}
                    maximo={dados.maxCat}
                    className="mt-1.5"
                    rotulo={`Cliques em ${cat.rotulo}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padding="md">
          <SectionTitle titulo="Cliques por cidade" />
          {dados.cidades.length === 0 ? (
            <p className="text-sm text-neutral-500">Sem dados.</p>
          ) : (
            <ul className="space-y-3">
              {dados.cidades.map((item) => (
                <li key={item.cidade}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">{item.cidade}</span>
                    <span className="font-bold text-neutral-100">{formatarNumero(item.total)}</span>
                  </div>
                  <ProgresoBar
                    valor={item.total}
                    maximo={dados.maxCidade}
                    className="mt-1.5"
                    rotulo={`Cliques em ${item.cidade}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card padding="md" className={cn('border-neon/25')}>
        <p className="text-xs leading-relaxed text-neutral-400">
          <span className="font-bold text-neon">Dica:</span> grupos com a cidade no nome e descricao com mais de 100
          caracteres costumam ter CTR ate 2x maior. Experimentar em{' '}
          <Link to="/publicar" className="text-neon hover:underline">
            publicar um novo grupo
          </Link>
          .
        </p>
      </Card>
    </div>
  )
}
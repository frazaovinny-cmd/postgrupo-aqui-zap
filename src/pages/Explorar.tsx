import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Filter, MapPin, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { GroupCard, GroupCardSkeleton } from '@/components/GroupCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Chip } from '@/components/ui/Bits'
import { EmptyState } from '@/components/ui/States'
import { CATEGORIES } from '@/types'
import { ESTADOS, REGIOES, buscarCidades, cidadesDoEstado, resolverUF, rotuloEstado } from '@/data/geo'
import { cn, normalizar } from '@/lib/utils'

type Ordenacao = 'recentes' | 'populares' | 'membros' | 'cliques'

const OPCOES_ORDENACAO: Array<{ value: Ordenacao; label: string }> = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'populares', label: 'Mais populares' },
  { value: 'membros', label: 'Mais membros' },
  { value: 'cliques', label: 'Mais cliques' },
]

export default function Explorar() {
  const [params, setParams] = useSearchParams()
  const { grupos, carregando, comentarios, registrarBusca, limparBuscas, buscasRecentes } = useData()

  useSeo({
    titulo: 'Explorar grupos de WhatsApp',
    descricao: 'Busque grupos de WhatsApp por estado, cidade, categoria e palavra-chave.',
    caminho: '/buscar',
  })

  const [termo, setTermo] = useState(params.get('q') ?? '')
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [termoCidade, setTermoCidade] = useState('')

  const categoria = params.get('categoria') ?? ''
  const regiao = params.get('regiao') ?? ''
  const estadoBruto = params.get('estado') ?? ''
  const cidade = params.get('cidade') ?? ''
  const preco = params.get('preco') ?? ''
  const ordenacao = (params.get('ordem') as Ordenacao | null) ?? 'recentes'

  const estado = resolverUF(estadoBruto)
  const rotuloEstadoSelecionado = estadoBruto ? rotuloEstado(estadoBruto) : ''

  const definirParam = useCallback(
    (chave: string, valor: string) => {
      setParams(
        (atual) => {
          const proximo = new URLSearchParams(atual)
          if (valor) proximo.set(chave, valor)
          else proximo.delete(chave)
          return proximo
        },
        { replace: true },
      )
    },
    [setParams],
  )

  // Sincroniza o campo apenas quando o parametro "q" muda de verdade (ex.: link
  // externo ou navegacao de volta). Sem isso, trocar um filtro apagaria o que
  // o usuario ja havia digitado.
  const consultaNaUrl = params.get('q') ?? ''
  useEffect(() => {
    setTermo(consultaNaUrl)
  }, [consultaNaUrl])

  useEffect(() => {
    const id = setTimeout(() => {
      if (termo.trim().length >= 2) registrarBusca(termo.trim())
    }, 900)
    return () => clearTimeout(id)
  }, [termo, registrarBusca])

  const resultados = useMemo(() => {
    const alvo = normalizar(termo.trim())
    let lista = grupos.filter((g) => g.status === 'aprovado' || g.status === 'pendente')

    if (alvo) {
      lista = lista.filter((g) =>
        normalizar([g.nome, g.descricao, g.cidade, g.estado, g.ownerNome, g.tags.join(' ')].join(' ')).includes(alvo),
      )
    }
    if (categoria) lista = lista.filter((g) => g.categoria === categoria)
    if (estado) lista = lista.filter((g) => resolverUF(g.estado) === estado)
    if (regiao) lista = lista.filter((g) => ESTADOS.find((e) => e.uf === g.estado)?.regiao === regiao)
    if (cidade) lista = lista.filter((g) => normalizar(g.cidade) === normalizar(cidade))
    if (preco) lista = lista.filter((g) => g.preco === preco)

    switch (ordenacao) {
      case 'populares':
      case 'cliques':
        return [...lista].sort((a, b) => b.cliques - a.cliques)
      case 'membros':
        return [...lista].sort((a, b) => b.membros - a.membros)
      default:
        return [...lista].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    }
  }, [grupos, termo, categoria, estado, regiao, cidade, preco, ordenacao])

  const comentariosPorGrupo = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const c of comentarios) mapa.set(c.grupoId, (mapa.get(c.grupoId) ?? 0) + 1)
    return mapa
  }, [comentarios])

  const sugestoesCidade = useMemo(
    () => (termoCidade.trim().length >= 2 ? buscarCidades(termoCidade, 7) : []),
    [termoCidade],
  )

  const cidadesDisponiveis = useMemo(
    () => (estado ? cidadesDoEstado(estado) : []),
    [estado],
  )

  const filtrosAtivos = [categoria, estadoBruto, regiao, cidade, preco].filter(Boolean).length

  const limparTudo = (): void => {
    setTermo('')
    limparBuscas()
    setParams(new URLSearchParams(), { replace: true })
  }

  const titulo =
    termo.trim() || cidade || rotuloEstadoSelecionado || categoria
      ? 'Resultados da busca'
      : 'Explore todos os grupos'

  const subtitulo = `${resultados.length} ${resultados.length === 1 ? 'grupo encontrado' : 'grupos encontrados'}`

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-neon/20 bg-glow-primary p-5 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-grid-neon bg-grid opacity-50" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Explorar
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">{titulo}</h1>
          <p className="mt-1.5 text-sm text-neutral-400">{subtitulo}</p>

          <form
            className="mt-5 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              definirParam('q', termo.trim())
            }}
            role="search"
          >
            <div className="flex-1">
              <Input
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Nome do grupo, cidade, categoria ou tag…"
                aria-label="Buscar grupos"
                icone={<Search className="h-4 w-4" aria-hidden />}
                containerClassName="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" tamanho="md" className="flex-1 sm:flex-none">
                <Search className="h-4 w-4" aria-hidden />
                Buscar
              </Button>
              <Button
                variante="contorno"
                onClick={() => setFiltrosAbertos((v) => !v)}
                aria-expanded={filtrosAbertos}
                className="sm:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filtros
                {filtrosAtivos > 0 ? (
                  <span className="rounded-full bg-neon px-1.5 text-[10px] font-bold text-base">{filtrosAtivos}</span>
                ) : null}
              </Button>
            </div>
          </form>

          {buscasRecentes.length > 0 && !termo ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Buscas recentes</span>
              {buscasRecentes.slice(0, 5).map((item) => (
                <Chip key={item} onClick={() => setTermo(item)}>
                  {item}
                </Chip>
              ))}
              <button
                type="button"
                onClick={limparBuscas}
                className="text-[11px] font-semibold text-neutral-500 underline-offset-2 hover:text-neon hover:underline"
              >
                limpar
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className={cn('lg:block', filtrosAbertos ? 'block' : 'hidden')} aria-label="Filtros">
          <div className="pgz-surface sticky top-20 space-y-5 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-100">
                <Filter className="h-4 w-4 text-neon" aria-hidden />
                Filtros
              </h2>
              {filtrosAtivos > 0 ? (
                <button
                  type="button"
                  onClick={limparTudo}
                  className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-neon"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden />
                  Limpar
                </button>
              ) : null}
            </div>

            <div className="space-y-3">
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Estado</span>
                <Select
                  value={estadoBruto}
                  onChange={(e) => {
                    definirParam('estado', e.target.value)
                    definirParam('cidade', '')
                  }}
                  opcoes={ESTADOS.map((e) => ({ value: e.uf, label: `${e.nome} (${e.uf})` }))}
                  placeholder="Todos os estados"
                  aria-label="Selecionar estado"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Regiao</span>
                <div className="flex flex-wrap gap-1.5">
                  {REGIOES.map((r) => (
                    <Chip key={r} ativo={regiao === r} onClick={() => definirParam('regiao', regiao === r ? '' : r)}>
                      {r}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Cidade</span>
                {cidadesDisponiveis.length > 0 ? (
                  <Select
                    value={cidade}
                    onChange={(e) => definirParam('cidade', e.target.value)}
                    opcoes={cidadesDisponiveis.map((c) => ({ value: c, label: c }))}
                    placeholder="Todas as cidades"
                    aria-label="Selecionar cidade"
                  />
                ) : (
                  <>
                    <Input
                      value={termoCidade}
                      onChange={(e) => setTermoCidade(e.target.value)}
                      placeholder="Digite a cidade…"
                      aria-label="Buscar cidade"
                      icone={<MapPin className="h-4 w-4" aria-hidden />}
                    />
                    {sugestoesCidade.length > 0 ? (
                      <ul className="mt-1.5 space-y-1" role="listbox">
                        {sugestoesCidade.map((s) => (
                          <li key={`${s.cidade}-${s.uf}`}>
                            <button
                              type="button"
                              onClick={() => {
                                definirParam('estado', s.uf)
                                definirParam('cidade', s.cidade)
                                setTermoCidade('')
                              }}
                              className="flex w-full min-h-[40px] items-center justify-between rounded-lg px-2.5 text-left text-xs text-neutral-300 transition hover:bg-neon/10 hover:text-neon"
                            >
                              <span>
                                {s.cidade} <span className="text-neutral-500">- {s.uf}</span>
                              </span>
                              <span className="text-[10px] text-neutral-500">{s.regiao}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )}
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Ordenar por</span>
                <Select
                  value={ordenacao}
                  onChange={(e) => definirParam('ordem', e.target.value)}
                  opcoes={OPCOES_ORDENACAO}
                  aria-label="Ordenar resultados"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Acesso</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { valor: '', rotulo: 'Todos' },
                    { valor: 'gratuito', rotulo: 'Gratuitos' },
                    { valor: 'pago', rotulo: 'Pagos' },
                  ].map((opcao) => (
                    <Chip
                      key={opcao.valor || 'todos'}
                      ativo={preco === opcao.valor}
                      onClick={() => definirParam('preco', opcao.valor)}
                    >
                      {opcao.rotulo}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Categoria</span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.value}
                    ativo={categoria === cat.value}
                    onClick={() => definirParam('categoria', categoria === cat.value ? '' : cat.value)}
                  >
                    {cat.emoji} {cat.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section aria-label="Resultados">
          {filtrosAbertos ? (
            <div className="mb-4 lg:hidden">
              <span className="mb-1.5 block text-xs font-semibold text-neutral-300">Categoria</span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.value}
                    ativo={categoria === cat.value}
                    onClick={() => definirParam('categoria', categoria === cat.value ? '' : cat.value)}
                  >
                    {cat.emoji} {cat.label}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          {filtrosAtivos > 0 || termo ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500">Filtros aplicados:</span>
              {termo ? <ChipAtivo rotulo={`"${termo}"`} aoRemover={() => definirParam('q', '')} /> : null}
              {categoria ? (
                <ChipAtivo
                  rotulo={CATEGORIES.find((c) => c.value === categoria)?.label ?? categoria}
                  aoRemover={() => definirParam('categoria', '')}
                />
              ) : null}
              {estadoBruto ? (
                <ChipAtivo rotulo={rotuloEstadoSelecionado} aoRemover={() => definirParam('estado', '')} />
              ) : null}
              {cidade ? <ChipAtivo rotulo={cidade} aoRemover={() => definirParam('cidade', '')} /> : null}
              {regiao ? <ChipAtivo rotulo={regiao} aoRemover={() => definirParam('regiao', '')} /> : null}
              {preco ? <ChipAtivo rotulo={preco} aoRemover={() => definirParam('preco', '')} /> : null}
            </div>
          ) : null}

          {carregando ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <GroupCardSkeleton key={i} />
              ))}
            </div>
          ) : resultados.length === 0 ? (
            <EmptyState
              titulo="Nenhum grupo encontrado"
              descricao="Nao achamos nada com esses filtros. Tente outra cidade, outro estado ou remova um filtro."
              icone={<Search className="h-7 w-7" aria-hidden />}
              acao={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variante="contorno" onClick={limparTudo}>
                    Limpar filtros
                  </Button>
                  <Link to="/publicar">
                    <Button>Cadastrar meu grupo</Button>
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {resultados.map((grupo, i) => (
                <motion.div
                  key={grupo.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <GroupCard grupo={grupo} totalComentarios={comentariosPorGrupo.get(grupo.id) ?? 0} />
                </motion.div>
              ))}
            </div>
          )}

          {resultados.length > 0 ? (
            <p className="mt-6 text-center text-xs text-neutral-500">
              Mostrando {resultados.length} de {grupos.length} grupos cadastrados
            </p>
          ) : null}
        </section>
      </div>
    </div>
  )
}

function ChipAtivo({ rotulo, aoRemover }: { rotulo: string; aoRemover: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-neon/45 bg-neon/10 px-2.5 py-1 text-[11px] font-semibold text-neon">
      {rotulo}
      <button type="button" onClick={aoRemover} aria-label={`Remover filtro ${rotulo}`} className="hover:text-base">
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  )
}
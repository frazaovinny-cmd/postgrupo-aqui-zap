import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CHAVES, gravar, ler } from '@/lib/storage'
import { agora, uid } from '@/lib/utils'
import { USUARIO_DEMO, gerarComentarios, gerarGrupos, gerarNotificacoes } from '@/data/seed'
import type { Ad, AppNotification, Group, GroupComment, NotificationKind, Report } from '@/types'

interface FiltrosGrupo {
  termo?: string
  estado?: string
  cidade?: string
  categoria?: string
  preco?: string
  ordenacao?: 'recentes' | 'populares' | 'membros' | 'cliques'
}

interface DataContextValue {
  carregando: boolean
  grupos: Group[]
  comentarios: GroupComment[]
  anuncios: Ad[]
  notificacoes: AppNotification[]
  likes: string[]
  favoritos: string[]
  buscasRecentes: string[]
  naoLidas: number

  gruposFiltrados: (filtros?: FiltrosGrupo) => Group[]
  grupoPorId: (id: string) => Group | undefined
  gruposDoDono: (ownerId: string) => Group[]
  gruposDestaque: () => Group[]
  categoriasComContagem: () => Array<{ value: string; total: number }>
  cidadesComContagem: (estado?: string) => Array<{ cidade: string; total: number }>

  criarGrupo: (dados: Omit<Group, 'id' | 'criadoEm' | 'atualizadoEm' | 'gostei' | 'cliques' | 'visualizacoes'>) => Group
  editarGrupo: (id: string, dados: Partial<Group>) => void
  excluirGrupo: (id: string) => void
  alternarLike: (id: string) => boolean
  alternarFavorito: (id: string) => boolean
  registrarClique: (id: string) => void

  comentariosDoGrupo: (grupoId: string) => GroupComment[]
  comentar: (grupoId: string, texto: string, autorNome: string, autorFoto?: string, autorId?: string | null) => void

  criarAnuncio: (dados: Omit<Ad, 'id' | 'criadoEm' | 'impressoes' | 'cliques'>) => Ad
  editarAnuncio: (id: string, dados: Partial<Ad>) => void
  excluirAnuncio: (id: string) => void
  registrarCliqueAnuncio: (id: string) => void

  notificacoesDoUsuario: (userId: string) => AppNotification[]
  marcarLida: (id: string) => void
  marcarTodasLidas: (userId: string) => void
  notificar: (userId: string, tipo: NotificationKind, titulo: string, texto: string, link?: string) => void

  registrarBusca: (termo: string) => void
  limparBuscas: () => void
  reportar: (grupoId: string, motivo: string, detalhes: string) => void
  restaurarDemo: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

function seedInicial(): { grupos: Group[]; comentarios: GroupComment[]; anuncios: Ad[] } {
  const grupos = ler<Group[]>(CHAVES.grupos, [])
  if (grupos.length > 0) {
    return {
      grupos,
      comentarios: ler<GroupComment[]>(CHAVES.comentarios, []),
      anuncios: ler<Ad[]>(CHAVES.anuncios, []),
    }
  }

  const novosGrupos = gerarGrupos()
  const novosComentarios = novosGrupos.flatMap((g) => gerarComentarios(g.id))
  const novosAnuncios = ler<Ad[]>(CHAVES.anuncios, [])

  gravar(CHAVES.grupos, novosGrupos)
  gravar(CHAVES.comentarios, novosComentarios)
  gravar(CHAVES.anuncios, novosAnuncios)

  return { grupos: novosGrupos, comentarios: novosComentarios, anuncios: novosAnuncios }
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [carregando, setCarregando] = useState(true)
  const [grupos, setGrupos] = useState<Group[]>([])
  const [comentarios, setComentarios] = useState<GroupComment[]>([])
  const [anuncios, setAnuncios] = useState<Ad[]>([])
  const [notificacoes, setNotificacoes] = useState<AppNotification[]>([])
  const [likes, setLikes] = useState<string[]>([])
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [buscasRecentes, setBuscasRecentes] = useState<string[]>([])

  const likesRef = useRef<string[]>([])
  const favoritosRef = useRef<string[]>([])

  useEffect(() => {
    const seed = seedInicial()
    const likesSalvos = ler<string[]>(CHAVES.likes, [])
    const favoritosSalvos = ler<string[]>(CHAVES.favoritos, [])
    setGrupos(seed.grupos)
    setComentarios(seed.comentarios)
    setAnuncios(seed.anuncios)
    const notificacoesSalvas = ler<AppNotification[]>(CHAVES.notificacoes, [])
    setNotificacoes(
      notificacoesSalvas.length > 0 ? notificacoesSalvas : gerarNotificacoes(USUARIO_DEMO.id),
    )
    setLikes(likesSalvos)
    setFavoritos(favoritosSalvos)
    setBuscasRecentes(ler<string[]>(CHAVES.buscaRecente, []))
    likesRef.current = likesSalvos
    favoritosRef.current = favoritosSalvos
    setCarregando(false)
  }, [])

  const setGruposE = useCallback((proximos: Group[]) => {
    setGrupos(proximos)
    gravar(CHAVES.grupos, proximos)
  }, [])

  const setAnunciosE = useCallback((proximos: Ad[]) => {
    setAnuncios(proximos)
    gravar(CHAVES.anuncios, proximos)
  }, [])

  const setComentariosE = useCallback((proximos: GroupComment[]) => {
    setComentarios(proximos)
    gravar(CHAVES.comentarios, proximos)
  }, [])

  const setNotificacoesE = useCallback((proximos: AppNotification[]) => {
    setNotificacoes(proximos)
    gravar(CHAVES.notificacoes, proximos)
  }, [])

  const gruposFiltrados = useCallback(
    (filtros: FiltrosGrupo = {}): Group[] => {
      const termo = filtros.termo ? normalizar(filtros.termo.trim()) : ''
      const estado = normalizar(filtros.estado ?? '')
      const cidade = normalizar(filtros.cidade ?? '')

      let lista = grupos.filter((g) => {
        if (g.status !== 'aprovado' && g.status !== 'pendente') return false

        if (filtros.categoria && g.categoria !== filtros.categoria) return false
        if (estado && normalizar(g.estado) !== estado && normalizar(`${g.estado} ${g.cidade}`) !== estado) return false
        if (cidade && normalizar(g.cidade) !== cidade) return false
        if (filtros.preco && g.preco !== filtros.preco) return false

        if (termo) {
          const alvo = normalizar(
            [g.nome, g.descricao, g.cidade, g.estado, g.ownerNome, g.categoria, g.tags.join(' ')].join(' '),
          )
          if (!alvo.includes(termo)) return false
        }
        return true
      })

      switch (filtros.ordenacao) {
        case 'populares':
          lista = [...lista].sort((a, b) => b.cliques - a.cliques)
          break
        case 'membros':
          lista = [...lista].sort((a, b) => b.membros - a.membros)
          break
        case 'cliques':
          lista = [...lista].sort((a, b) => b.cliques - a.cliques)
          break
        default:
          lista = [...lista].sort((a, b) => {
            if (a.fixado !== b.fixado) return a.fixado ? -1 : 1
            if (a.destacado !== b.destacado) return a.destacado ? -1 : 1
            return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
          })
      }

      return lista
    },
    [grupos],
  )

  const grupoPorId = useCallback((id: string) => grupos.find((g) => g.id === id), [grupos])

  const gruposDoDono = useCallback(
    (ownerId: string) =>
      grupos
        .filter((g) => g.ownerId === ownerId)
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
    [grupos],
  )

  const gruposDestaque = useCallback(
    () => grupos.filter((g) => g.status === 'aprovado' && g.destacado).slice(0, 12),
    [grupos],
  )

  const categoriasComContagem = useCallback(() => {
    const mapa = new Map<string, number>()
    for (const g of grupos) {
      if (g.status !== 'aprovado') continue
      mapa.set(g.categoria, (mapa.get(g.categoria) ?? 0) + 1)
    }
    return [...mapa.entries()].map(([value, total]) => ({ value, total })).sort((a, b) => b.total - a.total)
  }, [grupos])

  const cidadesComContagem = useCallback(
    (estado?: string) => {
      const alvo = normalizar(estado ?? '')
      const mapa = new Map<string, number>()
      for (const g of grupos) {
        if (g.status !== 'aprovado') continue
        if (alvo && normalizar(g.estado) !== alvo) continue
        mapa.set(g.cidade, (mapa.get(g.cidade) ?? 0) + 1)
      }
      return [...mapa.entries()]
        .map(([cidade, total]) => ({ cidade, total }))
        .sort((a, b) => b.total - a.total || a.cidade.localeCompare(b.cidade, 'pt-BR'))
    },
    [grupos],
  )

  const criarGrupo = useCallback<DataContextValue['criarGrupo']>(
    (dados) => {
      const novo: Group = {
        ...dados,
        id: uid('grp'),
        criadoEm: agora(),
        atualizadoEm: agora(),
        gostei: 0,
        cliques: 0,
        visualizacoes: 0,
      }
      setGruposE([novo, ...grupos])
      return novo
    },
    [grupos, setGruposE],
  )

  const editarGrupo = useCallback(
    (id: string, dados: Partial<Group>) => {
      setGruposE(
        grupos.map((g) => (g.id === id ? { ...g, ...dados, atualizadoEm: agora() } : g)),
      )
    },
    [grupos, setGruposE],
  )

  const excluirGrupo = useCallback(
    (id: string) => {
      setGruposE(grupos.filter((g) => g.id !== id))
      const restantes = comentarios.filter((c) => c.grupoId !== id)
      setComentariosE(restantes)
    },
    [grupos, comentarios, setGruposE, setComentariosE],
  )

  const alternarLike = useCallback(
    (id: string): boolean => {
      // Espelhos em ref evitam cliques rapidos demais serem perdidos e mantem
      // o contador de "gostei" sempre coerente com a lista de curtidas.
      const adicionando = !likesRef.current.includes(id)
      likesRef.current = adicionando
        ? [...likesRef.current, id]
        : likesRef.current.filter((x) => x !== id)
      setLikes(likesRef.current)
      gravar(CHAVES.likes, likesRef.current)
      setGruposE(
        grupos.map((g) =>
          g.id === id ? { ...g, gostei: Math.max(0, g.gostei + (adicionando ? 1 : -1)) } : g,
        ),
      )
      return adicionando
    },
    [grupos, setGruposE],
  )

  const alternarFavorito = useCallback((id: string): boolean => {
    const adicionando = !favoritosRef.current.includes(id)
    favoritosRef.current = adicionando
      ? [...favoritosRef.current, id]
      : favoritosRef.current.filter((x) => x !== id)
    setFavoritos(favoritosRef.current)
    gravar(CHAVES.favoritos, favoritosRef.current)
    return adicionando
  }, [])

  const registrarClique = useCallback(
    (id: string) => {
      setGruposE(
        grupos.map((g) =>
          g.id === id ? { ...g, cliques: g.cliques + 1, visualizacoes: g.visualizacoes + 1 } : g,
        ),
      )
    },
    [grupos, setGruposE],
  )

  const comentariosDoGrupo = useCallback(
    (grupoId: string) =>
      comentarios
        .filter((c) => c.grupoId === grupoId)
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
    [comentarios],
  )

  const comentar = useCallback(
    (grupoId: string, texto: string, autorNome: string, autorFoto = '', autorId: string | null = null) => {
      const novo: GroupComment = {
        id: uid('cmt'),
        grupoId,
        autorNome,
        autorFoto,
        autorId,
        texto: texto.trim(),
        criadoEm: agora(),
      }
      setComentariosE([novo, ...comentarios])
    },
    [comentarios, setComentariosE],
  )

  const criarAnuncio = useCallback<DataContextValue['criarAnuncio']>(
    (dados) => {
      const novo: Ad = { ...dados, id: uid('ad'), criadoEm: agora(), impressoes: 0, cliques: 0 }
      setAnunciosE([novo, ...anuncios])
      return novo
    },
    [anuncios, setAnunciosE],
  )

  const editarAnuncio = useCallback(
    (id: string, dados: Partial<Ad>) => {
      setAnunciosE(anuncios.map((a) => (a.id === id ? { ...a, ...dados } : a)))
    },
    [anuncios, setAnunciosE],
  )

  const excluirAnuncio = useCallback(
    (id: string) => {
      setAnunciosE(anuncios.filter((a) => a.id !== id))
    },
    [anuncios, setAnunciosE],
  )

  const registrarCliqueAnuncio = useCallback(
    (id: string) => {
      setAnunciosE(anuncios.map((a) => (a.id === id ? { ...a, cliques: a.cliques + 1 } : a)))
    },
    [anuncios, setAnunciosE],
  )

  const notificacoesDoUsuario = useCallback(
    (userId: string) =>
      notificacoes
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
    [notificacoes],
  )

  const marcarLida = useCallback(
    (id: string) => {
      setNotificacoesE(notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)))
    },
    [notificacoes, setNotificacoesE],
  )

  const marcarTodasLidas = useCallback(
    (userId: string) => {
      setNotificacoesE(notificacoes.map((n) => (n.userId === userId ? { ...n, lida: true } : n)))
    },
    [notificacoes, setNotificacoesE],
  )

  const notificar = useCallback(
    (userId: string, tipo: NotificationKind, titulo: string, texto: string, link = '/admin') => {
      const nova: AppNotification = {
        id: uid('ntf'),
        userId,
        tipo,
        titulo,
        texto,
        link,
        lida: false,
        criadoEm: agora(),
      }
      setNotificacoesE([nova, ...notificacoes])
    },
    [notificacoes, setNotificacoesE],
  )

  const registrarBusca = useCallback((termo: string) => {
    const limpo = termo.trim()
    if (limpo.length < 2) return
    setBuscasRecentes((atual) => {
      const proxima = [limpo, ...atual.filter((t) => normalizar(t) !== normalizar(limpo))].slice(0, 8)
      gravar(CHAVES.buscaRecente, proxima)
      return proxima
    })
  }, [])

  const limparBuscas = useCallback(() => {
    setBuscasRecentes([])
    gravar(CHAVES.buscaRecente, [])
  }, [])

  const reportar = useCallback((grupoId: string, motivo: string, detalhes: string) => {
    const novo: Report = { id: uid('rep'), grupoId, motivo, detalhes, criadoEm: agora() }
    const lista = ler<Report[]>(CHAVES.reports, [])
    gravar(CHAVES.reports, [...lista, novo])
  }, [])

  const restaurarDemo = useCallback(() => {
    const novosGrupos = gerarGrupos()
    const novosComentarios = novosGrupos.flatMap((g) => gerarComentarios(g.id))
    setGruposE(novosGrupos)
    setComentariosE(novosComentarios)
    setNotificacoesE(gerarNotificacoes(USUARIO_DEMO.id))
  }, [setGruposE, setComentariosE, setNotificacoesE])

  const naoLidas = useMemo(() => notificacoes.filter((n) => !n.lida).length, [notificacoes])

  const valor = useMemo<DataContextValue>(
    () => ({
      carregando,
      grupos,
      comentarios,
      anuncios,
      notificacoes,
      likes,
      favoritos,
      buscasRecentes,
      naoLidas,
      gruposFiltrados,
      grupoPorId,
      gruposDoDono,
      gruposDestaque,
      categoriasComContagem,
      cidadesComContagem,
      criarGrupo,
      editarGrupo,
      excluirGrupo,
      alternarLike,
      alternarFavorito,
      registrarClique,
      comentariosDoGrupo,
      comentar,
      criarAnuncio,
      editarAnuncio,
      excluirAnuncio,
      registrarCliqueAnuncio,
      notificacoesDoUsuario,
      marcarLida,
      marcarTodasLidas,
      notificar,
      registrarBusca,
      limparBuscas,
      reportar,
      restaurarDemo,
    }),
    [
      carregando,
      grupos,
      comentarios,
      anuncios,
      notificacoes,
      likes,
      favoritos,
      buscasRecentes,
      naoLidas,
      gruposFiltrados,
      grupoPorId,
      gruposDoDono,
      gruposDestaque,
      categoriasComContagem,
      cidadesComContagem,
      criarGrupo,
      editarGrupo,
      excluirGrupo,
      alternarLike,
      alternarFavorito,
      registrarClique,
      comentariosDoGrupo,
      comentar,
      criarAnuncio,
      editarAnuncio,
      excluirAnuncio,
      registrarCliqueAnuncio,
      notificacoesDoUsuario,
      marcarLida,
      marcarTodasLidas,
      notificar,
      registrarBusca,
      limparBuscas,
      reportar,
      restaurarDemo,
    ],
  )

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData precisa estar dentro de <DataProvider>')
  return ctx
}
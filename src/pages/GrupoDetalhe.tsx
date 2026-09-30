import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  Clock,
  Copy,
  Eye,
  Flag,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Avatar, CategoriaBadge, StatPill } from '@/components/ui/Bits'
import { Card } from '@/components/ui/Primitives'
import { Modal } from '@/components/ui/Modal'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States'
import { CATEGORIES } from '@/types'
import { rotuloEstado } from '@/data/geo'
import {
  cn,
  formatarData,
  formatarMembros,
  formatarMoeda,
  formatarNumero,
  navegarParaWhatsapp,
  tempoRelativo,
} from '@/lib/utils'

export default function GrupoDetalhe() {
  const { id = '' } = useParams()
  const navegar = useNavigate()
  const { grupoPorId, carregando, comentariosDoGrupo, comentar, favoritos, alternarFavorito, registrarClique, grupos, reportar } =
    useData()
  const { autenticado, usuario } = useAuth()
  const { sucesso, erro, info } = useToast()

  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [modalReport, setModalReport] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [detalhes, setDetalhes] = useState('')

  const grupo = grupoPorId(id)

  useSeo({
    titulo: grupo ? `${grupo.nome} - ${grupo.cidade}/${grupo.estado}` : 'Grupo nao encontrado',
    descricao: grupo?.descricao ?? 'Link de grupo de WhatsApp no PostGrupo Aqui Zap.',
    caminho: `/grupo/${id}`,
    noindex: !grupo,
  })

  useEffect(() => {
    if (grupo && !carregando) registrarClique(grupo.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, carregando])

  const comentarios = useMemo(() => comentariosDoGrupo(id), [comentariosDoGrupo, id])

  const similares = useMemo(() => {
    if (!grupo) return []
    return grupos
      .filter((g) => g.id !== grupo.id && g.status === 'aprovado' && (g.categoria === grupo.categoria || g.estado === grupo.estado))
      .slice(0, 4)
  }, [grupo, grupos])

  if (carregando) return <PaginaCarregando />

  if (!grupo) {
    return (
      <ErrorState
        titulo="Grupo nao encontrado"
        descricao="Este link pode ter sido removido ou o grupo foi excluido pelo administrador."
        aoTentarNovamente={() => navegar('/buscar')}
      />
    )
  }

  const salvo = favoritos.includes(grupo.id)
  const meta = CATEGORIES.find((c) => c.value === grupo.categoria)

  const entrar = (): void => {
    registrarClique(grupo.id)
    navegarParaWhatsapp(grupo.link, `Ola! Vi o grupo "${grupo.nome}" no PostGrupo Aqui Zap e quero entrar.`)
  }

  const copiarLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(grupo.link)
      sucesso('Link de convite copiado!')
    } catch {
      info('Copie manualmente', grupo.link)
    }
  }

  const compartilhar = async (): Promise<void> => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: grupo.nome, text: grupo.descricao, url })
      } else {
        await navigator.clipboard.writeText(url)
        sucesso('Link do grupo copiado para compartilhar')
      }
    } catch {
      /* usuario cancelou */
    }
  }

  const enviarComentario = async (): Promise<void> => {
    if (texto.trim().length < 2) {
      erro('Comentario vazio', 'Escreva ao menos duas letras.')
      return
    }
    setEnviando(true)
    await new Promise((r) => setTimeout(r, 350))
    comentar(id, texto, usuario?.nome ?? 'Visitante', usuario?.foto, usuario?.id ?? null)
    setTexto('')
    setEnviando(false)
    sucesso('Comentario publicado')
  }

  const enviarReport = (): void => {
    if (!motivo) {
      erro('Escolha um motivo')
      return
    }
    reportar(id, motivo, detalhes)
    setModalReport(false)
    setMotivo('')
    setDetalhes('')
    sucesso('Denuncia enviada', 'Ouras equipe vai analisar em breve.')
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navegar(-1)}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-neutral-400 transition hover:text-neon"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar
      </button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="pgz-surface overflow-hidden rounded-2xl border"
          >
            <div
              className="relative h-48 w-full sm:h-64"
              style={{
                background: `linear-gradient(135deg, ${grupo.corDestaque}33 0%, #101441 55%, #152237 100%)`,
              }}
            >
              {grupo.imagem ? (
                <img
                  src={grupo.imagem}
                  alt={`Capa de ${grupo.nome}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-full place-items-center bg-grid-neon bg-grid">
                  <span className="text-6xl" aria-hidden>
                    {meta?.emoji ?? '\u{1F4E6}'}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
                <CategoriaBadge categoria={grupo.categoria} tamanho="md" />
                {grupo.preco === 'pago' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    {formatarMoeda(grupo.valor)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-neon/20 px-2.5 py-1 text-xs font-bold text-neon">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Gratuito
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-xl font-extrabold tracking-tight text-neutral-100 sm:text-2xl">{grupo.nome}</h1>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {grupo.cidade} — {rotuloEstado(grupo.estado)}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      publicado {tempoRelativo(grupo.criadoEm)}
                    </span>
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => alternarFavorito(grupo.id)}
                    className={cn(
                      'grid h-11 w-11 place-items-center rounded-xl border transition',
                      salvo ? 'border-neon/50 bg-neon/15 text-neon' : 'border-base-600 text-neutral-400 hover:text-neon',
                    )}
                    aria-label={salvo ? 'Remover dos salvos' : 'Salvar'}
                    aria-pressed={salvo}
                  >
                    <Bookmark className={cn('h-5 w-5', salvo && 'fill-current')} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void compartilhar()}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-base-600 text-neutral-400 transition hover:text-neon"
                    aria-label="Compartilhar"
                  >
                    <Share2 className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-300">{grupo.descricao}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {grupo.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/buscar?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-base-600 px-2.5 py-1 text-[11px] text-neutral-400 transition hover:border-neon/40 hover:text-neon"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-base-600 py-3">
                <StatPill icone={<Users className="h-4 w-4" aria-hidden />} valor={formatarMembros(grupo.membros)} rotulo="membros" />
                <StatPill icone={<Eye className="h-4 w-4" aria-hidden />} valor={formatarNumero(grupo.cliques)} rotulo="cliques" />
                <StatPill icone={<Heart className="h-4 w-4" aria-hidden />} valor={formatarNumero(grupo.gostei)} rotulo="curtidas" />
                <StatPill icone={<MessageCircle className="h-4 w-4" aria-hidden />} valor={comentarios.length} rotulo="comentarios" />
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button tamanho="lg" onClick={entrar} className="sm:flex-1">
                  <Users className="h-[18px] w-[18px]" aria-hidden />
                  Entrar no grupo no WhatsApp
                </Button>
                <Button variante="contorno" tamanho="lg" onClick={() => void copiarLink()}>
                  <Copy className="h-4 w-4" aria-hidden />
                  Copiar link
                </Button>
              </div>

              <p className="mt-3 text-center text-[11px] text-neutral-500">
                Voce sera levado ao WhatsApp. Confirme a entrada no grupo.
              </p>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setModalReport(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 transition hover:text-red-400"
                >
                  <Flag className="h-3.5 w-3.5" aria-hidden />
                  Denunciar conteudo invalido
                </button>
              </div>
            </div>
          </motion.div>

          <Card id="comentarios" padding="md" className="scroll-mt-24">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-neutral-100">
                <MessageCircle className="h-[18px] w-[18px] text-neon" aria-hidden />
                Comentarios
                <span className="rounded-full bg-base-700 px-2 text-[11px] text-neon">{comentarios.length}</span>
              </h2>
            </div>

            <div className="mt-4 flex gap-3">
              <Avatar nome={usuario?.nome ?? 'Voce'} url={usuario?.foto} tamanho={36} />
              <div className="min-w-0 flex-1">
                <Textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder={
                    autenticado ? 'Deixe seu comentario sobre este grupo…' : 'Entre com sua conta para comentar'
                  }
                  rows={3}
                  disabled={!autenticado}
                  maxLength={280}
                  aria-label="Escrever comentario"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-500">{texto.length}/280</span>
                  {autenticado ? (
                    <Button tamanho="sm" onClick={() => void enviarComentario()} carregando={enviando}>
                      <Send className="h-3.5 w-3.5" aria-hidden />
                      Publicar
                    </Button>
                  ) : (
                    <Link to="/entrar">
                      <Button tamanho="sm" variante="contorno">
                        Entrar para comentar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <ul className="mt-5 space-y-4">
              {comentarios.length === 0 ? (
                <li>
                  <EmptyState
                    titulo="Nenhum comentario ainda"
                    descricao="Seja a primeira pessoa a comentar sobre este grupo."
                    icone={<MessageCircle className="h-6 w-6" aria-hidden />}
                  />
                </li>
              ) : (
                comentarios.map((comentario) => (
                  <li key={comentario.id} className="flex gap-3">
                    <Avatar nome={comentario.autorNome} url={comentario.autorFoto} tamanho={36} />
                    <div className="min-w-0 flex-1">
                      <div className="pgz-surface rounded-2xl rounded-tl-sm border px-3.5 py-2.5">
                        <p className="text-xs font-bold text-neon">{comentario.autorNome}</p>
                        <p className="mt-1 break-words text-sm text-neutral-300">{comentario.texto}</p>
                      </div>
                      <p className="mt-1 px-1 text-[10px] text-neutral-500">{tempoRelativo(comentario.criadoEm)}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card padding="md">
            <h2 className="text-sm font-bold text-neutral-100">Sobre o administrador</h2>
            <div className="mt-3 flex items-center gap-3">
              <Link to={`/perfil/${grupo.ownerId}`}>
                <Avatar nome={grupo.ownerNome} url={grupo.ownerFoto} tamanho={48} anel />
              </Link>
              <div className="min-w-0">
                <Link
                  to={`/perfil/${grupo.ownerId}`}
                  className="block truncate text-sm font-bold text-neutral-100 hover:text-neon"
                >
                  {grupo.ownerNome}
                </Link>
                <p className="text-[11px] text-neutral-500">Administrador do grupo</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-neutral-500">Grupos publicados</dt>
                <dd className="font-semibold text-neutral-200">
                  {grupos.filter((g) => g.ownerId === grupo.ownerId).length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-500">MembrosSomados</dt>
                <dd className="font-semibold text-neutral-200">
                  {formatarMembros(grupos.filter((g) => g.ownerId === grupo.ownerId).reduce((s, g) => s + g.membros, 0))}
                </dd>
              </div>
            </dl>
          </Card>

          <Card padding="md" className="border-amber-400/25">
            <h2 className="flex items-center gap-2 text-sm font-bold text-amber-200">
              <AlertTriangle className="h-4 w-4" aria-hidden />
              Fique atento
            </h2>
            <ul className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-neutral-400">
              <li>• Nunca Envie dinheiro ou senha a desconhecidos.</li>
              <li>• Confirme as regras do grupo antes de participar.</li>
              <li>• O PostGrupo Aqui Zap nao responde pelo conteudo publicado.</li>
            </ul>
          </Card>

          {similares.length > 0 ? (
            <Card padding="md">
              <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-100">
                <TrendingUp className="h-4 w-4 text-neon" aria-hidden />
                Grupos parecidos
              </h2>
              <ul className="mt-3 space-y-2">
                {similares.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/grupo/${item.id}`}
                      className="pgz-surface flex min-h-[52px] items-center gap-2.5 rounded-xl border p-2.5 transition hover:border-neon/40"
                    >
                      <Avatar nome={item.nome} tamanho={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-neutral-200">{item.nome}</span>
                        <span className="block text-[10px] text-neutral-500">
                          {item.cidade} - {item.estado}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <p className="text-center text-[10px] text-neutral-600">
            Publicado em {formatarData(grupo.criadoEm)} · atualizado {tempoRelativo(grupo.atualizadoEm)}
          </p>
        </aside>
      </div>

      <Modal
        aberto={modalReport}
        aoFechar={() => setModalReport(false)}
        titulo="Denunciar grupo"
        descricao="Conte o que esta errado. Nossa equipe analisa em ate 48h."
        tamanho="sm"
        rodape={
          <>
            <Button variante="fantasma" onClick={() => setModalReport(false)}>
              Cancelar
            </Button>
            <Button variante="perigo" onClick={enviarReport}>
              Enviar denuncia
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="space-y-2">
            {['Link quebrado', 'Golpe ou fraude', 'Conteudo proibido', 'Informacoes falsas', 'Outro'].map((item) => (
              <label
                key={item}
                className={cn(
                  'flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 text-sm transition',
                  motivo === item
                    ? 'border-neon/50 bg-neon/10 text-neon'
                    : 'border-base-600 text-neutral-300 hover:border-neon/30',
                )}
              >
                <input
                  type="radio"
                  name="motivo"
                  value={item}
                  checked={motivo === item}
                  onChange={() => setMotivo(item)}
                  className="h-4 w-4 accent-[#53e515]"
                />
                {item}
              </label>
            ))}
          </div>
          <Textarea
            label="Detalhes (opcional)"
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
            placeholder="Descreva o problema para ajudarmos a revisar."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  )
}

function PaginaCarregando() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="pgz-surface space-y-4 rounded-2xl border p-5">
        <Skeleton className="h-48 w-full rounded-xl sm:h-64" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  )
}
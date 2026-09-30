import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Copy,
  Eye,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Group } from '@/types'
import { CATEGORIES } from '@/types'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { Avatar, CategoriaBadge, StatPill } from '@/components/ui/Bits'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/States'
import {
  cn,
  formatarMembros,
  formatarMoeda,
  formatarNumero,
  navegarParaWhatsapp,
  tempoRelativo,
  titulo as cortarTitulo,
} from '@/lib/utils'

function Capa({ grupo, altura = 'h-44 sm:h-52' }: { grupo: Group; altura?: string }) {
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setCarregando(true)
  }, [grupo.imagem])

  const estilo: React.CSSProperties = {
    background: `linear-gradient(135deg, ${grupo.corDestaque}2e 0%, #101441 55%, #152237 100%)`,
  }

  return (
    <div className={cn('relative w-full overflow-hidden', altura)} style={estilo}>
      {grupo.imagem ? (
        <>
          {carregando ? <Skeleton className="absolute inset-0 h-full w-full rounded-none" /> : null}
          <img
            src={grupo.imagem}
            alt={`Capa do grupo ${grupo.nome}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setCarregando(false)}
            onError={() => setCarregando(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-grid-neon bg-grid">
          <span className="text-5xl opacity-80" aria-hidden>
            {CATEGORIES.find((c) => c.value === grupo.categoria)?.emoji ?? '\u{1F4E6}'}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        <div className="flex flex-wrap gap-1.5">
          <CategoriaBadge categoria={grupo.categoria} />
          {grupo.preco === 'pago' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
              <Lock className="h-3 w-3" aria-hidden />
              {formatarMoeda(grupo.valor)}
            </span>
          ) : null}
          {grupo.destacado ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-neon/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neon">
              <TrendingUp className="h-3 w-3" aria-hidden />
              Destaque
            </span>
          ) : null}
        </div>
        {grupo.status === 'pendente' ? (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
            Em analise
          </span>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
    </div>
  )
}

interface Props {
  grupo: Group
  compacto?: boolean
  totalComentarios?: number
}

export function GroupCard({ grupo, compacto = false, totalComentarios = 0 }: Props) {
  const { likes, favoritos, alternarLike, alternarFavorito, registrarClique } = useData()
  const { sucesso, info, erro } = useToast()

  const curtido = likes.includes(grupo.id)
  const salvo = favoritos.includes(grupo.id)

  const entrar = (): void => {
    registrarClique(grupo.id)
    navegarParaWhatsapp(grupo.link, `Ola! Vi o grupo "${grupo.nome}" no PostGrupo Aqui Zap e quero entrar.`)
    sucesso('Abrindo no WhatsApp', 'Se o link nao funcionar, copie e cole direto no chat.')
  }

  const compartilhar = async (): Promise<void> => {
    const url = `${window.location.origin}/grupo/${grupo.id}`
    const dados = { title: grupo.nome, text: grupo.descricao, url }
    try {
      if (navigator.share) {
        await navigator.share(dados)
        return
      }
      await navigator.clipboard.writeText(url)
      sucesso('Link copiado', 'Cole em qualquer lugar para compartilhar o grupo.')
    } catch {
      erro('Nao foi possivel compartilhar', 'Tente copiar o link manualmente.')
    }
  }

  const copiar = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(grupo.link)
      sucesso('Link de convite copiado')
    } catch {
      info('Copie manualmente', grupo.link)
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className={cn(
        'pgz-surface group overflow-hidden rounded-2xl border shadow-card transition-all duration-300',
        'hover:-translate-y-1 hover:border-neon/35 hover:shadow-lift',
      )}
    >
      <div className="flex items-center gap-3 p-3.5">
        <Link to={`/perfil/${grupo.ownerId}`} className="shrink-0" aria-label={`Perfil de ${grupo.ownerNome}`}>
          <Avatar nome={grupo.ownerNome} url={grupo.ownerFoto} tamanho={40} />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/grupo/${grupo.id}`}
            className="line-clamp-1 block text-sm font-bold text-neutral-100 hover:text-neon"
          >
            {grupo.nome}
          </Link>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {grupo.cidade} - {grupo.estado}
            </span>
            <span aria-hidden>·</span>
            <span>{tempoRelativo(grupo.criadoEm)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => alternarFavorito(grupo.id)}
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition',
            salvo
              ? 'border-neon/50 bg-neon/15 text-neon'
              : 'border-base-600 text-neutral-400 hover:border-neon/40 hover:text-neon',
          )}
          aria-label={salvo ? 'Remover dos salvos' : 'Salvar grupo'}
          aria-pressed={salvo}
        >
          <Bookmark className={cn('h-[18px] w-[18px]', salvo && 'fill-current')} aria-hidden />
        </button>
      </div>

      <Link to={`/grupo/${grupo.id}`} className="block">
        <Capa grupo={grupo} altura={compacto ? 'h-32' : 'h-44 sm:h-52'} />
      </Link>

      <div className="p-3.5">
        <div className="flex items-center gap-1 border-b border-base-600 pb-2.5">
          <button
            type="button"
            onClick={() => alternarLike(grupo.id)}
            className={cn(
              'flex min-h-[40px] items-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition',
              curtido ? 'text-red-400' : 'text-neutral-300 hover:text-red-400',
            )}
            aria-label={curtido ? 'Remover curtida' : 'Curtir grupo'}
            aria-pressed={curtido}
          >
            <Heart className={cn('h-5 w-5', curtido && 'fill-current')} aria-hidden />
            {formatarNumero(grupo.gostei, true)}
          </button>

          <Link
            to={`/grupo/${grupo.id}#comentarios`}
            className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-neutral-300 transition hover:text-neon"
            aria-label="Ver comentarios"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            {totalComentarios}
          </Link>

          <button
            type="button"
            onClick={() => void compartilhar()}
            className="flex min-h-[40px] items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-neutral-300 transition hover:text-neon"
            aria-label="Compartilhar grupo"
          >
            <Share2 className="h-5 w-5" aria-hidden />
          </button>

          <span className="ml-auto flex items-center gap-1 text-[11px] text-neutral-500">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {formatarNumero(grupo.cliques, true)}
          </span>
        </div>

        {!compacto ? (
          <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-neutral-300">
            <span className="font-bold text-neon">{grupo.ownerNome}</span> {grupo.descricao}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {grupo.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/buscar?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-base-600 px-2 py-0.5 text-[10px] text-neutral-400 transition hover:border-neon/40 hover:text-neon"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <StatPill icone={<Users className="h-3.5 w-3.5" aria-hidden />} valor={formatarMembros(grupo.membros)} rotulo="membros" />
          <StatPill
            icone={<Eye className="h-3.5 w-3.5" aria-hidden />}
            valor={`${formatarNumero(grupo.cliques, true)} cliques`}
            rotulo="cliques"
          />
        </div>

        <div className="mt-3.5 flex gap-2">
          <Button
            variante="primario"
            tamanho="sm"
            className="flex-1"
            onClick={entrar}
          >
            <Users className="h-4 w-4" aria-hidden />
            Entrar no grupo
          </Button>
          <Button variante="contorno" tamanho="sm" tamanhoIcone onClick={() => void copiar()} aria-label="Copiar link">
            <Copy className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        {grupo.preco === 'pago' ? (
          <p className="mt-2 text-center text-[10px] text-neutral-500">
            Grupo pago — taxa de acesso informada pelo administrador: {cortarTitulo(grupo.descricao, 60)}
          </p>
        ) : null}
      </div>
    </motion.article>
  )
}

export function GroupCardSkeleton() {
  return (
    <div className="pgz-surface overflow-hidden rounded-2xl border">
      <div className="flex items-center gap-3 p-3.5">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-44 w-full rounded-none sm:h-52" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}

export { Capa }
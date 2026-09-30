import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, Crown, MapPin, MessageSquare, Users } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { GroupCard, GroupCardSkeleton } from '@/components/GroupCard'
import { Avatar, CategoriaBadge } from '@/components/ui/Bits'
import { Card } from '@/components/ui/Primitives'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { CATEGORIES } from '@/types'
import { formatarData, formatarMembros, formatarNumero, pluralizar } from '@/lib/utils'

export default function PerfilPublico() {
  const { id = '' } = useParams()
  const { grupos, carregando, comentarios } = useData()

  const dono = useMemo(() => {
    const gruposDoDono = grupos.filter((g) => g.ownerId === id)
    const primeiro = gruposDoDono[0]
    if (!primeiro) return null
    return {
      id: primeiro.ownerId,
      nome: primeiro.ownerNome,
      foto: primeiro.ownerFoto,
      grupos: gruposDoDono,
    }
  }, [grupos, id])

  useSeo({
    titulo: dono ? `${dono.nome} - grupos publicados` : 'Perfil nao encontrado',
    descricao: dono
      ? `Veja os grupos de WhatsApp publicados por ${dono.nome} no PostGrupo Aqui Zap.`
      : 'Perfil de administrador no PostGrupo Aqui Zap.',
    caminho: `/perfil/${id}`,
    noindex: !dono,
  })

  const comentariosPorGrupo = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const c of comentarios) mapa.set(c.grupoId, (mapa.get(c.grupoId) ?? 0) + 1)
    return mapa
  }, [comentarios])

  const totalMembros = useMemo(
    () => (dono ? dono.grupos.reduce((s, g) => s + g.membros, 0) : 0),
    [dono],
  )
  const totalCliques = useMemo(() => (dono ? dono.grupos.reduce((s, g) => s + g.cliques, 0) : 0), [dono])

  if (carregando) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GroupCardSkeleton />
          <GroupCardSkeleton />
        </div>
      </div>
    )
  }

  if (!dono) {
    return (
      <ErrorState
        titulo="Perfil nao encontrado"
        descricao="Este administrador ainda nao possui grupos publicados."
        aoTentarNovamente={() => window.location.assign('/buscar')}
      />
    )
  }

  const categorias = [...new Set(dono.grupos.map((g) => g.categoria))]

  return (
    <div className="space-y-6">
      <Card padding="none" className="overflow-hidden">
        <div className="relative h-28 bg-gradient-to-r from-primary via-primary-600 to-support">
          <div className="absolute inset-0 bg-grid-neon bg-grid opacity-40" aria-hidden />
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-wrap items-end gap-4">
            <div className="rounded-full bg-base-800 p-1">
              <Avatar nome={dono.nome} url={dono.foto} tamanho={84} anel />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-neutral-100">
                {dono.nome}
                <Crown className="h-4 w-4 text-amber-300" aria-label="Administrador" />
              </h1>
              <p className="mt-0.5 text-xs text-neutral-500">
                {pluralizar(dono.grupos.length, 'grupo publicado', 'grupos publicados')}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icone: MessageSquare, rotulo: 'Grupos', valor: formatarNumero(dono.grupos.length) },
              { icone: Users, rotulo: 'Membros', valor: formatarMembros(totalMembros) },
              { icone: CalendarDays, rotulo: 'Atualizado', valor: formatarData(dono.grupos[0]?.atualizadoEm ?? '') },
              { icone: Crown, rotulo: 'Cliques', valor: formatarNumero(totalCliques, true) },
            ].map((item) => (
              <div key={item.rotulo} className="rounded-xl border border-base-600 p-3">
                <item.icone className="h-4 w-4 text-neon" aria-hidden />
                <dd className="mt-1 text-sm font-extrabold text-neutral-100">{item.valor}</dd>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-500">{item.rotulo}</dt>
              </div>
            ))}
          </dl>

          {categorias.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {categorias.map((cat) => (
                <CategoriaBadge key={cat} categoria={cat} />
              ))}
            </div>
          ) : null}

          {dono.grupos[0]?.estado ? (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-400">
              <MapPin className="h-3.5 w-3.5 text-neon" aria-hidden />
              Atua em {dono.grupos[0]?.cidade} - {dono.grupos[0]?.estado}
            </p>
          ) : null}
        </div>
      </Card>

      <section aria-labelledby="grupos-do-perfil">
        <h2 id="grupos-do-perfil" className="mb-4 text-lg font-bold text-neutral-100">
          Grupos publicados
        </h2>

        {dono.grupos.length === 0 ? (
          <EmptyState titulo="Nenhum grupo publicado" descricao="Este administrador ainda nao publicou grupos." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dono.grupos.map((grupo) => (
              <GroupCard
                key={grupo.id}
                grupo={grupo}
                totalComentarios={comentariosPorGrupo.get(grupo.id) ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">
          Falou com{' '}
          <span className="font-bold text-neon">{dono.nome}</span>? Fale pelo WhatsApp.
        </p>
        <Link to="/publicar">
          <span className="inline-flex h-9 items-center rounded-lg border border-neon/45 px-3.5 text-xs font-semibold text-neon transition hover:bg-neon/10">
            Publicar tambem
          </span>
        </Link>
      </Card>

      <p className="text-center text-[10px] text-neutral-600">
        Categorias mais usadas:{' '}
        {categorias
          .slice(0, 3)
          .map((c) => CATEGORIES.find((x) => x.value === c)?.label)
          .join(' · ')}
      </p>
    </div>
  )
}
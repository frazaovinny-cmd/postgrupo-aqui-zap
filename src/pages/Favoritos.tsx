import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Compass, Trash2 } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useSeo } from '@/hooks/useSeo'
import { GroupCard, GroupCardSkeleton } from '@/components/GroupCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { formatarNumero } from '@/lib/utils'

export default function Favoritos() {
  useSeo({ titulo: 'Meus grupos salvos', caminho: '/favoritos', noindex: true })

  const { grupos, favoritos, carregando, comentarios, alternarFavorito } = useData()

  const salvos = useMemo(
    () => grupos.filter((g) => favoritos.includes(g.id)),
    [grupos, favoritos],
  )

  const comentariosPorGrupo = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const c of comentarios) mapa.set(c.grupoId, (mapa.get(c.grupoId) ?? 0) + 1)
    return mapa
  }, [comentarios])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neon">Sua lista</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Grupos salvos</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {salvos.length === 0
              ? 'Salve grupos para acessar depois'
              : `${formatarNumero(salvos.length)} ${salvos.length === 1 ? 'grupo salvo' : 'grupos salvos'} neste navegador`}
          </p>
        </div>
        {salvos.length > 0 ? (
          <Button
            variante="contorno"
            tamanho="sm"
            onClick={() => salvos.forEach((g) => alternarFavorito(g.id))}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Limpar lista
          </Button>
        ) : null}
      </header>

      {carregando ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GroupCardSkeleton />
          <GroupCardSkeleton />
        </div>
      ) : salvos.length === 0 ? (
        <EmptyState
          titulo="Nenhum grupo salvo ainda"
          descricao="Toque no icone de marcador em qualquer grupo para guardar aqui e acessar depois."
          icone={<Bookmark className="h-6 w-6" aria-hidden />}
          acao={
            <Link to="/buscar">
              <Button>
                <Compass className="h-4 w-4" aria-hidden />
                Explorar grupos
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {salvos.map((grupo) => (
            <GroupCard
              key={grupo.id}
              grupo={grupo}
              totalComentarios={comentariosPorGrupo.get(grupo.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
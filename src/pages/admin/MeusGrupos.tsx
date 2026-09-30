import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Edit3, ExternalLink, Eye, Heart, MessageSquare, Plus, Trash2, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Primitives'
import { Avatar, CategoriaBadge, Chip } from '@/components/ui/Bits'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/States'
import type { Group } from '@/types'
import { cn, formatarMembros, formatarNumero, tempoRelativo } from '@/lib/utils'

const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'aprovado', rotulo: 'Publicados' },
  { valor: 'pendente', rotulo: 'Em analise' },
] as const

type Filtro = (typeof FILTROS)[number]['valor']

export default function MeusGrupos() {
  useSeo({ titulo: 'Meus grupos', caminho: '/admin/grupos', noindex: true })

  const { usuario } = useAuth()
  const { gruposDoDono, comentarios, excluirGrupo } = useData()
  const { sucesso, aviso } = useToast()

  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [aExcluir, setAExcluir] = useState<Group | null>(null)
  const [removendo, setRemovendo] = useState(false)

  const meus = useMemo(() => {
    if (!usuario) return []
    const lista = gruposDoDono(usuario.id)
    return filtro === 'todos' ? lista : lista.filter((g) => g.status === filtro)
  }, [gruposDoDono, usuario, filtro])

  const contagem = useMemo(() => {
    if (!usuario) return { total: 0, aprovados: 0, cliques: 0 }
    const lista = gruposDoDono(usuario.id)
    return {
      total: lista.length,
      aprovados: lista.filter((g) => g.status === 'aprovado').length,
      cliques: lista.reduce((s, g) => s + g.cliques, 0),
    }
  }, [gruposDoDono, usuario])

  const confirmarExclusao = (): void => {
    if (!aExcluir) return
    setRemovendo(true)
    window.setTimeout(() => {
      excluirGrupo(aExcluir.id)
      setRemovendo(false)
      setAExcluir(null)
      sucesso('Grupo removido', 'Ele nao aparece mais nas buscas.')
    }, 400)
  }

  if (!usuario) return null

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neon">Conteudo</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Meus grupos</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {contagem.total} publicados · {formatarNumero(contagem.cliques)} cliques acumulados
          </p>
        </div>
        <Link to="/publicar">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            Novo grupo
          </Button>
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((item) => {
          const total =
            item.valor === 'todos'
              ? contagem.total
              : gruposDoDono(usuario.id).filter((g) => g.status === item.valor).length
          return (
            <Chip key={item.valor} ativo={filtro === item.valor} onClick={() => setFiltro(item.valor)} total={total}>
              {item.rotulo}
            </Chip>
          )
        })}
      </div>

      {meus.length === 0 ? (
        <EmptyState
          titulo={filtro === 'todos' ? 'Voce ainda nao publicou grupos' : 'Nada neste filtro'}
          descricao={
            filtro === 'todos'
              ? 'Publique o primeiro grupo para comecar a receber cliques da sua cidade.'
              : 'Troque o filtro para ver outros grupos.'
          }
          icone={<Users className="h-6 w-6" aria-hidden />}
          acao={
            filtro === 'todos' ? (
              <Link to="/publicar">
                <Button>Publicar meu grupo</Button>
              </Link>
            ) : (
              <Button variante="contorno" onClick={() => setFiltro('todos')}>
                Ver todos
              </Button>
            )
          }
        />
      ) : (
        <ul className="space-y-3">
          {meus.map((grupo, i) => {
            const totalComents = comentarios.filter((c) => c.grupoId === grupo.id).length
            return (
              <motion.li
                key={grupo.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(i * 0.05, 0.35) }}
              >
                <Card padding="md">
                  <div className="flex flex-wrap items-start gap-4">
                    <Avatar nome={grupo.nome} tamanho={52} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/grupo/${grupo.id}`}
                          className="text-base font-bold text-neutral-100 hover:text-neon"
                        >
                          {grupo.nome}
                        </Link>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                            grupo.status === 'aprovado'
                              ? 'bg-neon/15 text-neon'
                              : grupo.status === 'pendente'
                                ? 'bg-amber-500/15 text-amber-300'
                                : 'bg-red-500/15 text-red-400',
                          )}
                        >
                          {grupo.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-neutral-400">
                        {grupo.cidade} - {grupo.estado} · publicado {tempoRelativo(grupo.criadoEm)}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <CategoriaBadge categoria={grupo.categoria} />
                        {grupo.preco === 'pago' ? (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            Pago
                          </span>
                        ) : null}
                        {grupo.destacado ? (
                          <span className="rounded-full bg-neon/15 px-2 py-0.5 text-[10px] font-bold text-neon">
                            Destaque
                          </span>
                        ) : null}
                      </div>

                      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                        {[
                          { icone: Eye, rotulo: 'Cliques', valor: formatarNumero(grupo.cliques) },
                          { icone: Users, rotulo: 'Membros', valor: formatarMembros(grupo.membros) },
                          { icone: Heart, rotulo: 'Curtidas', valor: formatarNumero(grupo.gostei) },
                          { icone: MessageSquare, rotulo: 'Coment.', valor: String(totalComents) },
                        ].map((item) => (
                          <div key={item.rotulo} className="flex items-center gap-1.5">
                            <item.icone className="h-3.5 w-3.5 text-neutral-500" aria-hidden />
                            <dt className="text-neutral-500">{item.rotulo}</dt>
                            <dd className="font-semibold text-neutral-200">{item.valor}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                      <Link to={`/grupo/${grupo.id}`} className="flex-1 sm:flex-none">
                        <Button variante="secundario" tamanho="sm" cheio className="sm:w-auto">
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/publicar?id=${grupo.id}`} className="flex-1 sm:flex-none">
                        <Button variante="contorno" tamanho="sm" cheio className="sm:w-auto">
                          <Edit3 className="h-3.5 w-3.5" aria-hidden />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variante="perigo"
                        tamanho="sm"
                        tamanhoIcone
                        onClick={() => {
                          aviso('Remover grupo?', 'Esta acao nao pode ser desfeita.')
                          setAExcluir(grupo)
                        }}
                        aria-label={`Excluir ${grupo.nome}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.li>
            )
          })}
        </ul>
      )}

      <Modal
        aberto={aExcluir !== null}
        aoFechar={() => setAExcluir(null)}
        titulo="Remover grupo"
        descricao={`"${aExcluir?.nome ?? ''}" sera removido permanentemente do site.`}
        tamanho="sm"
        rodape={
          <>
            <Button variante="fantasma" onClick={() => setAExcluir(null)}>
              Cancelar
            </Button>
            <Button variante="perigo" onClick={confirmarExclusao} carregando={removendo}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Remover definitivamente
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-400">
          Os comentarios deste grupo tambem serao apagados. Se voce apenas quer pausar a divulgacao, edite o grupo e
          marque como pago temporariamente.
        </p>
      </Modal>
    </div>
  )
}
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Edit3, Eye, Info, MousePointerClick, Plus, Power, Trash2, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Primitives'
import { Modal } from '@/components/ui/Modal'
import { Chip, ProgresoBar } from '@/components/ui/Bits'
import { EmptyState } from '@/components/ui/States'
import type { Ad, AdPlacement } from '@/types'
import { cn, formatarNumero, mascaraCelularBR, porcentagem, somenteDigitos, urlValida } from '@/lib/utils'

const POSICOES: Array<{ value: AdPlacement; label: string; descricao: string }> = [
  { value: 'feed', label: 'Feed', descricao: 'Cartao no topo da pagina inicial' },
  { value: 'lateral', label: 'Lateral', descricao: 'Coluna ao lado do feed' },
  { value: 'destaque', label: 'Destaque', descricao: 'Faixa de destaque no topo' },
  { value: 'stories', label: 'Stories', descricao: 'Circulos de destaque do topo' },
]

interface Erros {
  titulo?: string
  descricao?: string
  link?: string
  telefone?: string
}

const VAZIO = {
  titulo: '',
  descricao: '',
  link: '',
  telefone: '',
  posicao: 'feed' as AdPlacement,
  ativo: true,
}

export default function MeusAnuncios() {
  useSeo({ titulo: 'Meus anuncios', caminho: '/admin/anuncios', noindex: true })

  const { usuario, adicionarPontos } = useAuth()
  const { anuncios, criarAnuncio, editarAnuncio, excluirAnuncio, notificar } = useData()
  const { sucesso, erro } = useToast()

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Ad | null>(null)
  const [form, setForm] = useState({ ...VAZIO })
  const [erros, setErros] = useState<Erros>({})
  const [salvando, setSalvando] = useState(false)
  const [aExcluir, setAExcluir] = useState<Ad | null>(null)

  const meus = useMemo(() => {
    if (!usuario) return []
    return anuncios
      .filter((a) => a.ownerId === usuario.id || a.ownerNome === usuario.nome)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
  }, [anuncios, usuario])

  const totais = useMemo(() => {
    const impressoes = meus.reduce((s, a) => s + a.impressoes, 0)
    const cliques = meus.reduce((s, a) => s + a.cliques, 0)
    return { impressoes, cliques, ctr: porcentagem(cliques, impressoes) }
  }, [meus])

  const abrirNovo = (): void => {
    setEditando(null)
    setForm({ ...VAZIO, telefone: usuario?.telefone ?? '' })
    setErros({})
    setModalAberto(true)
  }

  const abrirEdicao = (ad: Ad): void => {
    setEditando(ad)
    setForm({
      titulo: ad.titulo,
      descricao: ad.descricao,
      link: ad.link,
      telefone: ad.telefone,
      posicao: ad.posicao,
      ativo: ad.ativo,
    })
    setErros({})
    setModalAberto(true)
  }

  const validar = (): boolean => {
    const novos: Erros = {}
    if (form.titulo.trim().length < 5) novos.titulo = 'Minimo de 5 caracteres.'
    if (form.descricao.trim().length < 15) novos.descricao = 'Minimo de 15 caracteres.'
    if (!urlValida(form.link)) novos.link = 'Informe uma URL valida.'
    if (form.telefone && somenteDigitos(form.telefone).length < 10)
      novos.telefone = 'Telefone incompleto (DDD + numero).'
    setErros(novos)
    if (Object.keys(novos).length > 0) {
      erro('Revise os campos', 'Alguns campos do anuncio precisam de atencao.')
      return false
    }
    return true
  }

  const salvar = async (): Promise<void> => {
    if (!usuario || !validar()) return

    setSalvando(true)
    await new Promise((r) => setTimeout(r, 400))

    const dados = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      link: form.link.trim().startsWith('http') ? form.link.trim() : `https://${form.link.trim()}`,
      telefone: somenteDigitos(form.telefone),
      posicao: form.posicao,
      ativo: form.ativo,
      ownerId: usuario.id,
      ownerNome: usuario.nome,
      imagem: editando?.imagem ?? null,
    }

    if (editando) {
      editarAnuncio(editando.id, dados)
      sucesso('Anuncio atualizado')
    } else {
      criarAnuncio(dados)
      adicionarPontos(25)
      notificar(usuario.id, 'sistema', 'Novo anuncio criado!', `"${dados.titulo}" ja esta no ar.`, '/admin/anuncios')
      sucesso('Anuncio criado!', 'Ele ja aparece no feed.')
    }

    setSalvando(false)
    setModalAberto(false)
  }


  if (!usuario) return null

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Publicidade</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Meus anuncios</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {meus.length} anuncios · {formatarNumero(totais.impressoes)} impressoes · {totais.ctr}% de cliques
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="h-4 w-4" aria-hidden />
          Novo anuncio
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { rotulo: 'Impressoes', valor: formatarNumero(totais.impressoes), icone: Eye, cor: '#38bdf8' },
          { rotulo: 'Cliques', valor: formatarNumero(totais.cliques), icone: MousePointerClick, cor: '#53e515' },
          { rotulo: 'Taxa de cliques', valor: `${totais.ctr}%`, icone: TrendingUp, cor: '#f59e0b' },
        ].map((item) => (
          <Card key={item.rotulo} padding="md">
            <div className="flex items-start justify-between">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{ backgroundColor: `${item.cor}1f`, color: item.cor }}
              >
                <item.icone className="h-5 w-5" aria-hidden />
              </span>
              <BarChart3 className="h-4 w-4 text-neutral-600" aria-hidden />
            </div>
            <p className="mt-3 text-xl font-extrabold text-neutral-100">{item.valor}</p>
            <p className="text-xs text-neutral-400">{item.rotulo}</p>
          </Card>
        ))}
      </div>

      <Card padding="sm" className="flex items-start gap-3 border-sky-500/25 bg-sky-500/5">
        <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-sky-300" aria-hidden />
        <p className="text-xs leading-relaxed text-neutral-300">
          Cada anuncio tem sua propria medicao. O CTR recomendado fica entre 3% e 8%. Anuncios com imagem e menos de 6
          palavras no titulo costumam ter o melhor resultado.
        </p>
      </Card>

      {meus.length === 0 ? (
        <EmptyState
          titulo="Nenhum anuncio criado"
          descricao="Crie sua primeira propaganda para aparecer no feed e trazer mais visitas aos seus grupos."
          icone={<BarChart3 className="h-6 w-6" aria-hidden />}
          acao={<Button onClick={abrirNovo}>Criar meu primeiro anuncio</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {meus.map((ad, i) => (
            <motion.li
              key={ad.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(i * 0.05, 0.35) }}
            >
              <Card padding="md" className={cn(!ad.ativo && 'opacity-60')}>
                <div className="flex flex-wrap items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-2xl">
                    <span aria-hidden>{'📣'}</span>
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-neutral-100">{ad.titulo}</h2>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                          ad.ativo ? 'bg-neon/15 text-neon' : 'bg-base-700 text-neutral-500',
                        )}
                      >
                        {ad.ativo ? 'ativo' : 'pausado'}
                      </span>
                      <span className="rounded-full bg-base-700 px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-400">
                        {POSICOES.find((p) => p.value === ad.posicao)?.label}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{ad.descricao}</p>
                    {ad.telefone ? (
                      <p className="mt-1.5 text-[11px] font-semibold text-amber-300">
                        WhatsApp: {mascaraCelularBR(ad.telefone)}
                      </p>
                    ) : null}

                    <div className="mt-3 grid max-w-sm gap-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Cliques sobre impressoes</span>
                        <span className="font-bold text-neutral-200">
                          {formatarNumero(ad.cliques)} / {formatarNumero(ad.impressoes)}
                        </span>
                      </div>
                      <ProgresoBar
                        valor={ad.cliques}
                        maximo={Math.max(ad.impressoes, 1)}
                        rotulo={`Taxa de clique do anuncio ${ad.titulo}`}
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-2 sm:w-auto">
                    <Button
                      variante="secundario"
                      tamanho="sm"
                      onClick={() => {
                        editarAnuncio(ad.id, { ativo: !ad.ativo })
                        sucesso(ad.ativo ? 'Anuncio pausado' : 'Anuncio reativado')
                      }}
                    >
                      <Power className="h-3.5 w-3.5" aria-hidden />
                      {ad.ativo ? 'Pausar' : 'Ativar'}
                    </Button>
                    <Button variante="contorno" tamanho="sm" onClick={() => abrirEdicao(ad)}>
                      <Edit3 className="h-3.5 w-3.5" aria-hidden />
                      Editar
                    </Button>
                    <Button
                      variante="perigo"
                      tamanho="sm"
                      tamanhoIcone
                      onClick={() => setAExcluir(ad)}
                      aria-label={`Excluir ${ad.titulo}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.li>
          ))}
        </ul>
      )}

      <Modal
        aberto={modalAberto}
        aoFechar={() => {
          setModalAberto(false)
          setEditando(null)
        }}
        titulo={editando ? 'Editar anuncio' : 'Novo anuncio'}
        descricao="Sua propaganda aparece marcada como patrocinado."
        rodape={
          <>
            <Button
              variante="fantasma"
              onClick={() => {
                setModalAberto(false)
                setEditando(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={() => void salvar()} carregando={salvando}>
              {editando ? 'Salvar' : 'Publicar anuncio'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Titulo do anuncio"
            obrigatorio
            value={form.titulo}
            onChange={(e) => {
              setForm((f) => ({ ...f, titulo: e.target.value }))
              setErros((e) => ({ ...e, titulo: undefined }))
            }}
            placeholder="Ex.: Seu servico de desenvolvimento de sites"
            erro={erros.titulo}
            maxLength={60}
          />

          <Textarea
            label="Descricao"
            obrigatorio
            value={form.descricao}
            onChange={(e) => {
              setForm((f) => ({ ...f, descricao: e.target.value }))
              setErros((e) => ({ ...e, descricao: undefined }))
            }}
            placeholder="Explique o que voce oferece e como entrar em contato."
            erro={erros.descricao}
            maxLength={220}
            rows={3}
          />

          <Input
            label="Link de destino"
            obrigatorio
            value={form.link}
            onChange={(e) => {
              setForm((f) => ({ ...f, link: e.target.value }))
              setErros((e) => ({ ...e, link: undefined }))
            }}
            placeholder="https://wa.me/5561998875920"
            erro={erros.link}
          />

          <Input
            label="Telefone para contato (opcional)"
            value={form.telefone}
            onChange={(e) => setForm((f) => ({ ...f, telefone: mascaraCelularBR(e.target.value) }))}
            placeholder="(61) 99887-5920"
            inputMode="numeric"
            erro={erros.telefone}
          />

          <div>
            <span className="mb-2 block text-xs font-semibold text-neutral-300">Onde exibir</span>
            <div className="space-y-2">
              {POSICOES.map((pos) => (
                <label
                  key={pos.value}
                  className={cn(
                    'flex min-h-[52px] cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-2.5 transition',
                    form.posicao === pos.value
                      ? 'border-neon/50 bg-neon/10'
                      : 'border-base-600 hover:border-neon/30',
                  )}
                >
                  <input
                    type="radio"
                    name="posicao"
                    checked={form.posicao === pos.value}
                    onChange={() => setForm((f) => ({ ...f, posicao: pos.value }))}
                    className="mt-1 h-4 w-4 accent-[#53e515]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-neutral-100">{pos.label}</span>
                    <span className="block text-[11px] text-neutral-400">{pos.descricao}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip ativo={form.ativo} onClick={() => setForm((f) => ({ ...f, ativo: !f.ativo }))}>
              {form.ativo ? 'Ativo no ar' : 'Pausado'}
            </Chip>
          </div>
        </div>
      </Modal>

      <Modal
        aberto={aExcluir !== null}
        aoFechar={() => setAExcluir(null)}
        titulo="Excluir anuncio"
        descricao={`"${aExcluir?.titulo ?? ''}" sera removido permanentemente.`}
        tamanho="sm"
        rodape={
          <>
            <Button variante="fantasma" onClick={() => setAExcluir(null)}>
              Cancelar
            </Button>
            <Button
              variante="perigo"
              onClick={() => {
                if (aExcluir) excluirAnuncio(aExcluir.id)
                setAExcluir(null)
                sucesso('Anuncio excluido')
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-400">
          Pause o anuncio em vez de excluir se voce quiser voltar a exibir depois.
        </p>
      </Modal>
    </div>
  )
}
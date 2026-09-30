import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Image as ImageIcon,
  Info,
  Link2,
  MapPin,
  Save,
  Send,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { Chip, CategoriaBadge } from '@/components/ui/Bits'
import { CATEGORIES, PLAN, type Group, type GroupCategory } from '@/types'
import { ESTADOS, cidadesDoEstado, resolverUF, rotuloEstado } from '@/data/geo'
import {
  cn,
  formatarMoeda,
  linkWhatsappValido,
  navegarParaWhatsapp,
  normalizar,
  urlValida,
} from '@/lib/utils'

interface Erros {
  nome?: string
  descricao?: string
  link?: string
  categoria?: string
  estado?: string
  cidade?: string
  imagem?: string
}

const FORMULARIO_VAZIO = {
  nome: '',
  descricao: '',
  link: '',
  categoria: '' as GroupCategory | '',
  estado: '',
  cidade: '',
  tags: '',
  preco: 'gratuito' as Group['preco'],
  valor: 0,
  imagem: '',
}

export default function PublicarGrupo() {
  useSeo({ titulo: 'Publicar meu grupo de WhatsApp', caminho: '/publicar', noindex: true })

  const navegar = useNavigate()
  const [params] = useSearchParams()
  const { usuario, adicionarPontos } = useAuth()
  const { criarGrupo, editarGrupo, notificar, gruposDoDono } = useData()
  const { sucesso, erro, aviso, info } = useToast()

  const editandoId = params.get('id')
  const emEdicao = Boolean(editandoId)

  const [form, setForm] = useState({ ...FORMULARIO_VAZIO })
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [mostrarDica, setMostrarDica] = useState(false)

  const meus = usuario ? gruposDoDono(usuario.id) : []

  useEffect(() => {
    if (!editandoId) return
    const grupo = meus.find((g) => g.id === editandoId)
    if (!grupo) {
      aviso('Grupo nao encontrado', 'Talvez ele tenha sido excluido.')
      navegar('/admin/grupos')
      return
    }
    setForm({
      nome: grupo.nome,
      descricao: grupo.descricao,
      link: grupo.link,
      categoria: grupo.categoria,
      estado: grupo.estado,
      cidade: grupo.cidade,
      tags: grupo.tags.join(', '),
      preco: grupo.preco,
      valor: grupo.valor,
      imagem: grupo.imagem ?? '',
    })
  }, [editandoId, meus, navegar, aviso])

  const uf = useMemo(() => resolverUF(form.estado), [form.estado])
  const cidades = useMemo(() => (uf ? cidadesDoEstado(uf) : []), [uf])

  const atualizar = <K extends keyof typeof FORMULARIO_VAZIO>(campo: K, valor: (typeof FORMULARIO_VAZIO)[K]): void => {
    setForm((atual) => ({ ...atual, [campo]: valor }))
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  const validar = (): boolean => {
    const novos: Erros = {}

    if (form.nome.trim().length < 4) novos.nome = 'Use pelo menos 4 caracteres.'
    else if (form.nome.trim().length > 70) novos.nome = 'Maximo de 70 caracteres.'

    if (form.descricao.trim().length < 20) novos.descricao = 'Descreva com pelo menos 20 caracteres.'
    else if (form.descricao.trim().length > 500) novos.descricao = 'Maximo de 500 caracteres.'

    if (!form.link.trim()) novos.link = 'Cole o link de convite do grupo.'
    else if (!linkWhatsappValido(form.link)) novos.link = 'Link invalido. Use um link chat.whatsapp.com ou wa.me.'

    if (!form.categoria) novos.categoria = 'Escolha uma categoria.'

    if (!uf) novos.estado = 'Escolha um estado.'
    else if (!form.cidade.trim()) novos.cidade = 'Escolha ou digite a cidade.'
    else if (cidades.length > 0 && !cidades.some((c) => normalizar(c) === normalizar(form.cidade.trim())))
      novos.cidade = `Cidade nao encontrada em ${rotuloEstado(form.estado)}.`

    if (form.imagem.trim() && !urlValida(form.imagem)) novos.imagem = 'URL da imagem invalida.'

    setErros(novos)
    if (Object.keys(novos).length > 0) {
      const primeiro = document.querySelector<HTMLElement>('[data-erro="true"]')
      primeiro?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const limiteGratis = PLAN.maxGruposGratis
  const excedeuLimite = !emEdicao && meus.length >= limiteGratis && !(usuario?.planoAtivo ?? false)

  const enviar = async (): Promise<void> => {
    if (!usuario) {
      erro('Faca login para publicar', 'Entre com sua conta Gmail.')
      navegar('/entrar?destino=/publicar')
      return
    }
    if (!validar()) {
      erro('Revise os campos destacados', 'Alguns campos precisam de atencao antes de publicar.')
      return
    }

    setEnviando(true)
    await new Promise((r) => setTimeout(r, 500))

    const corDestaque =
      CATEGORIES.find((c) => c.value === form.categoria)?.cor ?? '#53e515'
    const tags = form.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6)

    const base = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      categoria: form.categoria as GroupCategory,
      estado: uf ?? form.estado,
      cidade: form.cidade.trim(),
      link: form.link.trim().startsWith('http') ? form.link.trim() : `https://${form.link.trim()}`,
      ownerId: usuario.id,
      ownerNome: usuario.nome,
      ownerFoto: usuario.foto,
      tags,
      membros: 0,
      membrosTexto: 'Novo',
      preco: form.preco,
      valor: form.preco === 'pago' ? Number(form.valor) : 0,
      imagem: form.imagem.trim() || null,
      corDestaque: corDestaque,
      status: 'aprovado' as const,
      destacado: Boolean(usuario.planoAtivo),
      fixado: false,
    }

    if (emEdicao && editandoId) {
      editarGrupo(editandoId, base)
      sucesso('Grupo atualizado', 'As informacoes ja aparecem na busca.')
    } else {
      const novo = criarGrupo({ ...base, membros: 120 + Math.floor(Math.random() * 80) })
      adicionarPontos(10)
      notificar(
        usuario.id,
        'aprovacao',
        'Grupo publicado com sucesso!',
        `"${novo.nome}" ja esta visivel na busca de ${novo.cidade}.`,
        '/admin/grupos',
      )
      sucesso('Grupo publicado!', `Ele ja aparece na busca de ${novo.cidade}.`)
    }

    setEnviando(false)
    navegar('/admin/grupos')
  }

  if (!usuario) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navegar(-1)}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-neutral-400 transition hover:text-neon"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar
      </button>

      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-neon">
          {emEdicao ? 'Editar grupo' : 'Novo grupo'}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">
          {emEdicao ? 'Atualize as informacoes' : 'Publique seu grupo de WhatsApp'}
        </h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          Preencha tudo corretamente: e assim que as pessoas da sua cidade vao encontrar o grupo.
        </p>
      </header>

      {!usuario.planoAtivo && meus.length >= limiteGratis ? (
        <Card padding="md" className="border-amber-400/35 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
            <div>
              <p className="text-sm font-bold text-neutral-100">
                Voce atingiu o limite de {limiteGratis} grupos do plano gratuito
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Ative o plano Admin por R$ 10/mes para publicar ilimitado e ganhar destaque.
              </p>
              <Button tamanho="sm" className="mt-3" onClick={() => navegar('/admin/plano')}>
                Ver planos
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card padding="md">
        <SectionTitle
          titulo="Informacoes do grupo"
          subtitulo="Nome, categoria e descricao"
          icone={<Sparkles className="h-5 w-5 text-neon" aria-hidden />}
        />

        <div className="space-y-4">
          <Input
            label="Nome do grupo"
            obrigatorio
            value={form.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
            placeholder="Ex.: Ofertas do Dia - Goiania"
            erro={erros.nome}
            dica={`${form.nome.length}/70 caracteres`}
            maxLength={70}
            icone={<Users className="h-4 w-4" aria-hidden />}
            data-erro={Boolean(erros.nome) || undefined}
          />

          <div data-erro={Boolean(erros.categoria) || undefined}>
            <span className="mb-2 block text-xs font-semibold text-neutral-300">
              Categoria <span className="text-neon">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.value}
                  ativo={form.categoria === cat.value}
                  onClick={() => atualizar('categoria', cat.value as GroupCategory)}
                >
                  {cat.emoji} {cat.label}
                </Chip>
              ))}
            </div>
            {erros.categoria ? <p className="mt-1.5 text-xs text-red-400">{erros.categoria}</p> : null}
          </div>

          <Textarea
            label="Descricao"
            obrigatorio
            value={form.descricao}
            onChange={(e) => atualizar('descricao', e.target.value)}
            placeholder="Explique o que as pessoas encontram no grupo, o que voce posta e as regras de participacao."
            erro={erros.descricao}
            dica={`${form.descricao.length}/500 caracteres`}
            maxLength={500}
            rows={4}
            data-erro={Boolean(erros.descricao) || undefined}
          />

          <Input
            label="Link de convite"
            obrigatorio
            value={form.link}
            onChange={(e) => atualizar('link', e.target.value)}
            placeholder="https://chat.whatsapp.com/XXXXXXXXXXXX"
            erro={erros.link}
            dica="No WhatsApp: grupo > menu > 'Convidar via link'."
            icone={<Link2 className="h-4 w-4" aria-hidden />}
            data-erro={Boolean(erros.link) || undefined}
          />

          {form.link && linkWhatsappValido(form.link) ? (
            <button
              type="button"
              onClick={() => navegarParaWhatsapp(form.link)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon hover:underline"
            >
              Testar link agora
              <ArrowLeft className="h-3 w-3 rotate-180" aria-hidden />
            </button>
          ) : null}

          <Input
            label="URL da imagem de capa (opcional)"
            value={form.imagem}
            onChange={(e) => atualizar('imagem', e.target.value)}
            placeholder="https://exemplo.com/capa.jpg"
            erro={erros.imagem}
            icone={<ImageIcon className="h-4 w-4" aria-hidden />}
          />

          <Input
            label="Tags (separadas por virgula)"
            value={form.tags}
            onChange={(e) => atualizar('tags', e.target.value)}
            placeholder="ofertas, cupons, cidade"
            dica="Ajudam nas buscas. Maximo de 6 tags."
          />
        </div>
      </Card>

      <Card padding="md">
        <SectionTitle
          titulo="Localizacao"
          subtitulo="Onde o grupo atua — e por isso onde ele aparece"
          icone={<MapPin className="h-5 w-5 text-neon" aria-hidden />}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div data-erro={Boolean(erros.estado) || undefined}>
            <Select
              label="Estado"
              value={form.estado}
              onChange={(e) => {
                atualizar('estado', e.target.value)
                atualizar('cidade', '')
              }}
              opcoes={ESTADOS.map((e) => ({ value: e.uf, label: `${e.nome} (${e.uf})` }))}
              placeholder="Selecione o estado"
              erro={erros.estado}
            />
          </div>

          <div data-erro={Boolean(erros.cidade) || undefined}>
            {cidades.length > 0 ? (
              <Select
                label="Cidade"
                value={form.cidade}
                onChange={(e) => atualizar('cidade', e.target.value)}
                opcoes={cidades.map((c) => ({ value: c, label: c }))}
                placeholder="Selecione a cidade"
                erro={erros.cidade}
              />
            ) : (
              <Input
                label="Cidade"
                value={form.cidade}
                onChange={(e) => atualizar('cidade', e.target.value)}
                placeholder="Escolha um estado primeiro"
                erro={erros.cidade}
                disabled
              />
            )}
          </div>
        </div>

        {form.estado && form.cidade ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-neon/25 bg-neon/5 p-3">
            <Check className="h-4 w-4 shrink-0 text-neon" aria-hidden />
            <p className="text-xs text-neutral-300">
              Seu grupo aparecera nas buscas de <span className="font-bold text-neon">{form.cidade}</span> —{' '}
              {rotuloEstado(form.estado)}.
            </p>
            {form.categoria ? <CategoriaBadge categoria={form.categoria as GroupCategory} /> : null}
          </div>
        ) : null}
      </Card>

      <Card padding="md">
        <SectionTitle
          titulo="Acesso"
          subtitulo="Como o grupo cobra (ou nao cobra) dos membros"
          icone={<Users className="h-5 w-5 text-neon" aria-hidden />}
        />

        <div className="flex flex-wrap gap-2">
          <Chip ativo={form.preco === 'gratuito'} onClick={() => atualizar('preco', 'gratuito')}>
            Gratuito
          </Chip>
          <Chip ativo={form.preco === 'pago'} onClick={() => atualizar('preco', 'pago')}>
            Pago
          </Chip>
        </div>

        {form.preco === 'pago' ? (
          <div className="mt-4 max-w-xs">
            <Input
              label="Valor de acesso (R$)"
              type="number"
              min={0}
              step={0.01}
              value={form.valor || ''}
              onChange={(e) => atualizar('valor', Number(e.target.value))}
              placeholder="19.90"
              dica={`Mostrado como ${form.valor > 0 ? formatarMoeda(form.valor) : 'R$ 0,00'} no card do grupo.`}
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setMostrarDica((v) => !v)}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-neon hover:underline"
        >
          <Info className="h-3.5 w-3.5" aria-hidden />
          Como aumentar os cliques
        </button>

        {mostrarDica ? (
          <ul className="mt-2.5 space-y-1.5 rounded-xl border border-base-600 bg-base-800/50 p-3 text-xs leading-relaxed text-neutral-400">
            <li>• Coloque a cidade no nome do grupo (ex.: "Ofertas Goiania - SP").</li>
            <li>• Use a descricao para dizer o horario das postagens.</li>
            <li>• Renove o link de convite quando o grupo bater 1000 membros.</li>
            <li>• Responda as mensagens do grupo: conta ativa gera mais conversas.</li>
          </ul>
        ) : null}
      </Card>

      <Card padding="md" className="sticky bottom-24 border-neon/25 lg:bottom-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-neon" aria-hidden />
            {excedeuLimite
              ? 'Limite do plano gratuito atingido — ative o plano para publicar.'
              : 'Voce podera editar ou remover o grupo a qualquer momento.'}
          </div>
          <div className="flex gap-2">
            <Button variante="fantasma" onClick={() => navegar('/admin/grupos')}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Cancelar
            </Button>
            <Button
              onClick={() => void enviar()}
              carregando={enviando}
              disabled={excedeuLimite}
              className={cn('flex-1 sm:flex-none')}
            >
              {emEdicao ? <Save className="h-4 w-4" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              {emEdicao ? 'Salvar alteracoes' : 'Publicar grupo'}
            </Button>
          </div>
        </div>
      </Card>

      {excedeuLimite ? (
        <p className="text-center text-[11px] text-neutral-500">
          Precisa publicar mais grupos?{' '}
          <button type="button" onClick={() => info('Ative o plano', 'Voce sera levado a pagina de planos.')} className="text-neon hover:underline">
            Ative o plano Admin
          </button>{' '}
          ou{' '}
          <button type="button" onClick={() => navegar('/admin/grupos')} className="text-neon hover:underline">
            edite um grupo existente
          </button>
          .
        </p>
      ) : null}
    </div>
  )
}
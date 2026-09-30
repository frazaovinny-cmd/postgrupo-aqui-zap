import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Database, Moon, Palette, RotateCcw, Save, Shield, Sun, Trash2, User2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { Modal } from '@/components/ui/Modal'
import { Avatar, Chip } from '@/components/ui/Bits'
import { ESTADOS, cidadesDoEstado, resolverUF } from '@/data/geo'
import { cn, formatarData, mascaraCelularBR, somenteDigitos } from '@/lib/utils'

export default function Configuracoes() {
  useSeo({ titulo: 'Configuracoes', caminho: '/admin/configuracoes', noindex: true })

  const { usuario, atualizarPerfil } = useAuth()
  const { tema, definirTema } = useTheme()
  const { restaurarDemo } = useData()
  const { sucesso, aviso, erro } = useToast()

  const [form, setForm] = useState({
    nome: usuario?.nome ?? '',
    bio: usuario?.bio ?? '',
    cidade: usuario?.cidade ?? '',
    estado: usuario?.estado ?? '',
    telefone: usuario?.telefone ?? '',
  })
  const [erros, setErros] = useState<Record<string, string | undefined>>({})
  const [salvando, setSalvando] = useState(false)
  const [modalReset, setModalReset] = useState(false)
  const [emailMarketing, setEmailMarketing] = useState(true)
  const [emailCliques, setEmailCliques] = useState(true)
  const [modoCompacto, setModoCompacto] = useState(false)

  const uf = useMemo(() => resolverUF(form.estado), [form.estado])
  const cidades = useMemo(() => (uf ? cidadesDoEstado(uf) : []), [uf])

  if (!usuario) return null

  const salvar = async (): Promise<void> => {
    const novos: Record<string, string | undefined> = {}
    if (form.nome.trim().length < 3) novos.nome = 'Informe ao menos 3 caracteres.'
    if (form.bio.trim().length > 200) novos.bio = 'Maximo de 200 caracteres.'
    if (form.telefone && somenteDigitos(form.telefone).length < 10) novos.telefone = 'Telefone incompleto.'
    if (form.estado && !uf) novos.estado = 'Estado invalido.'

    setErros(novos)
    if (Object.keys(novos).length > 0) {
      erro('Revise os campos', 'Alguns dados precisam de atencao.')
      return
    }

    setSalvando(true)
    await new Promise((r) => setTimeout(r, 450))
    atualizarPerfil({
      nome: form.nome.trim(),
      bio: form.bio.trim(),
      cidade: form.cidade.trim(),
      estado: uf ?? form.estado,
      telefone: somenteDigitos(form.telefone),
    })
    setSalvando(false)
    sucesso('Perfil atualizado', 'Suas informacoes foram salvas.')
  }

  const perfilCompleto =
    Boolean(form.bio.trim() && form.cidade.trim() && form.estado) ? 100 : Math.round(
    [form.nome.trim().length >= 3, Boolean(form.bio.trim()), Boolean(form.cidade.trim()), Boolean(form.estado)].filter(
      Boolean,
    ).length * 25,
  )

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-neon">Conta</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Configuracoes</h1>
        <p className="mt-1 text-sm text-neutral-400">Gerencie seu perfil, aparência e preferências.</p>
      </header>

      <Card padding="md">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar nome={form.nome || usuario.nome} url={usuario.foto} tamanho={64} anel />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-neutral-100">{usuario.email}</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Conta conectada via Google · criada em {formatarData(usuario.criadoEm)}
            </p>
          </div>
          <div className="w-full sm:w-48">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Perfil completo</span>
              <span className="font-bold text-neon">{perfilCompleto}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-base-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-deep to-neon transition-all duration-500"
                style={{ width: `${perfilCompleto}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <SectionTitle
          titulo="Dados do perfil"
          subtitulo="Aparecem publicamente nos seus grupos"
          icone={<User2 className="h-5 w-5 text-neon" aria-hidden />}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome exibido"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            erro={erros.nome}
          />
          <Input
            label="Telefone / WhatsApp"
            value={form.telefone}
            onChange={(e) => setForm((f) => ({ ...f, telefone: mascaraCelularBR(e.target.value) }))}
            placeholder="(00) 00000-0000"
            inputMode="numeric"
            erro={erros.telefone}
            dica="Usado para voce receber avisos importantes."
          />
          <Select
            label="Estado"
            value={form.estado}
            onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value, cidade: '' }))}
            opcoes={ESTADOS.map((e) => ({ value: e.uf, label: `${e.nome} (${e.uf})` }))}
            placeholder="Selecione"
            erro={erros.estado}
          />
          {cidades.length > 0 ? (
            <Select
              label="Cidade"
              value={form.cidade}
              onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))}
              opcoes={cidades.map((c) => ({ value: c, label: c }))}
              placeholder="Selecione"
            />
          ) : (
            <Input
              label="Cidade"
              value={form.cidade}
              onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))}
              placeholder="Escolha um estado primeiro"
              disabled
            />
          )}
        </div>

        <div className="mt-4">
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Conte em uma frase o que voce administra."
            erro={erros.bio}
            dica={`${form.bio.length}/200 caracteres · completar a bio da +20 pontos`}
            maxLength={200}
            rows={3}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={() => void salvar()} carregando={salvando}>
            <Save className="h-4 w-4" aria-hidden />
            Salvar alteracoes
          </Button>
        </div>
      </Card>

      <Card padding="md">
        <SectionTitle
          titulo="Aparencia"
          subtitulo="Escolha o tema do site"
          icone={<Palette className="h-5 w-5 text-neon" aria-hidden />}
        />
        <div className="flex flex-wrap gap-2">
          <Chip
            ativo={tema === 'dark'}
            onClick={() => definirTema('dark')}
            icone={<Moon className="h-3.5 w-3.5" aria-hidden />}
          >
            Modo escuro
          </Chip>
          <Chip
            ativo={tema === 'light'}
            onClick={() => definirTema('light')}
            icone={<Sun className="h-3.5 w-3.5" aria-hidden />}
          >
            Modo claro
          </Chip>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          O tema segue a preferencia do sistema quando voce nunca escolheu manualmente.
        </p>
      </Card>

      <Card padding="md">
        <SectionTitle
          titulo="Notificacoes"
          subtitulo="Como e onderecebemos avisos"
          icone={<Bell className="h-5 w-5 text-neon" aria-hidden />}
        />
        <ul className="space-y-2">
          {[
            { rotulo: 'Resumo semanal de cliques', desc: 'Um e-mail por semana com o desempenho.', valor: emailMarketing, set: setEmailMarketing },
            { rotulo: 'Alerta de novos comentarios', desc: 'Aviso quando alguem comenta em um seu grupo.', valor: emailCliques, set: setEmailCliques },
          ].map((item) => (
            <li
              key={item.rotulo}
              className="flex items-center justify-between gap-4 rounded-xl border border-base-600 p-3.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-100">{item.rotulo}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.valor}
                aria-label={item.rotulo}
                onClick={() => {
                  item.set(!item.valor)
                  sucesso('Preferencia salva')
                }}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition',
                  item.valor ? 'bg-neon' : 'bg-base-600',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-base transition-transform',
                    item.valor ? 'translate-x-[22px]' : 'translate-x-0.5',
                  )}
                />
              </button>
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 rounded-xl border border-base-600 p-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-100">Visualizacao compacta</p>
              <p className="text-xs text-neutral-500">Cards menores, mais grupos por tela.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={modoCompacto}
              aria-label="Visualizacao compacta"
              onClick={() => {
                setModoCompacto(!modoCompacto)
                aviso('Em breve', 'A visualizacao compacta sera aplicada em todo o site.')
              }}
              className={cn('relative h-6 w-11 shrink-0 rounded-full transition', modoCompacto ? 'bg-neon' : 'bg-base-600')}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-base transition-transform',
                  modoCompacto ? 'translate-x-[22px]' : 'translate-x-0.5',
                )}
              />
            </button>
          </li>
        </ul>
      </Card>

      <Card padding="md">
        <SectionTitle
          titulo="Dados e seguranca"
          icone={<Shield className="h-5 w-5 text-neon" aria-hidden />}
        />

        <div className="flex flex-wrap gap-2">
          <Link to="/privacidade">
            <Button variante="secundario" tamanho="sm">
              Politica de privacidade
            </Button>
          </Link>
          <Link to="/termos">
            <Button variante="secundario" tamanho="sm">
              Termos de uso
            </Button>
          </Link>
          <Button variante="perigo" tamanho="sm" onClick={() => setModalReset(true)}>
            <Database className="h-3.5 w-3.5" aria-hidden />
            Restaurar dados de demonstracao
          </Button>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
          Os dados ficam salvos apenas neste navegador (localStorage). Nada e enviado para servidores externos.
        </p>
      </Card>

      <Modal
        aberto={modalReset}
        aoFechar={() => setModalReset(false)}
        titulo="Restaurar dados de demonstracao"
        descricao="Todos os grupos e anuncios locais serao recriados."
        tamanho="sm"
        rodape={
          <>
            <Button variante="fantasma" onClick={() => setModalReset(false)}>
              Cancelar
            </Button>
            <Button
              variante="perigo"
              onClick={() => {
                restaurarDemo()
                setModalReset(false)
                sucesso('Dados restaurados', 'A lista de grupos foi recriada.')
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restaurar
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-400">
          Esta acao remove permanentemente os grupos, anuncios e comentarios que voce criou neste navegador.
        </p>
      </Modal>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-600">
        <Trash2 className="h-3 w-3" aria-hidden />
        Para excluir sua conta, fale com (61) 99887-5920
      </p>
    </div>
  )
}
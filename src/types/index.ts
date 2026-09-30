export type ThemeMode = 'dark' | 'light'

export type PlanStatus = 'inativo' | 'ativo' | 'pendente' | 'vencido'

export type UserRole = 'admin' | 'moderador'

export type GroupStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'expirado'

export type GroupCategory = (typeof CATEGORIES)[number]['value']

export type AdPlacement = 'feed' | 'stories' | 'lateral' | 'destaque'

export type NotificationKind =
  | 'aprovacao'
  | 'rejeicao'
  | 'curtida'
  | 'comentario'
  | 'clique'
  | 'pagamento'
  | 'sistema'

export interface User {
  id: string
  googleId: string
  nome: string
  email: string
  foto: string
  bio: string
  cidade: string
  estado: string
  telefone: string
  role: UserRole
  planoAtivo: boolean
  planoStatus: PlanStatus
  planoVenceEm: string | null
  pontos: number
  nivel: number
  criadoEm: string
}

export interface Group {
  id: string
  nome: string
  descricao: string
  categoria: GroupCategory
  estado: string
  cidade: string
  link: string
  ownerId: string
  ownerNome: string
  ownerFoto: string
  tags: string[]
  membros: number
  membrosTexto: string
  preco: 'gratuito' | 'pago'
  valor: number
  imagem: string | null
  corDestaque: string
  status: GroupStatus
  destacado: boolean
  fixado: boolean
 gostei: number
  cliques: number
  visualizacoes: number
  criadoEm: string
  atualizadoEm: string
}

export interface GroupComment {
  id: string
  grupoId: string
  autorNome: string
  autorFoto: string
  autorId: string | null
  texto: string
  criadoEm: string
}

export interface AppNotification {
  id: string
  userId: string
  tipo: NotificationKind
  titulo: string
  texto: string
  link: string
  lida: boolean
  criadoEm: string
}

export interface Ad {
  id: string
  ownerId: string
  ownerNome: string
  titulo: string
  descricao: string
  imagem: string | null
  link: string
  telefone: string
  posicao: AdPlacement
  ativo: boolean
  impressoes: number
  cliques: number
  criadoEm: string
}

export interface Report {
  id: string
  grupoId: string
  motivo: string
  detalhes: string
  criadoEm: string
}

export interface ToastMessage {
  id: string
  tipo: 'sucesso' | 'erro' | 'info' | 'aviso'
  titulo: string
  descricao?: string
}

export interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  pontos: number
}

export const CATEGORIES = [
  { value: 'vendas', label: 'Vendas e Ofertas', emoji: '\u{1F6E2}', cor: '#53e515' },
  { value: 'empregos', label: 'Vagas de Emprego', emoji: '\u{1F4BC}', cor: '#38bdf8' },
  { value: 'bebidas', label: 'Bebidas e Delivery', emoji: '\u{1F37A}', cor: '#f59e0b' },
  { value: 'compras', label: 'Compras e Descontos', emoji: '\u{1F6D2}', cor: '#f472b6' },
  { value: 'imoveis', label: 'Imoveis', emoji: '\u{1F3E0}', cor: '#a78bfa' },
  { value: 'autos', label: 'Carros e Motos', emoji: '\u{1F699}', cor: '#22d3ee' },
  { value: 'moda', label: 'Moda e Vestuario', emoji: '\u{1F455}', cor: '#fb7185' },
  { value: 'pet', label: 'Pet Shop', emoji: '\u{1F43E}', cor: '#4ade80' },
  { value: 'servicos', label: 'Servicos', emoji: '\u{1F6E0}', cor: '#60a5fa' },
  { value: 'eventos', label: 'Eventos', emoji: '\u{1F389}', cor: '#fbbf24' },
  { value: 'free', label: 'Free Fire / Games', emoji: '\u{1F3AE}', cor: '#c084fc' },
  { value: 'casa', label: 'Casa e Construcao', emoji: '\u{1F3E1}', cor: '#2dd4bf' },
  { value: 'escola', label: 'Cursos e Study', emoji: '\u{1F393}', cor: '#facc15' },
  { value: 'religiao', label: 'Religiao', emoji: '\u{1F54C}', cor: '#e2e8f0' },
  { value: 'saude', label: 'Saude e Beleza', emoji: '\u{1FA7A}', cor: '#34d399' },
  { value: 'outros', label: 'Outros', emoji: '\u{1F4E6}', cor: '#94a3b8' },
] as const

export const PLAN = {
  precoMensal: 10,
  maxGruposGratis: 2,
  maxAnunciosGratis: 0,
  nome: 'Admin',
} as const

export const BADGES: Badge[] = [
  { id: 'primeiro-post', nome: 'Primeiro Post', descricao: 'Publicou seu primeiro grupo', icone: '\u{1F680}', pontos: 10 },
  { id: 'dez-grupos', nome: 'Colecionador', descricao: 'Publicou 10 grupos', icone: '\u{1F3C6}', pontos: 50 },
  { id: 'cem-cliques', nome: 'Magnético', descricao: 'Conseguiu 100 cliques', icone: '\u{1F4A3}', pontos: 30 },
  { id: 'vendedor-pro', nome: 'Vendedor Pro', descricao: 'Alcancou 1000 cliques', icone: '\u{1F3C3}', pontos: 120 },
  { id: 'perfil-completo', nome: 'Perfil Completo', descricao: 'Preencheu cidade, estado e bio', icone: '\u{2705}', pontos: 20 },
  { id: 'assinante', nome: 'Assinante Ativo', descricao: 'Plano Admin em dia', icone: '\u{1F4B0}', pontos: 40 },
  { id: 'criador-anuncio', nome: 'Criador de Anuncios', descricao: 'Criou seu primeiro anúncio', icone: '\u{1F4E3}', pontos: 25 },
]
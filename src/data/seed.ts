import type { Ad, AppNotification, Group, GroupComment, User } from '@/types'
import { hojeISO, uid, variar } from '@/lib/utils'

export const USUARIO_DEMO: User = {
  id: 'usr_demo_vinny',
  googleId: 'demo-vinny',
  nome: 'Vinny',
  email: 'vinny@postgrupoaquizap.com.br',
  foto: '',
  bio: 'Desenvolvedor de sites e apps. Crio paginas rapidas para-groups e businesses.',
  cidade: 'Brasilia',
  estado: 'DF',
  telefone: '61998875920',
  role: 'admin',
  planoAtivo: true,
  planoStatus: 'ativo',
  planoVenceEm: new Date(Date.now() + 22 * 86_400_000).toISOString(),
  pontos: 320,
  nivel: 4,
  criadoEm: hojeISO(120),
}

export const ANUNCIOS_DEMO: Ad[] = [
  {
    id: uid('ad'),
    ownerId: USUARIO_DEMO.id,
    ownerNome: 'Vinny - Desenvolvedor Web',
    titulo: 'Voce precisa de site ou app?',
    descricao:
      'Crio sites, landing pages e sistemas para grupos de WhatsApp. Entrega rapida, suporte direto no zap: 61998875920',
    imagem: null,
    link: 'https://wa.me/5561998875920',
    telefone: '61998875920',
    posicao: 'feed',
    ativo: true,
    impressoes: 18420,
    cliques: 934,
    criadoEm: hojeISO(45),
  },
  {
    id: uid('ad'),
    ownerId: USUARIO_DEMO.id,
    ownerNome: 'Vinny - Desenvolvedor Web',
    titulo: 'Grupo de WhatsApp professionalizado',
    descricao: 'Bot de boas-vindas, catalogo, etiquetas e painel de pedidos. Fale comigo: 61998875920',
    imagem: null,
    link: 'https://wa.me/5561998875920',
    telefone: '61998875920',
    posicao: 'lateral',
    ativo: true,
    impressoes: 9210,
    cliques: 512,
    criadoEm: hojeISO(30),
  },
  {
    id: uid('ad'),
    ownerId: USUARIO_DEMO.id,
    ownerNome: 'Vinny - Desenvolvedor Web',
    titulo: 'Quer aumentar membros do seu grupo?',
    descricao: 'Publicidade direcionada por cidade e categoria no PostGrupo Aqui Zap. Chame no zap.',
    imagem: null,
    link: 'https://wa.me/5561998875920',
    telefone: '61998875920',
    posicao: 'destaque',
    ativo: true,
    impressoes: 25330,
    cliques: 1487,
    criadoEm: hojeISO(60),
  },
]

interface Modelo {
  nome: string
  descricao: string
  categoria: Group['categoria']
  estado: string
  cidade: string
  membros: number
  tags: string[]
  tagsExtra?: string[]
}

const MODELOS: Modelo[] = [
  { nome: 'Ofertas do Dia DF', descricao: 'Descontos relampago de lojas de Brasilia. Posto link toda manha e cupom de cupom.', categoria: 'vendas', estado: 'DF', cidade: 'Brasilia', membros: 4820, tags: ['ofertas', 'cupons', 'brasilia'] },
  { nome: 'Vagas de emprego DF', descricao: 'Vagas abertas na capital, com requisitos, salario e link de candidatura.', categoria: 'empregos', estado: 'DF', cidade: 'Brasilia', membros: 6310, tags: ['vagas', 'emprego', 'df'] },
  { nome: 'Delivery Bebidas Guarulhos', descricao: 'Bebidas geladas com entrega rapida em toda regao. Pedidos no proprio grupo.', categoria: 'bebidas', estado: 'SP', cidade: 'Guarulhos', membros: 2150, tags: ['delivery', 'bebidas'] },
  { nome: 'Ofertas SP Black Friday', descricao: 'Cupons e precos quebras de preco nas principais lojas paulistas.', categoria: 'vendas', estado: 'SP', cidade: 'Sao Paulo', membros: 18940, tags: ['ofertas', 'blackfriday', 'sp'] },
  { nome: 'Imoveis para Alugar BH', descricao: 'Locacao e compra de imoveis em Belo Horizonte e regiao.', categoria: 'imoveis', estado: 'MG', cidade: 'Belo Horizonte', membros: 3240, tags: ['imoveis', 'aluguel'] },
  { nome: 'Descontos Curitiba', descricao: 'Achadinhos e ofertas de shopping e lojas de Curitiba.', categoria: 'compras', estado: 'PR', cidade: 'Curitiba', membros: 5120, tags: ['descontos', 'curitiba'] },
  { nome: 'Vendas Rio de Janeiro', descricao: 'Ofertas e revendas do Rio. Estoque novo toda semana.', categoria: 'vendas', estado: 'RJ', cidade: 'Rio de Janeiro', membros: 12130, tags: ['vendas', 'rj'] },
  { nome: 'Recife Ofertas', descricao: 'Compras e ofertas com frete para Recife e Olinda.', categoria: 'vendas', estado: 'PE', cidade: 'Recife', membros: 4120, tags: ['ofertas', 'recife'] },
  { nome: 'Autos e Motos POA', descricao: 'Venda e compra de veiculos em Porto Alegre e regiao metropolitana.', categoria: 'autos', estado: 'RS', cidade: 'Porto Alegre', membros: 2780, tags: ['carros', 'motos'] },
  { nome: 'Moda Feminina Salvador', descricao: 'Brechós, novidade e ofertas de roupa em Salvador.', categoria: 'moda', estado: 'BA', cidade: 'Salvador', membros: 3910, tags: ['moda', 'brecho'] },
  { nome: 'Pet Shop Fortaleza', descricao: 'Racao, brinquedos e servicos veterinarios em Fortaleza.', categoria: 'pet', estado: 'CE', cidade: 'Fortaleza', membros: 2240, tags: ['pet', 'fortaleza'] },
  { nome: 'Servicos Gerais Goiania', descricao: 'Eletricistas, diaristas, pedreiros e mais em Goiania.', categoria: 'servicos', estado: 'GO', cidade: 'Goiania', membros: 1760, tags: ['servicos', 'goiania'] },
  { nome: 'Eventos Manaus', descricao: 'Shows, feiras e exposicoes em Manaus.', categoria: 'eventos', estado: 'AM', cidade: 'Manaus', membros: 1180, tags: ['eventos', 'manaus'] },
  { nome: 'Free Fire Squad Sul', descricao: 'Squad para jogar Free Fire com jogadores do Sul do pais.', categoria: 'free', estado: 'SC', cidade: 'Florianopolis', membros: 9840, tags: ['freefire', 'squad'] },
  { nome: 'Construcao e Reformas Campinas', descricao: 'Materiais, pedreiros e orcamentos de reforma em Campinas.', categoria: 'casa', estado: 'SP', cidade: 'Campinas', membros: 2050, tags: ['reforma', 'campinas'] },
  { nome: 'Cursos Online Gratuitos', descricao: 'Cursos e materiais gratuitos para estudo e qualificacao.', categoria: 'escola', estado: 'SP', cidade: 'Sao Paulo', membros: 15320, tags: ['cursos', 'gratis'] },
  { nome: 'Igreja Evangelica Betim', descricao: 'Celula, estudo biblico e eventos da comunidade.', categoria: 'religiao', estado: 'MG', cidade: 'Betim', membros: 940, tags: ['igreja', 'estudo'] },
  { nome: 'Barbearia e Beleza Natal', descricao: 'Agenda de barbearias, saloes e manicure em Natal.', categoria: 'saude', estado: 'RN', cidade: 'Natal', membros: 1320, tags: ['barbearia', 'beleza'] },
  { nome: 'Imoveis Recife', descricao: 'Aluguel e compra de imoveis na regiao do Recife.', categoria: 'imoveis', estado: 'PE', cidade: 'Recife', membros: 1870, tags: ['imoveis'] },
  { nome: 'Ofertas Vitoria da Conquista', descricao: 'Promocoes e ofertas locais da cidade.', categoria: 'vendas', estado: 'BA', cidade: 'Vitoria da Conquista', membros: 1450, tags: ['ofertas'] },
  { nome: 'Vagas Presencial Manaus', descricao: 'Vagas de emprego presencial e hybridas em Manaus.', categoria: 'empregos', estado: 'AM', cidade: 'Manaus', membros: 2210, tags: ['vagas'] },
  { nome: 'Agro e Fazenda Cuiaba', descricao: 'Negocios do agronegocio e fazenda em Cuiaba.', categoria: 'outros', estado: 'MT', cidade: 'Cuiaba', membros: 1080, tags: ['agro'] },
  { nome: 'Comidas e Restaurantes SP', descricao: 'Cupons de restaurante e entrega em Sao Paulo.', categoria: 'compras', estado: 'SP', cidade: 'Sao Paulo', membros: 8900, tags: ['restaurante'] },
  { nome: 'Bebidas Geladas Campinas', descricao: 'Cerveja, whisky e destilo com entrega rapida.', categoria: 'bebidas', estado: 'SP', cidade: 'Campinas', membros: 3410, tags: ['bebidas'] },
  { nome: 'Moda Masculina Porto Alegre', descricao: 'Camisas, calcas e calcados com preco direto.', categoria: 'moda', estado: 'RS', cidade: 'Porto Alegre', membros: 1640, tags: ['moda'] },
]

function idWhatsapp(): string {
  const n = Math.floor(Math.random() * 900 + 100)
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return `${letras[n % 26]}${letras[(n * 7) % 26]}${n}${(letras[(n * 3) % 26])}${(letras[(n * 11) % 26])}${(letras[(n * 5) % 26])}`
}

export function gerarGrupos(quantidade = 24): Group[] {
  const usados = new Set<string>()

  return MODELOS.slice(0, quantidade).map((modelo, indice) => {
    let slug = idWhatsapp()
    let tentativas = 0
    while (usados.has(slug) && tentativas < 20) {
      slug = idWhatsapp()
      tentativas += 1
    }
    usados.add(slug)

    const criadoEm = hojeISO(Math.max(0, 40 - indice * 2))
    const cor = ['#53e515', '#38bdf8', '#f59e0b', '#f472b6', '#a78bfa', '#22d3ee', '#4ade80'][indice % 7] ?? '#53e515'

    return {
      id: uid('grp'),
      nome: modelo.nome,
      descricao: modelo.descricao,
      categoria: modelo.categoria,
      estado: modelo.estado,
      cidade: modelo.cidade,
      link: `https://chat.whatsapp.com/${slug}`,
      ownerId: USUARIO_DEMO.id,
      ownerNome: USUARIO_DEMO.nome,
      ownerFoto: USUARIO_DEMO.foto,
      tags: [...modelo.tags, ...(modelo.tagsExtra ?? [])],
      membros: modelo.membros,
      membrosTexto: String(modelo.membros),
      preco: indice % 5 === 0 ? 'pago' : 'gratuito',
      valor: indice % 5 === 0 ? 19.9 : 0,
      imagem: null,
      corDestaque: cor,
      status: indice === 3 ? 'pendente' : 'aprovado',
      destacado: indice < 6,
      fixado: indice < 3,
      gostei: variar(60, 400),
      cliques: variar(120, 900),
      visualizacoes: variar(400, 3000),
      criadoEm,
      atualizadoEm: criadoEm,
    } satisfies Group
  })
}

export function gerarComentarios(grupoId: string): GroupComment[] {
  const textos = [
    'Muito bom, achei o que procurava aqui na cidade. Valeu!',
    'Link funcionando normal, pode entrar.',
    'Grupo ativo e com preco bom. Indicado.',
    'Alguem sabe se o grupo e para whole brasil ou so para a cidade?',
    'ja entrei, consegui uma oferta top. obrigado',
    'O admin responde rapido no zap, recomendo.',
    'Gostei da organizacao por cidade, facilita muito.',
    'Continua assim, tem bastante grupo de verdade aqui.',
  ]

  return textos.slice(0, 5).map((texto, i) => ({
    id: uid('cmt'),
    grupoId,
    autorNome: ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Alves', 'Elaine Souza', 'Felipe Rocha'][i] ?? 'Visitante',
    autorFoto: '',
    autorId: null,
    texto,
    criadoEm: hojeISO(i + 1),
  }))
}

export function gerarNotificacoes(userId: string): AppNotification[] {
  return [
    {
      id: uid('ntf'),
      userId,
      tipo: 'aprovacao',
      titulo: 'Grupo aprovado!',
      texto: 'Seu grupo "Ofertas do Dia DF" foi aprovado e ja aparece no feed.',
      link: '/admin/grupos',
      lida: false,
      criadoEm: hojeISO(0),
    },
    {
      id: uid('ntf'),
      userId,
      tipo: 'clique',
      titulo: 'Seu grupo foi muito acessado',
      texto: 'Voce chegou a 100 cliques hoje. Continue assim!',
      link: '/admin/analytics',
      lida: false,
      criadoEm: hojeISO(1),
    },
    {
      id: uid('ntf'),
      userId,
      tipo: 'pagamento',
      titulo: 'Pagamento confirmado',
      texto: 'Seu plano Admin esta ativo ate o proximo mes.',
      link: '/admin/plano',
      lida: true,
      criadoEm: hojeISO(3),
    },
    {
      id: uid('ntf'),
      userId,
      tipo: 'sistema',
      titulo: 'Bem-vindo ao PostGrupo Aqui Zap',
      texto: 'Complete seu perfil para receber mais cliques nos seus grupos.',
      link: '/admin/configuracoes',
      lida: true,
      criadoEm: hojeISO(6),
    },
  ]
}
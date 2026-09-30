export interface Estado {
  uf: string
  nome: string
  regiao: string
  slug: string
  cidades: string[]
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function slugify(texto: string): string {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const ESTADOS: Estado[] = [
  {
    uf: 'AC', nome: 'Acre', regiao: 'Norte', slug: 'acre',
    cidades: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauaca', 'Feijó'],
  },
  {
    uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste', slug: 'alagoas',
    cidades: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Penedo', 'Delmiro Gouveia'],
  },
  {
    uf: 'AP', nome: 'Amapá', regiao: 'Norte', slug: 'amapa',
    cidades: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque'],
  },
  {
    uf: 'AM', nome: 'Amazonas', regiao: 'Norte', slug: 'amazonas',
    cidades: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
  },
  {
    uf: 'BA', nome: 'Bahia', regiao: 'Nordeste', slug: 'bahia',
    cidades: [
      'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna',
      'Juazeiro', 'Ilhéus', 'Porto Seguro', 'Eunápolis', 'Barreiras', 'Jequié',
    ],
  },
  {
    uf: 'CE', nome: 'Ceará', regiao: 'Nordeste', slug: 'ceara',
    cidades: [
      'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Crato',
      'Maracanaú', 'Quixadá', 'Tianguá',
    ],
  },
  {
    uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste', slug: 'distrito-federal',
    cidades: ['Brasília', 'Taguatinga', 'Ceilândia', 'Gama', 'Sobradinho', 'Planaltina'],
  },
  {
    uf: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste', slug: 'espirito-santo',
    cidades: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Linhares', 'Colatina', 'Guarapari'],
  },
  {
    uf: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste', slug: 'goias',
    cidades: [
      'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia',
      'Cidade Ocidental', 'Trindade',
    ],
  },
  {
    uf: 'MA', nome: 'Maranhão', regiao: 'Nordeste', slug: 'maranhao',
    cidades: ['São Luís', 'Imperatriz', 'Timon', 'Caxias', 'Codó', 'Paço do Lumiar'],
  },
  {
    uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste', slug: 'mato-grosso',
    cidades: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Primavera do Leste'],
  },
  {
    uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', slug: 'mato-grosso-do-sul',
    cidades: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Naviraí'],
  },
  {
    uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste', slug: 'minas-gerais',
    cidades: [
      'Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', ' Montes Claros',
      'Ribeirão das Neves', 'Governador Valadares', 'Ipatinga', 'Sete Lagoas', 'Divinópolis',
      'Poços de Caldas', 'Patrocínio',
    ],
  },
  {
    uf: 'PA', nome: 'Pará', regiao: 'Norte', slug: 'para',
    cidades: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal', 'Parauapebas'],
  },
  {
    uf: 'PB', nome: 'Paraíba', regiao: 'Nordeste', slug: 'paraiba',
    cidades: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Sousa', 'Cabedelo'],
  },
  {
    uf: 'PR', nome: 'Paraná', regiao: 'Sul', slug: 'parana',
    cidades: [
      'Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais',
      'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá',
    ],
  },
  {
    uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste', slug: 'pernambuco',
    cidades: [
      'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Vitória de Santo Antão',
      'Cabo de Santo Agostinho',
    ],
  },
  {
    uf: 'PI', nome: 'Piauí', regiao: 'Nordeste', slug: 'piaui',
    cidades: ['Teresina', 'Parnaíba', 'Picos', 'Floriano', 'Piripiri'],
  },
  {
    uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste', slug: 'rio-de-janeiro',
    cidades: [
      'Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Niterói', 'Petrópolis',
      'Campos dos Goytacazes', 'Nova Iguaçu', 'Belford Roxo', 'Resende', 'Volta Redonda',
    ],
  },
  {
    uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste', slug: 'rio-grande-do-norte',
    cidades: ['Natal', 'Mossoró', 'Parnamirim', 'Caicó', 'Pau dos Ferros'],
  },
  {
    uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul', slug: 'rio-grande-do-sul',
    cidades: [
      'Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gravataí',
      'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande', 'Passo Fundo', 'Bento Gonçalves',
    ],
  },
  {
    uf: 'RO', nome: 'Rondônia', regiao: 'Norte', slug: 'rondonia',
    cidades: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Ji-Paraná', 'Rolim de Moura'],
  },
  {
    uf: 'RR', nome: 'Roraima', regiao: 'Norte', slug: 'roraima',
    cidades: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Mucajaí'],
  },
  {
    uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul', slug: 'santa-catarina',
    cidades: [
      'Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Criciúma', 'Lages', 'Itajaí',
      'Jaraguá do Sul', 'Palhoça', 'Balneário Camboriú',
    ],
  },
  {
    uf: 'SP', nome: 'São Paulo', regiao: 'Sudeste', slug: 'sao-paulo',
    cidades: [
      'São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco',
      'São José dos Campos', 'Ribeirão Preto', 'Sorocaba', 'Santos', 'Mauá', 'São José do Rio Preto',
      'Bauru', 'Piracicaba', 'Taubaté', 'São Carlos', 'Franca', 'Presidente Prudente', 'Carapicuíba',
      'Indaiatuba', 'Cotia', 'Itaquaquecetuba', 'Hortolândia',
    ],
  },
  {
    uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste', slug: 'sergipe',
    cidades: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância'],
  },
  {
    uf: 'TO', nome: 'Tocantins', regiao: 'Norte', slug: 'tocantins',
    cidades: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Tocantinópolis'],
  },
]

export const CIDADES = ESTADOS.flatMap((e) =>
  e.cidades.map((c) => ({ cidade: c, uf: e.uf, estado: e.nome, regiao: e.regiao })),
)

export const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const

const UF_POR_NOME = new Map<string, string>()
for (const estado of ESTADOS) {
  UF_POR_NOME.set(normalizar(estado.nome), estado.uf)
  UF_POR_NOME.set(normalizar(estado.uf), estado.uf)
  UF_POR_NOME.set(estado.slug, estado.uf)
}

export function resolverUF(valor: string): string | null {
  if (!valor) return null
  return UF_POR_NOME.get(normalizar(valor)) ?? null
}

export function buscarEstado(ufOuNome: string): Estado | null {
  const uf = resolverUF(ufOuNome)
  if (!uf) return null
  return ESTADOS.find((e) => e.uf === uf) ?? null
}

export function cidadesDoEstado(ufOuNome: string): string[] {
  return buscarEstado(ufOuNome)?.cidades ?? []
}

export function rotuloEstado(ufOuNome: string): string {
  const estado = buscarEstado(ufOuNome)
  return estado ? `${estado.nome} - ${estado.uf}` : ufOuNome
}

export interface ResultadoCidade {
  cidade: string
  uf: string
  estado: string
  regiao: string
  grupos: number
}

export function buscarCidades(termo: string, limite = 8): ResultadoCidade[] {
  const alvo = normalizar(termo)
  if (alvo.length < 2) return []

  const contagem = new Map<string, ResultadoCidade>()
  for (const item of CIDADES) {
    if (!normalizar(item.cidade).includes(alvo)) continue
    const chave = `${item.cidade}|${item.uf}`
    const existente = contagem.get(chave)
    if (existente) {
      existente.grupos += 1
    } else {
      contagem.set(chave, { cidade: item.cidade, uf: item.uf, estado: item.estado, regiao: item.regiao, grupos: 1 })
    }
  }

  return [...contagem.values()]
    .sort((a, b) => {
      const aExato = normalizar(a.cidade) === alvo ? 0 : 1
      const bExato = normalizar(b.cidade) === alvo ? 0 : 1
      if (aExato !== bExato) return aExato - bExato
      return a.cidade.localeCompare(b.cidade, 'pt-BR')
    })
    .slice(0, limite)
}

export function siglaDoEstadoNome(nome: string): string {
  return resolverUF(nome) ?? ''
}
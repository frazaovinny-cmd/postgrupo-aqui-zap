import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Compass, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { EmptyState } from '@/components/ui/States'

export function Sobre() {
  useSeo({
    titulo: 'Sobre o PostGrupo Aqui Zap',
    descricao:
      ' diretorio de links de grupos de WhatsApp organizado por estado, cidade e categoria. Conheça o projeto e como ele funciona.',
    caminho: '/sobre',
  })

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-neon/25 bg-glow-primary p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid-neon bg-grid opacity-50" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Sobre o projeto
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
            O directorio de grupos de WhatsApp do Brasil
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            O PostGrupo Aqui Zap nasceu para resolver um problema simples: achar o link do grupo de vendas da sua cidade
            sem precisar pedir indicacao a cada pessoa.
          </p>
        </div>
      </header>

      <Card padding="md">
        <SectionTitle titulo="O problema" icone={<AlertTriangle className="h-5 w-5 text-amber-300" aria-hidden />} />
        <p className="text-sm leading-relaxed text-neutral-300">
          Os grupos de WhatsApp de vendas e ofertas se-multiplicam todos os dias, mas quase sempre ficam escondidos:
          quem entra precisa do convite de alguem. Nao existe busca, organizacao por cidade nem forma de saber se o
          link ainda funciona.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-300">
          Aqui voce escolhe estado, cidade e categoria e ve direto todos os grupos disponiveis, com numero de membros,
          data de publicacao e um botao para entrar.
        </p>
      </Card>

      <Card padding="md">
        <SectionTitle titulo="Como o site funciona" icone={<Compass className="h-5 w-5 text-neon" aria-hidden />} />
        <ul className="space-y-3">
          {[
            { icone: Search, titulo: 'Busca por cidade', texto: 'Filtre por estado, cidade, categoria, palavra-chave e tipo de acesso.' },
            { icone: MapPin, titulo: 'Grupos organizados', texto: 'Cada grupo fica vinculado a um estado e uma cidade, com categorias claras.' },
            { icone: MessageCircle, titulo: 'Entrada em 1 toque', texto: 'O botao leva direto ao convite do WhatsApp. Sem instalar nada.' },
            { icone: Users, titulo: 'Administradores', texto: 'Cada admin entra com sua conta Gmail e tem um painel so dele.' },
          ].map((item) => (
            <li key={item.titulo} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon">
                <item.icone className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-neutral-100">{item.titulo}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">{item.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="md">
        <SectionTitle titulo="Para quem administra grupos" icone={<Zap className="h-5 w-5 text-neon" aria-hidden />} />
        <p className="text-sm leading-relaxed text-neutral-300">
          Anyone que administra um grupo paga <strong className="text-neon">R$ 10 por mes</strong> e ganha um painel
          completo: publicar grupos ilimitados, destacar o grupo na cidade da escolha, criar propagandas e acompanhar
          cliques em tempo real.
        </p>
        <Link to="/planos" className="mt-4 inline-block">
          <Button>Ver planos</Button>
        </Link>
      </Card>

      <Card padding="md">
        <SectionTitle titulo="Nossas regras" icone={<ShieldCheck className="h-5 w-5 text-neon" aria-hidden />} />
        <ul className="space-y-2 text-sm text-neutral-300">
          {[
            'Nao permitimos grupos de conteudo ilegal, violento ou de fraude.',
            'Nao permitimos coleta de dados pessoais em massa.',
            'Nao permitimos propagandas enganosas dentro dos grupos.',
            'Denuncie qualquer conteudo pelo botao da pagina do grupo.',
          ].map((regra) => (
            <li key={regra} className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
              {regra}
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="md" className="text-center">
        <p className="text-sm font-bold text-neutral-100">Fale com a gente</p>
        <p className="mt-1 text-xs text-neutral-400">Duvidas, sugestoes ou problemas com algum link?</p>
        <Link to="/contato" className="mt-4 inline-block">
          <Button variante="contorno">Ir para contato</Button>
        </Link>
      </Card>
    </div>
  )
}

export function Contato() {
  useSeo({
    titulo: 'Contato',
    descricao: 'Fale com a equipe do PostGrupo Aqui Zap pelo WhatsApp.',
    caminho: '/contato',
  })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-neon">Fale conosco</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">Contato</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          O canal mais rapido e o WhatsApp. Respondemos em horario comercial.
        </p>
      </header>

      <Card padding="md" className="border-neon/30">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-2xl font-extrabold text-neon">
            V
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-neutral-100">Vinny</p>
            <p className="text-xs text-neutral-400">Desenvolvedor web e administrador do site</p>
            <a
              href="https://wa.me/5561998875920"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-bold text-neon hover:underline"
            >
              (61) 99887-5920
            </a>
          </div>
          <a
            href="https://wa.me/5561998875920"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-xl border border-neon/45 bg-primary px-5 text-sm font-semibold text-neon transition hover:bg-primary-500"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </Card>

      <Card padding="md">
        <SectionTitle titulo="Assuntos comuns" />
        <div className="space-y-2">
          {[
            { p: 'Quero publicar meu grupo', r: 'Acesse /publicar ou entre com sua conta Gmail e use o painel.' },
            { p: 'Quero anunciar', r: 'Veja o plano de R$ 10/mes em /planos e ative pelo painel.' },
            { p: 'O link do meu grupo parou de funcionar', r: 'Edite o grupo no painel e cole um novo convite.' },
            { p: 'Quero reportar um grupo', r: 'Abra a pagina do grupo e toque em "Denunciar conteudo invalido".' },
          ].map((item) => (
            <div key={item.p} className="rounded-xl border border-base-600 p-3.5">
              <p className="text-sm font-bold text-neutral-100">{item.p}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">{item.r}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

interface DocProps {
  titulo: string
  descricao: string
  caminho: string
  secoes: Array<{ titulo: string; texto: ReactNode }>
}

function PaginaDoc({ titulo, descricao, caminho, secoes }: DocProps) {
  useSeo({ titulo, descricao, caminho })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-neon">Institucional</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-100 sm:text-3xl">{titulo}</h1>
        <p className="mt-1.5 text-sm text-neutral-400">{descricao}</p>
      </header>

      <Card padding="md">
        <div className="space-y-6">
          {secoes.map((secao) => (
            <section key={secao.titulo}>
              <h2 className="text-base font-bold text-neon">{secao.titulo}</h2>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-neutral-300">{secao.texto}</div>
            </section>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function Termos() {
  return (
    <PaginaDoc
      titulo="Termos de uso"
      descricao="As regras para usar o PostGrupo Aqui Zap."
      caminho="/termos"
      secoes={[
        {
          titulo: '1. O que e o site',
          texto: (
            <p>
              O PostGrupo Aqui Zap e um diretorio publico de links de grupos de WhatsApp. Nao somos proprietarios dos
              grupos listados: cada grupo pertence ao seu respectivo administrador e segue as regras por ele definidas.
            </p>
          ),
        },
        {
          titulo: '2. Conta de administrador',
          texto: (
            <>
              <p>
                Para publicar grupos e anuncios voce cria uma conta entrando com Gmail. Cada conta tem acesso apenas aos
                proprios grupos e anuncios.
              </p>
              <p>
                E proibido criar contas falsas para manipular cliques, comprar grupos com links quebrados ou usar o site
                para divulgacao enganosa.
              </p>
            </>
          ),
        },
        {
          titulo: '3. Plano e pagamento',
          texto: (
            <>
              <p>
                O plano Admin custa R$ 10 por mes, por administrador, com renovacao automatica. O cancelamento pode ser
                feito a qualquer momento e nao ha multa.
              </p>
              <p>
                Enquanto o plano estiver ativo, o grupo aparece em destaque. Ao cancelar, o grupo continua publicado,
                porem sem destaque e sem direito a novos anuncios.
              </p>
            </>
          ),
        },
        {
          titulo: '4. Conteudo proibido',
          texto: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Grupos de conteudo ilegal, violento ou discriminatorio.</li>
              <li>Divulgacao de golpes, falsificacoes ou documentos ilegeis.</li>
              <li>Coleta de dados pessoais de terceiros.</li>
              <li>Promocoes agressivas fora das regras do site.</li>
            </ul>
          ),
        },
        {
          titulo: '5. Responsabilidade',
          texto: (
            <p>
              O site facilita a descoberta de grupos, mas nao responde pelo conteudo, pelas negociar ou pelo
              funcionamento dos grupos de terceiros. Denuncie conteudos inadequados pela pagina do grupo.
            </p>
          ),
        },
      ]}
    />
  )
}

export function Privacidade() {
  return (
    <PaginaDoc
      titulo="Politica de privacidade"
      descricao="Como tratamos seus dados no PostGrupo Aqui Zap."
      caminho="/privacidade"
      secoes={[
        {
          titulo: '1. Dados que coletamos',
          texto: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Nome, e-mail e foto de perfil, fornecidos pelo login social do Google.</li>
              <li>Cidade, estado e telefone, que voce preenche voluntariamente.</li>
              <li>Informacoes de uso: grupos visitados, cliques e comentarios enviados.</li>
            </ul>
          ),
        },
        {
          titulo: '2. Como usamos',
          texto: (
            <p>
              Usamos esses dados apenas para operar o diretorio: exibir seu perfil nos grupos que voce publica,
              enviar avisos sobre a sua conta e melhorar a busca por cidade e categoria.
            </p>
          ),
        },
        {
          titulo: '3. Armazenamento',
          texto: (
            <p>
              Nesta versao, os dados ficam salvos apenas no seu navegador (localStorage). Nada e enviado para servidores
              externos nem compartilhado com terceiros.
            </p>
          ),
        },
        {
          titulo: '4. Seus direitos',
          texto: (
            <p>
              Voce pode editar ou apagar seus grupos, anuncios e comentarios a qualquer momento pelo painel. Para
              excluir a conta por completo, fale conosco pelo WhatsApp (61) 99887-5920.
            </p>
          ),
        },
        {
          titulo: '5. Contato',
          texto: (
            <p>
              Dudas sobre privacidade? Fale com a gente pelo WhatsApp (61) 99887-5920.
            </p>
          ),
        },
      ]}
    />
  )
}

export function Anunciar() {
  useSeo({
    titulo: 'Quero anunciar no PostGrupo Aqui Zap',
    descricao:
      'Anuncie sua marca nos espacos-sponsored do PostGrupo Aqui Zap: destaque no feed, stories e banners. Fale com o Vinny no WhatsApp.',
    caminho: '/anunciar',
  })

  const planos = [
    {
      nome: 'Feed',
      preco: 'sob consulta',
      detalhes: ['Card patrocinado entre os grupos', 'Link direto para o seu WhatsApp', 'Relatorio de cliques'],
    },
    {
      nome: 'Stories',
      preco: 'sob consulta',
      detalhes: ['Stories no topo do feed', 'Maior taxa de interacao', 'Destaque visual com a sua marca'],
    },
    {
      nome: 'Banner',
      preco: 'sob consulta',
      detalhes: ['Banner fixo no topo do site', 'Exibicao em todas as cidades', 'Melhor posicao para marca nacional'],
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-neon/25 bg-glow-primary p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid-neon bg-grid opacity-50" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Publicidade
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
            Coloque sua marca onde as <span className="gradient-text">pessoas ja estao</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            O PostGrupo Aqui Zap organiza milhares de grupos de WhatsApp por cidade. Quem entra aqui ja procura
            vitrine, oferta e servico — e encontra voce no caminho.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {planos.map((plano) => (
          <Card key={plano.nome} padding="sm" className="flex flex-col">
            <h2 className="text-base font-extrabold text-neutral-100">{plano.nome}</h2>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-neon">{plano.preco}</p>
            <ul className="mt-4 flex-1 space-y-2">
              {plano.detalhes.map((detalhe) => (
                <li key={detalhe} className="flex items-start gap-2 text-xs text-neutral-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
                  {detalhe}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card padding="md" className="border-neon/30">
        <SectionTitle
          titulo="Falar com o Vinny"
          icone={<MessageCircle className="h-5 w-5 text-neon" aria-hidden />}
          subtitulo="Desenvolvedor web. Resposta no mesmo dia."
        />
        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/5561998875920"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-neon px-5 text-sm font-extrabold text-neutral-900 transition hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Chamar no WhatsApp
          </a>
          <a href="mailto:vinny@postgrupoaquizap.com.br" className="inline-block">
            <Button variante="contorno" tamanho="lg" cheio>
              vinny@postgrupoaquizap.com.br
            </Button>
          </a>
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Ao anunciar, voce concorda com os{' '}
          <Link to="/termos" className="text-neon hover:underline">
            Termos de Uso
          </Link>{' '}
          e a{' '}
          <Link to="/privacidade" className="text-neon hover:underline">
            Politica de Privacidade
          </Link>
          .
        </p>
      </Card>
    </div>
  )
}

export function NaoEncontrado() {
  useSeo({ titulo: 'Pagina nao encontrada', caminho: '/404', noindex: true })

  return (
    <div className="mx-auto max-w-xl py-10">
      <EmptyState
        titulo="Pagina nao encontrada"
        descricao="O link que voce acessou nao existe, foi movido ou o conteudo foi removido."
        acao={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/">
              <Button>Ir para o inicio</Button>
            </Link>
            <Link to="/buscar">
              <Button variante="contorno">Explorar grupos</Button>
            </Link>
          </div>
        }
      />
    </div>
  )
}
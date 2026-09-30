import { Link } from 'react-router-dom'
import { BadgeCheck, Check, Crown, MessageSquare, Megaphone, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSeo } from '@/hooks/useSeo'
import { Button } from '@/components/ui/Button'
import { Card, SectionTitle } from '@/components/ui/Primitives'
import { ProgresoBar } from '@/components/ui/Bits'
import { PLAN } from '@/types'
import { cn, formatarMoeda } from '@/lib/utils'

const ITENS = [
  { icone: MessageSquare, titulo: 'Grupos ilimitados', texto: 'Publique todos os grupos que voce administra.' },
  { icone: Sparkles, titulo: 'Destaque na cidade', texto: 'Aparece primeiro nas buscas da sua regiao.' },
  { icone: Megaphone, titulo: 'Anuncios proprios', texto: 'Propagandas com impressoes e cliques medidos.' },
  { icone: Zap, titulo: 'Painel em tempo real', texto: 'Acompanhe cada visita direto no seu celular.' },
  { icone: BadgeCheck, titulo: 'Selo de anunciante', texto: 'Seu perfil ganha selo de administrador.' },
  { icone: ShieldCheck, titulo: 'Suporte prioritario', texto: 'Atendimento direto com o Vinny no WhatsApp.' },
]

const PASSOS = [
  { titulo: 'Crie sua conta', texto: 'Entre com Gmail em menos de 10 segundos.' },
  { titulo: 'Publique seus grupos', texto: 'Nome, link, cidade e categoria.' },
  { titulo: 'Ative o plano', texto: 'R$ 10/mes por administrador.' },
  { titulo: 'Receba cliques', texto: 'Painel com visitas, membros e curtidas.' },
]

export default function Planos() {
  useSeo({
    titulo: 'Planos para anunciantes',
    descricao: `Plano Admin por R$ ${PLAN.precoMensal}/mes: publique grupos de WhatsApp ilimitados, ganhe destaque e anuncie no site.`,
    caminho: '/planos',
  })

  const { autenticado } = useAuth()

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-neon/25 bg-glow-primary p-6 text-center sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-grid-neon bg-grid opacity-50" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neon">
            <Crown className="h-3.5 w-3.5" aria-hidden />
            Para administradores
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
            Um plano simples, <span className="gradient-text">R$ {PLAN.precoMensal} por mes</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
            Cada administrador paga R$ {PLAN.precoMensal}/mes e tem acesso ao seu proprio painel, com os seus grupos e os
            seus anuncios.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card padding="lg">
          <SectionTitle
            titulo="O que esta incluido"
            subtitulo="Todos os recursos, sem limites de uso"
            icone={<Sparkles className="h-5 w-5 text-neon" aria-hidden />}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {ITENS.map((item) => (
              <div key={item.titulo} className="flex items-start gap-3 rounded-xl border border-base-600 p-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon">
                  <item.icone className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-100">{item.titulo}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <aside className="space-y-4">
          <Card padding="lg" className="relative overflow-hidden border-neon/35 bg-gradient-to-b from-primary/70 to-base-800">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-neon/10 blur-2xl" aria-hidden />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-neon">
              <Crown className="h-3 w-3" aria-hidden />
              Admin
            </span>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-neon">{formatarMoeda(PLAN.precoMensal)}</span>
              <span className="text-sm text-neutral-400">/mes</span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">por administrador</p>

            <ul className="mt-5 space-y-2">
              {['Grupos ilimitados', 'Destaque na cidade', 'Anuncios com medicao', 'Painel individual', 'Suporte prioritario'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-neutral-200">
                    <Check className="h-3.5 w-3.5 shrink-0 text-neon" aria-hidden />
                    {item}
                  </li>
                ),
              )}
            </ul>

            <Link to={autenticado ? '/admin/plano' : '/entrar?destino=/admin/plano'} className="mt-6 block">
              <Button cheio tamanho="lg">
                {autenticado ? 'Ativar agora' : 'Entrar e ativar'}
              </Button>
            </Link>
            <p className="mt-2.5 text-center text-[10px] text-neutral-500">Sem taxa de adesao. Cancele quando quiser.</p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-bold text-neutral-100">Plano gratuito</p>
            <p className="mt-1 text-xs text-neutral-400">
              Ate {PLAN.maxGruposGratis} grupos publicados, sem destaque e sem anuncios.
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Uso</span>
                <span className="font-bold text-amber-300">
                  {PLAN.maxGruposGratis}/{PLAN.maxGruposGratis}
                </span>
              </div>
              <ProgresoBar valor={PLAN.maxGruposGratis} maximo={PLAN.maxGruposGratis} className="mt-1.5" rotulo="Uso do plano gratuito" />
            </div>
          </Card>
        </aside>
      </div>

      <section>
        <SectionTitle titulo="Como contratar" subtitulo="Quatro passos, menos de 2 minutos" />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo}>
              <Card padding="md" className="h-full">
                <span
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-full border border-neon/30 text-xs font-bold text-neon',
                  )}
                >
                  {i + 1}
                </span>
                <p className="mt-3 text-sm font-bold text-neutral-100">{passo.titulo}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">{passo.texto}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionTitle titulo="Perguntas frequentes" />
        <div className="space-y-2">
          {[
            {
              p: 'Preciso pagar para postar um grupo?',
              r: `Nao. Voce pode publicar ate ${PLAN.maxGruposGratis} grupos gratuitamente. O plano de R$ ${PLAN.precoMensal}/mes libera publicacao ilimitada, destaque e anuncios.`,
            },
            {
              p: 'Cada administrador paga um plano?',
              r: 'Sim. O plano e por administrador (por conta Gmail). Assim cada um tem seu proprio painel, seus grupos e seus anuncios, sem misturar dados.',
            },
            {
              p: 'Como recebo os cliques nos meus grupos?',
              r: 'Assim que o grupo e publicado, cada visita e registrada. Voce ve o total de cliques, membros, curtidas e comentarios no seu painel.',
            },
            {
              p: 'Posso cancelar quando quiser?',
              r: 'Pode. Nao ha fidelidade nem multa. Ao cancelar, seus grupos continuam publicados, mas perdem o destaque.',
            },
            {
              p: 'Como funciona a propaganda?',
              r: 'Dentro do painel voce cria anuncios com titulo, texto e link. Eles aparecem marcados como patrocinado no feed, na lateral ou nos stories, com impressoes e cliques medidos.',
            },
          ].map((faq) => (
            <details key={faq.p} className="pgz-surface group rounded-xl border p-4">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-bold text-neutral-100 marker:hidden">
                {faq.p}
                <span className="text-neon transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-xs leading-relaxed text-neutral-400">{faq.r}</p>
            </details>
          ))}
        </div>
      </section>

      <Card padding="lg" className="text-center">
        <Users className="mx-auto h-6 w-6 text-neon" aria-hidden />
        <p className="mt-3 text-sm font-bold text-neutral-100">Precisa anunciar varias cidades?</p>
        <p className="mx-auto mt-1.5 max-w-lg text-xs leading-relaxed text-neutral-400">
          Fale com o Vinny e monte um pacote sob medida para varias unidades ou varios administradores.
        </p>
        <a
          href="https://wa.me/5561998875920"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-11 items-center rounded-xl border border-neon/45 bg-primary px-5 text-sm font-semibold text-neon transition hover:bg-primary-500"
        >
          Chamar no WhatsApp: (61) 99887-5920
        </a>
      </Card>
    </div>
  )
}
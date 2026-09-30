# PostGrupo Aqui Zap

Diretorio de grupos de WhatsApp organizados por **estado**, **cidade** e **categoria**, com
interface inspirada no Instagram e painel individual para quem administra os grupos.

## Stack

- React 18 + TypeScript (strict)
- Vite 5
- Tailwind CSS 3
- React Router
- Framer Motion
- Lucide React

## Comandos

```bash
npm install          # instala as dependencias
npm run dev          # servidor de desenvolvimento (http://localhost:5173)
npm run typecheck    # checagem de tipos
npm run build        # build de producao em dist/
npm run preview      # serve o build de producao
```

## Como funciona hoje

A versao atual e um **front-end completo com persistencia local**. Nao ha backend:

- Grupos, comentarios, anuncios, favoritos, curtidas e tema ficam no `localStorage`
  (chaves com prefixo `pgz.`).
- Autenticacao e demonstrativa, por login social simulado.
- O plano de R$ 10/mes e ativado localmente, sem cobranca real.
- Para sair do modo demonstracao, defina `VITE_GOOGLE_CLIENT_ID` (veja `.env.example`).

## Contas de teste

| Conta | E-mail | Plano |
| --- | --- | --- |
| Vinny | vinny@postgrupoaquizap.com.br | ativo |
| Ana Souza | ana.souza@gmail.com | inativo |
| Bruno Lima | bruno.lima@gmail.com | ativo |

Vinny e o administrador dono dos grupos de exemplo, entao e a conta que mostra o painel
com mais conteudo.

## Rotas

| Rota | Descricao |
| --- | --- |
| `/` | Feed inicial estilo Instagram (stories, grupos, anuncios) |
| `/buscar` | Busca e filtros (alias: `/vagas`, `/ofertas`) |
| `/grupo/:id` | Detalhe do grupo, comentarios e denúncia |
| `/perfil` | Redireciona para o seu perfil publico |
| `/perfil/:id` | Perfil publico do administrador |
| `/favoritos` | Grupos que voce salvou |
| `/planos` | Pagina publica do plano |
| `/anunciar` | Publicidade (Vinny) |
| `/publicar` | Publicar ou editar grupo (protegido) |
| `/notificacoes` | Notificacoes (protegido) |
| `/entrar` | Login |
| `/admin` | Dashboard do administrador (protegido) |
| `/admin/grupos` | Meus grupos |
| `/admin/anuncios` | Meus anuncios |
| `/admin/analytics` | Estatisticas |
| `/admin/plano` | Meu plano |
| `/admin/configuracoes` | Configuracoes da conta |
| `/sobre`, `/contato`, `/termos`, `/privacidade` | Paginas institucionais |

Rotas `/admin*`, `/publicar`, `/notificacoes` e `/perfil` exigem sessao. Sem login, o
usuario e enviado para `/entrar?destino=...` e volta para a pagina original depois do login.

## Estrutura

```
src/
  components/    UI base, layout publico, layout administrativo, cards e feed
  context/       AuthContext, DataContext, ThemeContext, ToastContext
  data/          seed de demonstracao, estados e cidades
  lib/           storage, filtros, formatadores, integracao Google
  pages/         paginas publicas e admin
  types/         modelos, categorias, plano e badges
```

## Proximas etapas

1. Backend real (Supabase ou equivalente) para grupos, contas e cobranca.
2. Validacao do token do Google no servidor.
3. Cobranca real do plano de R$ 10/mes (Pix ou cartao).
4. Moderacao das denuncias e aprovacao de grupos.
5. Painel do anunciante para os espacos patrocinados.

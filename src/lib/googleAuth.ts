import type { User } from '@/types'

export interface PerfilGoogle {
  googleId: string
  nome: string
  email: string
  foto: string
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

let carregando: Promise<void> | null = null

interface GoogleCredentialResponse {
  credential?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (resposta: GoogleCredentialResponse) => void
          }) => void
          renderButton: (parent: HTMLElement, config: Record<string, unknown>) => void
        }
      }
    }
  }
}

export function googleConfigurado(): boolean {
  return typeof GOOGLE_CLIENT_ID === 'string' && GOOGLE_CLIENT_ID.length > 20
}

export function carregarScriptGoogle(): Promise<void> {
  if (carregando) return carregando
  carregando = new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[data-google-identity]')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Falha ao carregar o login do Google. Verifique sua conexao.'))
    document.head.appendChild(script)
  })
  return carregando
}

/**
 * Login real via Google Identity Services (JWT do front-end).
 * Retorna null quando o SDK nao esta pronto para uso.
 */
export async function obterTokenGoogle(): Promise<string | null> {
  if (!googleConfigurado()) return null
  try {
    await carregarScriptGoogle()
  } catch {
    return null
  }

  return new Promise<string | null>((resolve) => {
    const timeout = setTimeout(() => resolve(null), 8000)
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID ?? '',
      callback: (resposta) => {
        clearTimeout(timeout)
        resolve(resposta.credential ?? null)
      },
    })
    const alvo = document.getElementById('google-signin-helper')
    if (!alvo || !window.google?.accounts.id.renderButton) {
      clearTimeout(timeout)
      resolve(null)
      return
    }
    alvo.innerHTML = ''
    window.google.accounts.id.renderButton(alvo, {
      type: 'standard',
      theme: document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 320,
    })
    resolve(null)
  })
}

/** Contas de demonstracao usadas quando o Google OAuth nao esta configurado. */
export const CONTAS_DEMO: Array<PerfilGoogle & { senha?: string; perfil: Partial<User> }> = [
  {
    googleId: 'demo-vinny',
    nome: 'Vinny',
    email: 'vinny@postgrupoaquizap.com.br',
    foto: '',
    perfil: {
      bio: 'Desenvolvedor de sites e apps. Crio paginas rapidas para grupos e businesses.',
      cidade: 'Brasilia',
      estado: 'DF',
      telefone: '61998875920',
      role: 'admin',
      planoAtivo: true,
    },
  },
  {
    googleId: 'demo-ana',
    nome: 'Ana Souza',
    email: 'ana.souza@gmail.com',
    foto: '',
    perfil: {
      bio: 'Cuido de grupos de ofertas da regiao de Campinas.',
      cidade: 'Campinas',
      estado: 'SP',
      telefone: '',
      role: 'admin',
      planoAtivo: false,
    },
  },
  {
    googleId: 'demo-bruno',
    nome: 'Bruno Lima',
    email: 'bruno.lima@gmail.com',
    foto: '',
    perfil: {
      bio: 'Grupo de pets em Recife.',
      cidade: 'Recife',
      estado: 'PE',
      telefone: '',
      role: 'admin',
      planoAtivo: true,
    },
  },
]

export function googleHabilitado(): boolean {
  return googleConfigurado()
}
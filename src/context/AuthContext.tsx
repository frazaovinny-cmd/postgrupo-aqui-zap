import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CHAVES, gravar, ler } from '@/lib/storage'
import { agora, dataMais30Dias, uid } from '@/lib/utils'
import { CONTAS_DEMO, type PerfilGoogle } from '@/lib/googleAuth'
import { USUARIO_DEMO } from '@/data/seed'
import type { User } from '@/types'

interface AuthContextValue {
  usuario: User | null
  carregando: boolean
  autenticado: boolean
  entrarComo: (perfil: PerfilGoogle, extras?: Partial<User>) => User
  sair: () => void
  atualizarPerfil: (dados: Partial<Pick<User, 'nome' | 'bio' | 'cidade' | 'estado' | 'telefone' | 'foto'>>) => void
  ativarPlano: () => void
  adicionarPontos: (pontos: number) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type RegistroUsuarios = Record<string, User>

function chaveEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Registro de contas por e-mail. Garante que o id do usuario seja estavel entre
 * sessoes — e o que permite que os grupos publicados continuem vinculados ao
 * dono correto mesmo depois de recarregar a pagina.
 */
function lerRegistro(): RegistroUsuarios {
  const salvo = ler<RegistroUsuarios>(CHAVES.usuarios, {})
  if (Object.keys(salvo).length > 0) return salvo

  const inicial: RegistroUsuarios = {}
  for (const conta of CONTAS_DEMO) {
    const hoje = agora()
    const ativo = conta.perfil.planoAtivo ?? false
    inicial[chaveEmail(conta.email)] = {
      id: conta.googleId === USUARIO_DEMO.googleId ? USUARIO_DEMO.id : uid('usr'),
      googleId: conta.googleId,
      nome: conta.nome,
      email: conta.email,
      foto: conta.foto,
      bio: conta.perfil.bio ?? '',
      cidade: conta.perfil.cidade ?? '',
      estado: conta.perfil.estado ?? '',
      telefone: conta.perfil.telefone ?? '',
      role: conta.perfil.role ?? 'admin',
      planoAtivo: ativo,
      planoStatus: ativo ? 'ativo' : 'inativo',
      planoVenceEm: ativo ? dataMais30Dias() : null,
      pontos: conta.googleId === USUARIO_DEMO.googleId ? USUARIO_DEMO.pontos : 10,
      nivel: 1,
      criadoEm: hoje,
    }
  }
  gravar(CHAVES.usuarios, inicial)
  return inicial
}

function usuarioDePerfil(perfil: PerfilGoogle, id: string, extras?: Partial<User>): User {
  const hoje = agora()
  return {
    id,
    googleId: perfil.googleId,
    nome: perfil.nome,
    email: perfil.email,
    foto: perfil.foto,
    bio: extras?.bio ?? '',
    cidade: extras?.cidade ?? '',
    estado: extras?.estado ?? '',
    telefone: extras?.telefone ?? '',
    role: extras?.role ?? 'admin',
    planoAtivo: extras?.planoAtivo ?? false,
    planoStatus: extras?.planoAtivo ? 'ativo' : 'inativo',
    planoVenceEm: extras?.planoAtivo ? dataMais30Dias() : null,
    pontos: extras?.pontos ?? 10,
    nivel: 1,
    criadoEm: hoje,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    lerRegistro()
    const salvo = ler<User | null>(CHAVES.usuario, null)
    if (salvo) {
      const vencimento = salvo.planoVenceEm ? new Date(salvo.planoVenceEm).getTime() : 0
      const expirado = vencimento > 0 && vencimento < Date.now()
      setUsuario(
        expirado
          ? { ...salvo, planoAtivo: false, planoStatus: 'vencido' }
          : salvo,
      )
    }
    setCarregando(false)
  }, [])

  const persistir = useCallback((proximo: User | null) => {
    setUsuario(proximo)
    gravar(CHAVES.usuario, proximo)
    if (proximo) {
      const registro = ler<RegistroUsuarios>(CHAVES.usuarios, {})
      registro[chaveEmail(proximo.email)] = proximo
      gravar(CHAVES.usuarios, registro)
    }
  }, [])

  const entrarComo = useCallback(
    (perfil: PerfilGoogle, extras?: Partial<User>): User => {
      const registro = lerRegistro()
      const chave = chaveEmail(perfil.email)
      const anterior = registro[chave]

      const extrasCombinados = extras ?? (perfil as { perfil?: Partial<User> }).perfil

      const base: User = anterior
        ? {
            ...anterior,
            googleId: perfil.googleId,
            nome: perfil.nome || anterior.nome,
            email: anterior.email,
            foto: perfil.foto || anterior.foto,
          }
        : usuarioDePerfil(perfil, uid('usr'), extrasCombinados)

      const usuarioFinal: User = { ...base, ...extrasCombinados, id: base.id }

      // Preserva assinatura, pontos e nivel ja conquistados pela mesma conta.
      if (anterior && !extras) {
        usuarioFinal.planoAtivo = anterior.planoAtivo
        usuarioFinal.planoStatus = anterior.planoStatus
        usuarioFinal.planoVenceEm = anterior.planoVenceEm
        usuarioFinal.pontos = anterior.pontos
        usuarioFinal.nivel = anterior.nivel
        usuarioFinal.bio = anterior.bio || usuarioFinal.bio
        usuarioFinal.cidade = anterior.cidade || usuarioFinal.cidade
        usuarioFinal.estado = anterior.estado || usuarioFinal.estado
        usuarioFinal.telefone = anterior.telefone || usuarioFinal.telefone
      }

      const vencimento = usuarioFinal.planoVenceEm ? new Date(usuarioFinal.planoVenceEm).getTime() : 0
      if (usuarioFinal.planoAtivo && vencimento > 0 && vencimento < Date.now()) {
        usuarioFinal.planoAtivo = false
        usuarioFinal.planoStatus = 'vencido'
      }

      persistir(usuarioFinal)
      return usuarioFinal
    },
    [persistir],
  )

  const sair = useCallback(() => {
    persistir(null)
  }, [persistir])

  const atualizarPerfil = useCallback(
    (dados: Partial<Pick<User, 'nome' | 'bio' | 'cidade' | 'estado' | 'telefone' | 'foto'>>) => {
      setUsuario((atual) => {
        if (!atual) return atual
        const proximo: User = { ...atual, ...dados, pontos: atual.pontos + 20 }
        gravar(CHAVES.usuario, proximo)
        const registro = ler<RegistroUsuarios>(CHAVES.usuarios, {})
        registro[chaveEmail(proximo.email)] = proximo
        gravar(CHAVES.usuarios, registro)
        return proximo
      })
    },
    [],
  )

  const ativarPlano = useCallback(() => {
    setUsuario((atual) => {
      if (!atual) return atual
      const proximo: User = {
        ...atual,
        planoAtivo: true,
        planoStatus: 'ativo',
        planoVenceEm: dataMais30Dias(),
        pontos: atual.pontos + 40,
      }
      gravar(CHAVES.usuario, proximo)
      const registro = ler<RegistroUsuarios>(CHAVES.usuarios, {})
      registro[chaveEmail(proximo.email)] = proximo
      gravar(CHAVES.usuarios, registro)
      return proximo
    })
  }, [])

  const adicionarPontos = useCallback((pontos: number) => {
    setUsuario((atual) => {
      if (!atual) return atual
      const soma = atual.pontos + pontos
      const proximo: User = { ...atual, pontos: soma, nivel: Math.max(1, Math.floor(soma / 100) + 1) }
      gravar(CHAVES.usuario, proximo)
      const registro = ler<RegistroUsuarios>(CHAVES.usuarios, {})
      registro[chaveEmail(proximo.email)] = proximo
      gravar(CHAVES.usuarios, registro)
      return proximo
    })
  }, [])

  const valor = useMemo<AuthContextValue>(
    () => ({
      usuario,
      carregando,
      autenticado: usuario !== null,
      entrarComo,
      sair,
      atualizarPerfil,
      ativarPlano,
      adicionarPontos,
    }),
    [usuario, carregando, entrarComo, sair, atualizarPerfil, ativarPlano, adicionarPontos],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}

export { CONTAS_DEMO, USUARIO_DEMO }
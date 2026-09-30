const PREFIXO = 'pgz.'
const disponivel = (() => {
  try {
    const teste = `${PREFIXO}__t`
    localStorage.setItem(teste, '1')
    localStorage.removeItem(teste)
    return true
  } catch {
    return false
  }
})()

const memoria = new Map<string, string>()

export function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = disponivel ? localStorage.getItem(PREFIXO + chave) : memoria.get(chave) ?? null
    if (bruto === null) return padrao
    return JSON.parse(bruto) as T
  } catch (erro) {
    console.warn(`[storage] falha ao ler "${chave}"`, erro)
    return padrao
  }
}

export function gravar<T>(chave: string, valor: T): boolean {
  try {
    const bruto = JSON.stringify(valor)
    if (disponivel) localStorage.setItem(PREFIXO + chave, bruto)
    else memoria.set(chave, bruto)
    return true
  } catch (erro) {
    console.warn(`[storage] falha ao gravar "${chave}"`, erro)
    return false
  }
}

export function apagar(chave: string): void {
  try {
    if (disponivel) localStorage.removeItem(PREFIXO + chave)
    else memoria.delete(chave)
  } catch (erro) {
    console.warn(`[storage] falha ao apagar "${chave}"`, erro)
  }
}

/** Leitura/escrita sem JSON — usado por valores lidos pelo script anti-FOUC no index.html. */
export function lerTexto(chave: string): string | null {
  try {
    return disponivel ? localStorage.getItem(PREFIXO + chave) : memoria.get(chave) ?? null
  } catch {
    return null
  }
}

export function gravarTexto(chave: string, valor: string): void {
  try {
    if (disponivel) localStorage.setItem(PREFIXO + chave, valor)
    else memoria.set(chave, valor)
  } catch (erro) {
    console.warn(`[storage] falha ao gravar texto "${chave}"`, erro)
  }
}

export function limparTodo(): void {
  try {
    if (disponivel) {
      const chaves: string[] = []
      for (let i = 0; i < localStorage.length; i += 1) {
        const chave = localStorage.key(i)
        if (chave?.startsWith(PREFIXO)) chaves.push(chave)
      }
      chaves.forEach((chave) => localStorage.removeItem(chave))
    }
    memoria.clear()
  } catch (erro) {
    console.warn('[storage] falha ao limpar tudo', erro)
  }
}

export const CHAVES = {
  grupos: 'grupos',
  comentarios: 'comentarios',
  anuncios: 'anuncios',
  notificacoes: 'notificacoes',
  usuario: 'usuario',
  usuarios: 'usuarios',
  likes: 'likes',
  tema: 'theme',
  oncboarding: 'oncboarding',
  buscaRecente: 'busca-recente',
  favoritos: 'favoritos',
  reports: 'reports',
} as const

export const storageDisponivel = disponivel
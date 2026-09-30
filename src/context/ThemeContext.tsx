import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CHAVES, gravarTexto, lerTexto } from '@/lib/storage'
import type { ThemeMode } from '@/types'

interface ThemeContextValue {
  tema: ThemeMode
  alternarTema: () => void
  definirTema: (tema: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function aplicar(tema: ThemeMode): void {
  const root = document.documentElement
  root.classList.toggle('dark', tema === 'dark')
  root.style.colorScheme = tema
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', tema === 'dark' ? '#161313' : '#f5f7f3')
}

function inicial(): ThemeMode {
  const armazenado = lerTexto(CHAVES.tema)
  if (armazenado === 'light' || armazenado === 'dark') return armazenado
  const prefereClaro = window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false
  return prefereClaro ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<ThemeMode>(inicial)

  useEffect(() => {
    aplicar(tema)
  }, [tema])

  const definirTema = useCallback((novo: ThemeMode) => {
    setTema(novo)
    gravarTexto(CHAVES.tema, novo)
  }, [])

  const alternarTema = useCallback(() => {
    setTema((atual) => {
      const novo = atual === 'dark' ? 'light' : 'dark'
      gravarTexto(CHAVES.tema, novo)
      return novo
    })
  }, [])

  const valor = useMemo<ThemeContextValue>(
    () => ({ tema, alternarTema, definirTema }),
    [tema, alternarTema, definirTema],
  )

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>')
  return ctx
}
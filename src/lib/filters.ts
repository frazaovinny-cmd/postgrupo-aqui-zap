import type { Group } from '@/types'
import { normalizar } from '@/lib/utils'

export interface CidadeFeed {
  cidade: string
  estado: string
  total: number
}

export function citiesForFeed(grupos: Group[]): CidadeFeed[] {
  const mapa = new Map<string, CidadeFeed>()

  for (const g of grupos) {
    if (g.status !== 'aprovado') continue
    const chave = `${normalizar(g.cidade)}|${normalizar(g.estado)}`
    const existente = mapa.get(chave)
    if (existente) {
      existente.total += 1
    } else {
      mapa.set(chave, { cidade: g.cidade, estado: g.estado, total: 1 })
    }
  }

  return [...mapa.values()].sort((a, b) => b.total - a.total || a.cidade.localeCompare(b.cidade, 'pt-BR'))
}

export function estadosComGrupos(grupos: Group[]): Array<{ estado: string; total: number }> {
  const mapa = new Map<string, number>()
  for (const g of grupos) {
    if (g.status !== 'aprovado') continue
    mapa.set(g.estado, (mapa.get(g.estado) ?? 0) + 1)
  }
  return [...mapa.entries()]
    .map(([estado, total]) => ({ estado, total }))
    .sort((a, b) => b.total - a.total)
}

export function categoriasComGrupos(grupos: Group[]): Array<{ value: string; total: number }> {
  const mapa = new Map<string, number>()
  for (const g of grupos) {
    if (g.status !== 'aprovado') continue
    mapa.set(g.categoria, (mapa.get(g.categoria) ?? 0) + 1)
  }
  return [...mapa.entries()].map(([value, total]) => ({ value, total })).sort((a, b) => b.total - a.total)
}
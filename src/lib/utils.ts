import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function uid(prefixo = 'id'): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefixo}_${Date.now().toString(36)}_${random}`
}

export function agora(): string {
  return new Date().toISOString()
}

export function diasAtras(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(ms / 86_400_000))
}

export function formatarData(iso: string): string {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function tempoRelativo(iso: string): string {
  const data = new Date(iso).getTime()
  if (Number.isNaN(data)) return '—'

  const segundos = Math.floor((Date.now() - data) / 1000)
  if (segundos < 45) return 'agora'
  if (segundos < 90) return 'há 1 min'

  const minutos = Math.floor(segundos / 60)
  if (minutos < 60) return `há ${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `há ${horas} h`

  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'ontem'
  if (dias < 7) return `há ${dias} dias`

  const semanas = Math.floor(dias / 7)
  if (semanas < 5) return `há ${semanas} sem`

  const meses = Math.floor(dias / 30)
  if (meses < 12) return `há ${meses} ${meses === 1 ? 'mês' : 'meses'}`

  const anos = Math.floor(dias / 365)
  return `há ${anos} ${anos === 1 ? 'ano' : 'anos'}`
}

export function formatarNumero(valor: number, compact = false): string {
  if (!Number.isFinite(valor)) return '0'
  if (compact && valor >= 1000) {
    return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(valor)
  }
  return new Intl.NumberFormat('pt-BR').format(valor)
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export function formatarMembros(valor: number): string {
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(1).replace('.', ',')} mi`
  if (valor >= 1_000) return `${(valor / 1_000).toFixed(1).replace('.', ',')} mil`
  return String(valor)
}

export function formatarPlacar(valor: number): string {
  return formatarNumero(valor, true)
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return (partes[0] ?? '').slice(0, 2).toUpperCase()
  const primeiro = partes[0]?.[0] ?? ''
  const ultimo = partes[partes.length - 1]?.[0] ?? ''
  return `${primeiro}${ultimo}`.toUpperCase()
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function semAcento(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function titulo(texto: string, limite = 40): string {
  if (texto.length <= limite) return texto
  return `${texto.slice(0, limite - 1).trimEnd()}…`
}

export function navegarParaWhatsapp(link: string, mensagem?: string): void {
  const limpo = link.trim()
  if (!limpo) return
  const base = /^https?:\/\//i.test(limpo) ? limpo : `https://${limpo}`
  const url = mensagem ? `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(mensagem)}` : base
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D+/g, '')
}

export function mascaraCelularBR(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function linkWhatsappValido(link: string): boolean {
  const limpo = link.trim()
  if (!limpo) return false
  const candidato = /^https?:\/\//i.test(limpo) ? limpo : `https://${limpo}`
  try {
    const url = new URL(candidato)
    if (!['http:', 'https:'].includes(url.protocol)) return false
    const alvo = `${url.hostname}${url.pathname}`.toLowerCase()
    return (
      alvo.includes('chat.whatsapp.com') ||
      alvo.includes('whatsapp.com') ||
      alvo.includes('t.me') ||
      alvo.includes('wa.me')
    )
  } catch {
    return false
  }
}

export function urlValida(valor: string): boolean {
  if (!valor.trim()) return false
  try {
    const url = new URL(valor.startsWith('http') ? valor : `https://${valor}`)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export function emojiIniciais(texto: string): string {
  const limpo = texto.replace(/[\p{Extended_Pictographic}]/gu, '').trim()
  if (limpo) return limpo.slice(0, 2).toUpperCase()
  return texto.slice(0, 2).toUpperCase()
}

export function porcentagem(parte: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((parte / total) * 100)
}

export function dataMais30Dias(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString()
}

export function nivelPorPontos(pontos: number): { nivel: number; faltam: number; progresso: number } {
  const nivel = Math.max(1, Math.floor(pontos / 100) + 1)
  const base = (nivel - 1) * 100
  const faltam = Math.max(0, base + 100 - pontos)
  const progresso = pontos >= base + 100 ? 100 : Math.round(((pontos - base) / 100) * 100)
  return { nivel, faltam, progresso }
}

export function variar(base: number, spread: number): number {
  return Math.max(0, base + Math.floor(Math.random() * spread) - Math.floor(spread / 2))
}

export function hojeISO(dias = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString()
}

export function agrupar<T, K extends string>(lista: T[], chave: (item: T) => K): Record<K, T[]> {
  return lista.reduce<Record<string, T[]>>((acc, item) => {
    const k = chave(item)
    const listaAtual = acc[k]
    if (listaAtual) listaAtual.push(item)
    else acc[k] = [item]
    return acc
  }, {}) as Record<K, T[]>
}

export function limitar<T>(lista: T[], inicio: number, quantidade: number): T[] {
  return lista.slice(inicio, inicio + quantidade)
}

export function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = copia[i]
    const b = copia[j]
    if (a !== undefined && b !== undefined) {
      copia[i] = b
      copia[j] = a
    }
  }
  return copia
}

export function clamp(valor: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, valor))
}

export function pluralizar(quantidade: number, singular: string, plural: string): string {
  return `${formatarNumero(quantidade)} ${quantidade === 1 ? singular : plural}`
}
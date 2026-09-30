import { useEffect } from 'react'

const TITULO_PADRAO = 'PostGrupo Aqui Zap'

interface SeoProps {
  titulo?: string
  descricao?: string
  imagem?: string
  caminho?: string
  noindex?: boolean
}

function aplicarMeta(seletor: string, atributo: 'name' | 'property', chave: string, conteudo: string): void {
  let elemento = document.head.querySelector<HTMLMetaElement>(`${seletor}[${atributo}="${chave}"]`)
  if (!elemento) {
    elemento = document.createElement('meta')
    elemento.setAttribute(atributo, chave)
    document.head.appendChild(elemento)
  }
  elemento.setAttribute('content', conteudo)
}

/** Atualiza title, description, Open Graph e canonical por pagina. */
export function useSeo({ titulo, descricao, imagem, caminho, noindex }: SeoProps): void {
  useEffect(() => {
    const completo = titulo ? `${titulo} | ${TITULO_PADRAO}` : TITULO_PADRAO
    document.title = completo

    const desc =
      descricao ??
      'Encontre links de grupos de WhatsApp de vendas, ofertas e oportunidades por cidade e estado.'
    const url = caminho ? `https://postgrupoaquizap.com.br${caminho}` : 'https://postgrupoaquizap.com.br/'
    const img = imagem ?? '/favicon.svg'

    aplicarMeta('meta', 'name', 'description', desc)
    aplicarMeta('meta', 'property', 'og:title', completo)
    aplicarMeta('meta', 'property', 'og:description', desc)
    aplicarMeta('meta', 'property', 'og:url', url)
    aplicarMeta('meta', 'property', 'og:image', `https://postgrupoaquizap.com.br${img}`)
    aplicarMeta('meta', 'name', 'twitter:title', completo)
    aplicarMeta('meta', 'name', 'twitter:description', desc)
    aplicarMeta('meta', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [titulo, descricao, imagem, caminho, noindex])
}
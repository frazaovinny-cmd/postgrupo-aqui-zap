import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function BackToTop() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const aoScroll = () => setVisivel(window.scrollY > 320)
    aoScroll()
    window.addEventListener('scroll', aoScroll, { passive: true })
    return () => window.removeEventListener('scroll', aoScroll)
  }, [])

  return (
    <AnimatePresence>
      {visivel ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="glass fixed bottom-4 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-neon/40 px-4 py-2 text-xs font-semibold text-neon shadow-neon-sm transition hover:bg-base-700 sm:bottom-6"
        >
          Voltar ao topo
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
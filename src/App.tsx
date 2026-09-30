import { Suspense, useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { DataProvider } from '@/context/DataContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Footer, Header, MobileTabBar } from '@/components/layout/Layout'
import AdminLayout from '@/components/layout/AdminLayout'
import { BackToTop } from '@/components/ui/BackToTop'
import { Skeleton } from '@/components/ui/States'
import Home from '@/pages/Home'
import Explorar from '@/pages/Explorar'
import GrupoDetalhe from '@/pages/GrupoDetalhe'
import Favoritos from '@/pages/Favoritos'
import Entrar from '@/pages/Entrar'
import Notificacoes from '@/pages/Notificacoes'
import Planos from '@/pages/Planos'
import PerfilPublico from '@/pages/PerfilPublico'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import MeusGrupos from '@/pages/admin/MeusGrupos'
import PublicarGrupo from '@/pages/admin/PublicarGrupo'
import MeusAnuncios from '@/pages/admin/MeusAnuncios'
import Estatisticas from '@/pages/admin/Estatisticas'
import MeuPlano from '@/pages/admin/MeuPlano'
import Configuracoes from '@/pages/admin/Configuracoes'
import { Sobre, Contato, Termos, Privacidade, Anunciar, NaoEncontrado } from '@/pages/Estaticas'

/** Redireciona /perfil para o perfil publico do usuario logado. */
function MeuPerfil() {
  const { usuario, autenticado, carregando } = useAuth()

  if (carregando) return <CarregandoPagina />
  if (!autenticado || !usuario) return <Navigate to="/entrar?destino=%2Fperfil" replace />
  return <Navigate to={`/perfil/${usuario.id}`} replace />
}

function CarregandoPagina() {
  return (
    <div className="space-y-4 py-8" role="status" aria-label="Carregando pagina">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  )
}

function ScrollParaTopo() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function Protegida({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <CarregandoPagina />

  if (!autenticado) {
    const destino = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/entrar?destino=${destino}`} replace />
  }

  return <>{children}</>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-neon"
      >
        Pular para o conteudo
      </a>

      <Header />

      <main
        id="conteudo"
        className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-6 lg:pb-12"
      >
        {children}
      </main>

      <Footer />
      <MobileTabBar />
      <BackToTop />
    </div>
  )
}

function AdminProtegido() {
  const { autenticado, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <CarregandoPagina />

  if (!autenticado) {
    const destino = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/entrar?destino=${destino}`} replace />
  }

  return <AdminLayout />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <DataProvider>
              <AuthProvider>
                <ScrollParaTopo />
                <Layout>
                  <Suspense fallback={<CarregandoPagina />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/buscar" element={<Explorar />} />
                      <Route path="/vagas" element={<Explorar />} />
                      <Route path="/ofertas" element={<Explorar />} />
                      <Route path="/grupo/:id" element={<GrupoDetalhe />} />
                      <Route path="/perfil" element={<MeuPerfil />} />
                      <Route path="/perfil/:id" element={<PerfilPublico />} />
                      <Route path="/favoritos" element={<Favoritos />} />
                      <Route path="/planos" element={<Planos />} />
                      <Route path="/anunciar" element={<Anunciar />} />
                      <Route path="/sobre" element={<Sobre />} />
                      <Route path="/contato" element={<Contato />} />
                      <Route path="/termos" element={<Termos />} />
                      <Route path="/privacidade" element={<Privacidade />} />

                      <Route path="/entrar" element={<Entrar />} />

                      <Route
                        path="/publicar"
                        element={
                          <Protegida>
                            <PublicarGrupo />
                          </Protegida>
                        }
                      />
                      <Route
                        path="/notificacoes"
                        element={
                          <Protegida>
                            <Notificacoes />
                          </Protegida>
                        }
                      />

                      <Route element={<AdminProtegido />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/grupos" element={<MeusGrupos />} />
                        <Route path="/admin/anuncios" element={<MeusAnuncios />} />
                        <Route path="/admin/analytics" element={<Estatisticas />} />
                        <Route path="/admin/plano" element={<MeuPlano />} />
                        <Route path="/admin/configuracoes" element={<Configuracoes />} />
                      </Route>

                      <Route path="*" element={<NaoEncontrado />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </AuthProvider>
            </DataProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
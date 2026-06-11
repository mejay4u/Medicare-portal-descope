import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@descope/react-sdk'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { setBaseUrl } from '@medicare/shared'

// Configure the shared API layer with the Vite env URL before any query runs
setBaseUrl(import.meta.env.VITE_API_URL ?? 'http://localhost:3001')

const App            = lazy(() => import('./App.tsx'))
const LoginPage      = lazy(() => import('./pages/LoginPage.tsx'))
const Dashboard      = lazy(() => import('./pages/Dashboard.tsx'))
const FindCare       = lazy(() => import('./pages/FindCare.tsx'))
const Benefits       = lazy(() => import('./pages/Benefits.tsx'))
const Prescriptions  = lazy(() => import('./pages/Prescriptions.tsx'))
const Claims         = lazy(() => import('./pages/Claims.tsx'))
const ClaimDetails   = lazy(() => import('./pages/ClaimDetails.tsx'))
const SubmitClaim    = lazy(() => import('./pages/SubmitClaim.tsx'))
const ProviderDetail = lazy(() => import('./pages/ProviderDetail.tsx'))

const queryClient = new QueryClient()

function Page({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>Loading…</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider projectId={import.meta.env.VITE_DESCOPE_PROJECT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Page><LoginPage /></Page>} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Page><App /></Page>
                </ProtectedRoute>
              }
            >
              <Route index element={<Page><Dashboard /></Page>} />
              <Route path="find-care" element={<Page><FindCare /></Page>} />
              <Route path="find-care/:id" element={<Page><ProviderDetail /></Page>} />
              <Route path="benefits" element={<Page><Benefits /></Page>} />
              <Route path="prescriptions" element={<Page><Prescriptions /></Page>} />
              <Route path="claims" element={<Page><Claims /></Page>} />
              <Route path="claims/:id" element={<Page><ClaimDetails /></Page>} />
              <Route path="claims/submit" element={<Page><SubmitClaim /></Page>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)

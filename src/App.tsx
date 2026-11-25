/**
 * Raíz de la aplicación AgriMarket.
 *
 * Define el Navbar (visible en todas las páginas) y las rutas:
 * - /          → Landing (pública)
 * - /login     → Login (pública)
 * - /registro  → Register (pública)
 * - /catalogo, /panel, /mis-solicitudes → privadas (requieren sesión);
 *   por ahora muestran un placeholder "Próximamente" porque las páginas
 *   reales las construyen otros módulos. Cuando lleguen, solo se cambia
 *   el import de cada ruta.
 * - *          → redirige a /
 */

import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './hooks/useAuth'

/**
 * Protege rutas privadas: si no hay sesión activa, redirige a /login.
 * Mientras se restaura la sesión muestra un texto de carga.
 */
function RutaPrivada({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <p className="px-4 pt-24 text-center text-sm text-agri-texto-suave">
        Cargando…
      </p>
    )
  }
  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  return children
}

/**
 * Placeholder temporal para los módulos que aún están en desarrollo
 * (catálogo, panel del productor y mis solicitudes).
 */
function Proximamente({ nombre }: { nombre: string }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <h1 className="font-display text-2xl font-bold text-agri-texto sm:text-3xl">
        {nombre}
      </h1>
      <p className="mt-3 max-w-md text-sm text-agri-texto-suave sm:text-base">
        Este módulo está en desarrollo. Muy pronto estará disponible.
      </p>
    </main>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      {/* Espaciado superior para compensar la barra de navegación fija. */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/catalogo"
            element={
              <RutaPrivada>
                <Proximamente nombre="Catálogo" />
              </RutaPrivada>
            }
          />
          <Route
            path="/panel"
            element={
              <RutaPrivada>
                <Proximamente nombre="Panel del productor" />
              </RutaPrivada>
            }
          />
          <Route
            path="/mis-solicitudes"
            element={
              <RutaPrivada>
                <Proximamente nombre="Mis solicitudes" />
              </RutaPrivada>
            }
          />
          {/* Cualquier ruta desconocida vuelve a la landing. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

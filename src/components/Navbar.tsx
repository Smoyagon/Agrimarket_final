/**
 * Barra de navegación superior de AgriMarket.
 *
 * Barra fija en la parte superior, fondo blanco con borde inferior suave.
 * Muestra opciones según el estado de la sesión (usa el hook useAuth):
 * - Sin sesión: botones "Iniciar sesión" y "Crear cuenta".
 * - Con sesión: saludo con el nombre, insignia con el rol, enlaces según
 *   el rol (Catálogo + Mi panel / Mis solicitudes) y botón Cerrar sesión.
 *
 * Responsive: en celular las opciones se pliegan en un menú hamburguesa.
 * La navegación usa enlaces #/... (el router se conecta en un paso posterior).
 */

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  /** Enlaces visibles solo con sesión, según el rol del usuario. */
  const enlacesSesion = usuario
    ? [
        { texto: 'Catálogo', href: '#/catalogo' },
        usuario.rol === 'productor'
          ? { texto: 'Mi panel', href: '#/panel' }
          : { texto: 'Mis solicitudes', href: '#/mis-solicitudes' },
      ]
    : []

  const manejarCerrarSesion = () => {
    cerrarSesion()
    setMenuAbierto(false)
    // Al cerrar sesión se vuelve a la landing.
    window.location.hash = '/'
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-agri-borde bg-agri-blanco shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / nombre de la marca. */}
        <a
          href="#/"
          className="font-display text-xl font-bold text-agri-verde sm:text-2xl"
          onClick={() => setMenuAbierto(false)}
        >
          AgriMarket
        </a>

        {/* Opciones en escritorio. */}
        <div className="hidden items-center gap-4 md:flex">
          {usuario ? (
            <>
              {enlacesSesion.map((enlace) => (
                <a
                  key={enlace.href}
                  href={enlace.href}
                  className="text-sm font-medium text-agri-texto hover:text-agri-verde"
                >
                  {enlace.texto}
                </a>
              ))}
              <span className="text-sm text-agri-texto-suave">
                Hola, {usuario.nombre.split(' ')[0]}
              </span>
              <span className="rounded-full bg-agri-verde-tenue px-3 py-1 text-xs font-semibold text-agri-verde capitalize">
                {usuario.rol}
              </span>
              <button
                type="button"
                onClick={manejarCerrarSesion}
                className="rounded-lg border border-agri-rojo px-3 py-1.5 text-sm font-medium text-agri-rojo transition-colors hover:bg-agri-rojo hover:text-agri-blanco"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a
                href="#/login"
                className="rounded-lg border border-agri-verde px-4 py-1.5 text-sm font-semibold text-agri-verde transition-colors hover:bg-agri-verde-tenue"
              >
                Iniciar sesión
              </a>
              <a
                href="#/registro"
                className="rounded-lg bg-agri-verde px-4 py-1.5 text-sm font-semibold text-agri-blanco transition-colors hover:bg-agri-verde-claro"
              >
                Crear cuenta
              </a>
            </>
          )}
        </div>

        {/* Botón hamburguesa (solo celular). */}
        <button
          type="button"
          className="rounded-lg p-2 text-agri-texto hover:bg-agri-verde-tenue md:hidden"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú desplegable en celular. */}
      {menuAbierto && (
        <div className="border-t border-agri-borde bg-agri-blanco px-4 pt-2 pb-4 md:hidden">
          {usuario ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 py-1">
                <span className="text-sm text-agri-texto-suave">
                  Hola, {usuario.nombre.split(' ')[0]}
                </span>
                <span className="rounded-full bg-agri-verde-tenue px-3 py-1 text-xs font-semibold text-agri-verde capitalize">
                  {usuario.rol}
                </span>
              </div>
              {enlacesSesion.map((enlace) => (
                <a
                  key={enlace.href}
                  href={enlace.href}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-agri-texto hover:bg-agri-verde-tenue"
                  onClick={() => setMenuAbierto(false)}
                >
                  {enlace.texto}
                </a>
              ))}
              <button
                type="button"
                onClick={manejarCerrarSesion}
                className="mt-1 rounded-lg border border-agri-rojo px-3 py-2 text-sm font-medium text-agri-rojo"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <a
                href="#/login"
                className="rounded-lg border border-agri-verde px-4 py-2 text-center text-sm font-semibold text-agri-verde"
                onClick={() => setMenuAbierto(false)}
              >
                Iniciar sesión
              </a>
              <a
                href="#/registro"
                className="rounded-lg bg-agri-verde px-4 py-2 text-center text-sm font-semibold text-agri-blanco"
                onClick={() => setMenuAbierto(false)}
              >
                Crear cuenta
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

/**
 * Barra de navegación superior de AgriMarket.
 *
 * Barra fija en la parte superior, fondo blanco con borde inferior suave.
 * Muestra opciones según el estado de la sesión (usa el hook useAuth):
 * - Sin sesión: botones "Iniciar sesión" y "Registrarse".
 * - Con sesión: saludo con el nombre, insignia con el rol, enlaces según
 *   el rol (Catálogo + Mi panel / Mis solicitudes) y botón Cerrar sesión.
 *
 * Responsive: en celular las opciones se pliegan en un menú hamburguesa.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  /** Enlaces visibles solo con sesión, según el rol del usuario. */
  const enlacesSesion = usuario
    ? [
        { texto: 'Catálogo', ruta: '/catalogo' },
        usuario.rol === 'productor'
          ? { texto: 'Mi panel', ruta: '/panel' }
          : { texto: 'Mis solicitudes', ruta: '/mis-solicitudes' },
      ]
    : []

  const manejarCerrarSesion = () => {
    cerrarSesion()
    setMenuAbierto(false)
    // Al cerrar sesión se vuelve a la landing.
    navegar('/')
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-agri-borde bg-agri-blanco shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo: hoja verde + nombre de la marca. */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-agri-verde sm:text-2xl"
          onClick={() => setMenuAbierto(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-agri-verde">
            <svg
              className="h-5 w-5 text-agri-blanco"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
              />
            </svg>
          </span>
          AgriMarket
        </Link>

        {/* Opciones en escritorio. */}
        <div className="hidden items-center gap-4 md:flex">
          {usuario ? (
            <>
              {enlacesSesion.map((enlace) => (
                <Link
                  key={enlace.ruta}
                  to={enlace.ruta}
                  className="text-sm font-medium text-agri-texto hover:text-agri-verde"
                >
                  {enlace.texto}
                </Link>
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
              <Link
                to="/login"
                className="rounded-lg border border-agri-borde bg-agri-blanco px-4 py-1.5 text-sm font-semibold text-agri-texto transition-colors hover:bg-agri-verde-tenue"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="rounded-lg bg-agri-verde px-4 py-1.5 text-sm font-semibold text-agri-blanco transition-colors hover:bg-agri-verde-claro"
              >
                Registrarse
              </Link>
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
                <Link
                  key={enlace.ruta}
                  to={enlace.ruta}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-agri-texto hover:bg-agri-verde-tenue"
                  onClick={() => setMenuAbierto(false)}
                >
                  {enlace.texto}
                </Link>
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
              <Link
                to="/login"
                className="rounded-lg border border-agri-borde px-4 py-2 text-center text-sm font-semibold text-agri-texto"
                onClick={() => setMenuAbierto(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="rounded-lg bg-agri-verde px-4 py-2 text-center text-sm font-semibold text-agri-blanco"
                onClick={() => setMenuAbierto(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

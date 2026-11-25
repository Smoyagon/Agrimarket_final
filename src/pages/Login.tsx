/**
 * Página de inicio de sesión de AgriMarket (según prototipo de Figma).
 *
 * Tarjeta blanca centrada sobre fondo crema, con ícono de hoja, campos
 * con íconos, opción de mostrar/ocultar contraseña y enlace de
 * recuperación (próximamente). El error de credenciales se muestra en
 * un recuadro ámbar/rojo arriba del formulario.
 */

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Expresión regular sencilla para validar el formato del correo. */
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Ícono de hoja dentro de un cuadrado verde (marca AgriMarket). */
function LogoHoja() {
  return (
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-agri-verde">
      <svg
        className="h-7 w-7 text-agri-blanco"
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
  )
}

/** Ícono de correo. */
function IconoCorreo() {
  return (
    <svg
      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-agri-texto-suave"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
    </svg>
  )
}

/** Ícono de candado. */
function IconoCandado() {
  return (
    <svg
      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-agri-texto-suave"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

/** Ícono de ojo (mostrar contraseña). */
function IconoOjo() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

/** Ícono de ojo tachado (ocultar contraseña). */
function IconoOjoTachado() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l22 22" />
    </svg>
  )
}

export default function Login() {
  const { iniciarSesion } = useAuth()
  const navegar = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [error, setError] = useState('')
  const [avisoRecuperacion, setAvisoRecuperacion] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')

    // Validaciones de campos obligatorios.
    if (!correo.trim() || !contrasena) {
      setError('Por favor completa todos los campos')
      return
    }
    if (!CORREO_VALIDO.test(correo.trim())) {
      setError('Ingresa un correo válido')
      return
    }

    setEnviando(true)
    try {
      iniciarSesion(correo.trim(), contrasena)
      // Sesión iniciada: se redirige al catálogo.
      navegar('/catalogo')
    } catch (err) {
      // El servicio lanza errores con mensajes en español.
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-agri-crema px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-agri-borde bg-agri-blanco px-6 py-8 shadow-sm">
        <LogoHoja />
        <h1 className="mt-4 text-center font-display text-2xl font-bold text-agri-texto">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-center text-sm text-agri-texto-suave">
          Bienvenido de nuevo a AgriMarket
        </p>

        {/* Error de validación o credenciales, arriba del formulario. */}
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-agri-rojo bg-agri-ambar px-3 py-2 text-sm font-medium text-agri-rojo"
          >
            {error}
          </p>
        )}

        <form onSubmit={manejarEnvio} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="correo" className="text-sm font-medium text-agri-texto">
              Correo electrónico
            </label>
            <div className="relative">
              <IconoCorreo />
              <input
                id="correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-lg border border-agri-borde bg-agri-superficie py-2 pr-3 pl-9 text-agri-texto outline-none focus:border-agri-verde"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="contrasena" className="text-sm font-medium text-agri-texto">
                Contraseña
              </label>
              {/* Recuperación de contraseña: disponible próximamente. */}
              <button
                type="button"
                onClick={() => setAvisoRecuperacion((visible) => !visible)}
                className="text-xs font-medium text-agri-verde hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <IconoCandado />
              <input
                id="contrasena"
                type={verContrasena ? 'text' : 'password'}
                autoComplete="current-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-agri-borde bg-agri-superficie py-2 pr-10 pl-9 text-agri-texto outline-none focus:border-agri-verde"
              />
              <button
                type="button"
                onClick={() => setVerContrasena((visible) => !visible)}
                aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-agri-texto-suave hover:text-agri-verde"
              >
                {verContrasena ? <IconoOjoTachado /> : <IconoOjo />}
              </button>
            </div>
            {avisoRecuperacion && (
              <p className="rounded-lg bg-agri-verde-tenue px-3 py-2 text-xs text-agri-texto-suave">
                Función disponible próximamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 w-full rounded-lg bg-agri-verde px-4 py-2.5 font-semibold text-agri-blanco transition-colors hover:bg-agri-verde-claro disabled:opacity-60"
          >
            {enviando ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-agri-texto-suave">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-agri-verde hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}

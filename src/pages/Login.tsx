/**
 * Página de inicio de sesión de AgriMarket.
 *
 * Valida campos vacíos, muestra los errores del servicio de autenticación
 * (ej. "Correo o contraseña incorrectos") y redirige al catálogo al
 * iniciar sesión exitosamente.
 */

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

/** Expresión regular sencilla para validar el formato del correo. */
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { iniciarSesion } = useAuth()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
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
      window.location.hash = '/catalogo'
    } catch (err) {
      // El servicio lanza errores con mensajes en español.
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-agri-crema px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-agri-borde bg-agri-blanco p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold text-agri-texto sm:text-3xl">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-agri-texto-suave">
          Bienvenido de nuevo a AgriMarket
        </p>

        <form onSubmit={manejarEnvio} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="correo" className="text-sm font-medium text-agri-texto">
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tucorreo@ejemplo.co"
              className="rounded-lg border border-agri-borde bg-agri-superficie px-3 py-2 text-agri-texto outline-none focus:border-agri-verde"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="contrasena" className="text-sm font-medium text-agri-texto">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Tu contraseña"
              className="rounded-lg border border-agri-borde bg-agri-superficie px-3 py-2 text-agri-texto outline-none focus:border-agri-verde"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-agri-rojo bg-agri-ambar px-3 py-2 text-sm font-medium text-agri-rojo"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-lg bg-agri-verde px-4 py-2.5 font-semibold text-agri-blanco transition-colors hover:bg-agri-verde-claro disabled:opacity-60"
          >
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-agri-texto-suave">
          ¿No tienes cuenta?{' '}
          <a href="#/registro" className="font-semibold text-agri-verde hover:underline">
            Regístrate aquí
          </a>
        </p>

        {/* Nota de demostración con las cuentas de prueba. */}
        <div className="mt-6 rounded-lg bg-agri-verde-tenue px-3 py-2 text-xs text-agri-texto-suave">
          <p className="font-semibold text-agri-texto">Cuentas de demostración:</p>
          <p>Productor: jose@agrimarket.co · Consumidor: laura@correo.co</p>
          <p>Contraseña de ambas: 123456</p>
        </div>
      </div>
    </main>
  )
}

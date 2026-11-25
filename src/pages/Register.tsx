/**
 * Página de registro de AgriMarket (según prototipo de Figma).
 *
 * Tarjeta blanca centrada sobre fondo crema. El tipo de usuario se elige
 * con dos tarjetas grandes ("Soy agricultor" / "Soy consumidor"); los
 * campos tienen íconos y las contraseñas opción de mostrar/ocultar.
 * El prototipo no pide teléfono ni ubicación: el modelo User los mantiene,
 * pero aquí se guardan como cadena vacía.
 */

import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Rol } from '../types'
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

/** Ícono de persona (nombre completo). */
function IconoPersona() {
  return (
    <svg
      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-agri-texto-suave"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
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

/** Ícono de planta (rol agricultor). */
function IconoPlanta() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h10M12 20v-7" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 13c0-3.314 2.239-6 5-6 0 3.314-2.239 6-5 6zM12 13c0-3.314-2.239-6-5-6 0 3.314 2.239 6 5 6z"
      />
    </svg>
  )
}

/** Ícono de carrito (rol consumidor). */
function IconoCarrito() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
      />
    </svg>
  )
}

/** Check verde que marca la tarjeta de rol seleccionada. */
function IconoCheck() {
  return (
    <svg
      className="h-5 w-5 text-agri-verde"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" className="text-agri-verde" fill="currentColor" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Opciones de rol mostradas como tarjetas grandes. */
const OPCIONES_ROL: {
  valor: Rol
  titulo: string
  descripcion: string
  icono: ReactNode
}[] = [
  {
    valor: 'productor',
    titulo: 'Soy agricultor',
    descripcion: 'Quiero vender mis cosechas',
    icono: <IconoPlanta />,
  },
  {
    valor: 'consumidor',
    titulo: 'Soy consumidor',
    descripcion: 'Quiero comprar productos frescos',
    icono: <IconoCarrito />,
  },
]

export default function Register() {
  const { registrarse } = useAuth()
  const navegar = useNavigate()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [verConfirmacion, setVerConfirmacion] = useState(false)
  const [rol, setRol] = useState<Rol | ''>('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')

    // Validaciones en español.
    if (!rol) {
      setError('Elige si te registras como agricultor o consumidor')
      return
    }
    if (!nombre.trim() || !correo.trim() || !contrasena || !confirmarContrasena) {
      setError('Por favor completa todos los campos')
      return
    }
    if (!CORREO_VALIDO.test(correo.trim())) {
      setError('Ingresa un correo válido')
      return
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres')
      return
    }
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    setEnviando(true)
    try {
      registrarse({
        nombre: nombre.trim(),
        email: correo.trim(),
        password: contrasena,
        rol,
        // El prototipo no pide teléfono ni ubicación: se guardan vacíos.
        telefono: '',
        ubicacion: '',
      })
      // El registro inicia la sesión automáticamente: se redirige al catálogo.
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
      <div className="w-full max-w-md rounded-2xl border border-agri-borde bg-agri-blanco px-6 py-8 shadow-sm">
        <LogoHoja />
        <h1 className="mt-4 text-center font-display text-2xl font-bold text-agri-texto">
          Crear cuenta
        </h1>
        <p className="mt-1 text-center text-sm text-agri-texto-suave">
          Selecciona el tipo de usuario
        </p>

        {/* Error de validación o del servicio, arriba del formulario. */}
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-agri-rojo bg-agri-ambar px-3 py-2 text-sm font-medium text-agri-rojo"
          >
            {error}
          </p>
        )}

        <form onSubmit={manejarEnvio} className="mt-6 flex flex-col gap-4" noValidate>
          {/* Selección de rol: dos tarjetas grandes lado a lado. */}
          <div className="grid grid-cols-2 gap-3">
            {OPCIONES_ROL.map((opcion) => {
              const seleccionado = rol === opcion.valor
              return (
                <button
                  key={opcion.valor}
                  type="button"
                  onClick={() => setRol(opcion.valor)}
                  aria-pressed={seleccionado}
                  className={`relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 text-center transition-colors ${
                    seleccionado
                      ? 'border-agri-verde bg-agri-verde-tenue'
                      : 'border-agri-borde bg-agri-superficie hover:border-agri-verde-claro'
                  }`}
                >
                  {/* Marca de selección en la esquina superior derecha. */}
                  {seleccionado && (
                    <span className="absolute top-2 right-2">
                      <IconoCheck />
                    </span>
                  )}
                  <span className={seleccionado ? 'text-agri-verde' : 'text-agri-texto-suave'}>
                    {opcion.icono}
                  </span>
                  <span className="text-sm font-semibold text-agri-texto">
                    {opcion.titulo}
                  </span>
                  <span className="text-xs text-agri-texto-suave">
                    {opcion.descripcion}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="nombre" className="text-sm font-medium text-agri-texto">
              Nombre completo
            </label>
            <div className="relative">
              <IconoPersona />
              <input
                id="nombre"
                type="text"
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                className="w-full rounded-lg border border-agri-borde bg-agri-superficie py-2 pr-3 pl-9 text-agri-texto outline-none focus:border-agri-verde"
              />
            </div>
          </div>

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
            <label htmlFor="contrasena" className="text-sm font-medium text-agri-texto">
              Contraseña
            </label>
            <div className="relative">
              <IconoCandado />
              <input
                id="contrasena"
                type={verContrasena ? 'text' : 'password'}
                autoComplete="new-password"
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
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmar" className="text-sm font-medium text-agri-texto">
              Confirmar contraseña
            </label>
            <div className="relative">
              <IconoCandado />
              <input
                id="confirmar"
                type={verConfirmacion ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-agri-borde bg-agri-superficie py-2 pr-10 pl-9 text-agri-texto outline-none focus:border-agri-verde"
              />
              <button
                type="button"
                onClick={() => setVerConfirmacion((visible) => !visible)}
                aria-label={verConfirmacion ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-agri-texto-suave hover:text-agri-verde"
              >
                {verConfirmacion ? <IconoOjoTachado /> : <IconoOjo />}
              </button>
            </div>
          </div>

          {/* Aceptación de términos (obligatoria). */}
          <label className="flex items-center gap-2 text-sm text-agri-texto-suave">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="h-4 w-4 accent-agri-verde"
            />
            Acepto los términos y condiciones
          </label>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 w-full rounded-lg bg-agri-verde px-4 py-2.5 font-semibold text-agri-blanco transition-colors hover:bg-agri-verde-claro disabled:opacity-60"
          >
            {enviando ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-agri-texto-suave">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-agri-verde hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}

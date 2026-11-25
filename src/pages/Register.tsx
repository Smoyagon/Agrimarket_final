/**
 * Página de registro de AgriMarket.
 *
 * Permite crear una cuenta como productor o consumidor (el rol se elige
 * con tarjetas grandes y visibles). Valida los campos en español, muestra
 * los errores del servicio (ej. "Ya existe una cuenta con este correo")
 * y, al registrarse, la sesión inicia sola y se redirige al catálogo.
 */

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Rol } from '../types'
import { useAuth } from '../hooks/useAuth'

/** Expresión regular sencilla para validar el formato del correo. */
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Opciones de rol mostradas como tarjetas grandes. */
const OPCIONES_ROL: { valor: Rol; titulo: string; descripcion: string }[] = [
  {
    valor: 'productor',
    titulo: 'Soy productor',
    descripcion: 'Quiero publicar y vender mis productos agrícolas',
  },
  {
    valor: 'consumidor',
    titulo: 'Soy consumidor',
    descripcion: 'Quiero explorar el catálogo y comprar directo al campo',
  },
]

export default function Register() {
  const { registrarse } = useAuth()
  const navegar = useNavigate()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [rol, setRol] = useState<Rol | ''>('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')

    // Validaciones de campos obligatorios.
    if (!nombre.trim() || !correo.trim() || !contrasena || !telefono.trim() || !ubicacion.trim()) {
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
    if (!rol) {
      setError('Elige si te registras como productor o consumidor')
      return
    }

    setEnviando(true)
    try {
      registrarse({
        nombre: nombre.trim(),
        email: correo.trim(),
        password: contrasena,
        telefono: telefono.trim(),
        ubicacion: ubicacion.trim(),
        rol,
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
      <div className="w-full max-w-md rounded-2xl border border-agri-borde bg-agri-blanco p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold text-agri-texto sm:text-3xl">
          Crear cuenta
        </h1>
        <p className="mt-1 text-sm text-agri-texto-suave">
          Únete a AgriMarket y conecta con el campo colombiano
        </p>

        <form onSubmit={manejarEnvio} className="mt-6 flex flex-col gap-4" noValidate>
          {/* Selección de rol: tarjetas grandes y visibles. */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-agri-texto">
              ¿Cómo quieres usar AgriMarket?
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {OPCIONES_ROL.map((opcion) => {
                const seleccionado = rol === opcion.valor
                return (
                  <button
                    key={opcion.valor}
                    type="button"
                    onClick={() => setRol(opcion.valor)}
                    aria-pressed={seleccionado}
                    className={`rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      seleccionado
                        ? 'border-agri-verde bg-agri-verde-tenue'
                        : 'border-agri-borde bg-agri-superficie hover:border-agri-verde-claro'
                    }`}
                  >
                    <span className="block font-semibold text-agri-texto">
                      {opcion.titulo}
                    </span>
                    <span className="mt-0.5 block text-xs text-agri-texto-suave">
                      {opcion.descripcion}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1">
            <label htmlFor="nombre" className="text-sm font-medium text-agri-texto">
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. María Pérez"
              className="rounded-lg border border-agri-borde bg-agri-superficie px-3 py-2 text-agri-texto outline-none focus:border-agri-verde"
            />
          </div>

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
              autoComplete="new-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="rounded-lg border border-agri-borde bg-agri-superficie px-3 py-2 text-agri-texto outline-none focus:border-agri-verde"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="telefono" className="text-sm font-medium text-agri-texto">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="300 123 4567"
                className="rounded-lg border border-agri-borde bg-agri-superficie px-3 py-2 text-agri-texto outline-none focus:border-agri-verde"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="ubicacion" className="text-sm font-medium text-agri-texto">
                Ubicación
              </label>
              <input
                id="ubicacion"
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Municipio, Departamento"
                className="rounded-lg border border-agri-borde bg-agri-superficie px-3 py-2 text-agri-texto outline-none focus:border-agri-verde"
              />
            </div>
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
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
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

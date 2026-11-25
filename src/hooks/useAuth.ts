/**
 * Hook de autenticación de AgriMarket.
 *
 * Conecta la interfaz con auth.service.ts y mantiene la sesión
 * como estado global de la aplicación mediante Context.
 *
 * Uso:
 * 1. Envolver la app una sola vez con <AuthProvider> (en main.tsx).
 * 2. En cualquier componente: const { usuario, cargando, iniciarSesion,
 *    registrarse, cerrarSesion } = useAuth()
 *
 * Los errores del servicio (ej. "Correo o contraseña incorrectos") se
 * propagan tal cual para que las páginas los muestren en el formulario.
 *
 * Nota: el archivo es .ts (sin JSX), por eso el provider se crea
 * con createElement.
 */

import { createContext, createElement, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  DatosRegistro,
  UsuarioSesion,
} from '../services/auth.service'
import {
  getSesion,
  login,
  logout,
  register,
} from '../services/auth.service'

/** Valor que expone el contexto de autenticación. */
interface ContextoAuth {
  /** Usuario con sesión activa (sin password), o null si no hay sesión. */
  usuario: UsuarioSesion | null
  /** true mientras se restaura la sesión (reservado para una futura API asíncrona). */
  cargando: boolean
  /**
   * Inicia sesión y actualiza el estado.
   * Lanza Error con mensaje en español si las credenciales son inválidas.
   */
  iniciarSesion: (email: string, password: string) => UsuarioSesion
  /**
   * Registra un usuario nuevo, inicia su sesión y actualiza el estado.
   * Lanza Error con mensaje en español si el correo ya está registrado.
   */
  registrarse: (datos: DatosRegistro) => UsuarioSesion
  /** Cierra la sesión y limpia el estado. */
  cerrarSesion: () => void
}

const AuthContext = createContext<ContextoAuth | null>(null)

/**
 * Proveedor de autenticación. Debe envolver la aplicación una sola vez.
 * Restaura la sesión guardada (si existe) al inicializar el estado.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // La sesión guardada en localStorage se restaura al inicializar el estado
  // (lectura síncrona, no requiere efecto).
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(() => getSesion())
  const [cargando] = useState(false)

  const iniciarSesion = (email: string, password: string): UsuarioSesion => {
    // login() lanza Error si las credenciales son inválidas; se propaga.
    const sesion = login(email, password)
    setUsuario(sesion)
    return sesion
  }

  const registrarse = (datos: DatosRegistro): UsuarioSesion => {
    // register() lanza Error si el correo ya está registrado; se propaga.
    const sesion = register(datos)
    setUsuario(sesion)
    return sesion
  }

  const cerrarSesion = (): void => {
    logout()
    setUsuario(null)
  }

  const valor: ContextoAuth = {
    usuario,
    cargando,
    iniciarSesion,
    registrarse,
    cerrarSesion,
  }

  return createElement(AuthContext.Provider, { value: valor }, children)
}

/**
 * Hook para acceder a la autenticación desde cualquier componente.
 *
 * @throws Error si se usa fuera de un <AuthProvider>.
 */
export function useAuth(): ContextoAuth {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return contexto
}

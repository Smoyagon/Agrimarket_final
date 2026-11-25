/**
 * Servicio de autenticación de AgriMarket.
 *
 * Maneja el registro, el inicio y el cierre de sesión de los usuarios.
 * Usa storage.ts como única vía de acceso a los datos; nunca toca
 * localStorage directamente.
 *
 * Regla de seguridad: ninguna función de este módulo expone el password,
 * ni en lo que devuelve ni en la sesión guardada (la sesión solo
 * almacena el id del usuario).
 */

import type { Rol, User } from '../types'
import {
  buscarUsuarioPorEmail,
  cerrarSesion,
  crearUsuario,
  guardarSesion,
  obtenerSesion,
  obtenerUsuarioPorId,
} from './storage'

/** Usuario autenticado, sin el password. Es lo que se expone al resto de la app. */
export type UsuarioSesion = Omit<User, 'password'>

/** Datos necesarios para registrar un usuario nuevo. */
export interface DatosRegistro {
  nombre: string
  email: string
  password: string
  rol: Rol
  telefono: string
  ubicacion: string
}

/** Quita el password de un usuario antes de entregarlo a la aplicación. */
function sinPassword(usuario: User): UsuarioSesion {
  const { password: _password, ...resto } = usuario
  return resto
}

/**
 * Inicia sesión con email y contraseña.
 *
 * Valida las credenciales contra los usuarios almacenados; si son válidas,
 * guarda la sesión y devuelve el usuario (sin password).
 *
 * @throws Error("Correo o contraseña incorrectos") si las credenciales no son válidas.
 */
export function login(email: string, password: string): UsuarioSesion {
  const usuario = buscarUsuarioPorEmail(email)
  if (!usuario || usuario.password !== password) {
    throw new Error('Correo o contraseña incorrectos')
  }
  guardarSesion(usuario.id)
  return sinPassword(usuario)
}

/**
 * Registra un usuario nuevo con rol 'productor' o 'consumidor'
 * e inicia su sesión automáticamente.
 *
 * @throws Error("Ya existe una cuenta con este correo") si el email ya está registrado.
 */
export function register(datos: DatosRegistro): UsuarioSesion {
  const existente = buscarUsuarioPorEmail(datos.email)
  if (existente) {
    throw new Error('Ya existe una cuenta con este correo')
  }
  const usuario = crearUsuario({
    nombre: datos.nombre,
    email: datos.email,
    password: datos.password,
    rol: datos.rol,
    telefono: datos.telefono,
    ubicacion: datos.ubicacion,
  })
  guardarSesion(usuario.id)
  return sinPassword(usuario)
}

/** Cierra la sesión activa. */
export function logout(): void {
  cerrarSesion()
}

/**
 * Devuelve el usuario con sesión activa (sin password),
 * o null si no hay sesión o el usuario ya no existe.
 */
export function getSesion(): UsuarioSesion | null {
  const id = obtenerSesion()
  if (!id) return null
  const usuario = obtenerUsuarioPorId(id)
  if (!usuario) {
    // La sesión apunta a un usuario que ya no existe: se limpia.
    cerrarSesion()
    return null
  }
  return sinPassword(usuario)
}

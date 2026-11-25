/**
 * Modelos del dominio de AgriMarket.
 *
 * Este archivo es la base del proyecto: los demás módulos
 * (services, hooks, components y pages) importan estos tipos.
 * Los nombres de campos y tipos deben permanecer estables:
 * una vez publicados, no se renombran campos ni funciones.
 */

/** Rol que puede tener un usuario dentro de la plataforma. */
export type Rol = 'productor' | 'consumidor'

/** Estado de una solicitud de compra. */
export type EstadoSolicitud = 'pendiente' | 'aceptada' | 'rechazada'

/**
 * Usuario registrado en AgriMarket.
 * Puede actuar como productor o como consumidor.
 */
export interface User {
  /** Identificador único del usuario. */
  id: string
  /** Nombre completo del usuario. */
  nombre: string
  /** Correo electrónico (se usa para iniciar sesión). */
  email: string
  /** Contraseña de acceso. */
  password: string
  /** Rol del usuario en la plataforma. */
  rol: Rol
  /** Teléfono de contacto (visible solo con sesión iniciada). */
  telefono: string
  /** Ubicación del usuario (municipio, departamento). */
  ubicacion: string
  /** Fecha de registro en formato ISO (ej. "2024-11-24T15:00:00.000Z"). */
  fechaRegistro: string
}

/**
 * Producto agrícola publicado por un productor.
 * El precio está en pesos colombianos (COP) por unidad de venta.
 */
export interface Product {
  /** Identificador único del producto. */
  id: string
  /** Id del productor que publicó el producto (referencia a User.id). */
  productorId: string
  /** Nombre del producto (ej. "Aguacate Hass"). */
  nombre: string
  /** Descripción del producto. */
  descripcion: string
  /** Categoría del producto (ver CATEGORIAS). */
  categoria: Categoria
  /** Precio por unidad de venta, en COP. */
  precio: number
  /** Unidad de venta (ver UNIDADES, ej. "libra", "unidad"). */
  unidad: Unidad
  /** Cantidad disponible para la venta. */
  cantidad: number
  /** Imagen del producto (URL, opcional). */
  imagen?: string
  /** Si está disponible aparece en el catálogo y admite solicitudes. */
  disponible: boolean
  /** Fecha de publicación en formato ISO. */
  fechaPublicacion: string
}

/**
 * Solicitud de compra que un consumidor envía a un productor
 * (el MVP no maneja pagos en línea: la solicitud inicia la negociación).
 */
export interface Solicitud {
  /** Identificador único de la solicitud. */
  id: string
  /** Id del producto solicitado (referencia a Product.id). */
  productoId: string
  /** Id del productor dueño del producto (referencia a User.id). */
  productorId: string
  /** Id del consumidor que solicita (referencia a User.id). */
  consumidorId: string
  /** Cantidad solicitada (no puede superar la disponible). */
  cantidad: number
  /** Mensaje del consumidor para el productor. */
  mensaje: string
  /** Estado actual de la solicitud. */
  estado: EstadoSolicitud
  /** Fecha de creación en formato ISO. */
  fecha: string
}

/** Categorías disponibles para clasificar los productos. */
export const CATEGORIAS = [
  'Verduras',
  'Frutas',
  'Granos',
  'Lácteos',
  'Hierbas y aromáticas',
] as const

/** Unidades de venta disponibles para los productos. */
export const UNIDADES = [
  'kg',
  'g',
  'lb',
  'unidad',
  'docena',
  'atado',
  'litro',
  'canasta',
] as const

/** Categoría válida de producto (derivada de CATEGORIAS). */
export type Categoria = (typeof CATEGORIAS)[number]

/** Unidad de venta válida (derivada de UNIDADES). */
export type Unidad = (typeof UNIDADES)[number]

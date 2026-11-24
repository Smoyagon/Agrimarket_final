/**
 * Modelos del dominio de AgriMarket.
 *
 * Este archivo es la base del proyecto: los demás módulos
 * (services, hooks, components y pages) importan estos tipos.
 * Los nombres de campos y tipos deben permanecer estables.
 */

/** Rol que puede tener un usuario dentro de la plataforma. */
export type Rol = 'productor' | 'consumidor'

/** Estado de una solicitud de compra. */
export type EstadoSolicitud = 'pendiente' | 'aceptada' | 'rechazada'

/**
 * Usuario registrado en AgriMarket.
 * Puede actuar como productor o como consumidor
 * (el rol se puede cambiar sin cerrar sesión).
 */
export interface User {
  /** Identificador único del usuario. */
  id: string
  /** Nombre completo del usuario. */
  nombre: string
  /** Correo electrónico (se usa para iniciar sesión). */
  correo: string
  /** Contraseña de acceso. */
  password: string
  /** Rol activo del usuario. */
  rol: Rol
  /** Municipio donde se ubica el usuario. */
  municipio: string
  /** Teléfono de contacto (visible solo con sesión iniciada). */
  telefono: string
  /** Descripción breve del usuario o de su finca/negocio. */
  descripcion: string
}

/**
 * Producto agrícola publicado por un productor.
 * Los precios están en pesos colombianos (COP).
 */
export interface Product {
  /** Identificador único del producto. */
  id: string
  /** Id del productor que publicó el producto (referencia a User.id). */
  productorId: string
  /** Nombre del producto (ej. "Aguacate Hass"). */
  nombre: string
  /** Categoría del producto (ver CATEGORIAS). */
  categoria: Categoria
  /** Descripción del producto. */
  descripcion: string
  /** Precio por unidad, en COP. */
  precio: number
  /** Unidad de venta (ver UNIDADES, ej. "kg", "unidad"). */
  unidad: Unidad
  /** Cantidad disponible para la venta. */
  cantidad: number
  /** Imagen del producto (URL o cadena en base64). */
  imagen: string
  /** Si está activo aparece en el catálogo; si no, se oculta y no admite solicitudes. */
  activo: boolean
  /** Fecha de publicación en formato ISO (ej. "2024-11-24T15:00:00.000Z"). */
  fecha: string
}

/**
 * Solicitud de compra que un consumidor hace directamente
 * a un productor (el MVP no maneja pagos en línea).
 */
export interface Solicitud {
  /** Identificador único de la solicitud. */
  id: string
  /** Id del producto solicitado (referencia a Product.id). */
  productoId: string
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
  'Frutas',
  'Verduras',
  'Hortalizas',
  'Tubérculos',
  'Granos',
  'Lácteos',
  'Hierbas aromáticas',
  'Café y cacao',
  'Otros',
] as const

/** Unidades de venta disponibles para los productos. */
export const UNIDADES = [
  'kg',
  'g',
  'lb',
  'unidad',
  'docena',
  'litro',
  'atado',
  'canasta',
] as const

/** Categoría válida de producto (derivada de CATEGORIAS). */
export type Categoria = (typeof CATEGORIAS)[number]

/** Unidad de venta válida (derivada de UNIDADES). */
export type Unidad = (typeof UNIDADES)[number]

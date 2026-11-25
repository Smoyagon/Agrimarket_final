/**
 * Capa de persistencia de AgriMarket (localStorage).
 *
 * Esta es la ÚNICA capa de la aplicación que habla con localStorage.
 * Los componentes y páginas nunca acceden a localStorage directamente;
 * siempre pasan por este módulo (directamente o a través de un service/hook).
 *
 * Diseñado para migrarse luego a una API REST + PostgreSQL sin cambiar
 * la interfaz de las funciones exportadas.
 *
 * Claves de almacenamiento:
 * - agrimarket_db_v3: base de datos (usuarios, productos, solicitudes)
 * - agrimarket_session_v1: sesión del usuario autenticado
 */

import type {
  EstadoSolicitud,
  Product,
  Solicitud,
  User,
} from '../types'

/** Clave de la base de datos en localStorage (v3: nombres de productos actualizados). */
const CLAVE_DB = 'agrimarket_db_v3'

/** Clave de la sesión en localStorage. */
const CLAVE_SESION = 'agrimarket_session_v1'

/** Estructura completa de la base de datos local. */
interface BaseDatos {
  usuarios: User[]
  productos: Product[]
  solicitudes: Solicitud[]
}

/** Genera un identificador único para nuevos registros. */
function generarId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Devuelve la fecha ISO de hace `dias` días.
 * Se usa para que los datos semilla tengan fechas realistas
 * sin quedar quemadas en el pasado lejano.
 */
function fechaHaceDias(dias: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  return fecha.toISOString()
}

/**
 * Construye los datos semilla obligatorios:
 * los usuarios José (productor) y Laura (consumidor),
 * los 6 productos de José y las 2 solicitudes de Laura.
 */
function construirDatosSemilla(): BaseDatos {
  const idJose = 'usuario-jose'
  const idLaura = 'usuario-laura'

  const usuarios: User[] = [
    {
      id: idJose,
      nombre: 'José Rodríguez',
      email: 'jose@agrimarket.co',
      password: '123456',
      rol: 'productor',
      telefono: '310 456 7890',
      ubicacion: 'La Unión, Valle del Cauca',
      fechaRegistro: fechaHaceDias(28),
    },
    {
      id: idLaura,
      nombre: 'Laura Gómez',
      email: 'laura@correo.co',
      password: '123456',
      rol: 'consumidor',
      telefono: '301 234 5678',
      ubicacion: 'Cali, Valle del Cauca',
      fechaRegistro: fechaHaceDias(21),
    },
  ]

  const productos: Product[] = [
    {
      id: 'producto-1',
      productorId: idJose,
      nombre: 'Tomate chonto',
      descripcion:
        'Tomate chonto fresco, cultivado sin químicos en finca familiar. Ideal para ensaladas y guisos.',
      categoria: 'Verduras',
      precio: 3500,
      unidad: 'kg',
      cantidad: 100,
      imagen:
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      disponible: true,
      fechaPublicacion: fechaHaceDias(4),
    },
    {
      id: 'producto-2',
      productorId: idJose,
      nombre: 'Zanahoria fresca',
      descripcion: 'Zanahoria dulce y crocante, cosechada esta semana.',
      categoria: 'Verduras',
      precio: 2800,
      unidad: 'kg',
      cantidad: 80,
      imagen:
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
      disponible: true,
      fechaPublicacion: fechaHaceDias(3),
    },
    {
      id: 'producto-3',
      productorId: idJose,
      nombre: 'Lechuga fresca',
      descripcion:
        'Lechuga fresca de hoja verde, cortada el mismo día del despacho.',
      categoria: 'Verduras',
      precio: 2000,
      unidad: 'unidad',
      cantidad: 60,
      imagen:
        'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80',
      disponible: true,
      fechaPublicacion: fechaHaceDias(2),
    },
    {
      id: 'producto-4',
      productorId: idJose,
      nombre: 'Papa',
      descripcion:
        'Papa criolla y pastusa, perfecta para cocinar, freír o hacer puré.',
      categoria: 'Verduras',
      precio: 2500,
      unidad: 'kg',
      cantidad: 150,
      imagen:
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      disponible: true,
      fechaPublicacion: fechaHaceDias(1),
    },
  ]

  const solicitudes: Solicitud[] = [
    {
      id: 'solicitud-1',
      productoId: 'producto-1',
      productorId: idJose,
      consumidorId: idLaura,
      cantidad: 3,
      mensaje:
        'Hola José, me interesa el tomate para mi restaurante. ¿Manejas precio por volumen si pido 3 kg a la semana?',
      estado: 'pendiente',
      fecha: fechaHaceDias(2),
    },
    {
      id: 'solicitud-2',
      productoId: 'producto-4',
      productorId: idJose,
      consumidorId: idLaura,
      cantidad: 5,
      mensaje:
        'Buenas tardes, quiero 5 kg de papa. ¿Cuándo podrías hacer la entrega?',
      estado: 'aceptada',
      fecha: fechaHaceDias(1),
    },
  ]

  return { usuarios, productos, solicitudes }
}

/**
 * Lee la base de datos desde localStorage.
 * Si no existe o está corrupta, la inicializa con los datos semilla.
 */
function leerDB(): BaseDatos {
  const crudo = localStorage.getItem(CLAVE_DB)
  if (!crudo) {
    return inicializarDatos()
  }
  try {
    return JSON.parse(crudo) as BaseDatos
  } catch {
    // Datos corruptos: se reinicia la base con los datos semilla.
    return inicializarDatos()
  }
}

/** Escribe la base de datos completa en localStorage. */
function guardarDB(db: BaseDatos): void {
  localStorage.setItem(CLAVE_DB, JSON.stringify(db))
}

/**
 * Inicializa la base de datos con los datos semilla si está vacía
 * y la devuelve. Es seguro llamarla varias veces: si ya hay datos,
 * no hace nada.
 */
export function inicializarDatos(): BaseDatos {
  const crudo = localStorage.getItem(CLAVE_DB)
  if (crudo) {
    try {
      return JSON.parse(crudo) as BaseDatos
    } catch {
      // Si está corrupta, se regenera abajo.
    }
  }
  const semilla = construirDatosSemilla()
  guardarDB(semilla)
  return semilla
}

// ---------------------------------------------------------------------------
// Usuarios
// ---------------------------------------------------------------------------

/** Devuelve todos los usuarios registrados. */
export function obtenerUsuarios(): User[] {
  return leerDB().usuarios
}

/** Busca un usuario por su id. Devuelve undefined si no existe. */
export function obtenerUsuarioPorId(id: string): User | undefined {
  return leerDB().usuarios.find((usuario) => usuario.id === id)
}

/** Busca un usuario por su email. Devuelve undefined si no existe. */
export function buscarUsuarioPorEmail(email: string): User | undefined {
  const normalizado = email.trim().toLowerCase()
  return leerDB().usuarios.find(
    (usuario) => usuario.email.toLowerCase() === normalizado,
  )
}

/**
 * Crea un usuario nuevo. El id y la fecha de registro se generan aquí.
 * Devuelve el usuario creado.
 */
export function crearUsuario(
  datos: Omit<User, 'id' | 'fechaRegistro'>,
): User {
  const db = leerDB()
  const usuario: User = {
    ...datos,
    id: generarId(),
    fechaRegistro: new Date().toISOString(),
  }
  db.usuarios.push(usuario)
  guardarDB(db)
  return usuario
}

/**
 * Actualiza los campos indicados de un usuario.
 * Devuelve el usuario actualizado, o undefined si no existe.
 */
export function actualizarUsuario(
  id: string,
  cambios: Partial<Omit<User, 'id'>>,
): User | undefined {
  const db = leerDB()
  const indice = db.usuarios.findIndex((usuario) => usuario.id === id)
  if (indice === -1) return undefined
  db.usuarios[indice] = { ...db.usuarios[indice], ...cambios, id }
  guardarDB(db)
  return db.usuarios[indice]
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

/** Devuelve todos los productos (disponibles y no disponibles). */
export function obtenerProductos(): Product[] {
  return leerDB().productos
}

/** Busca un producto por su id. Devuelve undefined si no existe. */
export function obtenerProductoPorId(id: string): Product | undefined {
  return leerDB().productos.find((producto) => producto.id === id)
}

/** Devuelve todos los productos publicados por un productor. */
export function obtenerProductosPorProductor(productorId: string): Product[] {
  return leerDB().productos.filter(
    (producto) => producto.productorId === productorId,
  )
}

/**
 * Crea un producto nuevo. El id y la fecha de publicación se generan aquí.
 * Devuelve el producto creado.
 */
export function crearProducto(
  datos: Omit<Product, 'id' | 'fechaPublicacion'>,
): Product {
  const db = leerDB()
  const producto: Product = {
    ...datos,
    id: generarId(),
    fechaPublicacion: new Date().toISOString(),
  }
  db.productos.push(producto)
  guardarDB(db)
  return producto
}

/**
 * Actualiza los campos indicados de un producto.
 * Devuelve el producto actualizado, o undefined si no existe.
 */
export function actualizarProducto(
  id: string,
  cambios: Partial<Omit<Product, 'id'>>,
): Product | undefined {
  const db = leerDB()
  const indice = db.productos.findIndex((producto) => producto.id === id)
  if (indice === -1) return undefined
  db.productos[indice] = { ...db.productos[indice], ...cambios, id }
  guardarDB(db)
  return db.productos[indice]
}

/**
 * Elimina un producto por su id.
 * Devuelve true si se eliminó, false si no existía.
 */
export function eliminarProducto(id: string): boolean {
  const db = leerDB()
  const totalAntes = db.productos.length
  db.productos = db.productos.filter((producto) => producto.id !== id)
  if (db.productos.length === totalAntes) return false
  guardarDB(db)
  return true
}

// ---------------------------------------------------------------------------
// Solicitudes
// ---------------------------------------------------------------------------

/** Devuelve todas las solicitudes. */
export function obtenerSolicitudes(): Solicitud[] {
  return leerDB().solicitudes
}

/** Busca una solicitud por su id. Devuelve undefined si no existe. */
export function obtenerSolicitudPorId(id: string): Solicitud | undefined {
  return leerDB().solicitudes.find((solicitud) => solicitud.id === id)
}

/** Devuelve las solicitudes hechas por un consumidor. */
export function obtenerSolicitudesPorConsumidor(
  consumidorId: string,
): Solicitud[] {
  return leerDB().solicitudes.filter(
    (solicitud) => solicitud.consumidorId === consumidorId,
  )
}

/** Devuelve las solicitudes recibidas por un productor. */
export function obtenerSolicitudesPorProductor(
  productorId: string,
): Solicitud[] {
  return leerDB().solicitudes.filter(
    (solicitud) => solicitud.productorId === productorId,
  )
}

/**
 * Crea una solicitud nueva en estado 'pendiente'.
 * El id, el estado inicial y la fecha se generan aquí.
 * Devuelve la solicitud creada.
 */
export function crearSolicitud(
  datos: Omit<Solicitud, 'id' | 'estado' | 'fecha'>,
): Solicitud {
  const db = leerDB()
  const solicitud: Solicitud = {
    ...datos,
    id: generarId(),
    estado: 'pendiente',
    fecha: new Date().toISOString(),
  }
  db.solicitudes.push(solicitud)
  guardarDB(db)
  return solicitud
}

/**
 * Actualiza los campos indicados de una solicitud
 * (uso típico: cambiar el estado a 'aceptada' o 'rechazada').
 * Devuelve la solicitud actualizada, o undefined si no existe.
 */
export function actualizarSolicitud(
  id: string,
  cambios: Partial<Omit<Solicitud, 'id'>>,
): Solicitud | undefined {
  const db = leerDB()
  const indice = db.solicitudes.findIndex((solicitud) => solicitud.id === id)
  if (indice === -1) return undefined
  db.solicitudes[indice] = { ...db.solicitudes[indice], ...cambios, id }
  guardarDB(db)
  return db.solicitudes[indice]
}

/** Cambia el estado de una solicitud. Atajo de actualizarSolicitud. */
export function cambiarEstadoSolicitud(
  id: string,
  estado: EstadoSolicitud,
): Solicitud | undefined {
  return actualizarSolicitud(id, { estado })
}

// ---------------------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------------------

/** Guarda la sesión del usuario autenticado (se almacena su id). */
export function guardarSesion(usuarioId: string): void {
  localStorage.setItem(CLAVE_SESION, usuarioId)
}

/**
 * Devuelve el id del usuario con sesión iniciada,
 * o null si no hay sesión activa.
 */
export function obtenerSesion(): string | null {
  return localStorage.getItem(CLAVE_SESION)
}

/** Cierra la sesión activa. */
export function cerrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION)
}

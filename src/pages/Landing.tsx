/**
 * Landing page de AgriMarket (según prototipo de Figma).
 *
 * Página de entrada pública:
 * - Hero con foto de fondo, propuesta de valor y botones de acción
 *   ("Quiero comprar" / "Quiero vender"; con sesión activa llevan al catálogo).
 * - Productos destacados: los primeros productos disponibles del catálogo.
 */

import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { obtenerProductos } from '../services/storage'

/** Foto del hero (paisaje agrícola). */
const FOTO_HERO =
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80'

/** Foto usada cuando un producto no tiene imagen propia. */
const FOTO_POR_DEFECTO =
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'

/** Formatea un precio en pesos colombianos: 12500 → "$ 12.500". */
function formatearPrecio(precio: number): string {
  return `$ ${precio.toLocaleString('es-CO')}`
}

export default function Landing() {
  const { usuario } = useAuth()

  // Productos destacados: los primeros disponibles del catálogo.
  const destacados = obtenerProductos()
    .filter((producto) => producto.disponible)
    .slice(0, 3)

  // Con sesión activa, los botones del hero llevan al catálogo.
  const destinoComprar = usuario ? '/catalogo' : '/registro'
  const destinoVender = usuario ? '/catalogo' : '/registro'

  return (
    <div className="min-h-screen bg-agri-crema text-agri-texto">
      {/* Hero con foto de fondo */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-20">
        <img
          src={FOTO_HERO}
          alt="Cultivos en el campo colombiano"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Velo oscuro para que el texto sea legible sobre la foto. */}
        <div className="absolute inset-0 bg-agri-texto/60" aria-hidden="true" />
        <div className="relative max-w-3xl text-center">
          <h1 className="font-display text-4xl font-black leading-tight text-agri-blanco sm:text-5xl">
            Del campo, con nombre de agricultor
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-agri-crema sm:text-lg">
            Conectamos pequeños productores con consumidores locales
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={destinoComprar}
              className="w-full rounded-lg bg-agri-verde px-8 py-3 text-center font-semibold text-agri-blanco shadow transition-colors hover:bg-agri-verde-claro sm:w-auto"
            >
              {usuario ? 'Ir al catálogo' : 'Quiero comprar'}
            </Link>
            <Link
              to={destinoVender}
              className="w-full rounded-lg bg-agri-verde-claro px-8 py-3 text-center font-semibold text-agri-blanco shadow transition-colors hover:bg-agri-verde sm:w-auto"
            >
              {usuario ? 'Ver productos' : 'Quiero vender'}
            </Link>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <p className="py-4 text-center text-xs text-agri-texto-suave">© AgriMarket 2026</p>

      {/* Productos destacados */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold text-agri-texto sm:text-3xl">
            Productos destacados del momento
          </h2>
          <p className="mt-2 text-sm text-agri-texto-suave sm:text-base">
            Descubre productos frescos ofrecidos directamente por productores locales
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((producto) => (
              <article
                key={producto.id}
                className="overflow-hidden rounded-2xl border border-agri-borde bg-agri-blanco shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Foto con esquinas superiores redondeadas. */}
                <img
                  src={producto.imagen || FOTO_POR_DEFECTO}
                  alt={producto.nombre}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-agri-texto">{producto.nombre}</h3>
                  <p className="mt-1 text-sm">
                    <span className="font-bold text-agri-texto">
                      {formatearPrecio(producto.precio)}
                    </span>
                    <span className="text-agri-texto-suave"> / {producto.unidad}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

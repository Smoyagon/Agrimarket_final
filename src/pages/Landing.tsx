/**
 * Landing page de AgriMarket.
 *
 * Página de entrada pública: hero con la propuesta de valor, sección
 * "¿Cómo funciona?", beneficios, llamado a la acción final y footer.
 * Si hay sesión activa, los botones del hero llevan al catálogo.
 */

import { useAuth } from '../hooks/useAuth'

/** Pasos de la sección "¿Cómo funciona?". */
const PASOS = [
  {
    numero: 1,
    titulo: 'El productor publica su cosecha',
    descripcion:
      'Los agricultores suben sus productos con fotos, precios y cantidades disponibles.',
  },
  {
    numero: 2,
    titulo: 'El consumidor explora y envía una solicitud',
    descripcion:
      'Navegas el catálogo, eliges lo que necesitas y envías una solicitud de compra directa.',
  },
  {
    numero: 3,
    titulo: 'El productor acepta y coordinan la entrega',
    descripcion:
      'El productor revisa tu solicitud, la acepta y se ponen de acuerdo para la entrega.',
  },
]

/** Tarjetas de la sección de beneficios. */
const BENEFICIOS = [
  {
    titulo: 'Sin intermediarios',
    descripcion:
      'El precio que paga el consumidor llega completo al productor, sin terceros de por medio.',
    icono: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    ),
  },
  {
    titulo: 'Productos frescos y locales',
    descripcion:
      'Compra cosechas recientes de agricultores de tu región, con la calidad del campo colombiano.',
    icono: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    ),
  },
  {
    titulo: 'Trato directo con el productor',
    descripcion:
      'Habla directamente con quien cultiva tus alimentos y negocia sin intermediarios.',
    icono: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    ),
  },
]

export default function Landing() {
  const { usuario } = useAuth()

  // Con sesión activa, el hero lleva al catálogo en vez del registro/login.
  const destinoPrincipal = usuario ? '#/catalogo' : '#/registro'
  const destinoSecundario = usuario ? '#/catalogo' : '#/login'
  const textoPrincipal = usuario ? 'Ir al catálogo' : 'Crear cuenta'
  const textoSecundario = usuario ? 'Ver productos' : 'Iniciar sesión'

  return (
    <div className="min-h-screen bg-agri-crema text-agri-texto">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-28">
        {/* Acento decorativo verde tenue. */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-agri-verde-tenue sm:h-96 sm:w-96"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-agri-verde-tenue sm:h-96 sm:w-96"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-black leading-tight text-agri-verde sm:text-5xl">
            Del campo colombiano a tu mesa
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-agri-texto-suave sm:text-lg">
            Conectamos productores agrícolas con consumidores de la región,
            sin intermediarios: compras fresco, local y directo.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={destinoPrincipal}
              className="w-full rounded-lg bg-agri-verde px-6 py-3 text-center font-semibold text-agri-blanco transition-colors hover:bg-agri-verde-claro sm:w-auto"
            >
              {textoPrincipal}
            </a>
            <a
              href={destinoSecundario}
              className="w-full rounded-lg border border-agri-verde px-6 py-3 text-center font-semibold text-agri-verde transition-colors hover:bg-agri-verde-tenue sm:w-auto"
            >
              {textoSecundario}
            </a>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-2xl font-bold text-agri-texto sm:text-3xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-agri-texto-suave sm:text-base">
            Tres pasos sencillos para conectar el campo con tu casa.
          </p>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PASOS.map((paso) => (
              <li
                key={paso.numero}
                className="rounded-2xl border border-agri-borde bg-agri-blanco p-6 text-center shadow-sm"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-agri-verde-tenue font-display text-xl font-bold text-agri-verde">
                  {paso.numero}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-agri-texto">
                  {paso.titulo}
                </h3>
                <p className="mt-2 text-sm text-agri-texto-suave">{paso.descripcion}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-agri-verde-tenue px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-2xl font-bold text-agri-texto sm:text-3xl">
            ¿Por qué AgriMarket?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BENEFICIOS.map((beneficio) => (
              <article
                key={beneficio.titulo}
                className="rounded-2xl border border-agri-borde bg-agri-blanco p-6 shadow-sm"
              >
                <svg
                  className="h-8 w-8 text-agri-verde"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {beneficio.icono}
                </svg>
                <h3 className="mt-4 font-display text-lg font-bold text-agri-texto">
                  {beneficio.titulo}
                </h3>
                <p className="mt-2 text-sm text-agri-texto-suave">{beneficio.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado a la acción final */}
      <section className="bg-agri-verde px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold text-agri-blanco sm:text-3xl">
            Únete a AgriMarket hoy
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-agri-verde-tenue sm:text-base">
            Regístrate como <strong>productor</strong> para vender tu cosecha,
            o como <strong>consumidor</strong> para comprar directo al campo.
          </p>
          {!usuario && (
            <a
              href="#/registro"
              className="mt-8 inline-block rounded-lg bg-agri-blanco px-8 py-3 font-semibold text-agri-verde transition-colors hover:bg-agri-crema"
            >
              Crear mi cuenta gratis
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-agri-borde bg-agri-blanco px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-display font-bold text-agri-verde">AgriMarket</p>
          <p className="text-xs text-agri-texto-suave">
            Proyecto académico · Universidad IBERO · Análisis y Diseño de Sistemas
          </p>
        </div>
      </footer>
    </div>
  )
}

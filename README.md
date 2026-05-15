# LUMEN

LUMEN es un storefront con panel administrativo hecho con **Next.js 16**, **React 19**, **TypeScript** y **Tailwind CSS**. La aplicación funciona como demo local de e-commerce en español, con catálogo, carrito, checkout, ofertas y administración persistida en el navegador.

## Características

- Storefront público con rutas en español.
- Página de categorías con filas horizontales por tipo de prenda.
- Página de novedades y página real de ofertas.
- Detalle de producto con variantes por color y talla.
- Carrito, checkout y confirmación de compra.
- Panel administrativo para productos, descuentos, ventas y configuración.
- Persistencia local con **IndexedDB** para catálogo, carrito, pedidos, descuentos y ajustes.
- Animaciones con **Motion** en flujos públicos y administrativos.
- Toasts y feedback visual en flujos visibles para el usuario.

## Rutas principales

### Storefront

- `/` Inicio
- `/categorias` Categorías con preview por tipo de producto
- `/categorias/[slug]` Listado por categoría
- `/novedades` Productos destacados
- `/ofertas` Productos con precio rebajado visible
- `/productos/[slug]` Detalle de producto
- `/carrito` Carrito
- `/pago` Checkout
- `/pago/exito` Confirmación del pedido

### Administración

- `/admin/login` Acceso administrativo local
- `/admin` Dashboard
- `/admin/productos` Gestión de productos y descuentos
- `/admin/sales` Gestión de ventas y detalle de pedidos
- `/admin/config` Configuración de tienda y credenciales locales

## Credenciales demo

El acceso administrativo es local y está pensado para demostración en el navegador actual.

- Correo: `admin@lumen.local`
- Contraseña: `lumen-demo`

Estas credenciales pueden cambiarse desde `/admin/config` y se guardan localmente.

## Cómo clonar el proyecto

```bash
git clone git@github.com:keevh/lumen.git
cd lumen
```

Si prefieres HTTPS:

```bash
git clone https://github.com/keevh/lumen.git
cd lumen
```

## Cómo ejecutarlo

Instala dependencias con `pnpm`:

```bash
pnpm install
```

Inicia el entorno de desarrollo:

```bash
pnpm dev
```

Luego abre:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
pnpm build
pnpm dev
pnpm lint
pnpm start
pnpm typecheck
```

## Despliegue

La opción recomendada para este proyecto es **Vercel**.

### Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Entra a [Vercel](https://vercel.com/).
3. Importa el repositorio `keevh/lumen`.
4. Deja que Vercel detecte **Next.js** automáticamente.
5. Usa `pnpm` como package manager.
6. Publica el proyecto.

Configuración esperada:

- Framework: `Next.js`
- Install command: `pnpm install`
- Build command: `pnpm build`
- Output: automático de Next.js

### Importante antes de publicar

Este proyecto funciona hoy como **demo local desplegable**, no como e-commerce multiusuario real.

- Productos, carrito, pedidos, descuentos y configuración se guardan en **IndexedDB**.
- La información vive en el navegador de cada usuario.
- Los cambios hechos en `/admin` no se comparten entre navegadores ni dispositivos.

Eso significa que el deploy es ideal para:

- portafolio
- demo funcional
- presentación del proyecto

Y no es la arquitectura final para:

- tienda real
- panel administrativo compartido
- persistencia global entre usuarios

Si más adelante quieres llevarlo a producción real, el siguiente paso es mover la persistencia a una base remota como Postgres, Supabase o PostgREST.

## Persistencia y datos

La aplicación guarda información en el navegador para simular un flujo completo sin backend real.

- **IndexedDB**:
  - productos
  - carrito
  - pedidos
  - descuentos
  - configuración de tienda
- **sessionStorage**:
  - sesión administrativa local
  - borradores temporales del checkout
- **localStorage**:
  - correo y contraseña administrativa configurados localmente

La arquitectura de repositorios está preparada para reemplazar la persistencia local por una base remota más adelante.

## Estructura del proyecto

```text
lumens/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── carrito/
│   │   ├── categorias/
│   │   ├── novedades/
│   │   ├── ofertas/
│   │   ├── pago/
│   │   └── productos/
│   ├── components/
│   │   ├── admin/
│   │   ├── commerce/
│   │   ├── layout/
│   │   ├── motion/
│   │   └── ui/
│   ├── data/
│   ├── features/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── catalog/
│   │   ├── discounts/
│   │   ├── orders/
│   │   └── settings/
│   ├── lib/
│   └── shared/
│       └── storage/
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Qué hace cada parte

- `src/app/`: rutas y páginas de Next.js.
- `src/components/commerce/`: UI del storefront, cards, galerías, detalle de producto y rails.
- `src/components/admin/`: layout, modales y primitives del panel administrativo.
- `src/components/motion/`: capa compartida de animaciones con Motion.
- `src/components/ui/`: toasts, íconos y wrappers visuales reutilizables.
- `src/features/catalog/`: tipos, pricing, categorías y lógica de consulta del catálogo.
- `src/features/cart/`: flujo del carrito.
- `src/features/orders/`: checkout, pedidos y confirmación.
- `src/features/admin/`: productos, ventas, login y configuración del panel.
- `src/shared/storage/`: puertos, repositorios y acceso a IndexedDB.
- `src/data/catalog.ts`: seed inicial del catálogo.

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Motion
- IndexedDB

## Notas de funcionamiento

- Las ofertas visibles se determinan por producto usando **precio actual** y **precio anterior**.
- Los descuentos por código siguen existiendo, pero son distintos de una prenda en oferta.
- La app está pensada como demo local, no como autenticación o checkout de producción.

## Contribuir

Si quieres proponer mejoras o corregir algo:

1. Abre un issue con el problema o idea.
2. Crea un pull request con el cambio.

Antes de enviar cambios, valida al menos:

- `pnpm lint`
- `pnpm typecheck`

## Autor

Kevin Gallardo - [GitHub](https://github.com/keevh)

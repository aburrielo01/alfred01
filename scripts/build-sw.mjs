import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = 'dist'

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const files = walk(DIST)
  .filter((f) => !f.endsWith('sw.js'))
  .map((f) => './' + relative(DIST, f).split('\\').join('/'))
  .sort()

// La versión de la caché cambia sólo cuando cambia el contenido: así una
// visita repetida no vuelve a descargar nada, y un despliegue nuevo sí.
const hash = createHash('sha256')
for (const f of files) hash.update(readFileSync(join(DIST, f.slice(2))))
const version = hash.digest('hex').slice(0, 10)

const sw = `// Generado por scripts/build-sw.mjs — no editar a mano.
const CACHE = 'alfred-${version}'
const ASSETS = ${JSON.stringify(files, null, 2)}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  // ignoreVary es imprescindible: los servidores suelen responder
  // \`Vary: Origin\`, y sin él una petición con cabecera Origin (todo lo que
  // el navegador pide con crossorigin) nunca encuentra lo ya guardado.
  const BUSQUEDA = { ignoreVary: true, ignoreSearch: true }

  // Toda navegación devuelve la misma app: abrir sin cobertura funciona igual.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html', BUSQUEDA).then((cached) => cached || fetch(request)),
    )
    return
  }

  event.respondWith(
    caches.match(request, BUSQUEDA).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && new URL(request.url).origin === self.location.origin) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        }),
    ),
  )
})
`

writeFileSync(join(DIST, 'sw.js'), sw)
console.log(`sw.js generado · ${files.length} archivos · caché alfred-${version}`)

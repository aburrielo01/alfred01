/**
 * Registra el service worker que deja usar Alfred sin conexión.
 * Sólo tiene sentido servida por http(s): abierta como archivo suelto o
 * dentro de una página incrustada, la app funciona igual sin él.
 */
export function enableOffline(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  if (!/^https?:$/.test(location.protocol)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* sin conexión, sin permisos o servido desde otro origen: seguimos igual */
    })
  })
}

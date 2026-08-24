interface DownloadsNamespace {
  save: (request: { filename: string; data: string }) => Promise<{ status: 'saved' }>
}

interface Host {
  use?: (name: string) => Promise<unknown>
}

export type SaveOutcome = 'guardado' | 'cancelado'

/**
 * Guardar un archivo. Dentro de una página publicada el guardado lo media el
 * anfitrión —el visitante confirma— y fuera de ella basta un enlace.
 */
export async function saveFile(filename: string, contents: string): Promise<SaveOutcome> {
  const host = (globalThis as { claude?: Host }).claude

  if (typeof host?.use === 'function') {
    const downloads = (await host.use('downloads')) as DownloadsNamespace | null
    if (downloads) {
      try {
        await downloads.save({ filename, data: contents })
        return 'guardado'
      } catch {
        return 'cancelado'
      }
    }
  }

  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
  return 'guardado'
}

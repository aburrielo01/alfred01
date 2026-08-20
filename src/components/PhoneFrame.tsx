import { useEffect, useState, type ReactNode } from 'react'

function clock(): string {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Marco de dispositivo. Solo aparece en pantallas anchas: en el móvil la app
 * ocupa la pantalla entera, que es donde está pensada para vivir.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const [time, setTime] = useState(clock)

  useEffect(() => {
    const id = setInterval(() => setTime(clock()), 20000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="stage">
      <div className="device">
        <div className="device__screen">
          <div className="device__status num" aria-hidden>
            {time}
          </div>
          {children}
          <div className="device__indicator" aria-hidden />
        </div>
      </div>
      <p className="stage__note">
        Alfred está pensado para el móvil. Esto es la misma app, en un marco.
      </p>
    </div>
  )
}

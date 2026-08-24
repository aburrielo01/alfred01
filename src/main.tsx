import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { enableOffline } from './app/offline'
import './styles/base.css'
import './styles/app.css'

const container = document.getElementById('root')
if (!container) throw new Error('Falta el contenedor #root')

enableOffline()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

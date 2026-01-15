import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// GLOBAL ERROR HANDLER FOR STARTUP
window.addEventListener('error', (e) => {
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace; font-size: 20px; background: #fff0f0;">
    <h1>Application Startup Error</h1>
    <p>${e.message}</p>
    <pre>${e.filename}:${e.lineno}</pre>
  </div>`
})

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (e: any) {
  document.body.innerHTML = `<div style="color: red; padding: 20px;"><h1>Render Error</h1><pre>${e.message}</pre></div>`
}

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'

// Start each invitation opening at the masthead instead of a restored scroll offset.
window.history.scrollRestoration = 'manual'
if (performance.getEntriesByType('navigation')[0]?.type === 'reload' && window.location.hash) {
  window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
}
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

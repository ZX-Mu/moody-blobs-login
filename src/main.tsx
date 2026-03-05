import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MouseProvider } from '@/context/MouseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MouseProvider>
      <App />
    </MouseProvider>
  </StrictMode>,
)

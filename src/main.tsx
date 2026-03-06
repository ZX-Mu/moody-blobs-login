import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MouseProvider } from '@/context/MouseContext'
import { EmotionProvider } from '@/context/EmotionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmotionProvider>
      <MouseProvider>
        <App />
      </MouseProvider>
    </EmotionProvider>
  </StrictMode>,
)

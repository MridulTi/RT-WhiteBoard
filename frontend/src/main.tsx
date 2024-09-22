import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ActionsProvider } from './hooks/useActions.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>

      <ActionsProvider>
        <App />
      </ActionsProvider>

  </StrictMode>,
)

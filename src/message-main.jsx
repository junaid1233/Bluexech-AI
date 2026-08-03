import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MessagePage from './pages/MessagePage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MessagePage />
  </StrictMode>,
)

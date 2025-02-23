import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FileProvider } from "./services/FileContext";
import './css/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <FileProvider>
      <App />
    </FileProvider>
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./authentication/AuthOptions.jsx"
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <HashRouter>
        <App />
    </HashRouter>
  </AuthProvider>
)

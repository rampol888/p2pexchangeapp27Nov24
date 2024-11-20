import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if (import.meta.env.DEV) {
  console.log('Environment Variables:', {
    STRIPE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    API_URL: import.meta.env.VITE_API_URL,
  });
}
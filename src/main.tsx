import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          borderRadius: '10px',
        },
        success: {
          iconTheme: { primary: '#4f46e5', secondary: '#fff' },
        },
      }}
    />
  </React.StrictMode>,
)
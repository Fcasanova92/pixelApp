import React from 'react'
import { CheckoutComponent } from './components/CheckoutComponent'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 TikTok Pixel Demo - React + TypeScript</h1>
        <p>Implementación completa del TikTok Pixel con eventos de e-commerce</p>
      </header>

      <main className="app-main">
        <CheckoutComponent />
      </main>

      <footer className="app-footer">
        <p>
          📱 Desarrollado con React + Vite + TypeScript | 
          🚀 TikTok Pixel Implementation Demo
        </p>
      </footer>
    </div>
  )
}

export default App

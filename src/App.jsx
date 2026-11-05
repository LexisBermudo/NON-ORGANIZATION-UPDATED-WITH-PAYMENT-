import { useEffect, useState } from 'react'
import AboutPage from './pages/AboutPage.jsx'
import HomePage from './pages/HomePage.jsx'
import Navigation from './components/Navigation.jsx'
import './App.css'

function App() {
  const [location, setLocation] = useState(() => window.location.pathname + window.location.hash)
  const page = location.startsWith('/about') ? 'about' : 'home'

  useEffect(() => {
    const handlePopState = () => setLocation(window.location.pathname + window.location.hash)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(event, destination) {
    if (event) event.preventDefault()
    window.history.pushState({}, '', destination)
    setLocation(window.location.pathname + window.location.hash)
    if (window.location.hash) {
      requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="app-shell">
      <Navigation page={page} navigate={navigate} />
      {page === 'about' ? <AboutPage navigate={navigate} /> : <HomePage navigate={navigate} />}
    </div>
  )
}

export default App

import { useState } from 'react'
import Login from './Login'
import LandingPage from './LandingPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('valentines_logged_in') === 'true')

  const handleLogin = () => {
    localStorage.setItem('valentines_logged_in', 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('valentines_logged_in')
    setIsLoggedIn(false)
  }

  return isLoggedIn ? <LandingPage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
}

export default App

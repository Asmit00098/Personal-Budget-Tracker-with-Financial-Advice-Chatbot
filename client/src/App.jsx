import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './styles/index.css'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import Expenses from './pages/Expenses/Expenses'
import Chatbot from './pages/Chatbot/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'
import Budgets from './pages/Budgets/Budgets'
import LandingPage from './pages/LandingPage'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
  }, [token])

  const Private = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth onAuth={(t)=>setToken(t)} />} />
        <Route path="/" element={token ? <Dashboard /> : <LandingPage />} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/expenses" element={<Private><Expenses /></Private>} />
        <Route path="/chat" element={<Private><Chatbot /></Private>} />
        <Route path="/budgets" element={<Private><Budgets /></Private>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

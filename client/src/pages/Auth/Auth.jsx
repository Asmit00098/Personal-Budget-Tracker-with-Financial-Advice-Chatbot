import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const { data } = await axios.post(`${API}${url}`, form)
      if (mode === 'login') {
        if (data?.token) {
          localStorage.setItem('token', data.token)
          onAuth?.(data.token)
          navigate('/dashboard')
        } else {
          setError('Login failed: no token received')
        }
      } else {
        setSuccess('Registration successful! Please log in.')
        setTimeout(() => navigate('/auth'), 800)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="container" style={{display:'grid',placeItems:'center',minHeight:'100vh', padding:'20px'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="card" style={{padding:24, maxWidth:420, width:'100%'}}>
        <div style={{marginBottom:18}}>
          <div className="h1" style={{margin:0}}>FlowLedger</div>
          <div className="muted">A serene way to master your money</div>
        </div>
        <form onSubmit={submit} style={{display:'grid', gap:12}}>
          {mode==='register' && (
            <input className="input" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
          )}
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          {error && <div className="muted" style={{color:'#b00020'}}>{error}</div>}
          {success && <div className="muted" style={{color:'var(--accent)'}}>{success}</div>}
          <button className="btn block" type="submit">{mode==='login'?'Login':'Create account'}</button>
        </form>
        <div style={{marginTop:12}}>
          <button className="btn" style={{background:'transparent', color:'var(--accent)'}} onClick={()=>setMode(mode==='login'?'register':'login')}>
            {mode==='login' ? 'Create an account' : 'Have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}



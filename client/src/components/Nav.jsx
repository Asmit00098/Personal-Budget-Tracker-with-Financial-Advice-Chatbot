import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav(){
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  function logout(){
    localStorage.removeItem('token')
    navigate('/auth')
    setIsOpen(false)
  }
  return (
    <nav className="card" style={{margin:'16px 0', padding:'12px 16px', display:'flex', gap:12, alignItems:'center', position:'relative'}}>
      <Link to="/" className="accent" style={{textDecoration:'none', fontWeight:700}}>FlowLedger</Link>
      <div style={{flex:1}} />
      <div className="hide-on-mobile" style={{display:'flex', alignItems:'center', gap:12}}>
        <Link to="/" style={{textDecoration:'none', color:'var(--ink)'}}>Dashboard</Link>
        <Link to="/expenses" style={{textDecoration:'none', color:'var(--ink)'}}>Expenses</Link>
        <Link to="/chat" style={{textDecoration:'none', color:'var(--ink)'}}>Chat</Link>
        <Link to="/budgets" style={{textDecoration:'none', color:'var(--ink)'}}>Budgets</Link>
        <button className="btn" onClick={logout} style={{marginLeft:12}}>Logout</button>
      </div>
      <button aria-label="Open menu" className="show-on-mobile btn" onClick={()=>setIsOpen(true)} style={{background:'transparent', color:'var(--accent)', border:'1px solid var(--accent)'}}>
        ☰
      </button>

      {isOpen && (
        <div className="glass" style={{position:'fixed', inset:0, zIndex:1000, display:'grid'}}>
          <div style={{background:'#fff', padding:20, borderBottom:'1px solid #eee', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{fontWeight:800}} className="accent">FlowLedger</div>
            <button aria-label="Close menu" className="btn" onClick={()=>setIsOpen(false)} style={{background:'transparent', color:'var(--accent)'}}>
              ✕
            </button>
          </div>
          <div style={{padding:20, display:'grid', gap:12, alignContent:'start', background:'#fff', height:'100%'}}>
            <Link to="/" onClick={()=>setIsOpen(false)} style={{textDecoration:'none', color:'var(--ink)'}}>Dashboard</Link>
            <Link to="/expenses" onClick={()=>setIsOpen(false)} style={{textDecoration:'none', color:'var(--ink)'}}>Expenses</Link>
            <Link to="/chat" onClick={()=>setIsOpen(false)} style={{textDecoration:'none', color:'var(--ink)'}}>Chat</Link>
            <Link to="/budgets" onClick={()=>setIsOpen(false)} style={{textDecoration:'none', color:'var(--ink)'}}>Budgets</Link>
            <button className="btn block" onClick={logout} style={{marginTop:8}}>Logout</button>
          </div>
        </div>
      )}
    </nav>
  )
}



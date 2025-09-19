import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import { api } from '../../hooks/useApi'
import { formatToINR } from '../../utils/currencyFormatter'

const CATEGORIES = ['Food','Transport','Entertainment','Utilities','Shopping','Health','Other']

export default function Budgets(){
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth()+1)
  const [year, setYear] = useState(now.getFullYear())
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category:'Food', limitAmount:'' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  async function load(){
    const { data } = await api.get('/api/budgets', { params: { month, year } })
    setItems(data)
  }

  useEffect(()=>{ load() }, [month, year])

  async function save(e){
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await api.put(`/api/budgets/${editing._id}`, { ...form, month, year, limitAmount: Number(form.limitAmount) })
        setEditing(null)
      } else {
        await api.post('/api/budgets', { ...form, month, year, limitAmount: Number(form.limitAmount) })
      }
      setForm({ category:'Food', limitAmount:'' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget')
    }
  }

  function startEdit(item){
    setEditing(item)
    setForm({ category:item.category, limitAmount:String(item.limitAmount) })
  }

  async function remove(id){
    await api.delete(`/api/budgets/${id}`)
    load()
  }

  return (
    <div className="container" style={{display:'grid', gap:16}}>
      <Nav />
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <div className="h1" style={{margin:0}}>Budgets</div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <select className="input" value={month} onChange={e=>setMonth(Number(e.target.value))}>
            {Array.from({length:12},(_,i)=>i+1).map(m=> <option key={m} value={m}>{m}</option>)}
          </select>
          <input className="input" type="number" value={year} onChange={e=>setYear(Number(e.target.value))} style={{width:120}} />
        </div>
      </header>

      <div className="card" style={{padding:16}}>
        <div className="h2" style={{marginBottom:8}}>{editing?'Edit Budget':'Add Budget'}</div>
        <form className="stack-on-mobile" onSubmit={save} style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr 1fr'}}>
          <select className="input" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))}>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Limit Amount" type="number" step="0.01" value={form.limitAmount} onChange={e=>setForm(f=>({...f, limitAmount:e.target.value}))} />
          <div style={{display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end'}}>
            <button className="btn" type="submit" style={{minWidth:120}}>{editing?'Update':'Add'}</button>
            {editing && <button className="btn" type="button" style={{background:'#ddd', color:'#333', minWidth:120}} onClick={()=>{setEditing(null); setForm({category:'Food', limitAmount:''})}}>Cancel</button>}
          </div>
        </form>
        {error && <div className="muted" style={{color:'#b00020', marginTop:8}}>{error}</div>}
      </div>

      <div className="card" style={{padding:0}}>
        <div className="hide-on-mobile">
          <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
            <thead>
              <tr>
                <th style={{textAlign:'left', padding:14}}>Category</th>
                <th style={{textAlign:'right', padding:14}}>Limit</th>
                <th style={{padding:14}}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(b => (
                <tr key={b._id} style={{borderTop:'1px solid #eee'}}>
                  <td style={{padding:14}}>{b.category}</td>
                  <td style={{padding:14, textAlign:'right'}}>{formatToINR(Number(b.limitAmount))}</td>
                  <td style={{padding:14, textAlign:'right'}}>
                    <button className="btn" onClick={()=>startEdit(b)} style={{marginRight:8}}>Edit</button>
                    <button className="btn" onClick={()=>remove(b._id)} style={{background:'#e74c3c'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="show-on-mobile" style={{padding:16}}>
          {items.map(b => (
            <div key={b._id} className="transaction-card">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                <div style={{fontWeight:600}}>{b.category}</div>
                <div style={{fontWeight:700}}>{formatToINR(Number(b.limitAmount))}</div>
              </div>
              <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                <button className="btn" onClick={()=>startEdit(b)}>Edit</button>
                <button className="btn" onClick={()=>remove(b._id)} style={{background:'#e74c3c'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



import { useEffect, useMemo, useState } from 'react'
import Nav from '../../components/Nav'
import { api } from '../../hooks/useApi'
import dayjs from 'dayjs'
import { formatToINR } from '../../utils/currencyFormatter'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const CATEGORIES = ['Food','Transport','Entertainment','Utilities','Shopping','Health','Other']

export default function Expenses(){
  const [items, setItems] = useState([])
  const [query, setQuery] = useState({ category: '', startDate: '', endDate: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ amount:'', category:'Food', description:'', date: dayjs().format('YYYY-MM-DD') })
  const [editing, setEditing] = useState(null)

  async function load(){
    const { data } = await api.get(`/api/expenses`, { params: query })
    setItems(data)
  }

  useEffect(()=>{ load() },[])

  async function addExpense(e){
    e.preventDefault()
    if (editing) {
      await api.put(`/api/expenses/${editing._id}`, { ...form, amount: Number(form.amount) })
      setEditing(null)
      setShowAdd(false)
      setForm({ amount:'', category:'Food', description:'', date: dayjs().format('YYYY-MM-DD') })
      load()
    } else {
      await api.post(`/api/expenses`, { ...form, amount: Number(form.amount) })
      setShowAdd(false)
      setForm({ amount:'', category:'Food', description:'', date: dayjs().format('YYYY-MM-DD') })
      load()
    }
  }

  const filtered = useMemo(()=>items, [items])

  return (
    <div className="container" style={{display:'grid', gap:16}}>
      <Nav />
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <div className="h1" style={{margin:0}}>Expenses</div>
        <button className="btn" onClick={()=>setShowAdd(true)} style={{minWidth:140}}>Add Expense</button>
      </header>

      <div className="card stack-on-mobile" style={{padding:16, display:'grid', gap:12, gridTemplateColumns:'repeat(4, 1fr)'}}>
        <select className="input" value={query.category} onChange={e=>setQuery(q=>({...q, category:e.target.value}))}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" type="date" value={query.startDate} onChange={e=>setQuery(q=>({...q, startDate:e.target.value}))}/>
        <input className="input" type="date" value={query.endDate} onChange={e=>setQuery(q=>({...q, endDate:e.target.value}))}/>
        <button className="btn" onClick={load}>Filter</button>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="hide-on-mobile">
          <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
            <thead>
              <tr>
                <th style={{textAlign:'left', padding:14}}>Date</th>
                <th style={{textAlign:'left', padding:14}}>Category</th>
                <th style={{textAlign:'left', padding:14}}>Description</th>
                <th style={{textAlign:'right', padding:14}}>Amount</th>
                <th style={{padding:14}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e)=> (
                <tr key={e._id} style={{borderTop:'1px solid #eee'}}>
                  <td style={{padding:14}}>{dayjs(e.date).format('MMM D, YYYY')}</td>
                  <td style={{padding:14}}>{e.category}</td>
                  <td style={{padding:14}}>{e.description}</td>
                  <td style={{padding:14, textAlign:'right'}}>{formatToINR(e.amount)}</td>
                  <td style={{padding:14, textAlign:'right'}}>
                    <button className="btn" onClick={()=>{ setEditing(e); setForm({ amount:String(e.amount), category:e.category, description:e.description, date: dayjs(e.date).format('YYYY-MM-DD') }); setShowAdd(true); }} style={{marginRight:8}}>Edit</button>
                    <button className="btn" onClick={async ()=>{ if (window.confirm('Delete this expense?')) { await api.delete(`/api/expenses/${e._id}`); setItems(items.filter(x=>x._id!==e._id)); } }} style={{background:'#e74c3c'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="show-on-mobile" style={{padding:16}}>
          {filtered.map((e)=> (
            <div key={e._id} className="transaction-card">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                <div style={{fontWeight:600}}>{e.category}</div>
                <div style={{fontWeight:700}}>{formatToINR(e.amount)}</div>
              </div>
              <div className="muted" style={{marginBottom:6}}>{e.description}</div>
              <div className="muted" style={{fontSize:12}}>{dayjs(e.date).format('MMM D, YYYY')}</div>
              <div style={{display:'flex', gap:8, marginTop:10, justifyContent:'flex-end'}}>
                <button className="btn" onClick={()=>{ setEditing(e); setForm({ amount:String(e.amount), category:e.category, description:e.description, date: dayjs(e.date).format('YYYY-MM-DD') }); setShowAdd(true); }}>Edit</button>
                <button className="btn" onClick={async ()=>{ if (window.confirm('Delete this expense?')) { await api.delete(`/api/expenses/${e._id}`); setItems(items.filter(x=>x._id!==e._id)); } }} style={{background:'#e74c3c'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="glass" style={{position:'fixed', inset:0, display:'grid', placeItems:'center', padding:'20px'}}>
          <div className="card" style={{padding:20, width:'100%', maxWidth:420}}>
            <div className="h2" style={{marginBottom:10}}>{editing ? 'Edit Expense' : 'Add Expense'}</div>
            <form onSubmit={addExpense} style={{display:'grid', gap:10}}>
              <input className="input" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} />
              <select className="input" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
              <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
              <div style={{display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap'}}>
                <button className="btn" type="button" style={{background:'#ddd', color:'#333'}} onClick={()=>{ setShowAdd(false); setEditing(null); }}>Cancel</button>
                <button className="btn" type="submit">{editing ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



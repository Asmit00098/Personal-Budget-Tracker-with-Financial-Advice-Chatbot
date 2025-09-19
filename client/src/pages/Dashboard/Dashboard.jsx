import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import { api } from '../../hooks/useApi'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { formatToINR } from '../../utils/currencyFormatter'
import useWindowSize from '../../hooks/useWindowSize'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const ACCENT = '#0b7d62'
const COLORS = ['#2c3d36', '#7da196', '#cfdad6', '#b7c7c1', '#dfe7e4', '#9eb6ae', '#e7f0ec']

export default function Dashboard(){
  const [summary, setSummary] = useState({ totalSpent: 0, breakdown: [] })
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [budgetSummary, setBudgetSummary] = useState([])
  const [chartKey, setChartKey] = useState(0)
  
  // Get window size and determine if mobile
  const { width } = useWindowSize()
  const isMobile = width <= 768

  useEffect(()=>{
    let mounted = true
    async function load(){
      try {
        setLoading(true)
        const [sRes, eRes, bRes] = await Promise.all([
          api.get(`/api/dashboard`),
          api.get(`/api/expenses`),
          api.get(`/api/summary/budget-vs-actual`),
        ])
        if (!mounted) return
        setSummary(sRes.data)
        setExpenses(eRes.data)
        setBudgetSummary(bRes.data.items || [])
      } catch (err) {
        if (!mounted) return
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  // derive category totals for pie from live expenses
  useEffect(()=>{
    const map = new Map()
    for (const e of expenses) {
      const key = e.category || 'Other'
      map.set(key, (map.get(key) || 0) + Number(e.amount || 0))
    }
    const arr = Array.from(map.entries()).map(([category, spent])=>({ category, spent }))
    setCategoryData(arr)
    
    // Force chart re-render when data changes
    setChartKey(prev => prev + 1)
  }, [expenses])

  // Debug logging
  useEffect(() => {
    console.log("Pie Chart Data:", JSON.stringify(categoryData, null, 2))
    console.log("Budget Summary Data:", JSON.stringify(budgetSummary, null, 2))
  }, [categoryData, budgetSummary])

  // Force chart re-render on window resize (important for mobile)
  useEffect(() => {
    const handleResize = () => {
      setChartKey(prev => prev + 1)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="container" style={{display:'grid', gap:24}}>
      <Nav />
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <div>
          <div className="h1" style={{margin:0}}>{formatToINR(summary.totalSpent)} <span className="muted">spent this month</span></div>
          <div className="muted">Balanced. Focused. In control.</div>
        </div>
        <a className="btn" href="/expenses" style={{minWidth:140, textAlign:'center'}}>Add Expense</a>
      </header>

      {/* Charts section - only render on desktop */}
      {!isMobile && (
        <section className="stack-on-mobile" style={{display:'grid', gap:24, gridTemplateColumns:'1.2fr 1fr'}}>
          <div className="card" style={{padding:20}}>
            <div className="h2">Spending by Category</div>
            <div className="chart-container" style={{height:300, width:'100%'}}>
              {categoryData && categoryData.length > 0 ? (
                <ResponsiveContainer 
                  key={`pie-${chartKey}-${categoryData.length}`} 
                  width="100%" 
                  height="100%"
                  debounce={1}
                >
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      dataKey="spent" 
                      nameKey="category" 
                      innerRadius={70} 
                      outerRadius={110} 
                      padAngle={2}
                      animationBegin={0}
                      animationDuration={800}
                    > 
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index===0?ACCENT:COLORS[index%COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v)=>formatToINR(v)} />
                    <Legend verticalAlign="bottom" height={24} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)'}}>
                  {loading ? 'Loading chart...' : 'No data available'}
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{padding:20}}>
            <div className="h2">Budget vs Actual</div>
            <div className="chart-container" style={{height:300, width:'100%'}}>
              {budgetSummary && budgetSummary.length > 0 ? (
                <ResponsiveContainer 
                  key={`bar-${chartKey}-${budgetSummary.length}`} 
                  width="100%" 
                  height="100%"
                  debounce={1}
                >
                  <BarChart 
                    data={budgetSummary}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(v)=>formatToINR(v)} />
                    <Bar 
                      dataKey="actual" 
                      fill={ACCENT} 
                      radius={[8,8,0,0]}
                      animationBegin={0}
                      animationDuration={800}
                    />
                    <Bar 
                      dataKey="budget" 
                      fill="#e8e2d8" 
                      radius={[8,8,0,0]}
                      animationBegin={0}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)'}}>
                  {loading ? 'Loading chart...' : 'No data available'}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mobile-friendly summary cards */}
      {isMobile && (
        <section style={{display:'grid', gap:16}}>
          <div className="card" style={{padding:20}}>
            <div className="h2">Spending Summary</div>
            {categoryData && categoryData.length > 0 ? (
              <div style={{display:'grid', gap:12}}>
                {categoryData.map((item, index) => (
                  <div key={index} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #eee'}}>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <div style={{width:12, height:12, borderRadius:'50%', backgroundColor:index===0?ACCENT:COLORS[index%COLORS.length]}}></div>
                      <span>{item.category}</span>
                    </div>
                    <span style={{fontWeight:600}}>{formatToINR(item.spent)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{color:'var(--muted)', textAlign:'center', padding:'20px 0'}}>
                {loading ? 'Loading...' : 'No spending data available'}
              </div>
            )}
          </div>
          
          <div className="card" style={{padding:20}}>
            <div className="h2">Budget Overview</div>
            {budgetSummary && budgetSummary.length > 0 ? (
              <div style={{display:'grid', gap:12}}>
                {budgetSummary.map((item, index) => (
                  <div key={index} style={{padding:'12px 0', borderBottom:'1px solid #eee'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                      <span>{item.category}</span>
                      <span style={{fontWeight:600}}>{formatToINR(item.actual)} / {formatToINR(item.budget)}</span>
                    </div>
                    <div style={{width:'100%', height:6, backgroundColor:'#f0f0f0', borderRadius:3, overflow:'hidden'}}>
                      <div style={{
                        width:`${Math.min((item.actual / item.budget) * 100, 100)}%`,
                        height:'100%',
                        backgroundColor: item.actual > item.budget ? '#e74c3c' : ACCENT,
                        transition:'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{color:'var(--muted)', textAlign:'center', padding:'20px 0'}}>
                {loading ? 'Loading...' : 'No budget data available'}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="card" style={{padding:20}}>
        <div className="h2" style={{marginBottom:8}}>Recent Transactions</div>
        {loading && <div className="muted">Loading…</div>}
        {!loading && error && <div className="muted" style={{color:'#b00020'}}>{error}</div>}
        {!loading && !error && expenses.length === 0 && (
          <div className="muted">You haven't added any expenses yet!</div>
        )}
        {!loading && !error && expenses.length > 0 && (
          <div style={{maxHeight:320, overflow:'auto'}}>
            <div className="hide-on-mobile">
              <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left', padding:12}}>Date</th>
                    <th style={{textAlign:'left', padding:12}}>Category</th>
                    <th style={{textAlign:'left', padding:12}}>Description</th>
                    <th style={{textAlign:'right', padding:12}}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0,10).map(e => (
                    <tr key={e._id} style={{borderTop:'1px solid #eee'}}>
                      <td style={{padding:12}}>{new Date(e.date).toLocaleDateString()}</td>
                      <td style={{padding:12}}>{e.category}</td>
                      <td style={{padding:12}}>{e.description}</td>
                      <td style={{padding:12, textAlign:'right'}}>{formatToINR(Number(e.amount))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="show-on-mobile">
              {expenses.slice(0,10).map(e => (
                <div key={e._id} className="transaction-card">
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                    <div style={{fontWeight:600}}>{e.category}</div>
                    <div style={{fontWeight:700}}>{formatToINR(Number(e.amount))}</div>
                  </div>
                  <div className="muted" style={{marginBottom:6}}>{e.description}</div>
                  <div className="muted" style={{fontSize:12}}>{new Date(e.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}



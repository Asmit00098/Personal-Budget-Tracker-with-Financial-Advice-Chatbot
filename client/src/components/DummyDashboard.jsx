import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { formatToINR } from '../utils/currencyFormatter'
import useWindowSize from '../hooks/useWindowSize'

const ACCENT = '#0b7d62'
const COLORS = ['#2c3d36', '#7da196', '#cfdad6', '#b7c7c1']

const dummyExpenses = [
  { _id: '1', date: new Date().toISOString(), category: 'Food', description: 'Cafe lunch', amount: 320.5 },
  { _id: '2', date: new Date().toISOString(), category: 'Transport', description: 'Metro card', amount: 150 },
  { _id: '3', date: new Date().toISOString(), category: 'Entertainment', description: 'Movie night', amount: 420 },
]

const dummyCategoryData = [
  { category: 'Food', spent: 320.5 },
  { category: 'Transport', spent: 150 },
  { category: 'Entertainment', spent: 420 },
  { category: 'Utilities', spent: 80 },
]

const dummyBudgetSummary = [
  { category: 'Food', budget: 5000, actual: 320.5 },
  { category: 'Transport', budget: 2000, actual: 150 },
  { category: 'Entertainment', budget: 3000, actual: 420 },
]

export default function DummyDashboard(){
  const [chartKey, setChartKey] = useState(0)
  const totalSpent = dummyExpenses.reduce((s,e)=> s + Number(e.amount||0), 0)
  
  // Get window size and determine if mobile
  const { width } = useWindowSize()
  const isMobile = width <= 768

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
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="h1" style={{margin:0}}>{formatToINR(totalSpent)} <span className="muted">spent this month</span></div>
          <div className="muted">Preview — demo data</div>
        </div>
      </header>

      {/* Charts section - only render on desktop */}
      {!isMobile && (
        <section className="stack-on-mobile" style={{display:'grid', gap:24, gridTemplateColumns:'1.2fr 1fr'}}>
          <div className="card" style={{padding:20}}>
            <div className="h2">Spending by Category</div>
            <div className="chart-container" style={{height:300, width:'100%'}}>
              {dummyCategoryData && dummyCategoryData.length > 0 ? (
                <ResponsiveContainer 
                  key={`dummy-pie-${chartKey}`} 
                  width="100%" 
                  height="100%"
                  debounce={1}
                >
                  <PieChart>
                    <Pie 
                      data={dummyCategoryData} 
                      dataKey="spent" 
                      nameKey="category" 
                      innerRadius={70} 
                      outerRadius={110} 
                      padAngle={2}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {dummyCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index===0?ACCENT:COLORS[index%COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v)=>formatToINR(v)} />
                    <Legend verticalAlign="bottom" height={24} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)'}}>
                  No data available
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{padding:20}}>
            <div className="h2">Budget vs Actual</div>
            <div className="chart-container" style={{height:300, width:'100%'}}>
              {dummyBudgetSummary && dummyBudgetSummary.length > 0 ? (
                <ResponsiveContainer 
                  key={`dummy-bar-${chartKey}`} 
                  width="100%" 
                  height="100%"
                  debounce={1}
                >
                  <BarChart 
                    data={dummyBudgetSummary}
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
                  No data available
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
            <div style={{display:'grid', gap:12}}>
              {dummyCategoryData.map((item, index) => (
                <div key={index} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #eee'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <div style={{width:12, height:12, borderRadius:'50%', backgroundColor:index===0?ACCENT:COLORS[index%COLORS.length]}}></div>
                    <span>{item.category}</span>
                  </div>
                  <span style={{fontWeight:600}}>{formatToINR(item.spent)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card" style={{padding:20}}>
            <div className="h2">Budget Overview</div>
            <div style={{display:'grid', gap:12}}>
              {dummyBudgetSummary.map((item, index) => (
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
          </div>
        </section>
      )}

      <section className="card" style={{padding:20}}>
        <div className="h2" style={{marginBottom:8}}>Recent Transactions</div>
        <div style={{maxHeight:240, overflow:'auto'}}>
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
              {dummyExpenses.map(e => (
                <tr key={e._id} style={{borderTop:'1px solid #eee'}}>
                  <td style={{padding:12}}>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                  <td style={{padding:12}}>{e.category}</td>
                  <td style={{padding:12}}>{e.description}</td>
                  <td style={{padding:12, textAlign:'right'}}>{formatToINR(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}



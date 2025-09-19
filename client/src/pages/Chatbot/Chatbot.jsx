import { useState } from 'react'
import Nav from '../../components/Nav'
import { api } from '../../hooks/useApi'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Chatbot(){
  const [messages, setMessages] = useState([{ role:'bot', text:'Hi! Ask me anything about your spending.' }])
  const [text, setText] = useState('')

  async function send(){
    if(!text.trim()) return
    const input = { role:'user', text }
    setMessages(m=>[...m, input])
    setText('')
    const { data } = await api.post(`/api/chatbot`, { message: text })
    setMessages(m=>[...m, { role:'bot', text: data.reply }])
  }

  return (
    <div className="container" style={{display:'grid', gap:12}}>
      <Nav />
      <div className="h1">Chat</div>
      <div className="card" style={{padding:16, height:'60vh', display:'flex', flexDirection:'column'}}>
        <div style={{flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8}}>
          {messages.map((m,i)=> (
            <div key={i} style={{display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{
                background: m.role==='user'?'#dcf8c6':'#ffffff',
                color: '#333',
                padding: '10px 15px',
                borderRadius: m.role==='user'?'18px 18px 3px 18px':'18px 18px 18px 3px',
                maxWidth: '70%',
                width: 'fit-content',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <input className="input" placeholder="Ask for advice..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} style={{flex:1, minWidth:200}} />
        <button className="btn" onClick={send} style={{minWidth:80}}>Send</button>
      </div>
    </div>
  )
}



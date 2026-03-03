import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReact = async () => {
    if (!input) return alert("ဗီဒီယို Link သို့မဟုတ် အကြောင်းအရာ ထည့်ပါ");
    
    setLoading(true);
    setResponse("");

    try {
      // Gemini ကို တိုက်ရိုက်မခေါ်ဘဲ ကျွန်တော်တို့ ဆောက်ထားတဲ့ API ဆီ လှမ်းခေါ်ခြင်း
      const res = await fetch("/api/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `You are a funny video reactor. React to this video description: ${input}` 
        }),
      });

      const data = await res.json();

      if (data.text) {
        setResponse(data.text);
      } else {
        setResponse("Error: API မှ အဖြေပြန်မလာပါ။ " + (data.error || ""));
      }
    } catch (error) {
      console.error(error);
      setResponse("Error: Server နဲ့ ချိတ်ဆက်လို့မရပါ။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🎬 Funny Video Reactor</h1>
      <p>ဗီဒီယိုအကြောင်း ပြောပြပါ၊ Gemini က react လုပ်ပေးပါလိမ့်မယ်။</p>
      
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="ဥပမာ- ကြောင် fighting ဖြစ်နေတာ"
        style={{ padding: '10px', width: '80%', maxWidth: '400px', marginBottom: '10px' }}
      />
      <br />
      
      <button 
        onClick={handleReact} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4285f4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? "Thinking..." : "React Now!"}
      </button>

      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '10px',
        textAlign: 'left',
        minHeight: '100px'
      }}>
        <strong>Gemini's Reaction:</strong>
        <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleGenerativeAI } from "@google/generative-ai"

// Vercel Environment Variable ကနေ API Key ကို ခေါ်ယူခြင်း
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReact = async () => {
    if (!input) return alert("ဗီဒီယို Link သို့မဟုတ် အကြောင်းအရာ တစ်ခုခု ထည့်ပါဦး!");
    
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are a funny video reactor. React to this video description or link in a hilarious way using Myanmar language: ${input}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      console.error(error);
      setResponse("Error: API Key မှားနေတာ ဒါမှမဟုတ် Connection မကောင်းတာ ဖြစ်နိုင်ပါတယ်။");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#3b82f6' }}>🎬 Funny Video Reactor</h1>
      <p>ဗီဒီယိုအကြောင်း ပြောပြပါ၊ Gemini က react လုပ်ပေးပါလိမ့်မယ်။</p>
      
      <div style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter video link or description..."
          style={{ padding: '10px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <br /><br />
        <button 
          onClick={handleReact}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? "Thinking..." : "React Now!"}
        </button>
      </div>

      {response && (
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '10px',
          textAlign: 'left',
          lineHeight: '1.6'
        }}>
          <strong>Gemini's Reaction:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

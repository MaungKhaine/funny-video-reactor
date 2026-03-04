import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Vercel Environment Variable ကနေ Key ကို ယူမယ်
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleReact = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // Model Name ကို gemini-1.5-flash လို့ပဲ သုံးပါ
     const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  { apiVersion: "v1" }
); 
      const prompt = `ဒီဗီဒီယိုအကြောင်းကို ဟာသနှောပြီး React လုပ်ပေးပါ: ${input}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      setResponse("Error: API ချိတ်ဆက်မှု အဆင်မပြေပါ။ Key သို့မဟုတ် Model Name စစ်ဆေးပါ။");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center' }}> Funny Video Reactor</h1>
      <p style={{ fontSize: '14px', color: '#666' }}>ဗီဒီယိုအကြောင်း ပြောပြပါ။ Gemini က react လုပ်ပေးပါလိမ့်မယ်။</p>
      
      <input 
        style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        placeholder="ခွေးကိုက်တဲ့ video..." 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      
      <button 
        onClick={handleReact}
        disabled={loading}
        style={{ width: '100%', padding: '10px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {loading ? "Reacting..." : "React Now!"}
      </button>

      {response && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eee', borderRadius: '5px' }}>
          <strong>Gemini's Reaction:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

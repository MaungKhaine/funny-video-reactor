import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel Environment Variable ကနေ API Key ကို ခေါ်ယူခြင်း
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReact = async () => {
    if (!input) return alert("ဗီဒီယို Link သို့မဟုတ် အကြောင်းအရာ ထည့်ပါ");
    
    if (!apiKey || apiKey === "") {
      setResponse("Error: API Key is missing. Please check Vercel Environment Variables.");
      return;
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a funny video reactor. React to this: ${input}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      console.error(error);
      setResponse("Error: Gemini API နဲ့ ချိတ်ဆက်လို့မရပါ။ Key သို့မဟုတ် Region ကို စစ်ဆေးပါ။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1> Funny Video Reactor</h1>
      <p>ဗီဒီယိုအကြောင်း ပြောပြပါ၊ Gemini က react လုပ်ပေးပါလိမ့်မယ်။</p>
      
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="ဥပမာ- ကြောင် fighting ဖြစ်နေတာ"
        style={{ padding: '10px', width: '300px' }}
      />
      <br /><br />
      
      <button onClick={handleReact} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {loading ? "Thinking..." : "React Now!"}
      </button>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
        <h3>Gemini's Reaction:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}

// သင့် App ကို Render လုပ်တဲ့အပိုင်း (အရင်အတိုင်းထားပါ)
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

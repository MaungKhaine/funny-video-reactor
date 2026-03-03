import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt } = req.body;
  
  // API Key ကို Vercel Environment Variable ကနေ ဖတ်ခြင်း
  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

  try {
    // အရေးကြီးသောပြင်ဆင်ချက်: model နာမည်ရှေ့တွင် models/ ထည့်ပေးရပါသည်
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

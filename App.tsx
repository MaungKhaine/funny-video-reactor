import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Video, 
  Play, 
  Clock, 
  Laugh, 
  Upload, 
  Github, 
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Reaction {
  timestamp: string;
  text: string;
}

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reactions, setReactions] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setReactions('');
      setError(null);
    } else {
      setError("Please upload a valid video file.");
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(videoFile);
      const base64Data = await base64Promise;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Watch this video and provide funny reactions with timestamps. Format the response as a list with timestamps like [MM:SS]." },
              {
                inlineData: {
                  mimeType: videoFile.type,
                  data: base64Data
                }
              }
            ]
          }
        ]
      });

      setReactions(response.text || 'No reactions generated.');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze video. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif italic text-2xl tracking-tight">Funny Video Reactor</h1>
          <p className="text-[11px] uppercase tracking-widest opacity-50 font-mono mt-1">AI-Powered Content Analysis v1.0</p>
        </div>
        <div className="flex gap-4">
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors text-xs uppercase tracking-wider font-mono"
            onClick={() => alert("Please use the 'Publish' or 'GitHub' button in the top-right header of the AI Studio interface (outside this preview) to connect your account.")}
          >
            <Github size={14} />
            Publish to GitHub
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Video Input */}
        <section className="space-y-6">
          <div className="border border-[#141414] bg-white p-1 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full aspect-video object-cover bg-black"
              />
            ) : (
              <div 
                className="w-full aspect-video bg-[#F0F0F0] flex flex-col items-center justify-center border-2 border-dashed border-[#141414]/20 cursor-pointer hover:bg-[#F5F5F5] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mb-4 opacity-30" size={48} />
                <p className="font-serif italic opacity-50">Click or drag to upload video</p>
                <p className="text-[10px] font-mono uppercase mt-2 opacity-30">MP4, MOV, WebM supported</p>
              </div>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/*" 
            className="hidden" 
          />

          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-4 border border-[#141414] font-mono text-xs uppercase tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-all active:translate-x-1 active:translate-y-1"
            >
              {videoFile ? 'Change Video' : 'Select Video'}
            </button>
            
            {videoFile && (
              <button 
                onClick={analyzeVideo}
                disabled={isAnalyzing}
                className="flex-[2] py-4 bg-[#141414] text-[#E4E3E0] font-mono text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Laugh size={16} />
                    Generate Reactions
                  </>
                )}
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 border border-red-500 bg-red-50 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Right Column: Reactions */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif italic text-xl">AI Reactions</h2>
            <div className="text-[10px] font-mono uppercase opacity-50 flex items-center gap-2">
              <Clock size={12} />
              Real-time Processing
            </div>
          </div>

          <div className="flex-1 border border-[#141414] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] overflow-y-auto max-h-[600px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-4 py-20"
                >
                  <div className="w-12 h-12 border-4 border-[#141414] border-t-transparent rounded-full animate-spin" />
                  <p className="font-serif italic opacity-50">Gemini is watching your video...</p>
                </motion.div>
              ) : reactions ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:italic"
                >
                  <Markdown>{reactions}</Markdown>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                  <Video size={64} className="mb-4" />
                  <p className="font-serif italic">Upload and analyze to see reactions</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 border-t border-[#141414] p-8 bg-[#DCDAD7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-4 opacity-50">How it works</h3>
            <p className="text-sm leading-relaxed">
              This application uses the <span className="font-mono text-xs font-bold">Gemini 3 Flash</span> model to analyze video frames and audio, generating context-aware humorous commentary with precise timestamps.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest mb-4 opacity-50">GitHub Integration</h3>
            <p className="text-sm leading-relaxed">
              To publish this app, download the source code using the platform's export tool and push it to a new GitHub repository.
            </p>
          </div>
          <div className="flex flex-col justify-end items-end">
            <div className="text-[10px] font-mono opacity-30"> 2026 FUNNY VIDEO REACTOR</div>
            <div className="text-[10px] font-mono opacity-30 uppercase tracking-tighter">Built with Google AI Studio</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { LoadingState } from './components/LoadingState';
import { ReportDisplay } from './components/ReportDisplay';
import { ResearchConfig, ResearchReport } from './types';
import { generateResearchReport } from './services/geminiService';
import { Activity, ShieldCheck, Terminal, Compass } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'input' | 'processing' | 'report'>('input');
  const [report, setReport] = useState<ResearchReport | null>(null);

  const handleStartResearch = async (config: ResearchConfig) => {
    setView('processing');
    try {
      const result = await generateResearchReport(config);
      setReport(result);
      setView('report');
    } catch (error: any) {
      console.error("Analysis Failed", error);

      if (error.message === "API_KEY_LEAKED") {
        alert("CRITICAL ERROR: Your API key has been flagged as leaked by Google and blocked for security.\n\nPlease generate a NEW API key in Google AI Studio and update your environment variables.");
      } else if (error.message === "QUOTA_EXCEEDED") {
        alert("API Quota Exceeded.\n\nYou have reached the free tier limits for the Gemini API. Please wait about 60 seconds before trying again, or upgrade your plan in Google AI Studio.");
      } else {
        alert("Analysis failed. Please check your network connection and API key.");
      }

      setView('input');
    }
  };

  const handleReset = () => {
    setReport(null);
    setView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-trade-bg text-trade-text selection:bg-trade-accent selection:text-white flex flex-col">
      {/* Top Header System */}
      <header className="h-14 border-b border-trade-border bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 border-2 border-trade-text flex items-center justify-center transition-all group-hover:border-trade-accent group-hover:bg-trade-accent group-hover:text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm tracking-tight leading-none uppercase">TradeFlow<span className="text-trade-accent">.Intel</span></span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-trade-muted">Global Insight Protocol</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 font-mono text-[9px] text-trade-muted uppercase">
            <Activity className="w-3 h-3 text-trade-accent" />
            State: <span className="text-trade-text font-bold">Encrypted</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] text-trade-muted uppercase">
            <ShieldCheck className="w-3 h-3 text-trade-accent" />
            Node: <span className="text-trade-text font-bold">Terminal_01</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {view === 'input' && (
          <InputSection onSubmit={handleStartResearch} isProcessing={false} />
        )}
        {view === 'processing' && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingState />
          </div>
        )}
        {view === 'report' && report && (
          <ReportDisplay report={report} onReset={handleReset} />
        )}
      </main>

      {/* Professional Footer Bar */}
      <footer className="h-10 border-t border-trade-border bg-white px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-mono text-trade-muted uppercase flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Live_Database: Connection_Established
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-mono text-trade-muted uppercase flex items-center gap-2 cursor-pointer hover:text-trade-accent transition-colors">
            <Terminal className="w-2.5 h-2.5" />
            System_Manifest
          </span>
          <span className="text-[9px] font-mono text-trade-muted uppercase">
            © TradeFlow Intelligence v3.0.4
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
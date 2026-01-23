import React, { useState } from 'react';
import { Plus, Globe, ChevronRight, Target, Database, Trash2, Search, Info } from 'lucide-react';
import { REGIONS, INDUSTRIES, DEPTHS } from '../constants';
import { ResearchConfig, Region, Industry, ResearchDepth } from '../types';

interface InputSectionProps {
  onSubmit: (config: ResearchConfig) => void;
  isProcessing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isProcessing }) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [context, setContext] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [depth, setDepth] = useState<ResearchDepth>('Standard');

  const addUrl = () => setUrls([...urls, '']);
  const removeUrl = (index: number) => setUrls(urls.filter((_, i) => i !== index));
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const toggleRegion = (region: Region) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const toggleIndustry = (industry: Industry) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrls = urls.filter(u => u.trim() !== '');
    onSubmit({
      urls: cleanUrls,
      context,
      regions: selectedRegions,
      industries: selectedIndustries,
      depth
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-4 pb-12 animate-fade-in">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 border-b border-trade-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-trade-text font-sans">
            Market Intelligence <span className="text-trade-accent font-mono font-light text-xl">/ Research Terminal</span>
          </h1>
          <p className="text-sm text-trade-muted mt-1 max-w-xl">
            Configure analysis parameters for high-fidelity regional trade synthesis.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-trade-muted uppercase tracking-widest bg-trade-card px-3 py-1 border border-trade-border rounded-full">
          <div className="w-1.5 h-1.5 bg-trade-accent rounded-full animate-pulse" />
          Engine v3.0 // Ready
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Control Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 01: Context */}
          <div className="bg-trade-surface border border-trade-border soft-shadow overflow-hidden group">
            <div className="bg-trade-bg px-5 py-3 border-b border-trade-border flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-trade-muted flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> 01. Research Objective
              </h2>
              <Info className="w-3.5 h-3.5 text-trade-border group-hover:text-trade-muted transition-colors" />
            </div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What specifically are we investigating? (e.g., Supply chain bottlenecks in Southeast Asian plastic product exports 2024)"
              className="w-full h-32 p-5 text-sm text-trade-text focus:outline-none placeholder:text-trade-muted placeholder:italic resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Section 02: Sources */}
          <div className="bg-trade-surface border border-trade-border soft-shadow overflow-hidden">
            <div className="bg-trade-bg px-5 py-3 border-b border-trade-border">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-trade-muted flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> 02. Data Ingress
              </h2>
            </div>
            <div className="p-5 space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="Reference URL (Regulatory bodies, news, reports...)"
                    className="flex-1 bg-trade-card/50 border border-trade-border px-4 py-2.5 text-xs font-mono text-trade-text focus:border-trade-accent focus:bg-white focus:outline-none transition-all"
                  />
                  {urls.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeUrl(index)}
                      className="px-3 border border-trade-border text-trade-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addUrl}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-trade-muted hover:text-trade-accent transition-colors pt-1"
              >
                <Plus className="w-3 h-3" /> Add additional source
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Scoping Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-trade-surface border border-trade-border soft-shadow p-6">
            <h3 className="text-[10px] font-mono text-trade-accent font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Scoping Filter
            </h3>

            {/* Regions Selection */}
            <div className="mb-8">
              <label className="text-[9px] font-mono text-trade-muted uppercase tracking-wider block mb-3">Tactical Regions</label>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS.map(region => {
                  const isActive = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      className={`px-3 py-2 text-[10px] font-mono border transition-all ${
                        isActive 
                        ? 'bg-trade-accent border-trade-accent text-white' 
                        : 'bg-trade-card border-trade-border text-trade-muted hover:border-trade-muted hover:text-trade-text'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical Selection */}
            <div className="mb-8">
              <label className="text-[9px] font-mono text-trade-muted uppercase tracking-wider block mb-3">Vertical Focus</label>
              <div className="grid grid-cols-1 gap-1.5">
                {INDUSTRIES.map(industry => {
                  const isActive = selectedIndustries.includes(industry);
                  return (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => toggleIndustry(industry)}
                      className={`flex items-center justify-between px-3 py-2 text-[10px] font-mono border transition-all ${
                        isActive 
                        ? 'bg-trade-accent border-trade-accent text-white' 
                        : 'bg-trade-card border-trade-border text-trade-muted hover:border-trade-muted'
                      }`}
                    >
                      <span>{industry}</span>
                      {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Depth Selection */}
            <div className="mb-8">
              <label className="text-[9px] font-mono text-trade-muted uppercase tracking-wider block mb-3">Synthesis Depth</label>
              <div className="flex bg-trade-card p-1 border border-trade-border">
                {DEPTHS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDepth(d)}
                    className={`flex-1 py-2 text-[9px] font-mono uppercase transition-all ${
                      depth === d 
                        ? 'bg-white text-trade-accent shadow-sm' 
                        : 'text-trade-muted hover:text-trade-text'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Initiate Action */}
            <button
              type="submit"
              disabled={isProcessing || selectedRegions.length === 0 || selectedIndustries.length === 0}
              className="w-full group bg-trade-text text-white py-4 text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-trade-accent disabled:opacity-30 disabled:pointer-events-none"
            >
              {isProcessing ? 'SCANNING_SIGNAL' : 'INITIATE ANALYSIS'}
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isProcessing ? 'animate-pulse' : ''}`} />
            </button>
            <p className="text-[9px] font-mono text-trade-muted text-center mt-3 uppercase tracking-tighter opacity-60">
              Verified Terminal Access // 0x4921..FF
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
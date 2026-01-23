import React from 'react';
import { ResearchReport } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, ExternalLink, ArrowLeft, Printer, Share2 } from 'lucide-react';
import { Button } from './Button';

interface ReportDisplayProps {
  report: ResearchReport;
  onReset: () => void;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onReset }) => {
  const chartData = report.chartData && report.chartData.length > 0 ? report.chartData : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-trade-border pb-6">
        <button onClick={onReset} className="flex items-center gap-2 text-trade-muted hover:text-trade-text transition-colors text-[10px] font-mono uppercase font-bold tracking-widest">
          <ArrowLeft className="w-3.5 h-3.5" /> Create New Probe
        </button>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={() => window.print()}>
             <Printer className="w-3.5 h-3.5 mr-2" /> PRINT
           </Button>
           <Button variant="outline" size="sm">
             <Share2 className="w-3.5 h-3.5 mr-2" /> SHARE
           </Button>
           <Button variant="primary" size="sm">
             <Download className="w-3.5 h-3.5 mr-2" /> PDF EXPORT
           </Button>
        </div>
      </div>

      {/* High-End Report Title Block */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-1.5 bg-trade-accent rounded-full" />
             <span className="text-trade-accent font-mono text-[9px] font-bold tracking-[0.3em] uppercase">Security Level: Classified</span>
          </div>
          <h1 className="text-4xl font-bold text-trade-text tracking-tight font-sans">
            Regional Trade Synthesis <span className="text-trade-muted font-light">/ Analytics</span>
          </h1>
        </div>
        <div className="flex flex-col items-end text-[9px] font-mono text-trade-muted">
          <span>GENERATED: {new Date(report.generatedAt).toLocaleDateString()} // {new Date(report.generatedAt).toLocaleTimeString()}</span>
          <span>SYSTEM_ID: TRD-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Primary Analysis Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Summary Section */}
          <section className="bg-trade-surface border border-trade-border soft-shadow p-8 rounded-sm">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-trade-muted mb-6 flex items-center gap-2">
               <div className="w-3 h-[1px] bg-trade-border" /> 01 Executive Overview
            </h2>
            <div className="text-gray-700 text-lg leading-relaxed font-sans first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
              {report.executiveSummary}
            </div>
          </section>

          {/* Detailed Regional Breakdown */}
          <section className="space-y-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-trade-muted mb-6 flex items-center gap-2">
               <div className="w-3 h-[1px] bg-trade-border" /> 02 Regional Granularity
            </h2>
            {report.regionalAnalysis.map((region, idx) => (
              <div key={idx} className="border-l-2 border-trade-accent bg-white p-6 shadow-sm border border-trade-border border-l-trade-accent">
                <h3 className="text-sm font-bold text-trade-text mb-3 uppercase tracking-tight">{region.region}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{region.content}</p>
                
                {region.stats && region.stats.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-trade-border">
                    {region.stats.map((stat, i) => (
                      <div key={i}>
                        <div className="text-[9px] text-trade-muted font-mono uppercase mb-1">{stat.label}</div>
                        <div className="text-sm font-bold text-trade-text">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>

        {/* Tactical Data Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Charts System */}
          <div className="space-y-4">
             <div className="bg-white border border-trade-border p-5 rounded-sm soft-shadow">
                <h3 className="text-[10px] font-mono text-trade-muted uppercase tracking-widest mb-6 font-bold">Volume Differential</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#F4F4F5" vertical={false} />
                      <XAxis dataKey="name" stroke="#A1A1AA" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#A1A1AA" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ border: '1px solid #E4E4E7', borderRadius: '0', fontSize: '10px' }} />
                      <Bar dataKey="Import" fill="#2563EB" name="Imp" />
                      <Bar dataKey="Export" fill="#E4E4E7" name="Exp" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white border border-trade-border p-5 rounded-sm soft-shadow">
                <h3 className="text-[10px] font-mono text-trade-muted uppercase tracking-widest mb-6 font-bold">Trajectory Analysis</h3>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#F4F4F5" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Line type="monotone" dataKey="Export" stroke="#2563EB" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Import" stroke="#D4D4D8" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Strategic Indicators */}
          <div className="bg-trade-bg border border-trade-border p-6 border-dashed">
             <h3 className="text-[10px] font-mono font-bold text-trade-text uppercase mb-4">Market Opportunites</h3>
             <p className="text-xs text-gray-600 leading-relaxed italic">{report.opportunities}</p>
          </div>

          {/* Information Lineage */}
          <div className="pt-4 border-t border-trade-border">
            <h3 className="text-[10px] font-mono font-bold text-trade-muted uppercase tracking-widest mb-4">Source Lineage</h3>
            <div className="space-y-4">
              {report.sources.map((source, idx) => (
                <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="group block">
                   <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-gray-700 group-hover:text-trade-accent transition-colors leading-tight">{source.title}</span>
                      <ExternalLink className="w-3 h-3 text-trade-border group-hover:text-trade-accent shrink-0" />
                   </div>
                   <span className="text-[8px] font-mono text-trade-muted uppercase tracking-tighter opacity-70 truncate block">{new URL(source.uri).hostname}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
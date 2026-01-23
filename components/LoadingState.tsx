import React, { useEffect, useState } from 'react';

const STEPS = [
  "Initializing Protocols",
  "Accessing Trade Grids",
  "Synthesizing Regional Data",
  "Analyzing Market Verticals",
  "Finalizing Research Report"
];

export const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 w-full animate-fade-in">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 border border-trade-accent/20 bg-trade-accent/5 text-trade-accent font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
             System Analysis in Progress
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-trade-text">Processing Signals</h2>
        </div>

        <div className="space-y-5">
          {STEPS.map((step, index) => (
            <div key={index} className={`flex items-center gap-4 transition-all duration-300 ${index <= currentStep ? 'opacity-100' : 'opacity-10'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${index === currentStep ? 'bg-trade-accent animate-ping' : index < currentStep ? 'bg-trade-text' : 'bg-trade-border'}`} />
              <span className={`font-mono text-[11px] uppercase tracking-widest ${index === currentStep ? 'text-trade-accent font-bold' : 'text-trade-muted'}`}>
                {step}
              </span>
              {index < currentStep && <div className="ml-auto w-1 h-1 bg-trade-accent rounded-full" />}
            </div>
          ))}
        </div>

        <div className="relative h-px w-full bg-trade-border">
           <div 
             className="absolute top-0 left-0 h-full bg-trade-accent transition-all duration-700 ease-out"
             style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
           />
        </div>
        
        <p className="text-center font-mono text-[9px] text-trade-muted uppercase opacity-50">
          Estimated Completion: {Math.max(0, (STEPS.length - currentStep) * 2)}s
        </p>
      </div>
    </div>
  );
};
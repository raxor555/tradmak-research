export type Region = 'Middle East Ports' | 'African Ports' | 'Southeast Asia' | 'Mediterranean Sea' | 'Europe';

export type Industry = 'General Chemicals' | 'Drilling Chemicals' | 'Plastic Products';

export type ResearchDepth = 'Quick' | 'Standard' | 'Comprehensive';

export interface ResearchConfig {
  urls: string[];
  context: string;
  regions: Region[];
  industries: Industry[];
  depth: ResearchDepth;
}

export interface ChartDataPoint {
  name: string;
  Import?: number;
  Export?: number;
  value?: number;
  [key: string]: any;
}

export interface ResearchReport {
  executiveSummary: string;
  regionalAnalysis: {
    region: string;
    content: string;
    stats?: { label: string; value: string | number }[];
  }[];
  productBreakdown: string;
  trends: string;
  opportunities: string;
  chartData: ChartDataPoint[];
  sources: { title: string; uri: string }[];
  generatedAt: string;
}

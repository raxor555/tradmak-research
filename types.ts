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

export interface TradeRecord {
  date: string;
  hsCode: string;
  description: string;
  destination: string;
  portOfLoading: string;
  unit: string;
  quantity: number;
  totalValueUSD: number;
  pricePerUnitUSD: number;
  sourceUrl?: string;
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
  tradeData: TradeRecord[];
  sources: { title: string; uri: string }[];
  generatedAt: string;
}

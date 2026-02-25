import { GoogleGenAI } from "@google/genai";
import { ResearchConfig, ResearchReport } from "../types";

const initGenAI = () => {
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  let source = "VITE_GEMINI_API_KEY";

  if (!apiKey) {
    apiKey = process.env.GEMINI_API_KEY;
    source = "process.env.GEMINI_API_KEY";
  }
  if (!apiKey) {
    apiKey = process.env.API_KEY;
    source = "process.env.API_KEY";
  }

  if (!apiKey) {
    throw new Error("API Key not found");
  }

  // Log the source to help debugging (safe partial log)
  console.log(`[System] Using API Key from: ${source} (Prefix: ${apiKey.substring(0, 4)}...)`);

  return new GoogleGenAI({ apiKey });
};

export const generateResearchReport = async (config: ResearchConfig): Promise<ResearchReport> => {
  const ai = initGenAI();

  // Construct a prompt that guides the model to perform "deep research"
  // We use gemini-2.5-flash for speed and googleSearch for grounding.

  const prompt = `
    You are an expert trade analyst specializing in chemical products import/export research.
    Conduct a deep research analysis based on the following parameters:

    CONTEXT: ${config.context}
    
    TARGET REGIONS: ${config.regions.join(', ')}
    
    INDUSTRY FOCUS: ${config.industries.join(', ')}
    
    REFERENCE URLS (Prioritize searching for info related to these domains if applicable): 
    ${config.urls.join('\n')}

    RESEARCH DEPTH: ${config.depth}

    OBJECTIVES:
    1. Analyze import/export volumes and trends for the selected industries in the target regions.
    2. Identify key trading partners, routes, and logistical bottlenecks.
    3. Assess market opportunities and risks.
    4. Provide quantitative data wherever possible (volumes, YoY growth, prices).
    5. Generate a dataset for visualizing the findings over the last 4-6 time periods (quarters or years).
    6. SEARCH FOR AND EXTRACT REAL TRADE DATA from the last 3 years using the Google Search tool.
       - DO NOT GENERATE SIMULATED OR "REALISTIC" DATA. USE ONLY REAL DATA FOUND IN SEARCH RESULTS.
       - Look for: Customs reports, Ministry of Commerce export statistics, USGS Mineral Commodity Summaries, UN Comtrade summaries, or industry market reports.
       - If row-level transaction data (specific dates/shipments) is unavailable (as it is often proprietary), provide the BEST AVAILABLE AGGREGATED DATA (e.g., Monthly exports to top destinations, or Yearly volumes).
       - Map found data to the 'tradeData' structure. 
       - If a field like "Port of Loading" is not in the found report, use "N/A" or the Country name.
       - If "HS Code" is not specified in the text, use the standard HS code for the commodity (e.g., 2511.10 for Barite).
       - Ensure the 'quantity' and 'totalValueUSD' are actual numbers found in your research.
       - CRITICAL: Include the specific 'sourceUrl' for each data row where you found this information.

    OUTPUT FORMAT:
    You must return a single valid JSON object. 
    DO NOT wrap the output in markdown code blocks (like \`\`\`json).
    DO NOT include any text outside the JSON object.
    
    The JSON structure must be exactly:
    {
      "executiveSummary": "A concise high-level overview (2-3 paragraphs).",
      "regionalAnalysis": [
        {
          "region": "Region Name",
          "content": "Detailed analysis for this region.",
          "stats": [ {"label": "Import Vol", "value": "1.2M Tons"} ]
        }
      ],
      "productBreakdown": "Analysis of specific product categories selected.",
      "trends": "Temporal trends, seasonality, growth rates.",
      "opportunities": "Strategic recommendations and market gaps.",
      "chartData": [
        { "name": "Q1 2024", "Import": 1200, "Export": 900 }
      ],
      "tradeData": [
        {
          "date": "2023-11-21",
          "hsCode": "25111020",
          "description": "BARITE POWDER PACKED IN 1.5 M.TON BAG",
          "destination": "United Arab Emirates",
          "portOfLoading": "KATTUPALLI",
          "unit": "KGS",
          "quantity": 270000,
          "totalValueUSD": 30147,
          "pricePerUnitUSD": 0.11,
          "sourceUrl": "https://example.com/report"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    let jsonText = response.text || "{}";

    // Clean up markdown if the model ignores the "no markdown" instruction
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse JSON response:", jsonText);
      // Provide a fallback structure so the UI doesn't crash completely
      data = {
        executiveSummary: "The analysis was generated but the format could not be processed automatically. Raw output available in console.",
        regionalAnalysis: [],
        productBreakdown: "Processing Error",
        trends: "Processing Error",
        opportunities: "Processing Error",
        chartData: [],
        tradeData: []
      };
    }

    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          return { title: chunk.web.title, uri: chunk.web.uri };
        }
        return null;
      })
      .filter((source: any) => source !== null);

    // Dedup sources
    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values()) as { title: string, uri: string }[];

    // Sanitize numeric fields to ensure the UI doesn't crash
    const sanitizedTradeData = (data.tradeData || []).map((row: any) => ({
      ...row,
      quantity: Number(row.quantity) || 0,
      totalValueUSD: Number(row.totalValueUSD) || 0,
      pricePerUnitUSD: Number(row.pricePerUnitUSD) || 0,
    }));

    const sanitizedChartData = (data.chartData || []).map((point: any) => {
      const sanitizedPoint = { ...point };
      if ('Import' in sanitizedPoint) sanitizedPoint.Import = Number(sanitizedPoint.Import) || 0;
      if ('Export' in sanitizedPoint) sanitizedPoint.Export = Number(sanitizedPoint.Export) || 0;
      if ('value' in sanitizedPoint) sanitizedPoint.value = Number(sanitizedPoint.value) || 0;
      return sanitizedPoint;
    });

    return {
      ...data,
      tradeData: sanitizedTradeData,
      chartData: sanitizedChartData,
      sources: uniqueSources,
      generatedAt: new Date().toISOString(),
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Check for specific API key leaked error
    if (error.status === 403 || (error.message && error.message.includes("API key was reported as leaked"))) {
      throw new Error("API_KEY_LEAKED");
    }

    // Check for quota exceeded error (429)
    if (error.status === 429 || (error.message && error.message.includes("quota"))) {
      throw new Error("QUOTA_EXCEEDED");
    }

    throw error;
  }
};
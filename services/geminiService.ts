import { GoogleGenAI } from "@google/genai";
import { ResearchConfig, ResearchReport } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateResearchReport = async (config: ResearchConfig): Promise<ResearchReport> => {
  const ai = initGenAI();
  
  // Construct a prompt that guides the model to perform "deep research"
  // We use gemini-3-pro-preview for complex reasoning and googleSearch for grounding.

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
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2048 },
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
        chartData: []
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
    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values()) as {title: string, uri: string}[];

    return {
      ...data,
      sources: uniqueSources,
      generatedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
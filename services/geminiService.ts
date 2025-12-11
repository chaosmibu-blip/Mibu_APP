import { GoogleGenerativeAI, Tool } from '@google/generative-ai';
import { GachaResponse, GroundingChunk } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

// Type declaration for process.env (injected by Vite)
declare const process: { env: { API_KEY?: string } };

// Safely initialize. If API_KEY is missing, it might throw later, but won't crash the module load.
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenerativeAI;

try {
  ai = new GoogleGenerativeAI(apiKey);
} catch (e) {
  console.error("Failed to initialize GoogleGenAI. Check API_KEY.", e);
}

export async function generateGachaItinerary(
  country: string,
  city: string,
  level: number,
  language: string,
  collectedNames: string[] = []
): Promise<{ data: GachaResponse; sources: GroundingChunk[] }> {
  
  if (!apiKey || !ai) {
    throw new Error("API Key is missing or invalid. Please check your settings.");
  }

  const tools: Tool[] = [
    { googleSearchRetrieval: {} } // Use Google Search for verification
  ];

  // We add a random seed aspect or instructions to avoid duplicates
  const avoidList = collectedNames.slice(-20).join(', '); // Only send last 20 to avoid token limits
  
  const prompt = `
    User Context:
    - Country: ${country}
    - City/District: ${city}
    - Intensity Level: ${level} (This determines quantity. 5 = ~3 items, 12 = ~7 items)
    - Language: ${language}
    - Avoid these recently collected places if possible: [${avoidList}]

    Task:
    Generate a JSON itinerary following the System Instructions. 
    Make sure to verify existence with Google Search.
    
    IMPORTANT: Return raw JSON only. Do not use Markdown formatting.
  `;

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: tools,
      generationConfig: {
        temperature: 0.9, // High creativity for Gacha
      }
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    let text = response.text();
    if (!text) {
      throw new Error("No response generated");
    }

    // Clean up markdown code blocks if present (Gemini often adds them even if asked not to)
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const data = JSON.parse(text) as GachaResponse;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { data, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}
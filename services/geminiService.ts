import { GoogleGenAI, Tool } from '@google/genai';
import { GachaResponse, GroundingChunk } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGachaItinerary(
  country: string,
  city: string,
  level: number,
  language: string,
  collectedNames: string[] = []
): Promise<{ data: GachaResponse; sources: GroundingChunk[] }> {
  
  const tools: Tool[] = [
    { googleSearch: {} } // Use Google Search for verification
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
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        tools: tools,
        temperature: 0.9, // High creativity for Gacha
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated");
    }

    const data = JSON.parse(text) as GachaResponse;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { data, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}
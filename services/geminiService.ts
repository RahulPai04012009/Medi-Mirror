import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes text symptoms and returns a structured assessment.
 */
export const analyzeSymptoms = async (symptoms: string) => {
  const ai = getAiClient();
  
  const prompt = `
    The patient describes the following symptoms: "${symptoms}".
    Analyze these symptoms and provide a JSON response with:
    1. A list of 1-3 likely conditions with severity (low, medium, high).
    2. A brief recommendation.
    3. A boolean indicating if they should see a doctor immediately.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  probability: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                }
              }
            },
            recommendation: { type: Type.STRING },
            seeDoctor: { type: Type.BOOLEAN }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Symptom analysis failed:", error);
    throw error;
  }
};

/**
 * Analyzes a wound image encoded in base64.
 */
export const analyzeWound = async (base64Image: string) => {
  const ai = getAiClient();

  // Remove data URL prefix if present for processing
  const base64Data = base64Image.split(',')[1] || base64Image;

  const prompt = `
    Analyze this image of a wound. 
    Provide a JSON assessment including:
    1. Redness level (Low/Medium/High)
    2. Infection probability (Percentage string)
    3. Healing stage description
    4. Boolean if urgent care is needed
    5. Short advice
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for multimodal analysis
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming jpeg for simplicity or detect from input
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            rednessLevel: { type: Type.STRING },
            infectionProbability: { type: Type.STRING },
            healingStage: { type: Type.STRING },
            urgentCareNeeded: { type: Type.BOOLEAN },
            advice: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Wound analysis failed:", error);
    throw error;
  }
};

/**
 * General health chat assistant.
 */
export const chatWithMedi = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  const ai = getAiClient();

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction: "You are Medi, a helpful and empathetic health assistant. Keep answers concise (under 100 words) and friendly. Always advise seeing a doctor for serious issues."
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat failed:", error);
    throw error;
  }
};
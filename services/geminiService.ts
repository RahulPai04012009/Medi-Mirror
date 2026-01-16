
import { GoogleGenAI, Type } from "@google/genai";
import { Place } from "../types";

// Initialize the client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

// --- EMERGENCY SAFETY PROTOCOL ---
export const EMERGENCY_KEYWORDS = [
  "chest pain", "heart attack", "can't breathe", "difficulty breathing",
  "suicide", "kill myself", "want to die", "crushing pain", 
  "left arm pain", "stroke", "face drooping", "slurred speech",
  "severe bleeding", "unconscious"
];

export const checkEmergencyKeywords = (text: string): boolean => {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(k => lower.includes(k));
};

/**
 * Enhanced search for nearby places with reasoning for doctors/medicines.
 */
export const mapSearchWithContext = async (
  query: string, 
  type: 'hospital' | 'pharmacy', 
  location: { lat: number; lng: number },
  appDoctors?: any[]
) => {
  const ai = getAiClient();
  
  // Provide app context to the model so it can resolve "Dr. Wilson" to "City Heart Center"
  const doctorContext = appDoctors 
    ? `Available Doctors in App: ${JSON.stringify(appDoctors.map(d => ({ name: d.name, hospital: d.hospital })))}` 
    : "";

  const systemInstruction = `
    You are an intelligent medical location assistant powered by Google Maps.
    
    CONTEXT:
    - User Location: ${location.lat}, ${location.lng}
    - App Doctors: ${doctorContext}
    - Search Type: ${type}
    
    YOUR GOAL is to interpret the user's intent and find the most medically appropriate physical locations using the googleMaps tool.

    LOGIC RULES:
    1. IF TYPE IS 'HOSPITAL':
       - **Symptom Analysis**: If the user inputs a SYMPTOM (e.g., "chest pain", "blurry vision", "broken arm"), DO NOT search for the symptom string. INFER the required medical SPECIALTY (e.g., "Cardiology", "Ophthalmology", "Orthopedics").
       - **Search Action**: Use the googleMaps tool to search for that SPECIFIC SPECIALTY or Department nearby (e.g., "Cardiology Hospital", "Eye Clinic", "Urgent Care").
       - **Doctor Lookup**: If the user searches for a doctor's name from the provided App Doctors list, find their specific workplace/hospital.
    
    2. IF TYPE IS 'PHARMACY':
       - **Medication Analysis**: If the user searches for a specific MEDICATION, identify if it requires a specific type of pharmacy (e.g., Compounding, 24-hour, or major chain).
       - **Search Action**: Search for pharmacies likely to stock this item. For common meds, prioritize nearest. For specific meds, prioritize larger chains or medical center pharmacies over convenience stores.
    
    3. RESPONSE:
       - Use the googleMaps tool to return the locations.
  `;

  const finalQuery = query.trim() === "" 
    ? (type === 'hospital' ? "Find top hospitals nearby" : "Find nearby pharmacies")
    : query;

  try {
    // Maps grounding is only supported in Gemini 2.5 series models.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search Type: ${type}. User Query: "${finalQuery}"`,
      config: {
        systemInstruction,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const textOutput = response.text || "";

    const places = chunks
      .map((chunk: any) => {
        const mapData = chunk.maps;
        if (mapData && mapData.title && mapData.uri) {
          // Attempt to extract lat/lng from the URI if possible
          const coordsMatch = mapData.uri.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
          const coords = coordsMatch ? {
            lat: parseFloat(coordsMatch[1]),
            lng: parseFloat(coordsMatch[2])
          } : undefined;

          let reason = "";
          
          if (type === 'hospital') {
            if (query.toLowerCase().includes("dr.")) {
               reason = "Doctor's Workplace";
            } else if (query.trim() !== "") {
               // Dynamic reason based on symptom inference (simplified for UI)
               reason = "Specialized Care";
            } else {
               reason = "General Hospital";
            }
          } else if (type === 'pharmacy') {
             if (query.trim() !== "") {
                reason = `Likely stocks ${query}`;
             } else {
                reason = "Pharmacy";
             }
          }

          return { 
            name: mapData.title, 
            uri: mapData.uri, 
            address: mapData.placeId || "Nearby",
            reason: reason,
            coords: coords
          } as Place;
        }
        return null;
      })
      .filter((p: any) => p !== null) as Place[];

    // Dedup
    const uniquePlaces = Array.from(new Map(places.map((p: any) => [p.uri, p])).values());

    return {
      text: textOutput,
      places: uniquePlaces
    };
  } catch (error) {
    console.error("Advanced map search failed:", error);
    throw error;
  }
};

// Existing analysis functions remain...
export const analyzeSymptoms = async (symptoms: string) => {
  const ai = getAiClient();
  const prompt = `Analyze: "${symptoms}". Provide a JSON response with:
  1. A list of potential conditions (be conservative, prioritize safety).
  2. A brief, simple explanation of what the primary condition is.
  3. A treatment/care plan (home remedies for minor issues, doctor referral for serious ones).
  4. A list of 2-3 generic over-the-counter medicines (strictly OTC, add disclaimer).
  5. The type of specialist doctor to see.
  6. 'seeDoctor': boolean. Set to true for severe/persistent symptoms.
  7. 'recommendation': One sentence summary of action.`;
  
  try {
    // Using gemini-3-flash-preview for basic text tasks with structured JSON output.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conditions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, probability: { type: Type.STRING }, severity: { type: Type.STRING } } } },
            explanation: { type: Type.STRING, description: "A simple 2-sentence explanation of the main condition." },
            treatment: { type: Type.STRING, description: "Brief home care advice or cure steps." },
            suggestedMedicines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of generic OTC medicines." },
            specialistType: { type: Type.STRING, description: "The type of doctor to visit." },
            recommendation: { type: Type.STRING },
            seeDoctor: { type: Type.BOOLEAN }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { throw e; }
};

export const analyzeWound = async (base64Image: string) => {
  const ai = getAiClient();
  const base64Data = base64Image.split(',')[1] || base64Image;
  try {
    // Using gemini-3-flash-preview for multimodal tasks with structured JSON output.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: base64Data } }, { text: "Analyze this medical image. Return JSON with: conditionName, description (brief), severity (Low/Medium/High), specialistType (doctor needed), rednessLevel, infectionProbability, healingStage, urgentCareNeeded, advice." }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conditionName: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING },
            specialistType: { type: Type.STRING },
            rednessLevel: { type: Type.STRING },
            infectionProbability: { type: Type.STRING },
            healingStage: { type: Type.STRING },
            urgentCareNeeded: { type: Type.BOOLEAN },
            advice: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { throw e; }
};

export const analyzeMood = async (base64Image: string) => {
  const ai = getAiClient();
  const base64Data = base64Image.split(',')[1] || base64Image;
  try {
    const prompt = `Analyze this selfie for general health and wellness indicators (non-diagnostic).
    Look for:
    - Fatigue (bags under eyes, drooping eyelids)
    - Stress (tension in jaw, forehead)
    - General Mood (smile, neutral, frown)
    - Physical Signs (pallor, flushing, dry skin)
    
    Return JSON with:
    - fatigueLevel (Low/Medium/High)
    - stressLevel (Low/Medium/High)
    - mood (string)
    - wellnessScore (1-10 integer)
    - insight (Short encouraging sentence)
    - physicalSigns (Array of strings)`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } }, 
          { text: prompt }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fatigueLevel: { type: Type.STRING },
            stressLevel: { type: Type.STRING },
            mood: { type: Type.STRING },
            wellnessScore: { type: Type.INTEGER },
            insight: { type: Type.STRING },
            physicalSigns: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { throw e; }
};

export const chatWithMedi = async (history: any[], newMessage: string) => {
  const ai = getAiClient();
  try {
    // Using gemini-3-flash-preview for general chat tasks.
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history,
      config: { systemInstruction: "You are Medi, a helpful health assistant. Provide concise, clear medical information based on user queries. If the user indicates a medical emergency, direct them to 911 immediately." }
    });
    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (e) { throw e; }
};

/**
 * Estimates calories burned for a specific activity, duration, and intensity.
 */
export const estimateActivityCalories = async (activityName: string, durationMinutes: number, intensity: string) => {
  const ai = getAiClient();
  const prompt = `
    Calculate estimated calories burned for a standard adult performing:
    Activity: ${activityName}
    Duration: ${durationMinutes} minutes
    Intensity: ${intensity}

    Return JSON with:
    1. calories (number)
    2. explanation (short string explaining the calculation factor used)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calories: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Calorie estimation failed:", e);
    // Fallback simple calculation if AI fails
    return { calories: durationMinutes * 5, explanation: "Estimation based on average METs (Offline Fallback)." };
  }
};

/**
 * Generates an insight/explanation for a specific health metric.
 */
export const getHealthInsight = async (metricName: string, recentValue: string, unit: string) => {
  const ai = getAiClient();
  const prompt = `
    Provide a short, 2-sentence health insight for the metric: "${metricName}".
    The user's recent value is: ${recentValue} ${unit}.
    Explain if this is generally typical (assuming average adult) or what it indicates.
    Keep it encouraging and medical but simple.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (e) {
    return `Tracking ${metricName} helps you understand your overall health trends.`;
  }
};

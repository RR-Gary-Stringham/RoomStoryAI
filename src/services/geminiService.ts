import { GoogleGenAI, Type } from "@google/genai";
import { AppState, RoomInventoryItem, ShotPlanItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeRoomImage(base64Image: string, roomType: string): Promise<{ inventory: RoomInventoryItem[], shotPlan: ShotPlanItem[] }> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this hotel room hero image. 
  Room Type: ${roomType}
  
  1. Identify all notable furniture, amenities, and design details.
  2. Propose a set of 6 additional "shots" (crops, close-ups, or alternate angles) that would help a traveler understand the room better.
  
  Return the analysis in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1]
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          inventory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["High", "Med", "Low"] },
                description: { type: Type.STRING }
              },
              required: ["label", "confidence"]
            }
          },
          shotPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING, enum: ["Clarity", "Luxury", "Amenity", "Texture", "Experience"] },
                description: { type: Type.STRING },
                instructions: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["High", "Med", "Low"] }
              },
              required: ["name", "purpose", "description", "instructions", "confidence"]
            }
          }
        },
        required: ["inventory", "shotPlan"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return {
    inventory: result.inventory || [],
    shotPlan: (result.shotPlan || []).map((s: any, i: number) => ({
      ...s,
      id: `shot-${i}`,
      included: true
    }))
  };
}

export async function generateShotImage(
  base64Hero: string, 
  shot: ShotPlanItem, 
  brandStyle: string,
  strictness: number
): Promise<string> {
  // Using gemini-2.5-flash-image for image editing/generation
  const model = "gemini-2.5-flash-image";
  
  const prompt = `Create a high-quality, realistic hotel room gallery shot based on the provided hero image.
  Shot Type: ${shot.name}
  Purpose: ${shot.purpose}
  Description: ${shot.description}
  Specific Instructions: ${shot.instructions}
  Brand Style: ${brandStyle}
  Strictness Level: ${strictness}/100 (High strictness means stay very close to the original image's details).
  
  The output must look like a professional photograph. Maintain consistent lighting, materials, and color palette from the hero image.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Hero.split(',')[1]
          }
        },
        { text: prompt }
      ]
    }
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  return imageUrl;
}

export async function generateCaption(base64Image: string, shotName: string): Promise<{ caption: string, altText: string }> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: `Generate a short, elegant marketing caption and an accessible alt text for this hotel room detail shot: "${shotName}".` },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1]
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          altText: { type: Type.STRING }
        },
        required: ["caption", "altText"]
      }
    }
  });

  return JSON.parse(response.text || '{"caption": "", "altText": ""}');
}

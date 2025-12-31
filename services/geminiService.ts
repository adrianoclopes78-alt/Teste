
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessedText } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processTextWithGemini = async (text: string, title: string): Promise<ProcessedText> => {
  // We process in chunks if the text is too long to stay within token limits and maintain quality
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following English text into Portuguese and provide a "Portuguese-adapted pronunciation" (phonetic approximation using PT-BR sounds). 
    Break the text into logical sentences or short phrases.
    
    Example: 
    Original: "Hello, how are you today?"
    Translation: "Olá, como você está hoje?"
    Phonetic: "Rélou, ráu ár iú tudêi?"

    Text to process:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING, description: "The original English sentence" },
                translation: { type: Type.STRING, description: "Portuguese translation" },
                phonetic: { type: Type.STRING, description: "Phonetic spelling adapted for Portuguese speakers" }
              },
              required: ["original", "translation", "phonetic"]
            }
          }
        },
        required: ["segments"]
      },
      systemInstruction: "You are an expert English-Portuguese language tutor specializing in pronunciation for Brazilians."
    }
  });

  const result = JSON.parse(response.text || '{"segments":[]}');
  return {
    segments: result.segments,
    title
  };
};

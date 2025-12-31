
import OpenAI from "openai";
import { ProcessedText } from "../types";

const openai = new OpenAI({
  apiKey: process.env.Open_aiKey || '',
  dangerouslyAllowBrowser: true // Required for client-side usage in Vite
});

export const processTextWithOpenAI = async (text: string, title: string): Promise<ProcessedText> => {
  // We process in chunks if the text is too long to stay within token limits and maintain quality
  // OpenAI GPT-4o-mini is a good cost-effective choice, or gpt-3.5-turbo
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert English-Portuguese language tutor specializing in pronunciation for Brazilians. Output JSON."
      },
      {
        role: "user",
        content: `Translate the following English text into Portuguese and provide a "Portuguese-adapted pronunciation" (phonetic approximation using PT-BR sounds). 
    Break the text into logical sentences or short phrases.
    
    Example: 
    Original: "Hello, how are you today?"
    Translation: "Olá, como você está hoje?"
    Phonetic: "Rélou, ráu ár iú tudêi?"

    Text to process:
    ${text}
    
    Return the result in the following JSON format:
    {
      "segments": [
        {
          "original": "The original English sentence",
          "translation": "Portuguese translation",
          "phonetic": "Phonetic spelling adapted for Portuguese speakers"
        }
      ]
    }`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content;
  const result = JSON.parse(content || '{"segments":[]}');
  
  return {
    segments: result.segments,
    title
  };
};

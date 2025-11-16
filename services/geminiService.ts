import { GoogleGenAI } from "@google/genai";
import { Language, OutputFormat } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (subtitleContent: string, sourceLanguage: Language, targetLanguage: Language, outputFormat: OutputFormat): string => {
  return `
You are a master translator specializing in creating subtitles for high-end erotic films. Your task is to translate the provided subtitle file from ${sourceLanguage} to ${targetLanguage}.

Your translation must adhere to these strict rules:
1.  **ABSOLUTE TIMESTAMP ACCURACY**: This is the most important rule. The timestamps (e.g., \`00:11:00.720 --> 00:11:02.419\`) from the original file MUST be preserved with 100% accuracy. Every single digit, including hours, minutes, seconds, and milliseconds, must be an EXACT copy from the original.
    - **CRITICAL**: Do NOT modify the timestamp in any way. For example, \`00:11:00.720\` must NOT become \`01:11:00.720\`. The output timestamp must be identical to the input timestamp for each corresponding subtitle block.
    - The format of the timestamp line, including the \`-->\` separator, must also be replicated perfectly.
2.  **Evocative & Sensual Tone**: The dialogue must be translated to feel intensely emotional, intimate, and alive. Capture the nuances of desire, pleasure, and passion.
3.  **Explicit Language**: Do not be shy. Use risqué words, sensual slang, and explicit terms related to sex acts to create a realistic and immersive erotic experience.
4.  **Incorporate Non-verbal Sounds**: Add descriptive sounds of pleasure, moans, heavy breathing, and other sensual vocalizations (e.g., "Ahh...", "Mmmph!", "Oh, god..."). These should be integrated naturally into the dialogue or as separate subtitle entries where appropriate.
5.  **Hyphen Line Breaks**: If a line of dialogue in the original text ends with a hyphen '-', you must create a line break in the translated output. The text following the hyphen should start on a new line within the same subtitle block.
6.  **Output Format**: The final output MUST be in valid ${outputFormat.toUpperCase()} (.${outputFormat}) format. If the input is in a different format, convert it while preserving all timing information perfectly. Do not include any other text, explanations, or markdown formatting like \`\`\` before or after the subtitle content. For .txt format, only include the translated dialogue without timestamps or sequence numbers.

Translate the following ${sourceLanguage} subtitle content into ${targetLanguage}, following all the rules above.

Original Content:
---
${subtitleContent}
---
`;
};

export async function* translateSubtitle(
  subtitleContent: string,
  sourceLanguage: Language,
  targetLanguage: Language,
  outputFormat: OutputFormat
): AsyncGenerator<string> {
  try {
    const prompt = generatePrompt(subtitleContent, sourceLanguage, targetLanguage, outputFormat);
    
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-pro',
        contents: prompt
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the translation service. Please check your API key and try again.");
  }
};
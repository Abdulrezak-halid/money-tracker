import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category, ParsedExpenseData } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? "";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = "gemini-2.0-flash";
const RESPONSE_MIME_TYPE = "application/json";
const TEMPERATURE = 0.1;

const parseExpenseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    amount: {
      type: Type.NUMBER,
      description: "The amount of money spent. Extract only the number (positive values only).",
    },
    description: {
      type: Type.STRING,
      description: "The name of the merchant, store, or item bought (e.g., A101, BIM, Trendyol).",
    },
    category: {
      type: Type.STRING,
      enum: Object.values(Category),
      description: "The most appropriate category for this expense from the available list.",
    },
  },
  required: ["amount", "description", "category"],
};

export const parseExpenseFromText = async (text: string): Promise<ParsedExpenseData | null> => {
  try {
    if (!text || !text.trim()) {
      return null;
    }

    if (!apiKey) {
      console.error("Gemini API key not configured");
      return null;
    }

    const prompt = `
      You are a smart financial assistant.
      Analyze the following text (which might be in Turkish or Arabic) and extract expense details.
      The currency is Turkish Lira (TL). Only extract realistic amounts (0-1,000,000 TL).
      
      Rules:
      - Extract the numeric amount as a positive number
      - If amount is invalid or missing, reject
      - If text is in Arabic, categorize correctly but preserve description language
      - Be strict about validation
      
      Input text: "${text.trim()}"
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: RESPONSE_MIME_TYPE,
        responseSchema: parseExpenseSchema,
        temperature: TEMPERATURE,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      return null;
    }

    const parsed = JSON.parse(jsonText) as ParsedExpenseData;
    
    // Validate parsed data
    if (!parsed.amount || parsed.amount <= 0 || parsed.amount > 1000000) {
      return null;
    }
    
    if (!parsed.description || !parsed.description.trim()) {
      return null;
    }
    
    if (!Object.values(Category).includes(parsed.category)) {
      return null;
    }

    return parsed;

  } catch (error) {
    console.error("Gemini parsing error:", error instanceof Error ? error.message : String(error));
    return null;
  }
};

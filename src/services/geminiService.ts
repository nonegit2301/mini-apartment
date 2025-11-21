import { GoogleGenAI, Type } from "@google/genai";

// Assumes API_KEY is set in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    response: {
      type: Type.STRING,
      description: 'A friendly, helpful, and conversational response to the user in Vietnamese.',
    },
    filters: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Identified filters from the user query. Only include if explicitly mentioned.',
      properties: {
        address: {
          type: Type.STRING,
          description: 'A location, district, or street mentioned by the user.',
        },
        minPrice: {
          type: Type.NUMBER,
          description: 'The minimum price mentioned by the user.',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'The maximum price mentioned by the user.',
        },
      },
    },
  },
  required: ['response'],
};

const systemInstruction = `You are a friendly and professional real estate assistant for a mini apartment rental app in Vietnam. Your goal is to help users find their ideal apartment.
- Communicate exclusively in Vietnamese.
- Keep your responses concise and natural.
- Analyze the user's message to identify key filtering criteria: location/address (địa chỉ), minimum price (giá từ), and maximum price (giá đến).
- If you identify any of these criteria, populate the 'filters' object in the JSON response.
- If the user's query is general or you cannot extract specific filters, return the 'filters' object as null.
- Always provide a helpful, conversational text response, regardless of whether you found filters or not. For example, if filters are found, confirm them with the user (e.g., "Ok, let's find apartments in District 1 under 10 million VND for you. I will apply these filters now."). If no filters are found, ask clarifying questions to help them (e.g., "I can help with that. What area are you interested in?").`;

export interface ChatbotResponse {
  response: string;
  filters?: {
    address?: string;
    minPrice?: number;
    maxPrice?: number;
  } | null;
}

export const getChatbotResponse = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], newMessage: string): Promise<ChatbotResponse> => {
    try {
        const fullHistory = [
            ...history,
            { role: 'user' as const, parts: [{ text: newMessage }] }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullHistory,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as ChatbotResponse;
        return parsedResponse;

    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return {
            response: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
            filters: null
        };
    }
};

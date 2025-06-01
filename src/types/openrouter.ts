export interface OpenRouterConfig {
  apiKey: string;
  siteUrl: string;
  siteName: string;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  id: string;
  choices: {
    delta: {
      content: string;
    };
    index: number;
    finish_reason: string | null;
  }[];
  created: number;
  model: string;
  object: string;
} 
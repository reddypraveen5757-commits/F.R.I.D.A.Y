export type AssistantLanguage = 'auto' | 'en' | 'te';

export type AssistantMode = 'concise' | 'technical' | 'companion';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface WeatherWidgetData {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  wind: string;
  forecast?: string;
}

export interface MathWidgetData {
  expression: string;
  result: string;
  steps?: string[];
}

export interface TranslationWidgetData {
  sourceText: string;
  sourceLang: string;
  translatedText: string;
  targetLang: string;
  transliteration?: string;
}

export interface TimeWidgetData {
  timezone: string;
  currentTime: string;
  date: string;
  utcOffset?: string;
}

export interface CodeWidgetData {
  language: string;
  title: string;
  code: string;
  explanation?: string;
}

export type WidgetData =
  | { type: 'weather'; data: WeatherWidgetData }
  | { type: 'math'; data: MathWidgetData }
  | { type: 'translation'; data: TranslationWidgetData }
  | { type: 'time'; data: TimeWidgetData }
  | { type: 'code'; data: CodeWidgetData };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  spokenText?: string;
  detectedLanguage?: 'en' | 'te';
  timestamp: number;
  widget?: WidgetData | null;
  suggestedActions?: string[];
  isStreaming?: boolean;
}

export interface VoiceSettings {
  autoSpeak: boolean;
  recognitionLanguage: 'auto' | 'te-IN' | 'en-US' | 'en-IN';
  preferredLanguage: AssistantLanguage;
  voiceURI: string | null;
  rate: number;
  pitch: number;
  volume: number;
  soundEffects: boolean;
  mode: AssistantMode;
}

export interface SystemTelemetry {
  neuralCore: string;
  speechSynthesis: string;
  speechRecognition: string;
  latency: string;
  quantumCoherence: string;
  istTime: string;
  utcTime: string;
}

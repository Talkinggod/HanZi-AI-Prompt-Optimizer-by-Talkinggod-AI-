export interface TokenCounts {
  original: number;
  optimized: number;
}

export interface HistoryItem {
  id: string;
  originalPrompt: string;
  negativePrompt?: string;
  optimizedPrompt: string;
  tokenCounts: TokenCounts;
  timestamp: string; // ISO string date
}

export interface LegalOptimizationSettings {
  formality: 'brief' | 'memorandum' | 'law-review';
  protectLatinTerms: boolean;
  enforceIrac: boolean;
  compressCitations: boolean;
}

export interface TechOptimizationSettings {
  audience: 'layman' | 'developer' | 'expert';
  codeStyle: 'inline' | 'fenced';
}

export interface FinanceOptimizationSettings {
  quantitativeFocus: boolean;
  riskAssessment: 'brief' | 'detailed';
}

export interface MedicalOptimizationSettings {
  anonymizePii: boolean;
  evidenceLevel: 'anecdotal' | 'case-study' | 'systematic-review';
}

export interface ArtOptimizationSettings {
  ideaInputType: 'concept' | 'image';
  targetGenerator: 'none' | 'midjourney' | 'dall-e-3' | 'sora';
  autoAppendParameters: boolean;
  artisticStyle: 'photorealistic' | 'impressionistic' | 'surrealist' | 'abstract' | 'manga';
  medium: 'oil-painting' | 'watercolor' | 'digital-art' | 'photograph' | 'sculpture';
  colorPaletteFocus: 'vibrant' | 'monochromatic' | 'pastel' | 'earth-tones';
}

export interface AdvancedSettings {
  targetModel: 'gemini' | 'claude' | 'deepseek' | 'llama' | 'grok' | 'openai';
  useXml: boolean;
  reasoningStrategy: 'none' | 'tree-of-thought' | 'rewoo' | 'chain-of-thought';
  useDspy: boolean;
  dspyOptimizationLevel: 'basic' | 'advanced' | 'expert';
}

export interface OptimizationSettings {
  hanziDensity: number; // 0-100
  industryGlossary: 'none' | 'tech' | 'finance' | 'medical' | 'law' | 'art';
  classicalMode: boolean;
  advanced: AdvancedSettings;
  legal?: LegalOptimizationSettings;
  tech?: TechOptimizationSettings;
  finance?: FinanceOptimizationSettings;
  medical?: MedicalOptimizationSettings;
  art?: ArtOptimizationSettings;
}

export interface PerformanceMetrics {
  latency: number; // in ms
  semanticFidelity: number; // mocked 0-1 scale
  instructionAdherence: number; // mocked 0-1 scale
}

export type OptimizationSuccess = {
  needsClarification: false;
  optimizedPrompt: string;
  originalTokens: number;
  optimizedTokens: number;
  startTime: number;
  originalPromptForHistory: string;
};

export type OptimizationClarification = {
  needsClarification: true;
  question: string;
  promptForClarification: string;
};

export type OptimizationResult = OptimizationSuccess | OptimizationClarification;
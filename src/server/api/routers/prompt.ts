import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { GoogleGenAI, Type, Content } from "@google/genai";
import { env } from "@/env";
import type { OptimizationResult } from '../../../types';
import { buildOptimizerSystemInstruction } from "../lib/prompts";

// --- Zod Schemas for Type-Safe Inputs ---
// These schemas ensure that the input to our tRPC procedures is valid.

const legalOptimizationSettingsSchema = z.object({
  formality: z.enum(['brief', 'memorandum', 'law-review']),
  protectLatinTerms: z.boolean(),
  enforceIrac: z.boolean(),
  compressCitations: z.boolean(),
});

const techOptimizationSettingsSchema = z.object({
  audience: z.enum(['layman', 'developer', 'expert']),
  codeStyle: z.enum(['inline', 'fenced']),
});

const financeOptimizationSettingsSchema = z.object({
  quantitativeFocus: z.boolean(),
  riskAssessment: z.enum(['brief', 'detailed']),
});

const medicalOptimizationSettingsSchema = z.object({
  anonymizePii: z.boolean(),
  evidenceLevel: z.enum(['anecdotal', 'case-study', 'systematic-review']),
});

const artOptimizationSettingsSchema = z.object({
  ideaInputType: z.enum(['concept', 'image']),
  targetGenerator: z.enum(['none', 'midjourney', 'dall-e-3', 'sora']),
  autoAppendParameters: z.boolean(),
  artisticStyle: z.enum(['photorealistic', 'impressionistic', 'surrealist', 'abstract', 'manga']),
  medium: z.enum(['oil-painting', 'watercolor', 'digital-art', 'photograph', 'sculpture']),
  colorPaletteFocus: z.enum(['vibrant', 'monochromatic', 'pastel', 'earth-tones']),
});

const advancedSettingsSchema = z.object({
  targetModel: z.enum(['gemini', 'claude', 'deepseek', 'llama', 'grok', 'openai']),
  useXml: z.boolean(),
  reasoningStrategy: z.enum(['none', 'tree-of-thought', 'rewoo', 'chain-of-thought']),
  useDspy: z.boolean(),
  dspyOptimizationLevel: z.enum(['basic', 'advanced', 'expert']),
});

const optimizationSettingsSchema = z.object({
  hanziDensity: z.number().min(0).max(100),
  industryGlossary: z.enum(['none', 'tech', 'finance', 'medical', 'law', 'art']),
  classicalMode: z.boolean(),
  advanced: advancedSettingsSchema,
  legal: legalOptimizationSettingsSchema.optional(),
  tech: techOptimizationSettingsSchema.optional(),
  finance: financeOptimizationSettingsSchema.optional(),
  medical: medicalOptimizationSettingsSchema.optional(),
  art: artOptimizationSettingsSchema.optional(),
});


// --- Gemini API Service (Now on the Server) ---
const ai = new GoogleGenAI({ apiKey: env.API_KEY });
const optimizerModel = 'gemini-2.5-flash';
const responseModel = 'gemini-2.5-flash';

const optimizerResponseSchema = {
    type: Type.OBJECT,
    properties: {
        clarificationNeeded: { type: Type.BOOLEAN },
        question: { type: Type.STRING, nullable: true },
        optimizedPrompt: { type: Type.STRING, nullable: true },
    },
    required: ['clarificationNeeded']
};


// --- tRPC Router ---
export const promptRouter = createTRPCRouter({
  optimize: publicProcedure
    .input(z.object({
      prompt: z.string(),
      negativePrompt: z.string().optional(),
      settings: optimizationSettingsSchema,
      imageInput: z.string().nullable(),
      useDspy: z.boolean(),
      originalPromptForHistory: z.string(),
    }))
    .mutation(async ({ input }): Promise<OptimizationResult> => {
      const startTime = performance.now();
      
      // DSPy path (mocked)
      if (input.useDspy) {
        console.log("Simulating DSPy backend call with settings:", input.settings.advanced);
        const delayMap = { basic: 2000, advanced: 5000, expert: 10000 };
        const delay = delayMap[input.settings.advanced.dspyOptimizationLevel];
        await new Promise(resolve => setTimeout(resolve, delay));
        const optimizedPrompt = `[DSPy ${input.settings.advanced.dspyOptimizationLevel} MOCK]\n「${input.prompt}」- 根据行业: ${input.settings.industryGlossary} 进行自动优化和机器学习提炼。`;
        const [originalTokensResponse, optimizedTokensResponse] = await Promise.all([
            ai.models.countTokens({ model: responseModel, contents: input.prompt }),
            ai.models.countTokens({ model: responseModel, contents: optimizedPrompt }),
        ]);
        const endTime = performance.now();
        return {
            needsClarification: false,
            optimizedPrompt,
            originalTokens: originalTokensResponse.totalTokens,
            optimizedTokens: optimizedTokensResponse.totalTokens,
            originalPromptForHistory: input.originalPromptForHistory,
            latency: Math.round(endTime - startTime),
        };
      }

      // Gemini Optimization Path
      const { systemInstruction, processedPrompt } = buildOptimizerSystemInstruction(input.settings, input.prompt, !!input.imageInput, input.negativePrompt);
      
      const content: Content[] | string = input.imageInput
        ? [{ parts: [{ text: processedPrompt || "Analyze this image and generate a descriptive, optimized prompt based on it." }, { inlineData: { mimeType: 'image/jpeg', data: input.imageInput } }] }]
        : processedPrompt;

      try {
        const optimizerResponse = await ai.models.generateContent({
            model: optimizerModel,
            contents: content,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: optimizerResponseSchema,
            }
        });
        
        const responseText = optimizerResponse.text?.trim();
        
        if (!responseText) {
            const finishReason = optimizerResponse.candidates?.[0]?.finishReason;
            if (finishReason === 'SAFETY') {
                throw new Error("The optimization was blocked by the API's safety filters. Please modify your prompt.");
            }
            throw new Error("Received an empty response from the optimization model. The model may have refused to answer.");
        }
        
        const jsonResponse = JSON.parse(responseText);

        if (jsonResponse.clarificationNeeded) {
            return {
                needsClarification: true,
                question: jsonResponse.question || "The model needs more information, but did not provide a specific question. Please rephrase your prompt with more detail.",
                promptForClarification: input.originalPromptForHistory,
            };
        }

        let optimizedPrompt = jsonResponse.optimizedPrompt || "";
        if (input.settings.industryGlossary === 'art' && input.settings.art) {
             const { art, negativePrompt } = input.settings;
             if (art.targetGenerator === 'midjourney' && negativePrompt?.trim()) {
                optimizedPrompt += ` --no ${negativePrompt}`;
            }
            if (art.autoAppendParameters && art.targetGenerator !== 'none') {
                switch (art.targetGenerator) {
                    case 'midjourney': optimizedPrompt += ` --ar 16:9 --style raw --s 250`; break;
                    case 'dall-e-3': optimizedPrompt += `, cinematic, high detail`; break;
                    case 'sora': optimizedPrompt += `, 4k, high quality, cinematic camera movement`; break;
                }
            }
        }

        const originalTextForTokenCount = (input.prompt || "") + (input.negativePrompt || "") + (input.imageInput ? " [IMAGE]" : "");
        const [originalTokensResponse, optimizedTokensResponse] = await Promise.all([
            ai.models.countTokens({ model: responseModel, contents: originalTextForTokenCount }),
            ai.models.countTokens({ model: responseModel, contents: optimizedPrompt }),
        ]);
        const endTime = performance.now();

        return {
            needsClarification: false,
            optimizedPrompt,
            originalTokens: originalTokensResponse.totalTokens,
            optimizedTokens: optimizedTokensResponse.totalTokens,
            originalPromptForHistory: input.originalPromptForHistory,
            latency: Math.round(endTime - startTime),
        };
      } catch (e) {
          if (e instanceof Error) {
            if (e.message.includes("SAFETY")) {
                 throw new Error("The optimization was blocked by the API's safety filters. Please modify your prompt.");
            }
            if (e instanceof SyntaxError) {
                console.error("Failed to parse JSON response from Gemini:", e);
                throw new Error("The optimization model returned an invalid format. Please try again.");
            }
          }
          console.error("An unexpected error occurred during optimization:", e);
          throw new Error("An unexpected error occurred. Please check the logs.");
      }
    }),

  getResponse: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      if (!input.prompt.trim()) {
        return { response: "" };
      }
      try {
        const response = await ai.models.generateContent({
            model: responseModel,
            contents: input.prompt
        });
        if (!response.text) {
             const finishReason = response.candidates?.[0]?.finishReason;
             if (finishReason === 'SAFETY') {
                throw new Error("The response was blocked by the API's safety filters.");
            }
        }
        return { response: response.text };
      } catch (e) {
          console.error("Error getting response from Gemini:", e);
          throw new Error("Failed to get response from the model.");
      }
    }),
});

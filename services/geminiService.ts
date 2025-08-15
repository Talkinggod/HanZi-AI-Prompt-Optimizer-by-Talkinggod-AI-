
import { GoogleGenAI, Type, Content, Part } from "@google/genai";
import type { OptimizationSettings, TechOptimizationSettings, FinanceOptimizationSettings, MedicalOptimizationSettings, ArtOptimizationSettings } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Dual-Model Architecture: Define models for specific roles.
const optimizerModel = 'gemini-2.5-flash'; // Fast, cheap model for optimization.
const responseModel = 'gemini-2.5-flash';  // Can be a more powerful model in a real scenario.

// --- Advanced Prompt Engineering Modules ---

const XML_TAG_PRESETS: { [key: string]: string } = {
  CLAUDE_FINANCE: `<report type="financial"><timeframe>quarterly</timeframe><sections>executive_summary,key_metrics,forecast</sections></report>`,
  CLAUDE_LEGAL: `<analysis context="legal"><jurisdiction>NY</jurisdiction><doctrine>summary_judgment</doctrine></analysis>`,
  DEEPSEEK_TECH: `<spec format="markdown"><components>architecture,apis,security</components></spec>`
};

function applyXMLTags(prompt: string, model: string, industry: string): string {
  const key = `${model.toUpperCase()}_${industry.toUpperCase()}`;
  const template = XML_TAG_PRESETS[key];
  if (template) {
    return `${template}\n${prompt}`;
  }
  return `<structured>${prompt}</structured>`;
}

const MODEL_OPTIMIZATION_RULES: { [key: string]: { preprocessor: (text: string) => string } } = {
  claude: {
    preprocessor: (text) => text.replace(/\. /g, '.\n<thinking>') + '</thinking>',
  },
  deepseek: {
    preprocessor: (text) => `REASONING TRACE:\n${text}\nFINAL CONCLUSION:`,
  },
  gemini: {
    preprocessor: (text) => `Let's think step-by-step:\n1. ${text}\nAnswer:`,
  },
  llama: { preprocessor: (text) => `[INST] ${text} [/INST]` },
  grok: { preprocessor: (text) => `[prompt]\n${text}\n[response]` },
};

function applyModelOptimization(prompt: string, model: string): string {
    const rule = MODEL_OPTIMIZATION_RULES[model as keyof typeof MODEL_OPTIMIZATION_RULES];
    return rule ? rule.preprocessor(prompt) : prompt;
}

const REASONING_MODULES: { [key: string]: (prompt: string) => string } = {
  'tree-of-thought': (prompt, branches = 3) => {
    let xml = '<tothoughts>\n';
    for (let i = 0; i < branches; i++) {
      xml += `<branch weight="${(1/(i+1)).toFixed(2)}">${prompt}?option${i+1}</branch>\n`;
    }
    return xml + '</tothoughts>';
  },
  'rewoo': (prompt) => `
    <rewoo>
      <planner>Break into: 1) Research 2) Analysis 3) Synthesis</planner>
      <worker tool="web_search">Context for: ${prompt}</worker>
      <solver>Combine evidence into final output</solver>
    </rewoo>
  `,
  'chain-of-thought': (prompt) => 
    `<cot>Step 1: Understand "${prompt}"\nStep 2: Analyze...\nStep 3: Conclude</cot>`
};

function applyReasoningModule(prompt: string, strategy: string): string {
    const module = REASONING_MODULES[strategy as keyof typeof REASONING_MODULES];
    return module ? module(prompt) : prompt;
}

// --- System Instructions ---

const COMMON_JSON_INSTRUCTION = `Your entire output MUST be a single JSON object.

If the user's prompt is ambiguous or lacks key details for a high-quality analysis, you MUST ask for clarification. Do this by setting 'clarificationNeeded' to true and providing a clear, direct question in the 'question' field.

If the prompt is clear, follow all rules strictly to create the optimized prompt. For a successful optimization, set 'clarificationNeeded' to false and provide the result in 'optimizedPrompt'. Your final JSON output must conform to the specified schema.`;

const buildBaseSystemInstruction = (settings: OptimizationSettings): string => `You are an expert in prompt engineering and linguistics, specializing in token optimization for Large Language Models. Your primary goal is to rephrase the user's prompt to be as concise as possible, thereby minimizing the token count, without losing any of the original prompt's intent or key information.
1.  **Preserve Intent:** The core meaning and all essential details of the original prompt must be fully retained.
2.  **Be Concise:** Aggressively eliminate redundant words, filler phrases, and conversational cruft.
3.  **Use Hanzi:** Substitute English words with Chinese Hanzi to save tokens. The target density for this substitution is roughly ${settings.hanziDensity}%. For example, at 50%, "A detailed step-by-step guide on how to bake a cake" might become "烘焙蛋糕的详细分步指南". At 100%, it could be 「蛋糕烘焙详解」.
${settings.classicalMode ? '4.  **Classical Mode Active:** Where appropriate, use classical Chinese idioms (Chengyu, e.g., 「一目了然」 for "user-friendly") and radical-level compression (e.g., 「美端面」 for "beautiful interface") for maximum conciseness and elegance.\n' : ''}`;

const buildTechSystemInstruction = (settings: OptimizationSettings): string => {
    const techSettings = settings.tech as TechOptimizationSettings;
    return `You are a senior staff software engineer and expert technical writer. Your task is to optimize a prompt for another AI, targeting a technical audience level of '${techSettings.audience}'.
${buildBaseSystemInstruction(settings)}
5.  **Technical Precision:** Use precise, unambiguous technical terms. Abbreviate common terms where appropriate (e.g., "database" -> "DB", "user interface" -> "UI").
6.  **Code Formatting:** Present code snippets using ${techSettings.codeStyle === 'inline' ? 'inline backticks' : 'fenced code blocks with language identifiers'}.
${COMMON_JSON_INSTRUCTION}`;
};

const buildFinanceSystemInstruction = (settings: OptimizationSettings): string => {
    const financeSettings = settings.finance as FinanceOptimizationSettings;
    return `You are a chartered financial analyst (CFA) specializing in concise reporting. Optimize this prompt for a financial context.
${buildBaseSystemInstruction(settings)}
${financeSettings.quantitativeFocus ? '5.  **Quantitative Focus:** Prioritize hard numbers, metrics, and data. Rephrase questions to demand quantifiable answers.\n' : ''}
6.  **Risk Assessment:** Frame requests to include a ${financeSettings.riskAssessment} analysis of risks, opportunities, and mitigation strategies. Use standard financial acronyms (e.g., "QoQ", "YoY", "CAGR").
${COMMON_JSON_INSTRUCTION}`;
};

const buildMedicalSystemInstruction = (settings: OptimizationSettings): string => {
    const medicalSettings = settings.medical as MedicalOptimizationSettings;
    return `You are a medical researcher and editor for a prestigious journal. Optimize this prompt for a medical or scientific context.
${buildBaseSystemInstruction(settings)}
${medicalSettings.anonymizePii ? '5.  **Anonymize PII:** You MUST aggressively remove or pseudonymize any potential Personally Identifiable Information (PII) from the prompt.\n' : ''}
6.  **Evidence Level:** The prompt should request information based on a specific level of evidence, such as '${medicalSettings.evidenceLevel}'. Use precise medical terminology (e.g., MeSH terms).
${COMMON_JSON_INSTRUCTION}`;
};


const buildLegalSystemInstruction = (settings: OptimizationSettings): string => {
    if (!settings.legal) return ''; // Should not happen if called correctly

    const { formality, protectLatinTerms, enforceIrac, compressCitations } = settings.legal;
    
    let instruction = `You are a paralegal expert system trained on Yale and Harvard Law principles and the LSAT. Your goal is to optimize legal text for conciseness and clarity while preserving its precise meaning and adhering to the highest academic and professional standards. The output formality should be consistent with a legal '${formality}'.

${COMMON_JSON_INSTRUCTION}

If the prompt is clear, follow these rules strictly to create the optimized prompt:
1.  **Preserve Core Legal Intent:** The core legal argument, facts, and questions must be perfectly retained.
2.  **Symbolic Logic (LSAT/Yale Style):** Replace common logical phrases with concise symbols:
    - "Therefore" → "∴"
    - "Because" or "since" → "∵"
    - "If and only if" → "iff"
    - "For all" or "for every" -> "∀"
    - "There exists" -> "∃"
    - "Summary Judgement" -> "∑J"
3.  **Standard Abbreviations:** Use common legal abbreviations after first use where appropriate (e.g., "Plaintiff" → "Pl.", "Defendant" → "Def.", "Section" → "§").
`;

    if (protectLatinTerms) {
        instruction += `4.  **Protect Legal Terms of Art:** Preserve exact terms from Black's Law Dictionary and other legal canons. Latin phrases (e.g., "res ipsa loquitur", "habeas corpus", "stare decisis", "mens rea") are sacrosanct and must not be altered or translated.\n`;
    }

    if (compressCitations) {
        instruction += `5.  **Citation Compression:** Compress legal citations using Bluebook short-form standards where applicable (e.g., "United States Code Title 42 Section 1983" → "42 U.S.C. § 1983"; subsequent citations like "Smith v. Jones, 123 F.3d 456, 460 (1999)" → "Smith, 123 F.3d at 460").\n`;
    }

    if (enforceIrac) {
        instruction += `6.  **Enforce IRAC Structure:** For any prompt containing a legal argument, you must reformat it into the IRAC (Issue, Rule, Analysis, Conclusion) structure. The output must be clearly delineated:
    [ISSUE] <Concise issue statement>
    [RULE] <Relevant legal rule(s)>
    [ANALYSIS] <Application of rule to facts, using symbolic logic>
    [CONCLUSION] <Brief outcome of the analysis>\n`;
    }
    return instruction;
}

const buildArtSystemInstruction = (settings: OptimizationSettings, hasImage: boolean): string => {
    if (!settings.art) return '';
    const artSettings = settings.art as ArtOptimizationSettings;
    const baseArtInstruction = `You are a world-renowned art director and prompt engineer for advanced AI image generators. Your task is to generate a new, highly-effective, and token-efficient prompt based on the user's input.
The final prompt must be a masterclass in descriptive language, suitable for the target generator: '${artSettings.targetGenerator}'.
It must incorporate the user's desired style of '${artSettings.artisticStyle}', medium of '${artSettings.medium}', and color palette of '${artSettings.colorPaletteFocus}'.
Use evocative adjectives, cinematic terms, and specific artistic details.
Also apply Hanzi substitutions for about ${settings.hanziDensity}% of the translatable terms to maximize token economy.`;

    if (hasImage) {
        return `
${baseArtInstruction}
You have been provided with an image. Your primary goal is to analyze the image and deconstruct its visual elements (subject, composition, lighting, mood, details).
Then, synthesize these observations with the user's optional text instructions and the specified creative controls to generate a new, optimized prompt that captures the essence of the image while adhering to the user's vision.
The user's text prompt should be treated as a set of override instructions or additional details to incorporate.
${COMMON_JSON_INSTRUCTION}`;
    } else {
        return `
${baseArtInstruction}
You have been provided with a text concept. Your goal is to expand this concept, enriching it with creative details, and then economize it into a powerful, concise prompt.
${COMMON_JSON_INSTRUCTION}`;
    }
};

const appendPlatformParameters = (prompt: string, settings: ArtOptimizationSettings): string => {
    if (!settings.autoAppendParameters || settings.targetGenerator === 'none') {
        return prompt;
    }
    switch (settings.targetGenerator) {
        case 'midjourney':
            return `${prompt} --ar 16:9 --style raw --s 250`;
        case 'dall-e-3':
            return `${prompt}, cinematic, high detail`;
        case 'sora':
             return `${prompt}, 4k, high quality, cinematic camera movement`;
        default:
            return prompt;
    }
}


const buildOptimizerSystemInstruction = (settings: OptimizationSettings, hasImage: boolean): string => {
    switch(settings.industryGlossary) {
        case 'tech':
            return buildTechSystemInstruction(settings);
        case 'finance':
            return buildFinanceSystemInstruction(settings);
        case 'medical':
            return buildMedicalSystemInstruction(settings);
        case 'law':
            return buildLegalSystemInstruction(settings);
        case 'art':
            return buildArtSystemInstruction(settings, hasImage);
        case 'none':
        default:
            return `${buildBaseSystemInstruction(settings)}\n${COMMON_JSON_INSTRUCTION}`;
    }
};

const optimizerResponseSchema = {
    type: Type.OBJECT,
    properties: {
        clarificationNeeded: { type: Type.BOOLEAN },
        question: { type: Type.STRING, nullable: true },
        optimizedPrompt: { type: Type.STRING, nullable: true },
    },
    required: ['clarificationNeeded']
};


/**
 * Optimizes a given prompt using the Gemini API with advanced settings.
 * @param originalPrompt The user's original prompt.
 * @param settings The user-configured optimization settings.
 * @param imageInput Optional base64 encoded image string.
 * @returns An object indicating if clarification is needed or containing the optimized prompt and token counts.
 */
export const optimizePromptWithGemini = async (originalPrompt: string, settings: OptimizationSettings, imageInput: string | null = null) => {
    
    // --- Advanced Prompt Engineering Pipeline ---
    let processedPrompt = originalPrompt;
    
    // 1. Apply XML tagging if enabled
    if (settings.advanced.useXml) {
        processedPrompt = applyXMLTags(processedPrompt, settings.advanced.targetModel, settings.industryGlossary);
    }
    
    // 2. Apply reasoning module
    if (settings.advanced.reasoningStrategy !== 'none') {
        processedPrompt = applyReasoningModule(processedPrompt, settings.advanced.reasoningStrategy);
    }
    
    // 3. Apply model-specific optimization
    processedPrompt = applyModelOptimization(processedPrompt, settings.advanced.targetModel);

    const systemInstruction = buildOptimizerSystemInstruction(settings, !!imageInput);
    
    const content: Content[] | string = imageInput
      ? [{
          parts: [
            { text: processedPrompt || "Analyze this image and generate a descriptive, optimized prompt based on it." },
            { inlineData: { mimeType: 'image/jpeg', data: imageInput } }
          ]
        }]
      : processedPrompt;

    const optimizerResponse = await ai.models.generateContent({
        model: optimizerModel,
        contents: content,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: optimizerResponseSchema,
            thinkingConfig: { thinkingBudget: 0 } // Faster response for this task
        }
    });
    
    let responseText = optimizerResponse.text.trim();
    if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7, responseText.length - 3).trim();
    }

    const jsonResponse = JSON.parse(responseText);

    if (jsonResponse.clarificationNeeded) {
        return {
            needsClarification: true,
            question: jsonResponse.question || "The model needs more information, but did not provide a specific question. Please rephrase your prompt with more detail.",
        };
    }

    let optimizedPrompt = jsonResponse.optimizedPrompt || "";
    
    // Append platform-specific parameters if in art mode
    if (settings.industryGlossary === 'art' && settings.art) {
        optimizedPrompt = appendPlatformParameters(optimizedPrompt, settings.art);
    }


    const originalTextForTokenCount = (originalPrompt || "") + (imageInput ? " [IMAGE]" : "");

    // Count tokens for both prompts in parallel for efficiency
    const [originalTokensResponse, optimizedTokensResponse] = await Promise.all([
        ai.models.countTokens({ model: responseModel, contents: originalTextForTokenCount }),
        ai.models.countTokens({ model: responseModel, contents: optimizedPrompt }),
    ]);

    return {
        needsClarification: false,
        optimizedPrompt,
        originalTokens: originalTokensResponse.totalTokens,
        optimizedTokens: optimizedTokensResponse.totalTokens,
    };
};

/**
 * Gets a streaming response from the Gemini API for a given prompt.
 * @param prompt The prompt to send to the model.
 * @returns A streaming response object.
 */
export const getResponseFromGeminiStream = async (prompt: string) => {
    const responseStream = await ai.models.generateContentStream({
        model: responseModel,
        contents: prompt
    });
    return responseStream;
};
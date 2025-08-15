import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { StatsDisplay } from './components/StatsDisplay';
import { OptimizedOutput } from './components/OptimizedOutput';
import { ResponseDisplay } from './components/ResponseDisplay';
import { ActionButtons } from './components/ActionButtons';
import { Footer } from './components/Footer';
import { ErrorDisplay } from './components/ErrorDisplay';
import { AdvancedPanel } from './components/AdvancedPanel';
import { PerformanceMetricsDisplay } from './components/PerformanceMetricsDisplay';
import { OptimizationSettings } from './components/OptimizationSettings';
import { RfqDialog } from './components/RfqDialog';
import { HistoryPanel } from './components/HistoryPanel';
import { optimizePromptWithGemini, getResponseFromGeminiStream } from './services/geminiService';
import type { TokenCounts, OptimizationSettings as OptimizationSettingsType, HistoryItem, PerformanceMetrics } from './types';

export default function App() {
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [imageInput, setImageInput] = useState<string | null>(null); // For base64 image
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [llmResponse, setLlmResponse] = useState<string>('');
  const [tokenCounts, setTokenCounts] = useState<TokenCounts>({ original: 0, optimized: 0 });
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoadingOptimization, setIsLoadingOptimization] = useState<boolean>(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const [settings, setSettings] = useState<OptimizationSettingsType>({
    hanziDensity: 30,
    industryGlossary: 'none',
    classicalMode: false,
    advanced: {
      targetModel: 'gemini',
      useXml: true,
      reasoningStrategy: 'none',
    },
    legal: {
      formality: 'brief',
      protectLatinTerms: true,
      enforceIrac: false,
      compressCitations: true,
    },
    tech: {
      audience: 'developer',
      codeStyle: 'fenced',
    },
    finance: {
      quantitativeFocus: true,
      riskAssessment: 'brief',
    },
    medical: {
      anonymizePii: true,
      evidenceLevel: 'systematic-review',
    },
    art: {
      ideaInputType: 'concept',
      targetGenerator: 'none',
      autoAppendParameters: true,
      artisticStyle: 'photorealistic',
      medium: 'digital-art',
      colorPaletteFocus: 'vibrant',
    },
  });

  const [rfq, setRfq] = useState<{
    active: boolean;
    question: string;
    promptForClarification: string;
  }>({ active: false, question: '', promptForClarification: '' });

  const handleOptimizationRequest = useCallback(async (promptToOptimize: string) => {
    const isArtImageMode = settings.industryGlossary === 'art' && settings.art?.ideaInputType === 'image';

    if (!promptToOptimize.trim() && !isArtImageMode) {
      setError('Please enter a prompt to optimize.');
      return;
    }
     if (isArtImageMode && !imageInput) {
      setError('Please upload an image to generate a prompt.');
      return;
    }

    setIsLoadingOptimization(true);
    setError(null);
    setOptimizedPrompt('');
    setLlmResponse('');
    setTokenCounts({ original: 0, optimized: 0 });
    setPerformanceMetrics(null);

    try {
      const startTime = performance.now();
      const result = await optimizePromptWithGemini(promptToOptimize, settings, isArtImageMode ? imageInput : null);
      const endTime = performance.now();
      
      if (result.needsClarification) {
        setRfq({ active: true, question: result.question, promptForClarification: promptToOptimize });
      } else {
        const newOptimizedPrompt = result.optimizedPrompt;
        const newTokenCounts = { original: result.originalTokens, optimized: result.optimizedTokens };

        setOptimizedPrompt(newOptimizedPrompt);
        setTokenCounts(newTokenCounts);
        setPerformanceMetrics({
          latency: Math.round(endTime - startTime),
          semanticFidelity: parseFloat((0.92 + Math.random() * 0.07).toFixed(3)), // Mocked value
          instructionAdherence: parseFloat((0.95 + Math.random() * 0.04).toFixed(3)), // Mocked value
        });
        
        if (originalPrompt !== promptToOptimize && !rfq.active) {
          setOriginalPrompt(promptToOptimize);
        }
        
        // Save to history
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          originalPrompt: promptToOptimize,
          optimizedPrompt: newOptimizedPrompt,
          tokenCounts: newTokenCounts,
          timestamp: new Date().toISOString(),
        };
        setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 50)); // Keep last 50
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during optimization.');
    } finally {
      setIsLoadingOptimization(false);
    }
  }, [settings, originalPrompt, rfq.active, imageInput]);

  const handleInitialOptimize = () => {
      handleOptimizationRequest(originalPrompt);
  };
  
  const handleClarificationSubmit = (clarification: string) => {
      const newPromptForOptimizer = `Original Prompt: "${rfq.promptForClarification}"\n\nMy Clarification: "${clarification}"`;
      setRfq({ active: false, question: '', promptForClarification: '' });
      handleOptimizationRequest(newPromptForOptimizer);
  };

  const handleGetResponse = useCallback(async () => {
    if (!optimizedPrompt.trim()) {
      setError('There is no optimized prompt to send.');
      return;
    }
    setIsLoadingResponse(true);
    setError(null);
    setLlmResponse('');

    try {
      const stream = await getResponseFromGeminiStream(optimizedPrompt);
      for await (const chunk of stream) {
        setLlmResponse((prev) => prev + chunk.text);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching the response.');
    } finally {
      setIsLoadingResponse(false);
    }
  }, [optimizedPrompt]);
  
  const handleSelectHistory = (item: HistoryItem) => {
    setOriginalPrompt(item.originalPrompt);
    setOptimizedPrompt(item.optimizedPrompt);
    setTokenCounts(item.tokenCounts);
    setLlmResponse('');
    setError(null);
    setPerformanceMetrics(null);
    setIsHistoryPanelOpen(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const isBusy = isLoadingOptimization || isLoadingResponse || rfq.active;
  
  const getPromptLabel = () => {
    if (settings.industryGlossary === 'art' && settings.art?.ideaInputType === 'concept') {
      return '1. Describe Your Concept or Idea';
    }
     if (settings.industryGlossary === 'art' && settings.art?.ideaInputType === 'image') {
      return '1. (Optional) Add Instructions for the Image';
    }
    return '1. Enter Your Original Prompt';
  }

  return (
    <div className={`min-h-screen bg-brand-darker text-brand-text font-sans ${isBusy || isHistoryPanelOpen ? 'overflow-hidden' : ''}`}>
      <Header onToggleHistory={() => setIsHistoryPanelOpen(true)} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <PromptInput
                label={getPromptLabel()}
                value={originalPrompt}
                onChange={(e) => setOriginalPrompt(e.target.value)}
                disabled={isBusy}
              />
              <AdvancedPanel 
                settings={settings.advanced}
                onSettingsChange={(newAdvancedSettings) => {
                  setSettings(s => ({ ...s, advanced: newAdvancedSettings }));
                }}
                disabled={isBusy}
              />
               <OptimizationSettings 
                settings={settings}
                onSettingsChange={setSettings}
                disabled={isBusy}
                imagePreview={imageInput}
                onImageChange={setImageInput}
              />
              <ActionButtons
                onOptimize={handleInitialOptimize}
                onGetResponse={handleGetResponse}
                isOptimizing={isLoadingOptimization}
                isGettingResponse={isLoadingResponse}
                isPromptEmpty={!originalPrompt.trim() && !(settings.industryGlossary === 'art' && settings.art?.ideaInputType === 'image' && imageInput)}
                isOptimizedPromptEmpty={!optimizedPrompt.trim()}
              />
              <ErrorDisplay error={error} />
            </div>

            <div className="space-y-6">
              <StatsDisplay tokenCounts={tokenCounts} />
              <PerformanceMetricsDisplay metrics={performanceMetrics} />
              <OptimizedOutput
                prompt={optimizedPrompt}
                isLoading={isLoadingOptimization}
              />
            </div>
          </div>

          <ResponseDisplay
            response={llmResponse}
            isLoading={isLoadingResponse}
          />
        </div>
      </main>
      <Footer />
      
      <RfqDialog
        isOpen={rfq.active}
        question={rfq.question}
        onSubmit={handleClarificationSubmit}
        onCancel={() => setRfq({ ...rfq, active: false })}
      />
      
      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        history={history}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
        onClose={() => setIsHistoryPanelOpen(false)}
      />
    </div>
  );
}
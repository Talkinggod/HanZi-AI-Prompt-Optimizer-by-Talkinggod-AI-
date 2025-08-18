import React, { useState } from 'react';
import type { OptimizationSettings as SettingsType, LegalOptimizationSettings, TechOptimizationSettings, ArtOptimizationSettings, AdvancedSettings } from '@/types/index';
import { IconCog, IconUpload, IconXCircle, IconCpuChip, IconCodeXml, IconLayers } from './IconComponents';

interface ConfigurationPanelProps {
    settings: SettingsType;
    onSettingsChange: (newSettings: SettingsType) => void;
    disabled: boolean;
    imagePreview: string | null;
    onImageChange: (base64Image: string | null) => void;
    onImageRemove: () => void;
}

type Tab = 'core' | 'industry' | 'middleware';

// --- Reusable UI Components (internal to this panel) ---

const Toggle: React.FC<{label: string, checked: boolean, onChange: (checked: boolean) => void, disabled: boolean, tooltip?: string}> = ({label, checked, onChange, disabled, tooltip}) => (
     <div className="flex items-center justify-between relative group">
        <span className="text-sm font-medium text-brand-subtle flex items-center">
            {label}
            {tooltip && <span className="ml-2 text-xs text-gray-500 cursor-help">(?)</span>}
        </span>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            disabled={disabled}
            className={`${checked ? 'bg-brand-accent' : 'bg-brand-darker'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed`}
            role="switch"
            aria-checked={checked}
        >
            <span aria-hidden="true" className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
        </button>
        {tooltip && (
            <div className="absolute z-10 bottom-full mb-2 -right-2 w-48 whitespace-normal px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {tooltip}
            </div>
        )}
    </div>
);

const RadioGroup: React.FC<{options: {value: string, label: string}[], selected: string, onChange: (value: string) => void, disabled: boolean}> = ({ options, selected, onChange, disabled }) => (
    <div className="flex flex-wrap items-center gap-2 rounded-md bg-brand-darker p-1">
        {options.map(option => (
             <button key={option.value} onClick={() => onChange(option.value)} disabled={disabled}
                className={`flex-1 text-center rounded py-1.5 px-3 text-sm font-medium transition-colors disabled:opacity-50 ${selected === option.value ? 'bg-brand-accent text-white shadow' : 'text-brand-subtle hover:bg-brand-dark'}`}>
                 {option.label}
             </button>
        ))}
    </div>
);

const commonSelectClass = "w-full p-2 bg-brand-darker border border-brand-dark rounded-md shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text disabled:opacity-50 disabled:cursor-not-allowed";

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ settings, onSettingsChange, disabled, imagePreview, onImageChange, onImageRemove }) => {
    const [activeTab, setActiveTab] = useState<Tab>('core');

    const handleSettingChange = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handleAdvancedSettingChange = <K extends keyof AdvancedSettings>(key: K, value: AdvancedSettings[K]) => {
        onSettingsChange({ ...settings, advanced: { ...settings.advanced, [key]: value } });
    };

    const handleNestedSettingChange = <C extends keyof Omit<SettingsType, 'advanced' | 'hanziDensity' | 'industryGlossary' | 'classicalMode' | 'symbolicLogic' | 'contextWindow' | 'outputFormat'>, K extends keyof NonNullable<SettingsType[C]>>(category: C, key: K, value: NonNullable<SettingsType[C]>[K]) => {
        onSettingsChange({ ...settings, [category]: { ...settings[category]!, [key]: value } });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                onImageChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const formalityMap: {[key: string]: LegalOptimizationSettings['formality']} = { '1': 'brief', '2': 'memorandum', '3': 'law-review' };
    const formalityValueMap: {[key in LegalOptimizationSettings['formality']]: string} = { 'brief': '1', 'memorandum': '2', 'law-review': '3' };

    const TabButton: React.FC<{tabId: Tab, label: string, icon: React.ReactNode}> = ({ tabId, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent ${activeTab === tabId ? 'bg-brand-accent text-white shadow-md' : 'text-brand-subtle bg-brand-dark hover:bg-brand-darker hover:text-brand-text'}`}
            role="tab"
            aria-selected={activeTab === tabId}
        >
            {icon}
            <span className="ml-2 hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="p-6 bg-brand-dark rounded-lg border border-brand-darker/70 shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Configure Optimization</h2>
            
            <div className="flex items-center gap-2 p-1 bg-brand-darker rounded-lg" role="tablist">
                <TabButton tabId="core" label="Core Settings" icon={<IconCog className="w-5 h-5"/>} />
                <TabButton tabId="industry" label="Industry Specific" icon={<IconLayers className="w-5 h-5"/>} />
                <TabButton tabId="middleware" label="Middleware" icon={<IconCpuChip className="w-5 h-5"/>} />
            </div>

            <div className="pt-4">
                {activeTab === 'core' && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-2">
                            <label htmlFor="hanzi-density" className="block text-sm font-medium text-brand-subtle">Hanzi Density: <span className="font-bold text-brand-accent">{settings.hanziDensity}%</span></label>
                            <input id="hanzi-density" type="range" min="0" max="100" step="1" value={settings.hanziDensity} onChange={(e) => handleSettingChange('hanziDensity', parseInt(e.target.value, 10))} disabled={disabled} className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="context-window" className="block text-sm font-medium text-brand-subtle mb-2">Context Window</label>
                                <select id="context-window" value={settings.contextWindow} onChange={(e) => handleSettingChange('contextWindow', e.target.value as SettingsType['contextWindow'])} disabled={disabled} className={commonSelectClass}>
                                    <option value="standard">Standard (4K+)</option>
                                    <option value="extended">Extended (32K+)</option>
                                    <option value="ultra">Ultra (100K+)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="output-format" className="block text-sm font-medium text-brand-subtle mb-2">Output Format</label>
                                <select id="output-format" value={settings.outputFormat} onChange={(e) => handleSettingChange('outputFormat', e.target.value as SettingsType['outputFormat'])} disabled={disabled} className={commonSelectClass}>
                                    <option value="plaintext">Plain Text</option>
                                    <option value="xml">XML</option>
                                    <option value="json">JSON</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 pt-2">
                            <Toggle label="Enable Classical Mode (Chengyu)" checked={settings.classicalMode} onChange={(checked) => handleSettingChange('classicalMode', checked)} disabled={disabled} />
                            <Toggle label="Symbolic Logic (∧∨¬)" checked={settings.symbolicLogic} onChange={(checked) => handleSettingChange('symbolicLogic', checked)} disabled={disabled} />
                        </div>
                    </div>
                )}
                {activeTab === 'industry' && (
                    <div className="space-y-4 animate-fadeIn">
                         <div>
                            <label htmlFor="industry-glossary" className="block text-sm font-medium text-brand-subtle mb-2">Industry Glossary</label>
                            <select id="industry-glossary" value={settings.industryGlossary} onChange={(e) => handleSettingChange('industryGlossary', e.target.value as SettingsType['industryGlossary'])} disabled={disabled} className={commonSelectClass}>
                                <option value="none">Default</option>
                                <option value="tech">Technology</option>
                                <option value="finance">Finance</option>
                                <option value="medical">Medical</option>
                                <option value="law">Law</option>
                                <option value="art">Art & Design</option>
                            </select>
                        </div>

                        {settings.industryGlossary === 'tech' && settings.tech && (
                             <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                                 <h4 className="text-sm font-semibold text-brand-accent">Technology Optimization</h4>
                                 <div>
                                    <label className="block text-sm font-medium text-brand-subtle mb-2">Target Audience</label>
                                    <RadioGroup options={[{value: 'developer', label: 'Developer'}, {value: 'business', label: 'Business'}, {value: 'general', label: 'General'}, {value: 'academic', label: 'Academic'}]} selected={settings.tech.audience} onChange={(v) => handleNestedSettingChange('tech', 'audience', v as TechOptimizationSettings['audience'])} disabled={disabled} />
                                </div>
                                 <Toggle label="Prefer Fenced Code Blocks" checked={settings.tech.preferFencedCodeBlocks} onChange={(checked) => handleNestedSettingChange('tech', 'preferFencedCodeBlocks', checked)} disabled={disabled} />
                             </div>
                        )}
                        {settings.industryGlossary === 'art' && settings.art && (
                             <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                                 <h4 className="text-sm font-semibold text-brand-accent">Art & Design Idea Generation</h4>
                                 <div className="space-y-2">
                                     <label className="block text-sm font-medium text-brand-subtle">Idea Input Type</label>
                                     <RadioGroup options={[{value: 'concept', label: 'Concept'}, {value: 'image', label: 'Image'}]} selected={settings.art.ideaInputType} onChange={(v) => handleNestedSettingChange('art', 'ideaInputType', v as 'concept' | 'image')} disabled={disabled}/>
                                 </div>

                                {settings.art.ideaInputType === 'image' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-brand-subtle">Upload Image</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-darker border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                {imagePreview ? (
                                                    <div className="relative group mx-auto">
                                                        <img src={`data:image/jpeg;base64,${imagePreview}`} alt="Image preview" className="h-24 w-auto rounded-md" />
                                                        <button onClick={onImageRemove} className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="Remove image"><IconXCircle className="w-5 h-5" /></button>
                                                    </div>
                                                ) : (<IconUpload className="mx-auto h-12 w-12 text-brand-subtle" />)}
                                                <div className="flex text-sm text-brand-subtle justify-center">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-dark rounded-md font-medium text-brand-accent hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-dark focus-within:ring-brand-accent px-1">
                                                        <span>{imagePreview ? 'Replace image' : 'Upload a file'}</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={disabled} />
                                                    </label>
                                                    {!imagePreview && <p className="pl-1">or drag and drop</p>}
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Other art settings... */}
                             </div>
                        )}
                        {/* Add other industry panels here similarly */}
                    </div>
                )}
                {activeTab === 'middleware' && (
                     <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="target-model" className="block text-sm font-medium text-brand-subtle mb-2">Target Model</label>
                                <select id="target-model" value={settings.advanced.targetModel} onChange={(e) => handleAdvancedSettingChange('targetModel', e.target.value as AdvancedSettings['targetModel'])} disabled={disabled} className={commonSelectClass}>
                                    <option value="gemini">Gemini</option>
                                    <option value="claude">Claude</option>
                                    <option value="openai">OpenAI (GPTs)</option>
                                    <option value="deepseek">DeepSeek</option>
                                    <option value="llama">Llama</option>
                                    <option value="grok">Grok</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="reasoning-strategy" className="block text-sm font-medium text-brand-subtle mb-2">Reasoning Strategy</label>
                                <select id="reasoning-strategy" value={settings.advanced.reasoningStrategy} onChange={(e) => handleAdvancedSettingChange('reasoningStrategy', e.target.value as AdvancedSettings['reasoningStrategy'])} disabled={disabled} className={commonSelectClass}>
                                    <option value="none">None</option>
                                    <option value="chain-of-thought">Chain-of-Thought</option>
                                    <option value="tree-of-thought">Tree-of-Thoughts</option>
                                    <option value="rewoo">ReWOO</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4 mt-2 border-t border-brand-darker/50 space-y-4">
                             <Toggle label="XML Structuring" checked={settings.advanced.useXml} onChange={(checked) => handleAdvancedSettingChange('useXml', checked)} disabled={disabled} tooltip="Add model-specific XML tags for precision, inspired by Anthropic's techniques." />
                             <Toggle label="Auto-Optimization (DSPy)" checked={settings.advanced.useDspy} onChange={(checked) => handleAdvancedSettingChange('useDspy', checked)} disabled={disabled} tooltip="Enable DSPy-based continuous prompt refinement. Requires a dedicated backend." />
                             {settings.advanced.useDspy && (
                                <div className="space-y-2 pl-4 border-l-2 border-brand-accent/50 ml-2">
                                    <label htmlFor="dspy-level" className="block text-sm font-medium text-brand-subtle">Optimization Level</label>
                                    <select id="dspy-level" value={settings.advanced.dspyOptimizationLevel} onChange={(e) => handleAdvancedSettingChange('dspyOptimizationLevel', e.target.value as AdvancedSettings['dspyOptimizationLevel'])} disabled={disabled} className={commonSelectClass}>
                                        <option value="basic">Basic (fast)</option>
                                        <option value="advanced">Advanced (slower)</option>
                                        <option value="expert">Expert (very slow)</option>
                                    </select>
                                </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
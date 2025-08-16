import React from 'react';
import type { AdvancedSettings } from '@/types';
import { IconCpuChip, IconCodeXml, IconLayers } from '@/components/IconComponents';

interface AdvancedPanelProps {
    settings: AdvancedSettings;
    onSettingsChange: (newSettings: AdvancedSettings) => void;
    disabled: boolean;
}

const Toggle: React.FC<{label: string, checked: boolean, onChange: (checked: boolean) => void, disabled: boolean, tooltip?: string}> = ({label, checked, onChange, disabled, tooltip}) => (
     <div className="flex items-center justify-between relative group">
        <span className="text-sm font-medium text-brand-subtle flex items-center">
            {label}
            {tooltip && <span className="ml-2 text-xs text-gray-500">(?)</span>}
        </span>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            disabled={disabled}
            className={`${
                checked ? 'bg-brand-accent' : 'bg-brand-darker'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed`}
            role="switch"
            aria-checked={checked}
        >
            <span
                aria-hidden="true"
                className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
        {tooltip && (
            <div className="absolute z-10 bottom-full mb-2 -right-2 w-48 whitespace-normal px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {tooltip}
            </div>
        )}
    </div>
);

const commonSelectClass = "w-full p-2 bg-brand-darker border border-brand-dark rounded-md shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text disabled:opacity-50 disabled:cursor-not-allowed";

export const AdvancedPanel: React.FC<AdvancedPanelProps> = ({ settings, onSettingsChange, disabled }) => {

    const handleSettingChange = <K extends keyof AdvancedSettings>(key: K, value: AdvancedSettings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="p-4 bg-brand-dark rounded-lg border border-brand-darker space-y-4">
            <h3 className="text-md font-semibold text-white flex items-center">
                <IconCpuChip className="w-5 h-5 mr-2 text-brand-subtle" />
                Prompt Middleware & Strategy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {/* Target Model */}
                <div className="space-y-2">
                    <label htmlFor="target-model" className="block text-sm font-medium text-brand-subtle">
                       Target Model
                    </label>
                    <select
                        id="target-model"
                        value={settings.targetModel}
                        onChange={(e) => handleSettingChange('targetModel', e.target.value as AdvancedSettings['targetModel'])}
                        disabled={disabled}
                        className={commonSelectClass}
                    >
                        <option value="gemini">Gemini</option>
                        <option value="claude">Claude</option>
                        <option value="openai">OpenAI (GPTs)</option>
                        <option value="deepseek">DeepSeek</option>
                        <option value="llama">Llama</option>
                        <option value="grok">Grok</option>
                    </select>
                </div>
                
                 {/* Reasoning Strategy */}
                <div className="space-y-2">
                    <label htmlFor="reasoning-strategy" className="block text-sm font-medium text-brand-subtle">
                        Reasoning Strategy
                    </label>
                    <select
                        id="reasoning-strategy"
                        value={settings.reasoningStrategy}
                        onChange={(e) => handleSettingChange('reasoningStrategy', e.target.value as AdvancedSettings['reasoningStrategy'])}
                        disabled={disabled}
                        className={commonSelectClass}
                    >
                        <option value="none">None</option>
                        <option value="chain-of-thought">Chain-of-Thought</option>
                        <option value="tree-of-thought">Tree-of-Thoughts</option>
                        <option value="rewoo">ReWOO</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 mt-2 border-t border-brand-darker/50 space-y-4">
                 <Toggle 
                    label="XML Structuring"
                    checked={settings.useXml}
                    onChange={(checked) => handleSettingChange('useXml', checked)}
                    disabled={disabled}
                    tooltip="Add model-specific XML tags for precision, inspired by Anthropic's techniques."
                />
                 <Toggle 
                    label="Auto-Optimization (DSPy)"
                    checked={settings.useDspy}
                    onChange={(checked) => handleSettingChange('useDspy', checked)}
                    disabled={disabled}
                    tooltip="Enable DSPy-based continuous prompt refinement. Requires a dedicated backend."
                />
                 {settings.useDspy && (
                    <div className="space-y-2 pl-4 border-l-2 border-brand-accent/50 ml-2">
                        <label htmlFor="dspy-level" className="block text-sm font-medium text-brand-subtle">
                            Optimization Level
                        </label>
                        <select
                            id="dspy-level"
                            value={settings.dspyOptimizationLevel}
                            onChange={(e) => handleSettingChange('dspyOptimizationLevel', e.target.value as AdvancedSettings['dspyOptimizationLevel'])}
                            disabled={disabled}
                            className={commonSelectClass}
                        >
                            <option value="basic">Basic (fast)</option>
                            <option value="advanced">Advanced (slower)</option>
                            <option value="expert">Expert (very slow)</option>
                        </select>
                    </div>
                 )}
            </div>
        </div>
    );
};
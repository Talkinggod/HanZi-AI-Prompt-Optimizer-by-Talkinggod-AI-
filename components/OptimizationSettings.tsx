import React from 'react';
import type { OptimizationSettings as SettingsType, LegalOptimizationSettings, TechOptimizationSettings, FinanceOptimizationSettings, MedicalOptimizationSettings, ArtOptimizationSettings } from '../types';
import { IconCog, IconUpload, IconXCircle } from './IconComponents';

interface OptimizationSettingsProps {
    settings: SettingsType;
    onSettingsChange: (newSettings: SettingsType) => void;
    disabled: boolean;
    imagePreview: string | null;
    onImageChange: (base64Image: string | null) => void;
    onImageRemove: () => void;
}

type NestedSettingsKey = 'legal' | 'tech' | 'finance' | 'medical' | 'art';

const Toggle: React.FC<{label: string, checked: boolean, onChange: (checked: boolean) => void, disabled: boolean}> = ({label, checked, onChange, disabled}) => (
     <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brand-subtle">
            {label}
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
    </div>
);


export const OptimizationSettings: React.FC<OptimizationSettingsProps> = ({ settings, onSettingsChange, disabled, imagePreview, onImageChange, onImageRemove }) => {
    const handleSettingChange = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const handleNestedSettingChange = <
        C extends NestedSettingsKey,
        K extends keyof NonNullable<SettingsType[C]>
    >(
        category: C,
        key: K,
        value: NonNullable<SettingsType[C]>[K]
    ) => {
        onSettingsChange({
            ...settings,
            [category]: {
                ...settings[category]!,
                [key]: value
            }
        });
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
    
    const techAudienceMap: {[key: string]: TechOptimizationSettings['audience']} = { '1': 'layman', '2': 'developer', '3': 'expert' };
    const techAudienceValueMap: {[key in TechOptimizationSettings['audience']]: string} = { 'layman': '1', 'developer': '2', 'expert': '3' };

    const medicalEvidenceMap: {[key: string]: MedicalOptimizationSettings['evidenceLevel']} = { '1': 'anecdotal', '2': 'case-study', '3': 'systematic-review' };
    const medicalEvidenceValueMap: {[key in MedicalOptimizationSettings['evidenceLevel']]: string} = { 'anecdotal': '1', 'case-study': '2', 'systematic-review': '3' };

    const commonSelectClass = "w-full p-2 bg-brand-darker border border-brand-dark rounded-md shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text disabled:opacity-50 disabled:cursor-not-allowed";
    
    const RadioGroup: React.FC<{options: {value: string, label: string}[], selected: string, onChange: (value: string) => void}> = ({ options, selected, onChange }) => (
        <div className="flex items-center gap-2 rounded-md bg-brand-darker p-1">
            {options.map(option => (
                 <button key={option.value} onClick={() => onChange(option.value)} disabled={disabled}
                    className={`flex-1 text-center rounded py-1.5 text-sm font-medium transition-colors disabled:opacity-50
                        ${selected === option.value ? 'bg-brand-accent text-white shadow' : 'text-brand-subtle hover:bg-brand-dark'}`}>
                     {option.label}
                 </button>
            ))}
        </div>
    );

    return (
        <div className="p-4 bg-brand-dark rounded-lg border border-brand-darker space-y-4">
            <h3 className="text-md font-semibold text-white flex items-center">
                <IconCog className="w-5 h-5 mr-2 text-brand-subtle" />
                Advanced Optimization Settings
            </h3>

            {/* Hanzi Density Slider */}
            <div className="space-y-2">
                <label htmlFor="hanzi-density" className="block text-sm font-medium text-brand-subtle">
                    Hanzi Density: <span className="font-bold text-brand-accent">{settings.hanziDensity}%</span>
                </label>
                <input
                    id="hanzi-density"
                    type="range" min="0" max="100" step="5"
                    value={settings.hanziDensity}
                    onChange={(e) => handleSettingChange('hanziDensity', parseInt(e.target.value, 10))}
                    disabled={disabled}
                    className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

            {/* Industry Glossary Dropdown */}
            <div className="space-y-2">
                <label htmlFor="industry-glossary" className="block text-sm font-medium text-brand-subtle">
                    Industry Glossary
                </label>
                <select
                    id="industry-glossary"
                    value={settings.industryGlossary}
                    onChange={(e) => handleSettingChange('industryGlossary', e.target.value as SettingsType['industryGlossary'])}
                    disabled={disabled}
                    className={commonSelectClass}
                >
                    <option value="none">Default</option>
                    <option value="tech">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="medical">Medical</option>
                    <option value="law">Law</option>
                    <option value="art">Art & Design</option>
                </select>
            </div>
            
            <Toggle
                label="Enable Classical Mode (Chengyu)"
                checked={settings.classicalMode}
                onChange={(checked) => handleSettingChange('classicalMode', checked)}
                disabled={disabled}
             />
            
            {/* --- Context-Aware Settings Panels --- */}

            {settings.industryGlossary === 'tech' && settings.tech && (
                 <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                     <h4 className="text-sm font-semibold text-brand-accent">Technology Optimization</h4>
                     <div className="space-y-2">
                        <label htmlFor="tech-audience" className="block text-sm font-medium text-brand-subtle">
                           Target Audience: <span className="font-bold text-brand-text capitalize">{settings.tech.audience}</span>
                        </label>
                        <input id="tech-audience" type="range" min="1" max="3" step="1" value={techAudienceValueMap[settings.tech.audience]} onChange={(e) => handleNestedSettingChange('tech', 'audience', techAudienceMap[e.target.value])} disabled={disabled} className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50" />
                    </div>
                     <Toggle label="Prefer Fenced Code Blocks" checked={settings.tech.codeStyle === 'fenced'} onChange={(checked) => handleNestedSettingChange('tech', 'codeStyle', checked ? 'fenced' : 'inline')} disabled={disabled} />
                 </div>
            )}

            {settings.industryGlossary === 'finance' && settings.finance && (
                 <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                     <h4 className="text-sm font-semibold text-brand-accent">Finance Optimization</h4>
                     <div className="space-y-2">
                        <label htmlFor="risk-assessment" className="block text-sm font-medium text-brand-subtle">
                           Risk Assessment: <span className="font-bold text-brand-text capitalize">{settings.finance.riskAssessment}</span>
                        </label>
                        <input id="risk-assessment" type="range" min="1" max="2" step="1" value={settings.finance.riskAssessment === 'brief' ? '1' : '2'} onChange={(e) => handleNestedSettingChange('finance', 'riskAssessment', e.target.value === '1' ? 'brief' : 'detailed')} disabled={disabled} className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50" />
                    </div>
                     <Toggle label="Quantitative Focus" checked={settings.finance.quantitativeFocus} onChange={(checked) => handleNestedSettingChange('finance', 'quantitativeFocus', checked)} disabled={disabled} />
                 </div>
            )}

            {settings.industryGlossary === 'medical' && settings.medical && (
                 <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                     <h4 className="text-sm font-semibold text-brand-accent">Medical Optimization</h4>
                      <div className="space-y-2">
                        <label htmlFor="evidence-level" className="block text-sm font-medium text-brand-subtle">
                           Evidence Level: <span className="font-bold text-brand-text capitalize">{settings.medical.evidenceLevel.replace('-', ' ')}</span>
                        </label>
                        <input id="evidence-level" type="range" min="1" max="3" step="1" value={medicalEvidenceValueMap[settings.medical.evidenceLevel]} onChange={(e) => handleNestedSettingChange('medical', 'evidenceLevel', medicalEvidenceMap[e.target.value])} disabled={disabled} className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50" />
                    </div>
                     <Toggle label="Anonymize PII" checked={settings.medical.anonymizePii} onChange={(checked) => handleNestedSettingChange('medical', 'anonymizePii', checked)} disabled={disabled} />
                 </div>
            )}

            {settings.industryGlossary === 'law' && settings.legal && (
                <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                     <h4 className="text-sm font-semibold text-brand-accent">Legal Optimization</h4>
                     <div className="space-y-2">
                        <label htmlFor="formality-level" className="block text-sm font-medium text-brand-subtle">
                           Formality Level: <span className="font-bold text-brand-text capitalize">{settings.legal.formality.replace('-', ' ')}</span>
                        </label>
                        <input id="formality-level" type="range" min="1" max="3" step="1" value={formalityValueMap[settings.legal.formality]} onChange={(e) => handleNestedSettingChange('legal', 'formality', formalityMap[e.target.value])} disabled={disabled} className="w-full h-2 bg-brand-darker rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50" />
                    </div>
                    <Toggle label="Protect Latin Terms" checked={settings.legal.protectLatinTerms} onChange={(checked) => handleNestedSettingChange('legal', 'protectLatinTerms', checked)} disabled={disabled} />
                    <Toggle label="Enforce IRAC Structure" checked={settings.legal.enforceIrac} onChange={(checked) => handleNestedSettingChange('legal', 'enforceIrac', checked)} disabled={disabled} />
                    <Toggle label="Compress Citations" checked={settings.legal.compressCitations} onChange={(checked) => handleNestedSettingChange('legal', 'compressCitations', checked)} disabled={disabled} />
                </div>
            )}

            {settings.industryGlossary === 'art' && settings.art && (
                 <div className="pt-4 mt-4 border-t border-brand-darker/50 space-y-4">
                     <h4 className="text-sm font-semibold text-brand-accent">Art & Design Idea Generation</h4>
                     <div className="space-y-2">
                         <label className="block text-sm font-medium text-brand-subtle">Idea Input Type</label>
                         <RadioGroup options={[{value: 'concept', label: 'Concept'}, {value: 'image', label: 'Image'}]} selected={settings.art.ideaInputType} onChange={(v) => handleNestedSettingChange('art', 'ideaInputType', v as 'concept' | 'image')} />
                     </div>

                    {settings.art.ideaInputType === 'image' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-brand-subtle">Upload Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-darker border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {imagePreview ? (
                                        <div className="relative group mx-auto">
                                            <img src={`data:image/jpeg;base64,${imagePreview}`} alt="Image preview" className="h-24 w-auto rounded-md" />
                                            <button 
                                                onClick={onImageRemove}
                                                className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                                aria-label="Remove image"
                                            >
                                                <IconXCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <IconUpload className="mx-auto h-12 w-12 text-brand-subtle" />
                                    )}
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

                     <div className="space-y-2">
                        <label htmlFor="art-generator" className="block text-sm font-medium text-brand-subtle">Target Generator</label>
                        <select id="art-generator" value={settings.art.targetGenerator} onChange={(e) => handleNestedSettingChange('art', 'targetGenerator', e.target.value as ArtOptimizationSettings['targetGenerator'])} disabled={disabled} className={commonSelectClass}>
                            <option value="none">Generic / None</option>
                            <option value="midjourney">Midjourney</option>
                            <option value="dall-e-3">DALL-E 3</option>
                            <option value="sora">Sora</option>
                        </select>
                     </div>
                      <Toggle label="Auto-append platform parameters" checked={settings.art.autoAppendParameters} onChange={(checked) => handleNestedSettingChange('art', 'autoAppendParameters', checked)} disabled={disabled || settings.art.targetGenerator === 'none'} />

                    <h4 className="text-sm font-semibold text-brand-accent pt-4 border-t border-brand-darker/50">Creative Controls</h4>
                     <div className="space-y-2">
                        <label htmlFor="art-style" className="block text-sm font-medium text-brand-subtle">Artistic Style</label>
                        <select id="art-style" value={settings.art.artisticStyle} onChange={(e) => handleNestedSettingChange('art', 'artisticStyle', e.target.value as ArtOptimizationSettings['artisticStyle'])} disabled={disabled} className={commonSelectClass}>
                            <option value="photorealistic">Photorealistic</option>
                            <option value="impressionistic">Impressionistic</option>
                            <option value="surrealist">Surrealist</option>
                            <option value="abstract">Abstract</option>
                            <option value="manga">Manga</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label htmlFor="art-medium" className="block text-sm font-medium text-brand-subtle">Medium</label>
                        <select id="art-medium" value={settings.art.medium} onChange={(e) => handleNestedSettingChange('art', 'medium', e.target.value as ArtOptimizationSettings['medium'])} disabled={disabled} className={commonSelectClass}>
                            <option value="digital-art">Digital Art</option>
                            <option value="oil-painting">Oil Painting</option>
                            <option value="watercolor">Watercolor</option>
                            <option value="photograph">Photograph</option>
                            <option value="sculpture">Sculpture</option>
                        </select>
                     </div>
                    <div className="space-y-2">
                        <label htmlFor="art-palette" className="block text-sm font-medium text-brand-subtle">Color Palette Focus</label>
                        <select id="art-palette" value={settings.art.colorPaletteFocus} onChange={(e) => handleNestedSettingChange('art', 'colorPaletteFocus', e.target.value as ArtOptimizationSettings['colorPaletteFocus'])} disabled={disabled} className={commonSelectClass}>
                            <option value="vibrant">Vibrant</option>
                            <option value="monochromatic">Monochromatic</option>
                            <option value="pastel">Pastel</option>
                            <option value="earth-tones">Earth Tones</option>
                        </select>
                    </div>
                 </div>
            )}
        </div>
    );
};
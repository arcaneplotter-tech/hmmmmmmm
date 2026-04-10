import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Zap, Type, Scaling, Square, Maximize, Eye, Box, Layers, Baseline, Sparkles } from 'lucide-react';
import { UICustomization, AppTheme } from '../types';
import { getArcaneStyles } from '../utils/arcaneThemes';

interface UICustomizationModalProps {
  uiCustomization: UICustomization;
  setUICustomization: (config: UICustomization) => void;
  onClose: () => void;
  theme: AppTheme;
  onUpdateTheme?: (t: Partial<AppTheme>) => void;
}

export const UICustomizationModal: React.FC<UICustomizationModalProps> = ({
  uiCustomization,
  setUICustomization,
  onClose,
  theme,
  onUpdateTheme
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isArcane = theme.visualStyle === 'arcane';

  const arcane = isArcane 
    ? getArcaneStyles(theme.accentColor) 
    : { border: 'border-slate-100 dark:border-slate-800', glow: '', text: 'text-slate-800 dark:text-slate-200', bg: 'bg-slate-50 dark:bg-slate-800/50', accent: 'bg-indigo-500', accentText: 'text-indigo-500', card: '', button: '', iconGlow: '' };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUICustomization({ ...uiCustomization, customFontUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFont = () => {
    setUICustomization({ ...uiCustomization, customFontUrl: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`brutal-modal w-full max-w-md p-6 rounded-[2.5rem] space-y-6 max-h-[90vh] overflow-y-auto border-2 transition-all duration-500 ${isArcane ? `bg-slate-950 ${arcane.border} ${arcane.glow}` : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
      >
        <div className={`flex items-center justify-between sticky top-0 py-2 z-10 backdrop-blur-md ${isArcane ? 'bg-slate-950/80' : 'bg-white/80 dark:bg-slate-900/80'}`}>
          <h3 className={`text-sm font-black uppercase tracking-widest transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-800 dark:text-slate-200'}`}>UI Customization</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors no-hat">
            <X className={`w-5 h-5 ${isArcane ? arcane.text : 'text-slate-600 dark:text-slate-400'}`} />
          </button>
        </div>

        <div className="space-y-6">
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3">
              <Zap className={`w-5 h-5 ${isArcane ? arcane.text : 'text-emerald-500'}`} />
              <div className="flex flex-col">
                <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Performance Mode</span>
                <span className="text-[10px] text-slate-500">Reduces animations for weak devices</span>
              </div>
            </div>
            <button
              onClick={() => setUICustomization({ ...uiCustomization, performanceMode: !uiCustomization.performanceMode })}
              className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer no-hat ${uiCustomization.performanceMode ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-emerald-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
            >
              <motion.div
                animate={{ x: uiCustomization.performanceMode ? 26 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3">
              <Sparkles className={`w-5 h-5 ${isArcane ? arcane.text : 'text-amber-500'}`} />
              <div className="flex flex-col">
                <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Optimization Mode</span>
                <span className="text-[10px] text-slate-500">Maximum performance: removes blurs, shadows, and heavy effects but keeps animations</span>
              </div>
            </div>
            <button
              onClick={() => setUICustomization({ ...uiCustomization, optimizationMode: !uiCustomization.optimizationMode })}
              className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer no-hat ${uiCustomization.optimizationMode ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-amber-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
            >
              <motion.div
                animate={{ x: uiCustomization.optimizationMode ? 26 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          <div className={`space-y-3 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Layers className={`w-5 h-5 ${isArcane ? arcane.text : 'text-blue-500'}`} />
                <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Dynamic Background</span>
              </div>
              <button
                onClick={() => setUICustomization({ ...uiCustomization, dynamicBackgroundEnabled: !uiCustomization.dynamicBackgroundEnabled })}
                className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer no-hat ${uiCustomization.dynamicBackgroundEnabled ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-blue-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                <motion.div
                  animate={{ x: uiCustomization.dynamicBackgroundEnabled ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            {uiCustomization.dynamicBackgroundEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
                  <span>Intensity</span>
                  <span>{(uiCustomization.dynamicBackgroundIntensity * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1" step="0.05"
                  value={isNaN(uiCustomization.dynamicBackgroundIntensity) ? 1.0 : uiCustomization.dynamicBackgroundIntensity}
                  onChange={(e) => setUICustomization({ ...uiCustomization, dynamicBackgroundIntensity: parseFloat(e.target.value) })}
                  className={`w-full ${isArcane ? 'accent-current' : 'accent-blue-500'} ${isArcane ? arcane.text : ''}`}
                />
              </div>
            )}
          </div>

          <div className={`space-y-3 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Scaling className={`w-5 h-5 ${isArcane ? arcane.text : 'text-indigo-500'}`} />
              <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>UI Size Scale</span>
              <span className={`ml-auto text-xs font-mono px-2 py-1 rounded-md ${isArcane ? arcane.bg + ' ' + arcane.text : 'bg-slate-200 dark:bg-slate-700'}`}>{uiCustomization.uiSize.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" max="1.5" step="0.05"
              value={isNaN(uiCustomization.uiSize) ? 1.0 : uiCustomization.uiSize}
              onChange={(e) => setUICustomization({ ...uiCustomization, uiSize: parseFloat(e.target.value) })}
              className={`w-full ${isArcane ? 'accent-current' : 'accent-indigo-500'} ${isArcane ? arcane.text : ''}`}
            />
          </div>

          <div className={`space-y-3 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Square className={`w-5 h-5 ${isArcane ? arcane.text : 'text-amber-500'}`} />
              <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Border Radius</span>
              <span className={`ml-auto text-xs font-mono px-2 py-1 rounded-md ${isArcane ? arcane.bg + ' ' + arcane.text : 'bg-slate-200 dark:bg-slate-700'}`}>{uiCustomization.borderRadius}px</span>
            </div>
            <input 
              type="range" 
              min="0" max="40" step="2"
              value={isNaN(uiCustomization.borderRadius) ? 16 : uiCustomization.borderRadius}
              onChange={(e) => setUICustomization({ ...uiCustomization, borderRadius: parseInt(e.target.value) })}
              className={`w-full ${isArcane ? 'accent-current' : 'accent-amber-500'} ${isArcane ? arcane.text : ''}`}
            />
          </div>

          <div className={`space-y-3 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Maximize className={`w-5 h-5 ${isArcane ? arcane.text : 'text-rose-500'}`} />
              <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Spacing Scale</span>
              <span className={`ml-auto text-xs font-mono px-2 py-1 rounded-md ${isArcane ? arcane.bg + ' ' + arcane.text : 'bg-slate-200 dark:bg-slate-700'}`}>{uiCustomization.spacing.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" max="2" step="0.1"
              value={isNaN(uiCustomization.spacing) ? 1.0 : uiCustomization.spacing}
              onChange={(e) => setUICustomization({ ...uiCustomization, spacing: parseFloat(e.target.value) })}
              className={`w-full ${isArcane ? 'accent-current' : 'accent-rose-500'} ${isArcane ? arcane.text : ''}`}
            />
          </div>

          <div className={`space-y-3 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Eye className={`w-5 h-5 ${isArcane ? arcane.text : 'text-fuchsia-500'}`} />
                <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Glass Blur Effects</span>
              </div>
              <button
                onClick={() => setUICustomization({ ...uiCustomization, blurEnabled: !uiCustomization.blurEnabled })}
                className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${uiCustomization.blurEnabled ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-fuchsia-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                <motion.div
                  animate={{ x: uiCustomization.blurEnabled ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Box className={`w-5 h-5 ${isArcane ? arcane.text : 'text-violet-500'}`} />
                <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Drop Shadows</span>
              </div>
              <button
                onClick={() => setUICustomization({ ...uiCustomization, shadowsEnabled: !uiCustomization.shadowsEnabled })}
                className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${uiCustomization.shadowsEnabled ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-violet-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                <motion.div
                  animate={{ x: uiCustomization.shadowsEnabled ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>

          <div className={`space-y-4 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Baseline className={`w-5 h-5 ${isArcane ? arcane.text : 'text-cyan-500'}`} />
              <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Text Controls</span>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                  <span>Font Size</span>
                  <span>{uiCustomization.textFontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" max="24" step="1"
                  value={isNaN(uiCustomization.textFontSize) ? 16 : uiCustomization.textFontSize}
                  onChange={(e) => setUICustomization({ ...uiCustomization, textFontSize: parseInt(e.target.value) })}
                  className={`w-full ${isArcane ? 'accent-current' : 'accent-cyan-500'} ${isArcane ? arcane.text : ''}`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                  <span>Font Weight</span>
                  <span>{uiCustomization.textFontWeight}</span>
                </div>
                <input 
                  type="range" 
                  min="100" max="900" step="100"
                  value={isNaN(uiCustomization.textFontWeight) ? 400 : uiCustomization.textFontWeight}
                  onChange={(e) => setUICustomization({ ...uiCustomization, textFontWeight: parseInt(e.target.value) })}
                  className={`w-full ${isArcane ? 'accent-current' : 'accent-cyan-500'} ${isArcane ? arcane.text : ''}`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                  <span>Letter Spacing</span>
                  <span>{uiCustomization.textLetterSpacing}px</span>
                </div>
                <input 
                  type="range" 
                  min="-2" max="10" step="0.5"
                  value={isNaN(uiCustomization.textLetterSpacing) ? 0 : uiCustomization.textLetterSpacing}
                  onChange={(e) => setUICustomization({ ...uiCustomization, textLetterSpacing: parseFloat(e.target.value) })}
                  className={`w-full ${isArcane ? 'accent-current' : 'accent-cyan-500'} ${isArcane ? arcane.text : ''}`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                  <span>Line Height</span>
                  <span>{uiCustomization.textLineHeight}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="2.5" step="0.1"
                  value={isNaN(uiCustomization.textLineHeight) ? 1.5 : uiCustomization.textLineHeight}
                  onChange={(e) => setUICustomization({ ...uiCustomization, textLineHeight: parseFloat(e.target.value) })}
                  className={`w-full ${isArcane ? 'accent-current' : 'accent-cyan-500'} ${isArcane ? arcane.text : ''}`}
                />
              </div>
            </div>
          </div>

          <div className={`space-y-4 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Type className={`w-5 h-5 ${isArcane ? arcane.text : 'text-purple-500'}`} />
                <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Text Animations</span>
              </div>
              <button
                onClick={() => onUpdateTheme?.({ textAnimationEnabled: !theme.textAnimationEnabled })}
                className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${theme.textAnimationEnabled ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-purple-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                <motion.div
                  animate={{ x: theme.textAnimationEnabled ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            
            {theme.textAnimationEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {(['typewriter', 'scramble', 'fade-up', 'blur-in', 'glitch', 'reveal', 'bounce', 'wave', 'flip', 'shimmer', 'pop', 'elastic'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => onUpdateTheme?.({ textAnimationType: type })}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${theme.textAnimationType === type ? (isArcane ? `${arcane.bg} ${arcane.border} border ${arcane.text}` : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]') : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-transparent'}`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Animation Speed</span>
                    <span>{theme.textAnimationSpeed?.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.2" max="3.0" step="0.1"
                    value={theme.textAnimationSpeed || 1.0}
                    onChange={(e) => onUpdateTheme?.({ textAnimationSpeed: parseFloat(e.target.value) })}
                    className={`w-full ${isArcane ? 'accent-current' : 'accent-purple-500'} ${isArcane ? arcane.text : ''}`}
                  />
                  <div className="flex justify-between text-[8px] text-slate-400 uppercase font-medium">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {(theme.visualStyle === 'arcane' || theme.visualStyle === 'ultimate' || theme.visualStyle === 'hollow-knight') && (
            <div className={`space-y-4 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-5 h-5 ${isArcane ? arcane.text : 'text-yellow-500'}`} />
                  <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Particle Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Reduce Lag</span>
                  <button
                    onClick={() => setUICustomization({ ...uiCustomization, particleReduceLag: !uiCustomization.particleReduceLag })}
                    className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${uiCustomization.particleReduceLag ? `${arcane.accent} shadow-lg ${isArcane ? arcane.glow : 'shadow-yellow-500/40'}` : 'bg-slate-200 dark:bg-slate-600'}`}
                    title="Reduce Particle Lag"
                  >
                    <motion.div
                      animate={{ x: uiCustomization.particleReduceLag ? 26 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Max Connections</span>
                    <span>{uiCustomization.particleMaxConnections ?? 3}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="10" step="1"
                    value={isNaN(uiCustomization.particleMaxConnections ?? 3) ? 3 : (uiCustomization.particleMaxConnections ?? 3)}
                    onChange={(e) => setUICustomization({ ...uiCustomization, particleMaxConnections: parseInt(e.target.value) })}
                    className={`w-full ${isArcane ? 'accent-current' : 'accent-yellow-500'} ${isArcane ? arcane.text : ''}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Connection Distance</span>
                    <span>{uiCustomization.particleConnectionDistance ?? 150}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="300" step="10"
                    value={isNaN(uiCustomization.particleConnectionDistance ?? 150) ? 150 : (uiCustomization.particleConnectionDistance ?? 150)}
                    onChange={(e) => setUICustomization({ ...uiCustomization, particleConnectionDistance: parseInt(e.target.value) })}
                    className={`w-full ${isArcane ? 'accent-current' : 'accent-yellow-500'} ${isArcane ? arcane.text : ''}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Max Size</span>
                    <span>{uiCustomization.particleMaxSize ?? 4}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" step="0.5"
                    value={isNaN(uiCustomization.particleMaxSize ?? 4) ? 4 : (uiCustomization.particleMaxSize ?? 4)}
                    onChange={(e) => setUICustomization({ ...uiCustomization, particleMaxSize: parseFloat(e.target.value) })}
                    className={`w-full ${isArcane ? 'accent-current' : 'accent-yellow-500'} ${isArcane ? arcane.text : ''}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Particle Count</span>
                    <span>{uiCustomization.particleCount ?? 50}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="200" step="5"
                    value={isNaN(uiCustomization.particleCount ?? 50) ? 50 : (uiCustomization.particleCount ?? 50)}
                    onChange={(e) => setUICustomization({ ...uiCustomization, particleCount: parseInt(e.target.value) })}
                    className={`w-full ${isArcane ? 'accent-current' : 'accent-yellow-500'} ${isArcane ? arcane.text : ''}`}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`space-y-3 p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Type className={`w-5 h-5 ${isArcane ? arcane.text : 'text-indigo-500'}`} />
              <span className={`text-sm font-bold transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-200'}`}>Custom Font Upload</span>
            </div>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept=".ttf,.otf,.woff,.woff2" 
                ref={fileInputRef}
                onChange={handleFontUpload}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl transition-colors text-sm font-bold no-hat ${isArcane ? `${arcane.bg} ${arcane.text} hover:bg-white/20` : 'bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300'}`}
              >
                <Upload className="w-4 h-4" />
                Upload Font File
              </button>
              {uiCustomization.customFontUrl && (
                <button 
                  onClick={clearFont}
                  className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 font-bold mt-1 no-hat"
                >
                  Clear Custom Font
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setUICustomization({
                enabled: true,
                uiSize: 1.0,
                customFontUrl: null,
                performanceMode: false,
                dynamicBackgroundEnabled: true,
                dynamicBackgroundIntensity: 1.0,
                borderRadius: 16,
                spacing: 1.0,
                blurEnabled: true,
                shadowsEnabled: true,
                textFontSize: 16,
                textFontWeight: 400,
                textLetterSpacing: 0,
                textLineHeight: 1.5,
                particleMaxConnections: 3,
                particleConnectionDistance: 150,
                particleMaxSize: 4,
                particleCount: 50,
                particleReduceLag: false,
                optimizationMode: false
              });
              onUpdateTheme?.({
                textAnimationEnabled: false,
                textAnimationType: 'typewriter',
                textAnimationSpeed: 1.0
              });
            }}
            className={`w-full py-3 px-4 rounded-xl transition-colors text-sm font-bold uppercase tracking-wider no-hat ${isArcane ? `${arcane.bg} ${arcane.text} hover:bg-white/20` : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
          >
            Reset to Defaults
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

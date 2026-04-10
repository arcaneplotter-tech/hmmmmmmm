import React from 'react';
import { motion } from 'motion/react';
import { X, Moon, Sun, Palette, Zap, Map as MapIcon, History, ChevronRight, Library, Layers, Save } from 'lucide-react';
import { AppTheme } from '../types';
import { getArcaneStyles } from '../utils/arcaneThemes';

interface GlobalSettingsProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  theme: AppTheme;
  onClose: () => void;
  onOpenHistory: () => void;
  onOpenThemes: () => void;
  onOpenBank: () => void;
  onOpenUICustomization: () => void;
  onOpenPowerSettings: () => void;
  onOpenSavedExams: () => void;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({ 
  darkMode, 
  setDarkMode, 
  theme,
  onClose,
  onOpenHistory,
  onOpenThemes,
  onOpenBank,
  onOpenUICustomization,
  onOpenPowerSettings,
  onOpenSavedExams
}) => {
  const isUndertale = theme.visualStyle === 'undertale';
  const isArcane = theme.visualStyle === 'arcane';
  const arcane = isArcane 
    ? getArcaneStyles(theme.accentColor) 
    : { border: 'border-white/20 dark:border-slate-800/50', glow: '', text: 'text-indigo-500', bg: 'bg-slate-50 dark:bg-slate-800/50' };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`brutal-modal relative w-full max-w-md bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border-2 overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500 ${arcane.border} ${arcane.glow}`}
      >
        <div className={`p-6 border-b flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 ${isArcane ? arcane.border : 'border-slate-100 dark:border-slate-800'}`}>
          <h3 className={`text-xs font-black uppercase tracking-[0.3em] transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-400'}`}>Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors no-hat">
            <X className={`w-4 h-4 ${isArcane ? arcane.text : 'text-slate-400'}`} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${isArcane ? `${arcane.bg} ${arcane.border}` : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'} ${isUndertale ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className={`w-4 h-4 ${isArcane ? arcane.text : 'text-indigo-400'}`} /> : <Sun className="w-4 h-4 text-amber-500" />}
              <div className="flex flex-col">
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-600 dark:text-slate-300'}`}>Dark Mode</span>
                {isUndertale && <span className="text-[8px] font-pixel text-amber-500 uppercase tracking-tighter">Forced in Undertale</span>}
              </div>
            </div>
            <button
              onClick={(e) => {
                if (isUndertale) return;
                e.stopPropagation();
                setDarkMode(!darkMode);
              }}
              disabled={isUndertale}
              className={`p-0 w-12 h-6 rounded-full transition-all duration-300 relative no-hat ${isUndertale ? 'cursor-not-allowed' : 'cursor-pointer'} ${darkMode ? (isArcane ? `${arcane.bg.replace('/5', '/20')} ${arcane.glow}` : 'bg-indigo-600 shadow-lg shadow-indigo-500/40') : 'bg-slate-200'}`}
              aria-label="Toggle Dark Mode"
            >
              <motion.div
                animate={{ x: darkMode ? 26 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 left-0 w-4 h-4 rounded-full shadow-sm ${darkMode && isArcane ? 'bg-white' : 'bg-white'}`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: Palette, label: 'Themes', onClick: onOpenThemes, color: isArcane ? arcane.text : 'text-indigo-500', bg: isArcane ? arcane.bg : 'bg-slate-50 dark:bg-slate-800/50', border: isArcane ? arcane.border : 'border-slate-100 dark:border-slate-700' },
              { icon: Zap, label: 'Power Settings', onClick: onOpenPowerSettings, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/50' },
              { icon: MapIcon, label: 'Question Bank', onClick: onOpenBank, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/50' },
              { icon: History, label: 'Exam History', onClick: onOpenHistory, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/50' },
              { icon: Save, label: 'Saved Exams', onClick: onOpenSavedExams, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/50' },
              { icon: Layers, label: 'UI Customization', onClick: onOpenUICustomization, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/50' }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all no-hat group ${item.bg} ${item.border} hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${isArcane && idx === 0 ? arcane.text : 'text-slate-600 dark:text-slate-300'}`}>{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${item.color}`} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

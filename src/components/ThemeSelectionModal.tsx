import React from 'react';
import { motion } from 'motion/react';
import { Paintbrush, X, Check } from 'lucide-react';
import { AppTheme } from '../types';
import { THEMES, VISUAL_STYLES } from '../constants/themes';
import { getArcaneStyles } from '../utils/arcaneThemes';

interface ThemeSelectionModalProps {
  currentTheme: AppTheme;
  onUpdateTheme: (t: Partial<AppTheme>) => void;
  onClose: () => void;
  onCreateTheme: () => void;
  onRemoveCustomTheme: () => void;
}

export const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({ 
  currentTheme, 
  onUpdateTheme, 
  onClose,
  onCreateTheme,
  onRemoveCustomTheme
}) => {
  const [arcaneClickCount, setArcaneClickCount] = React.useState(0);
  const [batmanClickCount, setBatmanClickCount] = React.useState(0);
  const filteredThemes = THEMES.filter(t => {
    if (t.id === 'kitler') {
      return localStorage.getItem('kitler_unlocked') === 'true';
    }
    return t.style === currentTheme.visualStyle && t.id !== 'ultimate-cosmic';
  });
  const visibleStyles = VISUAL_STYLES.filter(s => {
    if (s.id === 'kitler') {
      return localStorage.getItem('kitler_unlocked') === 'true';
    }
    return s.id !== 'ultimate';
  });
  const isArcane = currentTheme.visualStyle === 'arcane';

  const handleColorClick = (colorId: string) => {
    if (colorId === 'arcane-violet') {
      const newCount = arcaneClickCount + 1;
      setArcaneClickCount(newCount);
      if (newCount >= 10) {
        onUpdateTheme({ visualStyle: 'ultimate', accentColor: 'ultimate-cosmic' });
        setArcaneClickCount(0);
        return;
      }
    } else {
      setArcaneClickCount(0);
    }

    if (colorId === 'superhero-batman') {
      const newCount = batmanClickCount + 1;
      setBatmanClickCount(newCount);
      
      // Visual feedback for secret clicks
      if (newCount > 0 && newCount < 10) {
        const btn = document.querySelector(`[key="${colorId}"]`);
        if (btn) {
          (btn as HTMLElement).style.transform = `scale(${1.1 + newCount * 0.02}) rotate(${newCount % 2 === 0 ? 5 : -5}deg)`;
          setTimeout(() => {
            (btn as HTMLElement).style.transform = '';
          }, 100);
        }
      }

      if (newCount >= 10) {
        localStorage.setItem('kitler_unlocked', 'true');
        onUpdateTheme({ visualStyle: 'kitler', accentColor: 'kitler' });
        setBatmanClickCount(0);
        return;
      }
    } else {
      setBatmanClickCount(0);
    }

    // Superhero attack cycling
    if (colorId.startsWith('superhero-') && currentTheme.accentColor === colorId) {
      const currentIndex = currentTheme.superheroAttackIndex || 0;
      onUpdateTheme({ superheroAttackIndex: (currentIndex + 1) % 7 });
      return;
    } else if (colorId.startsWith('superhero-')) {
      // First time selecting this hero, set index to 0 or keep current
      onUpdateTheme({ accentColor: colorId as any, superheroAttackIndex: currentTheme.superheroAttackIndex ?? 0 });
      return;
    }

    onUpdateTheme({ accentColor: colorId as any });
  };

  const arcane = isArcane 
    ? getArcaneStyles(currentTheme.accentColor) 
    : { border: 'border-slate-100 dark:border-slate-800', glow: '', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', accent: '', accentText: '', card: '', button: '', iconGlow: '' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`brutal-modal bg-white dark:bg-slate-950 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-md p-5 sm:p-8 space-y-6 sm:space-y-8 border-2 relative !overflow-y-auto max-h-[90vh] transition-all duration-500 ${arcane.border} ${arcane.glow}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arcane Decorative Elements */}
        {isArcane && (
          <>
            <div className={`absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-[2.5rem] pointer-events-none opacity-50 ${arcane.border}`} />
            <div className={`absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-[2.5rem] pointer-events-none opacity-50 ${arcane.border}`} />
          </>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${arcane.bg} ${arcane.text}`}>
              <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-tighter leading-none transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-900 dark:text-white'}`}>Theme Selection</h3>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isArcane ? arcane.text : 'text-indigo-500'}`}>Customize your visual experience</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors no-hat">
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual Style</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onUpdateTheme({ visualStyle: style.id, accentColor: style.bestFit })}
                  className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 no-hat relative overflow-hidden group ${
                    currentTheme.visualStyle === style.id
                      ? (isArcane && style.id === 'arcane' ? `${arcane.border} ${arcane.bg}` : 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20')
                      : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <style.icon className={`w-5 h-5 transition-colors duration-500 ${currentTheme.visualStyle === style.id ? (isArcane ? arcane.text : 'text-indigo-600') : 'text-slate-400'}`} />
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider transition-colors duration-500 ${currentTheme.visualStyle === style.id ? (isArcane ? arcane.text : 'text-indigo-700 dark:text-indigo-300') : 'text-slate-600 dark:text-slate-400'}`}>
                      {style.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium leading-tight">{style.desc}</div>
                  </div>
                  
                  {/* Arcane Hover Effect */}
                  {isArcane && style.id === 'arcane' && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-current ${arcane.text}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accent Palette</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filteredThemes.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorClick(color.id)}
                  className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all relative group/color no-hat ${
                    currentTheme.accentColor === color.id
                      ? (isArcane ? `${arcane.border} scale-110 ${arcane.glow}` : 'border-indigo-600 scale-110 shadow-lg')
                      : 'border-transparent hover:scale-105'
                  }`}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden flex flex-col">
                    <div className={`flex-1 ${color.colors[0]}`} />
                    <div className={`flex-1 ${color.colors[1]}`} />
                  </div>
                  {currentTheme.accentColor === color.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <span className={`text-[8px] font-black uppercase ${isArcane ? arcane.text : 'text-slate-500'}`}>{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          {currentTheme.customTheme && (
            <button
              onClick={onRemoveCustomTheme}
              className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 group/remove no-hat ${
                isArcane ? 'border-red-500/50 hover:bg-red-500/10' : 'border-rose-200 dark:border-rose-800 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-900/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-500 ${isArcane ? 'bg-red-500/10' : 'bg-rose-100 dark:bg-rose-800 group-hover/remove:bg-rose-200 dark:group-hover/remove:bg-rose-900/40'}`}>
                <X className={`w-4 h-4 transition-colors duration-500 ${isArcane ? 'text-red-500' : 'text-rose-500 group-hover/remove:text-rose-600'}`} />
              </div>
              <div className="text-left">
                <div className={`text-xs font-black uppercase tracking-wider transition-colors duration-500 ${isArcane ? 'text-red-500' : 'text-rose-700 dark:text-rose-300 group-hover/remove:text-rose-700 dark:group-hover/remove:text-rose-300'}`}>Remove Custom Theme</div>
                <div className="text-[9px] text-slate-400 font-medium leading-tight">Revert to standard visual styles</div>
              </div>
            </button>
          )}

          <button
            onClick={onCreateTheme}
            className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 group/create no-hat ${
              isArcane ? `${arcane.border} hover:bg-purple-500/10` : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-500 ${isArcane ? arcane.bg : 'bg-slate-100 dark:bg-slate-800 group-hover/create:bg-indigo-100 dark:group-hover/create:bg-indigo-900/40'}`}>
              <Paintbrush className={`w-4 h-4 transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-500 group-hover/create:text-indigo-600'}`} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-black uppercase tracking-wider transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-700 dark:text-slate-300 group-hover/create:text-indigo-700 dark:group-hover/create:text-indigo-300'}`}>Create Theme</div>
              <div className="text-[9px] text-slate-400 font-medium leading-tight">Design your own custom visual experience</div>
            </div>
          </button>
        </div>

        <p className={`text-[10px] font-medium text-center italic transition-colors duration-500 ${isArcane ? arcane.text : 'text-slate-400'}`}>Changes are applied instantly across the entire app!</p>
      </motion.div>
    </motion.div>
  );
};

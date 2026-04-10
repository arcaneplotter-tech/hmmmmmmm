import React from 'react';
import { FileText, Download, RotateCcw, Coins, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTheme, CustomTheme, ButtonConfig } from '../types';
import { getArcaneStyles } from '../utils/arcaneThemes';

export const renderThemeUI = (
  theme: AppTheme,
  scoreDetails: { score: number; total: number; percentage: number; rank: { title: string; color: string; bg: string } },
  callbacks: { onReview: () => void; onDownload: () => void; onDownloadOnline: () => void; onRestart: () => void; onSave?: () => void; isSaved?: boolean },
  easterEggDetails: { show: boolean; gif: string; borderColor: string }
) => {
  const { score, total, percentage, rank } = scoreDetails;
  const { onReview, onDownload, onDownloadOnline, onRestart, onSave, isSaved } = callbacks;
  const { show, gif, borderColor } = easterEggDetails;

  const renderEasterEgg = () => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4"
        >
          <div className={`relative p-2 sm:p-4 bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl border-4 sm:border-8 ${borderColor}`}>
            <div className={`absolute inset-0 ${percentage === 0 ? 'bg-red-500/10' : percentage === 100 ? 'bg-amber-500/10' : 'bg-indigo-500/10'} blur-xl sm:blur-2xl rounded-full animate-pulse`} />
            <img 
              src={gif} 
              alt="Easter Egg" 
              className="relative w-32 h-32 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain rounded-[1rem] sm:rounded-[2rem]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderButtons = (btnClass1: string, btnClass2: string, btnClass3: string, btnClass4: string) => {
    const customBtnStyle = theme.customTheme?.buttonConfig ? {
      borderRadius: `${theme.customTheme.buttonConfig.borderRadius}px`,
      borderWidth: `${theme.customTheme.buttonConfig.borderWidth}px`,
      borderColor: theme.customTheme.buttonConfig.borderColor,
      backgroundColor: theme.customTheme.buttonConfig.backgroundColor,
      color: theme.customTheme.buttonConfig.textColor,
      fontSize: `${theme.customTheme.buttonConfig.fontSize}px`,
      fontWeight: theme.customTheme.buttonConfig.fontWeight,
      padding: `${theme.customTheme.buttonConfig.paddingY}px ${theme.customTheme.buttonConfig.paddingX}px`,
      letterSpacing: `${theme.customTheme.buttonConfig.letterSpacing}px`,
      textTransform: theme.customTheme.buttonConfig.textTransform,
      fontStyle: theme.customTheme.buttonConfig.italic ? 'italic' : 'normal',
      boxShadow: theme.customTheme.buttonConfig.shadow === 'none' ? 'none' : 
                 theme.customTheme.buttonConfig.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                 theme.customTheme.buttonConfig.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' :
                 theme.customTheme.buttonConfig.shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' :
                 theme.customTheme.buttonConfig.shadow === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' :
                 theme.customTheme.buttonConfig.shadow === '2xl' ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' :
                 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)'
    } : undefined;

    const getBtnProps = (baseClass: string, isRestart?: boolean) => {
      if (!customBtnStyle) return { className: baseClass };
      
      const config = theme.customTheme!.buttonConfig!;
      const props: any = {
        style: { ...customBtnStyle, ...(isRestart ? { backgroundColor: '#ef4444', borderColor: '#ef4444' } : {}) },
        className: "flex items-center justify-center gap-2 transition-all"
      };

      return props;
    };

    return (
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-8 relative z-10">
        <button onClick={onReview} {...getBtnProps(btnClass1)}>
          <FileText className="w-4 h-4" /> REVIEW
        </button>
        {onSave && (
          <button 
            onClick={isSaved ? undefined : onSave} 
            {...getBtnProps(isSaved ? "flex-1 py-4 bg-emerald-500 text-white border-4 border-emerald-600 rounded-2xl font-black uppercase flex items-center justify-center gap-2 text-xs cursor-default" : btnClass1)}
            disabled={isSaved}
          >
            {isSaved ? (
              <><CheckCircle2 className="w-4 h-4" /> SAVED</>
            ) : (
              <><Save className="w-4 h-4" /> SAVE EXAM</>
            )}
          </button>
        )}
        <button onClick={onDownload} {...getBtnProps(btnClass2)} title="Download full offline version">
          <Download className="w-4 h-4" /> OFFLINE
        </button>
        <button onClick={onDownloadOnline} {...getBtnProps(btnClass3)} title="Download small online version">
          <Download className="w-4 h-4" /> ONLINE
        </button>
        <button onClick={onRestart} {...getBtnProps(btnClass4, true)}>
          <RotateCcw className="w-4 h-4" /> RESTART
        </button>
      </div>
    );
  };

  const renderThemeContent = () => {
    switch (theme.visualStyle) {
      case 'brutalist':
        return (
          <div className="border-8 border-black bg-white p-8 sm:p-16 shadow-[16px_16px_0_#000] transform -rotate-1 dark:bg-[#111] dark:border-white dark:shadow-[16px_16px_0_#fff]">
             <h2 className="text-6xl sm:text-9xl font-black uppercase tracking-tighter text-black dark:text-white mb-8">DONE.</h2>
             <div className="flex flex-col sm:flex-row gap-8 border-y-8 border-black dark:border-white py-8 mb-8">
               <div className="flex-1 sm:border-r-8 border-black dark:border-white">
                 <div className="text-7xl sm:text-8xl font-black text-black dark:text-white">{score}</div>
                 <div className="text-2xl font-bold uppercase text-black dark:text-white">Correct</div>
               </div>
               <div className="flex-1">
                 <div className="text-7xl sm:text-8xl font-black text-black dark:text-white">{percentage}%</div>
                 <div className="text-2xl font-bold uppercase text-black dark:text-white">Score</div>
               </div>
             </div>
             {renderButtons(
               "flex-1 py-4 border-4 border-black dark:border-white bg-white dark:bg-[#111] text-black dark:text-white font-black uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 border-4 border-black dark:border-white bg-white dark:bg-[#111] text-black dark:text-white font-black uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 border-4 border-black dark:border-white bg-white dark:bg-[#111] text-black dark:text-white font-black uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 border-4 border-black dark:border-white bg-[#D32F2F] text-white font-black uppercase hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 text-xs"
             )}
          </div>
        );
      case 'game-minecraft':
        return (
          <div className="bg-[#c6c6c6] border-[6px] border-white border-b-[#555] border-r-[#555] p-8 sm:p-12 text-black font-['Press_Start_2P']">
            <h2 className="text-3xl sm:text-5xl mb-10 text-center text-yellow-300 drop-shadow-[4px_4px_0_#3f3f3f]">LEVEL COMPLETE</h2>
            <div className="bg-[#8b8b8b] border-[4px] border-[#373737] border-b-white border-r-white p-6 mb-8 flex flex-col sm:flex-row gap-6">
               <div className="flex-1 text-center">
                 <div className="text-4xl mb-2 text-white drop-shadow-[2px_2px_0_#3f3f3f]">{score}/{total}</div>
                 <div className="text-xs text-[#3f3f3f]">XP ORBS</div>
               </div>
               <div className="flex-1 text-center">
                 <div className="text-4xl mb-2 text-[#5eed5e] drop-shadow-[2px_2px_0_#3f3f3f]">{percentage}%</div>
                 <div className="text-xs text-[#3f3f3f]">SCORE</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-[#c6c6c6] border-4 border-white border-b-[#555] border-r-[#555] text-black font-['Press_Start_2P'] text-[10px] hover:bg-[#d9d9d9] active:border-t-[#555] active:border-l-[#555] active:border-b-white active:border-r-white flex items-center justify-center gap-2",
               "flex-1 py-4 bg-[#c6c6c6] border-4 border-white border-b-[#555] border-r-[#555] text-black font-['Press_Start_2P'] text-[10px] hover:bg-[#d9d9d9] active:border-t-[#555] active:border-l-[#555] active:border-b-white active:border-r-white flex items-center justify-center gap-2",
               "flex-1 py-4 bg-[#c6c6c6] border-4 border-white border-b-[#555] border-r-[#555] text-black font-['Press_Start_2P'] text-[10px] hover:bg-[#d9d9d9] active:border-t-[#555] active:border-l-[#555] active:border-b-white active:border-r-white flex items-center justify-center gap-2",
               "flex-1 py-4 bg-[#5eed5e] border-4 border-[#aaffaa] border-b-[#228822] border-r-[#228822] text-black font-['Press_Start_2P'] text-[10px] hover:bg-[#77ff77] active:border-t-[#228822] active:border-l-[#228822] active:border-b-[#aaffaa] active:border-r-[#aaffaa] flex items-center justify-center gap-2"
            )}
          </div>
        );
      case 'undertale':
        return (
          <div className="bg-black border-4 border-white p-8 sm:p-12 text-white font-['Press_Start_2P'] text-center">
            <h2 className="text-3xl sm:text-4xl mb-12">* You won!</h2>
            <div className="flex flex-col gap-6 mb-12 text-left max-w-md mx-auto">
               <div className="text-xl">* You earned {score} EXP.</div>
               <div className="text-xl">* Your LOVE increased to {percentage}%.</div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-black border-2 border-white text-white font-['Press_Start_2P'] text-[10px] hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2",
               "flex-1 py-4 bg-black border-2 border-white text-white font-['Press_Start_2P'] text-[10px] hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2",
               "flex-1 py-4 bg-black border-2 border-white text-white font-['Press_Start_2P'] text-[10px] hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2",
               "flex-1 py-4 bg-black border-2 border-yellow-400 text-yellow-400 font-['Press_Start_2P'] text-[10px] hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center gap-2"
            )}
          </div>
        );
      case 'tadc':
        return (
          <div className="bg-white border-8 border-dashed border-red-600 rounded-[3rem] p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,#ef4444_0deg_15deg,#fef08a_15deg_30deg)] opacity-10 animate-[spin_10s_linear_infinite]" />
            <h2 className="text-5xl sm:text-7xl font-black text-blue-600 mb-8 relative z-10 animate-tadc-glitch">PERFORMANCE EVALUATION</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
               <div className="flex-1 bg-yellow-300 border-4 border-black rounded-3xl p-6 transform rotate-3">
                 <div className="text-6xl font-black">{score}</div>
                 <div className="font-bold">HITS</div>
               </div>
               <div className="flex-1 bg-red-500 text-white border-4 border-black rounded-3xl p-6 transform -rotate-2">
                 <div className="text-6xl font-black">{percentage}%</div>
                 <div className="font-bold">SANITY</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-blue-500 border-4 border-black rounded-2xl text-white font-black uppercase hover:bg-blue-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-green-500 border-4 border-black rounded-2xl text-white font-black uppercase hover:bg-green-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-amber-500 border-4 border-black rounded-2xl text-white font-black uppercase hover:bg-amber-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-red-500 border-4 border-black rounded-2xl text-white font-black uppercase hover:bg-red-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-xs"
            )}
          </div>
        );
      case 'duck':
        return (
          <div className="bg-white/80 backdrop-blur-md border-4 border-yellow-400 rounded-[3rem] p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.3)]">
            <h2 className="text-5xl sm:text-7xl font-black text-blue-500 mb-8 drop-shadow-md">SPLISH SPLASH!</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <div className="flex-1 bg-blue-100 border-4 border-blue-300 rounded-[2rem] p-8">
                 <div className="text-5xl font-black text-blue-600">{score}</div>
                 <div className="font-bold text-blue-400">BUBBLES</div>
               </div>
               <div className="flex-1 bg-yellow-100 border-4 border-yellow-400 rounded-[2rem] p-8">
                 <div className="text-5xl font-black text-yellow-600">{percentage}%</div>
                 <div className="font-bold text-yellow-500">QUACK SCORE</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-white border-4 border-blue-300 rounded-full text-blue-500 font-black uppercase hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-white border-4 border-blue-300 rounded-full text-blue-500 font-black uppercase hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-white border-4 border-blue-300 rounded-full text-blue-500 font-black uppercase hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-yellow-400 border-4 border-yellow-500 rounded-full text-white font-black uppercase hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 shadow-lg text-xs"
            )}
          </div>
        );
      case 'saidi':
        return (
          <div className="bg-[#fffbeb] border-4 border-[#d97706] p-8 sm:p-12 text-center relative shadow-2xl rounded-xl font-['Amiri']">
            <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-[#d97706] opacity-50 rounded-lg pointer-events-none" />
            <h2 className="text-4xl sm:text-6xl font-bold text-[#92400e] mb-8">النتيجة النهائية</h2>
            <div className="flex flex-col sm:flex-row gap-8 mb-8 justify-center items-center">
               <div className="text-center">
                 <div className="text-5xl font-bold text-[#b45309]">{score}</div>
                 <div className="text-xl text-[#d97706]">الإجابات الصحيحة</div>
               </div>
               <div className="hidden sm:block w-px h-20 bg-[#d97706] opacity-30" />
               <div className="text-center">
                 <div className="text-5xl font-bold text-[#b45309]">{percentage}%</div>
                 <div className="text-xl text-[#d97706]">النسبة المئوية</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-3 border-2 border-[#d97706] bg-transparent text-[#92400e] font-bold hover:bg-[#fef3c7] transition-colors flex items-center justify-center gap-2 rounded text-xs",
               "flex-1 py-3 border-2 border-[#d97706] bg-transparent text-[#92400e] font-bold hover:bg-[#fef3c7] transition-colors flex items-center justify-center gap-2 rounded text-xs",
               "flex-1 py-3 border-2 border-[#d97706] bg-transparent text-[#92400e] font-bold hover:bg-[#fef3c7] transition-colors flex items-center justify-center gap-2 rounded text-xs",
               "flex-1 py-3 border-2 border-[#d97706] bg-[#d97706] text-white font-bold hover:bg-[#b45309] transition-colors flex items-center justify-center gap-2 rounded text-xs"
            )}
          </div>
        );
      case 'arcane':
        const arcane = getArcaneStyles(theme.accentColor);
        return (
          <div className={`p-8 sm:p-12 text-center relative rounded-lg border transition-all duration-500 ${arcane.bg} ${arcane.border} ${arcane.glow}`}>
            <h2 className={`text-4xl sm:text-6xl font-black mb-8 uppercase tracking-widest transition-colors duration-500 ${arcane.text}`}>Assessment Complete</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <div className={`flex-1 p-6 rounded border transition-all duration-500 ${arcane.bg} ${arcane.border} shadow-[inset_0_0_15px_rgba(0,0,0,0.2)]`}>
                 <div className={`text-5xl font-black transition-colors duration-500 ${arcane.text}`}>{score}</div>
                 <div className={`text-xs font-bold uppercase tracking-widest mt-2 opacity-70 ${arcane.text}`}>Variables Aligned</div>
               </div>
               <div className={`flex-1 p-6 rounded border transition-all duration-500 ${arcane.bg} ${arcane.border} shadow-[inset_0_0_15px_rgba(0,0,0,0.2)]`}>
                 <div className={`text-5xl font-black transition-colors duration-500 ${arcane.text}`}>{percentage}%</div>
                 <div className={`text-xs font-bold uppercase tracking-widest mt-2 opacity-70 ${arcane.text}`}>Mutation Rate</div>
               </div>
            </div>
            {renderButtons(
               `flex-1 py-4 border transition-all duration-500 ${arcane.border} ${arcane.bg} ${arcane.text} font-black uppercase tracking-widest hover:brightness-125 flex items-center justify-center gap-2 rounded text-[10px]`,
               `flex-1 py-4 border transition-all duration-500 ${arcane.border} ${arcane.bg} ${arcane.text} font-black uppercase tracking-widest hover:brightness-125 flex items-center justify-center gap-2 rounded text-[10px]`,
               `flex-1 py-4 border transition-all duration-500 ${arcane.border} ${arcane.bg} ${arcane.text} font-black uppercase tracking-widest hover:brightness-125 flex items-center justify-center gap-2 rounded text-[10px]`,
               `flex-1 py-4 border-2 transition-all duration-500 ${arcane.border} ${arcane.accent} ${arcane.accentText} font-black uppercase tracking-widest hover:scale-105 shadow-lg flex items-center justify-center gap-2 rounded text-[10px]`
            )}
          </div>
        );
      case 'adventure-time':
        return (
          <div className="bg-white border-4 border-black p-8 sm:p-12 text-center rounded-[2rem] shadow-[8px_8px_0_#000]">
            <h2 className="text-5xl sm:text-7xl font-black text-[#00A2E8] mb-8 drop-shadow-[2px_2px_0_#000]">ALGEBRAIC!</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <div className="flex-1 bg-[#FFC90E] border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0_#000]">
                 <div className="text-5xl font-black text-black">{score}</div>
                 <div className="font-bold text-black uppercase">Loot</div>
               </div>
               <div className="flex-1 bg-[#00A2E8] border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0_#000]">
                 <div className="text-5xl font-black text-white drop-shadow-[2px_2px_0_#000]">{percentage}%</div>
                 <div className="font-bold text-white uppercase drop-shadow-[1px_1px_0_#000]">Hero Level</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-white border-4 border-black rounded-xl text-black font-black uppercase hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-[10px]",
               "flex-1 py-4 bg-white border-4 border-black rounded-xl text-black font-black uppercase hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-[10px]",
               "flex-1 py-4 bg-white border-4 border-black rounded-xl text-black font-black uppercase hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-[10px]",
               "flex-1 py-4 bg-[#FFC90E] border-4 border-black rounded-xl text-black font-black uppercase hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 text-[10px]"
            )}
          </div>
        );
      case 'ultimate':
        return (
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-8 sm:p-16 text-center rounded-[3rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 animate-pulse-slow" />
            <h2 className="text-5xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 mb-10 relative z-10">TRANSCENDENCE</h2>
            <div className="flex flex-col sm:flex-row gap-6 mb-10 relative z-10">
               <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                 <div className="text-6xl font-black text-white">{score}</div>
                 <div className="text-sm font-bold text-white/50 uppercase tracking-widest mt-2">Nodes Unlocked</div>
               </div>
               <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                 <div className="text-6xl font-black text-white">{percentage}%</div>
                 <div className="text-sm font-bold text-white/50 uppercase tracking-widest mt-2">Synchronization</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md text-[10px]",
               "flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md text-[10px]",
               "flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md text-[10px]",
               "flex-1 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-black uppercase tracking-widest hover:opacity-90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(217,70,239,0.5)] flex items-center justify-center gap-2 text-[10px]"
            )}
          </div>
        );
      case 'superhero':
        return (
          <div className="glass p-8 sm:p-12 text-center relative overflow-hidden">
            <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tight uppercase italic" style={{ color: 'var(--btn-bg)' }}>MISSION ACCOMPLISHED</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
               <div className="flex-1 bg-white/50 dark:bg-black/50 border-2 rounded-3xl p-6" style={{ borderColor: 'var(--accent-color)' }}>
                 <div className="text-5xl font-black" style={{ color: 'var(--color-indigo-900)' }}>{score}</div>
                 <div className="text-sm font-bold uppercase tracking-widest mt-2" style={{ color: 'var(--color-indigo-900)', opacity: 0.7 }}>Rescued</div>
               </div>
               <div className="flex-1 bg-white/50 dark:bg-black/50 border-2 rounded-3xl p-6" style={{ borderColor: 'var(--accent-color)' }}>
                 <div className="text-5xl font-black" style={{ color: 'var(--btn-bg)' }}>{percentage}%</div>
                 <div className="text-sm font-bold uppercase tracking-widest mt-2" style={{ color: 'var(--btn-bg)', opacity: 0.7 }}>Hero Rating</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-white/50 dark:bg-black/50 border-2 rounded-2xl font-bold uppercase transition-all flex items-center justify-center gap-2 text-[10px]",
               "flex-1 py-4 bg-white/50 dark:bg-black/50 border-2 rounded-2xl font-bold uppercase transition-all flex items-center justify-center gap-2 text-[10px]",
               "flex-1 py-4 bg-white/50 dark:bg-black/50 border-2 rounded-2xl font-bold uppercase transition-all flex items-center justify-center gap-2 text-[10px]",
               "flex-1 py-4 rounded-2xl text-white font-bold uppercase transition-all shadow-lg flex items-center justify-center gap-2 text-[10px]"
            )}
            <style>{`
              .visual-superhero button:nth-child(1), .visual-superhero button:nth-child(2), .visual-superhero button:nth-child(3) {
                border-color: var(--accent-color);
                color: var(--color-indigo-900);
              }
              .visual-superhero button:nth-child(1):hover, .visual-superhero button:nth-child(2):hover, .visual-superhero button:nth-child(3):hover {
                background-color: var(--btn-bg);
                color: var(--btn-text);
                border-color: var(--btn-bg);
              }
              .visual-superhero button:nth-child(4) {
                background-color: var(--btn-bg);
                color: var(--btn-text);
              }
              .visual-superhero button:nth-child(4):hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
              }
            `}</style>
          </div>
        );
      case 'hollow-knight':
        const isSilksong = theme.accentColor === 'silksong-red' || theme.accentColor === 'silksong-gold';
        const primaryColor = isSilksong ? 'text-rose-600 dark:text-rose-500' : 'text-slate-800 dark:text-white';
        const borderColor = isSilksong ? 'border-rose-900/50' : 'border-slate-200 dark:border-white/20';
        const bgColor = 'bg-white dark:bg-[#0a0a0a]';
        
        return (
          <div className={`p-8 sm:p-16 text-center relative overflow-hidden border-4 ${borderColor} ${bgColor} rounded-sm`}>
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 dark:via-black/40 dark:to-black/90 pointer-events-none" />
            
            {/* Decorative corners */}
            <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${isSilksong ? 'border-rose-900' : 'border-slate-200 dark:border-slate-800'}`} />
            <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${isSilksong ? 'border-rose-900' : 'border-slate-200 dark:border-slate-800'}`} />
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${isSilksong ? 'border-rose-900' : 'border-slate-200 dark:border-slate-800'}`} />
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${isSilksong ? 'border-rose-900' : 'border-slate-200 dark:border-slate-800'}`} />

            <motion.h2 
              initial={{ letterSpacing: '1em', opacity: 0 }}
              animate={{ letterSpacing: '0.4em', opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`text-4xl sm:text-7xl font-serif italic mb-12 relative z-10 uppercase ${primaryColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
            >
              {percentage === 100 ? (isSilksong ? 'ASCENDED' : 'STEEL SOUL') : 'COMPLETION'}
            </motion.h2>

            <div className="flex flex-col sm:flex-row gap-8 mb-12 relative z-10">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="flex-1 bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/5 p-8 flex flex-col items-center justify-center rounded-sm group hover:border-slate-300 dark:hover:border-white/20 transition-colors"
               >
                 <div className="flex items-center gap-3 mb-2">
                   <Coins className={`w-8 h-8 ${isSilksong ? 'text-rose-500' : 'text-yellow-500'} animate-pulse`} />
                   <div className={`text-6xl font-serif italic ${primaryColor}`}>{score}</div>
                 </div>
                 <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">Geo Collected</div>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.7 }}
                 className="flex-1 bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/5 p-8 flex flex-col items-center justify-center rounded-sm group hover:border-slate-300 dark:hover:border-white/20 transition-colors"
               >
                 <div className={`text-6xl font-serif italic ${primaryColor} mb-2`}>{percentage}%</div>
                 <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">Journal Entry</div>
               </motion.div>
            </div>

            <div className="relative z-10">
              {renderButtons(
                 `flex-1 py-4 bg-white dark:bg-black/80 border ${isSilksong ? 'border-rose-900/50' : 'border-slate-200 dark:border-white/20'} text-slate-800 dark:text-white font-serif italic uppercase tracking-[0.2em] hover:border-slate-400 dark:hover:border-white transition-all flex items-center justify-center gap-2 text-[10px] rounded-sm`,
                 `flex-1 py-4 bg-white dark:bg-black/80 border ${isSilksong ? 'border-rose-900/50' : 'border-slate-200 dark:border-white/20'} text-slate-800 dark:text-white font-serif italic uppercase tracking-[0.2em] hover:border-slate-400 dark:hover:border-white transition-all flex items-center justify-center gap-2 text-[10px] rounded-sm`,
                 `flex-1 py-4 bg-white dark:bg-black/80 border ${isSilksong ? 'border-rose-900/50' : 'border-slate-200 dark:border-white/20'} text-slate-800 dark:text-white font-serif italic uppercase tracking-[0.2em] hover:border-slate-400 dark:hover:border-white transition-all flex items-center justify-center gap-2 text-[10px] rounded-sm`,
                 `flex-1 py-4 ${isSilksong ? 'bg-rose-700 text-white' : 'bg-slate-800 dark:bg-white text-white dark:text-black'} font-serif italic uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-[10px] rounded-sm`
              )}
            </div>
            
            {/* Ambient particles */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: [0, 0.5, 0], y: -100, x: (Math.random() - 0.5) * 100 }}
                  transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
                  className="absolute w-1 h-1 bg-slate-400 dark:bg-white rounded-full blur-[1px]"
                  style={{ left: `${Math.random() * 100}%`, top: '100%' }}
                />
              ))}
            </div>
          </div>
        );
      case 'kitler':
        return (
          <div className="bg-white dark:bg-black border-[12px] border-black dark:border-white p-8 sm:p-16 text-center relative shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:shadow-[20px_20px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-6xl sm:text-8xl font-black text-black dark:text-white mb-10 uppercase tracking-tighter italic">FINAL REPORT</h2>
            <div className="flex flex-col sm:flex-row gap-8 mb-10">
               <div className="flex-1 bg-black dark:bg-white p-8">
                 <div className="text-7xl font-black text-white dark:text-black">{score}</div>
                 <div className="text-sm font-black text-white dark:text-black uppercase tracking-widest mt-2">VERIFIED</div>
               </div>
               <div className="flex-1 border-8 border-black dark:border-white p-8">
                 <div className="text-7xl font-black text-black dark:text-white">{percentage}%</div>
                 <div className="text-sm font-black text-black dark:text-white uppercase tracking-widest mt-2">EFFICIENCY</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-tighter border-4 border-black dark:border-white hover:translate-x-1 hover:translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-tighter border-4 border-black dark:border-white hover:translate-x-1 hover:translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-tighter border-4 border-black dark:border-white hover:translate-x-1 hover:translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-red-600 text-white font-black uppercase tracking-tighter border-4 border-black dark:border-white hover:translate-x-1 hover:translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 text-xs"
            )}
          </div>
        );
      default:
        // Modern
        return (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center rounded-[3rem] shadow-2xl">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Exam Complete</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6">
                 <div className="text-5xl font-black text-slate-900 dark:text-white">{score}</div>
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Correct</div>
               </div>
               <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-6">
                 <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{percentage}%</div>
                 <div className="text-sm font-bold text-indigo-500 uppercase tracking-widest mt-2">Score</div>
               </div>
            </div>
            {renderButtons(
               "flex-1 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-xs",
               "flex-1 py-4 bg-indigo-600 rounded-2xl text-white font-bold uppercase hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs"
            )}
          </div>
        );
    }
  };

  return (
    <div className={`max-w-4xl mx-auto py-6 sm:py-12 px-2 sm:px-4 text-center space-y-8 sm:space-y-16 group/${theme.visualStyle} relative`}>
      {renderEasterEgg()}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {renderThemeContent()}
      </motion.div>
    </div>
  );
};

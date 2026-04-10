import { AccentColor } from '../types';

export interface ArcaneStyle {
  border: string;
  glow: string;
  text: string;
  bg: string;
  accent: string;
  accentText: string;
  card: string;
  button: string;
  pattern?: string;
  animation?: string;
  font?: string;
  iconGlow?: string;
}

export const getArcaneStyles = (accentColor: AccentColor): ArcaneStyle => {
  switch (accentColor) {
    case 'arcane-red':
      return {
        border: 'border-red-600/60 shadow-[0_0_15px_rgba(220,38,38,0.4)]',
        glow: 'shadow-[0_0_30px_rgba(220,38,38,0.5)]',
        text: 'text-red-500 font-black tracking-tighter',
        bg: 'bg-red-950/20 backdrop-blur-xl',
        accent: 'bg-red-600',
        accentText: 'text-red-100',
        card: 'rounded-none border-l-4 border-red-600 bg-slate-950/90',
        button: 'bg-red-600 hover:bg-red-500 text-white uppercase italic skew-x-[-10deg]',
        iconGlow: 'drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]',
        animation: 'animate-pulse'
      };
    case 'arcane-blue':
      return {
        border: 'border-cyan-500/40 border-dashed',
        glow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
        text: 'text-cyan-400 font-mono tracking-widest',
        bg: 'bg-slate-950/80 border-cyan-500/20',
        accent: 'bg-cyan-500',
        accentText: 'text-cyan-950',
        card: 'rounded-sm border border-cyan-500/30 bg-slate-900/95 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[length:100%_2px,3px_100%] before:pointer-events-none',
        button: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1',
        iconGlow: 'drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]'
      };
    case 'arcane-gold':
      return {
        border: 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        glow: 'shadow-[0_0_40px_rgba(245,158,11,0.3)]',
        text: 'text-amber-500 font-serif italic',
        bg: 'bg-amber-950/10 backdrop-blur-md border-amber-500/20',
        accent: 'bg-gradient-to-br from-amber-400 to-amber-600',
        accentText: 'text-amber-950',
        card: 'rounded-[2rem] border-2 border-amber-500/40 bg-slate-900/90 shadow-[inset_0_0_30px_rgba(245,158,11,0.1)]',
        button: 'bg-amber-600 hover:bg-amber-500 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-amber-500/40 transition-all duration-300',
        iconGlow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]'
      };
    case 'arcane-green':
      return {
        border: 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        glow: 'shadow-[0_0_35px_rgba(16,185,129,0.4)]',
        text: 'text-emerald-400 font-bold tracking-tight',
        bg: 'bg-emerald-950/20 border-emerald-500/30',
        accent: 'bg-emerald-500',
        accentText: 'text-emerald-950',
        card: 'rounded-3xl border-2 border-emerald-500/20 bg-slate-950/90 overflow-hidden relative after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)] after:pointer-events-none',
        button: 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl border-t border-emerald-400/30 shadow-xl',
        iconGlow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]'
      };
    case 'arcane-neon-pink':
      return {
        border: 'border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.4)]',
        glow: 'shadow-[0_0_40px_rgba(236,72,153,0.5)]',
        text: 'text-pink-400 font-black italic tracking-widest uppercase',
        bg: 'bg-pink-950/30 backdrop-blur-2xl border-pink-500/40',
        accent: 'bg-pink-500',
        accentText: 'text-white',
        card: 'rounded-none border-4 border-pink-500 bg-slate-950/95 skew-x-[-2deg] shadow-[10px_10px_0_0_rgba(236,72,153,0.3)]',
        button: 'bg-pink-500 hover:bg-pink-400 text-white font-black tracking-tighter uppercase px-8 py-3 skew-x-[5deg]',
        iconGlow: 'drop-shadow-[0_0_15px_rgba(236,72,153,1)]'
      };
    case 'arcane-plasma-cyan':
      return {
        border: 'border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.3)]',
        glow: 'shadow-[0_0_50px_rgba(34,211,238,0.4)]',
        text: 'text-cyan-300 font-light tracking-[0.2em]',
        bg: 'bg-cyan-950/20 border-cyan-400/20',
        accent: 'bg-cyan-400',
        accentText: 'text-cyan-950',
        card: 'rounded-[3rem] border border-cyan-400/30 bg-slate-900/80 backdrop-blur-3xl shadow-[inset_0_0_50px_rgba(34,211,238,0.05)]',
        button: 'bg-cyan-400 hover:bg-cyan-300 text-cyan-950 rounded-full font-black tracking-widest transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]',
        iconGlow: 'drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]'
      };
    case 'arcane-void-purple':
      return {
        border: 'border-indigo-600/40 shadow-[0_0_30px_rgba(79,70,229,0.2)]',
        glow: 'shadow-[0_0_60px_rgba(79,70,229,0.3)]',
        text: 'text-indigo-400 font-thin tracking-widest',
        bg: 'bg-black/90 border-indigo-900/50',
        accent: 'bg-indigo-600',
        accentText: 'text-white',
        card: 'rounded-full border-2 border-indigo-900/30 bg-black/95 shadow-[0_0_100px_rgba(79,70,229,0.1)] p-12',
        button: 'bg-indigo-900/50 hover:bg-indigo-800 text-indigo-100 border border-indigo-500/30 rounded-full transition-all duration-700 hover:tracking-[0.5em]',
        iconGlow: 'drop-shadow-[0_0_20px_rgba(79,70,229,0.6)]'
      };
    case 'arcane-solar-flare':
      return {
        border: 'border-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.4)]',
        glow: 'shadow-[0_0_50px_rgba(249,115,22,0.5)]',
        text: 'text-orange-400 font-black tracking-tighter',
        bg: 'bg-orange-950/30 border-orange-500/40',
        accent: 'bg-orange-500',
        accentText: 'text-white',
        card: 'rounded-xl border-b-8 border-orange-600 bg-slate-950/90 shadow-[0_20px_50px_rgba(249,115,22,0.2)]',
        button: 'bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white font-black rounded-lg shadow-2xl transition-transform hover:-translate-y-1',
        iconGlow: 'drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]'
      };
    case 'arcane-violet':
    default:
      return {
        border: 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
        glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
        text: 'text-purple-500 font-black italic tracking-tighter',
        bg: 'bg-purple-950/10 backdrop-blur-xl border-purple-500/20',
        accent: 'bg-purple-600',
        accentText: 'text-white',
        card: 'rounded-[2.5rem] border-2 border-purple-500/30 bg-slate-950/90 shadow-[0_0_50px_rgba(168,85,247,0.1)]',
        button: 'bg-purple-600 hover:bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105',
        iconGlow: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]'
      };
  }
};

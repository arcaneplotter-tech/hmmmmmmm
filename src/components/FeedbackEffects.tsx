import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Star, Heart, Zap, Sparkles, Ghost, Bird, User, Flame, Bomb, Trophy } from 'lucide-react';
import { VisualStyle, AccentColor } from '../types';

interface FeedbackEffectsProps {
  status: 'correct' | 'incorrect' | 'none';
  theme: VisualStyle;
  accent: AccentColor;
}

export const FeedbackEffects: React.FC<FeedbackEffectsProps> = ({ status, theme, accent }) => {
  if (status === 'none') return null;

  const isCorrect = status === 'correct';

  // Helper to get accent color hex/rgb for animations
  const getAccentColor = () => {
    switch (accent) {
      case 'indigo': return '#4f46e5';
      case 'emerald': return '#10b981';
      case 'rose': return '#f43f5e';
      case 'amber': return '#f59e0b';
      case 'cyan': return '#06b6d4';
      case 'lime': return '#84cc16';
      case 'brutal-red': return '#D32F2F';
      case 'brutal-blue': return '#1976D2';
      case 'brutal-yellow': return '#FBC02D';
      case 'brutal-green': return '#388E3C';
      case 'creeper-green': return '#5eed5e';
      case 'enderman-purple': return '#800080';
      case 'tadc-kinger': return '#6b21a8';
      case 'tadc-caine': return '#dc2626';
      case 'duck-yellow': return '#FFD700';
      case 'duck-orange': return '#FF8C00';
      case 'duck-blue': return '#00BFFF';
      case 'duck-white': return '#F0F8FF';
      case 'undertale-red': return '#ff0000';
      case 'undertale-blue': return '#00ffff';
      case 'saidi-white': return '#f5f5dc';
      case 'saidi-cream': return '#fff8e1';
      case 'saidi-dark': return '#1a1a1a';
      case 'saidi-gold': return '#ffd700';
      case 'arcane-violet': return '#8a2be2';
      case 'arcane-red': return '#ef4444';
      case 'arcane-blue': return '#3b82f6';
      case 'arcane-gold': return '#f59e0b';
      case 'arcane-green': return '#10b981';
      case 'arcane-neon-pink': return '#ff00ff';
      case 'arcane-plasma-cyan': return '#00ffff';
      case 'arcane-void-purple': return '#4a00e0';
      case 'arcane-solar-flare': return '#ff3300';
      case 'finn-blue': return '#00A2E8';
      case 'jake-yellow': return '#FFC90E';
      case 'ultimate-cosmic': return '#8b5cf6';
      case 'ultimate-easter': return '#fbcfe8';
      case 'superhero-spiderman': return '#E23636';
      case 'superhero-batman': return '#1A1A1A';
      case 'superhero-superman': return '#005BBF';
      case 'hollow-knight-white': return '#ffffff';
      case 'hollow-knight-black': return '#000000';
      case 'silksong-red': return '#ff3333';
      case 'silksong-gold': return '#ffd700';
      case 'kitler': return '#FF0000';
      default: return '#6366f1';
    }
  };

  const accentColor = getAccentColor();

  const renderParticles = (count: number, color: string, icon?: any, duration: number = 1.2) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const velocity = 60 + Math.random() * 140;
      const Icon = icon;
      
      // Special logic for creeper-green accent
      const isCreeper = accent === 'creeper-green';
      const particleColor = isCreeper && !isCorrect ? '#000000' : color;
      
      return (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: Math.cos(angle) * velocity, 
            y: Math.sin(angle) * velocity, 
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 720
          }}
          transition={{ duration, ease: "easeOut" }}
          className="absolute"
          style={{ color: particleColor }}
        >
          {Icon ? (
            <Icon 
              className="w-5 h-5 fill-current" 
              style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} 
            />
          ) : (
            <div className="w-3 h-3 rounded-full bg-current shadow-md" />
          )}
        </motion.div>
      );
    });
  };

  const renderThemeEffect = () => {
    switch (theme) {
      case 'ultimate':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 4, 6], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5 }}
                  className="absolute w-32 h-32 rounded-full"
                  style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
                />
                <motion.div 
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 360, scale: [0, 2, 0] }}
                  transition={{ duration: 1.8 }}
                  className="absolute w-64 h-64 border-4 border-dashed rounded-full opacity-30"
                  style={{ borderColor: accentColor }}
                />
                {renderParticles(12, accentColor, Sparkles)}
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: [2, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute w-32 h-32 rounded-full bg-black"
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], x: [-20, 20, -10, 10, 0] }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                {renderParticles(8, '#ff00ff', Zap)}
              </>
            )}
          </div>
        );

      case 'game-minecraft':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <div className="relative">
                <motion.div 
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -120, opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute text-emerald-400 font-pixel text-xl whitespace-nowrap"
                >
                  +100 XP
                </motion.div>
                {renderParticles(10, '#5eed5e')}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-red-600/50"
              />
            )}
          </div>
        );

      case 'brutalist':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full border-[40px] border-current"
                  style={{ color: accentColor }}
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 0.6 }}
                  className="absolute h-full w-20 bg-white/30 skew-x-12"
                />
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: [20, -20, 10, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full bg-current"
                  style={{ color: accentColor }}
                />
                <div className="absolute inset-0 flex flex-col justify-around opacity-20">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-1 bg-black w-full" />
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case 'duck':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [20, -60, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2 }}
                  className="will-change-transform"
                >
                  <Bird className="w-20 h-20 text-yellow-400" />
                </motion.div>
                {renderParticles(12, '#60a5fa', Bird)}
              </>
            ) : (
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl font-black text-blue-500"
                >
                  SPLASH!
                </motion.div>
                {renderParticles(8, '#3b82f6')}
              </div>
            )}
          </div>
        );

      case 'undertale':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center"
              >
                <Heart className="w-16 h-16 fill-red-500 text-red-500" />
                <span className="text-white font-pixel mt-4 text-sm">DETERMINATION</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center"
              >
                <Heart className="w-16 h-16 text-slate-700" />
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div key={i} animate={{ x: [0, 5, -5, 0] }} transition={{ duration: 0.1, repeat: 8 }} className="w-2 h-2 bg-slate-700" />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        );

      case 'arcane':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 border-4 border-double rounded-full opacity-20"
                  style={{ borderColor: accentColor }}
                />
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 3, 0], opacity: [0, 0.4, 0] }}
                  transition={{ duration: 1.2 }}
                  className="absolute w-40 h-40 rounded-full blur-2xl"
                  style={{ backgroundColor: accentColor }}
                />
                {renderParticles(15, accentColor, Flame)}
              </>
            ) : (
              <>
                <motion.div 
                  animate={{ 
                    filter: ['none', 'hue-rotate(180deg) blur(15px)', 'none'],
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                  style={{ backgroundColor: accentColor }}
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl font-black text-white mix-blend-difference italic"
                >
                  ERROR
                </motion.div>
              </>
            )}
          </div>
        );

      case 'saidi':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                  transition={{ duration: 1.8 }}
                  className="absolute w-40 h-40 border-8 border-amber-500/30 rounded-full"
                />
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: [0, 1, 0], y: -30 }}
                  transition={{ duration: 1.5 }}
                  className="flex flex-col items-center"
                >
                  <User className="w-20 h-20 text-amber-600" />
                  <span className="text-amber-700 font-serif italic text-xl mt-2">Dignity</span>
                </motion.div>
                {renderParticles(10, '#d4af37', Sparkles)}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: [0, 0.5, 0], scale: [1.2, 1] }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 bg-[#3d2c1e]/60 backdrop-blur-[2px]"
              />
            )}
          </div>
        );

      case 'tadc':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  animate={{ 
                    scale: [1, 2.5, 1],
                    rotate: [0, 270, 540],
                    filter: ['none', 'invert(1) hue-rotate(90deg)', 'none']
                  }}
                  transition={{ duration: 1.5 }}
                  className="will-change-transform"
                >
                  <Zap className="w-24 h-24 text-yellow-400" />
                </motion.div>
                {renderParticles(12, '#ff00ff', Ghost)}
              </>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 max-w-xs">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 0], x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="text-3xl font-black text-red-600"
                  >
                    {['?', '!', '@', '#', '$'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'adventure-time':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 1080 }}
                  transition={{ type: "spring", duration: 1.2, bounce: 0.6 }}
                  className="absolute"
                >
                  <Star className="w-24 h-24 fill-yellow-400 text-yellow-600" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [-20, -60] }}
                  transition={{ duration: 1.5 }}
                  className="absolute text-2xl font-black text-yellow-600 italic"
                >
                  ALGEBRAIC!
                </motion.div>
                {renderParticles(15, '#fbbf24', Sparkles)}
              </>
            ) : (
              <motion.div 
                initial={{ scale: 1, y: 0 }}
                animate={{ scale: [1, 0.7, 1.2, 0], y: [0, 20, -40], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-5xl font-black text-indigo-700 italic tracking-tighter">BUMMER!</div>
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                  <Bird className="w-12 h-12 text-indigo-400 mt-4" />
                </motion.div>
              </motion.div>
            )}
          </div>
        );

      case 'superhero':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <motion.div 
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.5, stiffness: 400 }}
                className="px-12 py-6 bg-yellow-400 border-8 border-black shadow-[12px_12px_0_0_#000] -rotate-3 relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border-4 border-black rotate-45" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white border-4 border-black rotate-45" />
                <span className="text-6xl font-black text-black italic tracking-tighter uppercase">AMAZING!</span>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1], x: [-10, 10, -10, 10, 0] }}
                transition={{ duration: 0.8 }}
                className="px-12 py-6 bg-red-600 border-8 border-black shadow-[12px_12px_0_0_#000] rotate-3"
              >
                <span className="text-6xl font-black text-white italic tracking-tighter uppercase">OOF!</span>
              </motion.div>
            )}
          </div>
        );

      case 'minimal':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1] }}
                transition={{ duration: 1 }}
                className="w-full h-full bg-emerald-500/10"
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="w-full h-full bg-rose-500/10"
              />
            )}
          </div>
        );

      case 'hollow-knight':
        const isSilksong = accent === 'silksong-red' || accent === 'silksong-gold';
        const primaryColor = isSilksong ? '#ff3333' : '#ffffff';
        const secondaryColor = isSilksong ? '#441111' : '#000000';
        
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 4, 6], opacity: [0, 0.4, 0] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-32 h-32 rounded-full blur-xl"
                  style={{ backgroundColor: primaryColor }}
                />
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2, 3], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute w-20 h-20 border-2 rounded-full"
                  style={{ borderColor: primaryColor }}
                />
                {renderParticles(8, primaryColor, Sparkles)}
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 2], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-40 h-40 blur-2xl"
                  style={{ backgroundColor: secondaryColor }}
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], x: [-10, 10, 0] }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-black/60"
                />
                {renderParticles(5, secondaryColor, Ghost)}
              </>
            )}
          </div>
        );

      case 'kitler':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ 
                    scale: [0.5, 1.05, 1], 
                    opacity: [0, 1, 1, 0],
                    rotate: [-20, 5, 0]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    times: [0, 0.15, 0.85, 1],
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="text-[26vmin] font-black italic select-none z-[60] no-kitler"
                >
                  JA!
                </motion.div>
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 6, 20], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3.5, ease: "easeOut" }}
                  className="absolute w-64 h-64 border-[80px] border-black dark:border-white opacity-25"
                />
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ scale: 1.5, opacity: 0, rotate: 20 }}
                  animate={{ 
                    scale: [1.5, 0.95, 1], 
                    opacity: [0, 1, 1, 0],
                    rotate: [20, -5, 0]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    times: [0, 0.15, 0.85, 1],
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="text-[26vmin] font-black italic select-none z-[60] no-kitler"
                >
                  NEIN!
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0] }}
                  transition={{ duration: 3.0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                />
              </>
            )}
          </div>
        );

      case 'modern':
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isCorrect ? (
              <>
                <motion.div 
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 5, opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute w-32 h-32 rounded-full border-8"
                  style={{ borderColor: accentColor }}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 0], y: -20 }}
                  transition={{ duration: 1 }}
                  className="will-change-transform"
                >
                  <Trophy className="w-20 h-20" style={{ color: accentColor }} />
                </motion.div>
                {renderParticles(12, accentColor)}
              </>
            ) : (
              <motion.div 
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: [15, -15, 10, -10, 0], opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.8 }}
                className="will-change-transform"
              >
                <Bomb className="w-24 h-24 text-red-500" />
              </motion.div>
            )}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[50] pointer-events-none overflow-hidden"
      >
        {renderThemeEffect()}
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Menu, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeRaw];

interface DustParticlesProps {
  active: boolean;
  color?: string;
  count?: number;
}

export const DustParticles: React.FC<DustParticlesProps> = ({ active, color = "rgba(255, 255, 255, 0.2)", count = 30 }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      maxOpacity: Math.random() * 0.5 + 0.2
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, color, count]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
    />
  );
};

export const HollowKnightBackground: React.FC<{ active: boolean; accent?: string; performanceMode?: boolean }> = ({ active, accent, performanceMode = false }) => {
  if (!active) return null;
  const isSilksong = accent === 'hollow-knight-silksong';
  const particleColor = isSilksong ? "rgba(225, 29, 72, 0.1)" : "rgba(255, 255, 255, 0.1)";
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <DustParticles active={active} color={particleColor} count={performanceMode ? 20 : (isSilksong ? 40 : 30)} />
    </div>
  );
};


export const ScreenShake: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => {
  return (
    <motion.div
      animate={active ? {
        x: [0, -5, 5, -5, 5, 0],
        y: [0, 2, -2, 2, -2, 0],
      } : {}}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export const SoulAbsorption: React.FC<{ active: boolean; color?: string; performanceMode?: boolean }> = ({ active, color = "#ffffff", performanceMode = false }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particleCount = performanceMode ? 10 : 20;
    const targetY = window.innerWidth < 640 ? 110 : 130;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: canvas.width / 2,
      targetY: targetY, // Aligned with background vessel
      size: Math.random() * 3 + 1.5,
      speed: Math.random() * 0.08 + 0.04,
      opacity: 1,
      life: 1
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      
      const targetY = canvas.width < 640 ? 110 : 130;
      
      if (!performanceMode) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
      }

      let allDone = true;
      particles.forEach(p => {
        if (p.life <= 0) return;
        allDone = false;

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * p.speed;
        p.y += dy * p.speed;
        p.life -= 0.01;

        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!allDone) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, color]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
};

export const HollowKnightDialogue: React.FC<{ 
  text: string; 
  active: boolean; 
  accent?: string;
  onTermClick?: (title: string, word: string) => void;
}> = ({ text, active, accent, onTermClick }) => {
  if (!active) return null;
  const isSilksong = accent === 'hollow-knight-silksong';
  const borderColor = isSilksong ? 'border-rose-900/40' : 'border-white/10';
  const cornerColor = isSilksong ? 'border-rose-500/30' : 'border-white/20';
  const titleColor = isSilksong ? 'text-rose-500/40' : 'text-white/30';
  const dotColor = isSilksong ? 'bg-rose-500/30' : 'bg-white/20';

  const markdownComponents = {
    p: ({children}: any) => <p className="mb-4 last:mb-0">{children}</p>,
    strong: ({children}: any) => <strong className={`font-black ${isSilksong ? 'text-rose-400' : 'text-white'}`}>{children}</strong>,
    em: ({children}: any) => <em className="italic opacity-80">{children}</em>,
    mark: ({children}: any) => (
      <mark className={`px-1.5 py-0.5 rounded-sm bg-transparent border-b-2 ${isSilksong ? 'border-rose-500 text-rose-200' : 'border-slate-400 text-slate-100'}`}>
        {children}
      </mark>
    ),
    term: ({ title, children }: any) => (
      <span 
        onClick={() => onTermClick?.(title || '', String(children))}
        className={`cursor-help border-b border-dashed ${isSilksong ? 'border-rose-400 text-rose-300 hover:text-rose-100' : 'border-slate-400 text-slate-200 hover:text-white'} transition-colors`}
        title={title}
      >
        {children}
      </span>
    ),
    ul: ({children}: any) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    li: ({children}: any) => <li className="text-sm sm:text-base">{children}</li>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        y: [0, -5, 0]
      }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        filter: { duration: 0.5 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className={`relative p-8 sm:p-10 ${isSilksong ? 'bg-[#1a0505]' : 'bg-[#0a0a0a]'} border-2 ${borderColor} rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.4)] max-w-3xl mx-auto overflow-hidden font-serif will-change-transform`}
    >
      {/* Background vignette */}
      <div className={`absolute inset-0 ${isSilksong ? 'bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.03)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]'} pointer-events-none`} />
      
      {/* Glitch Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay"
      />
      
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-6 ${isSilksong ? 'bg-[#1a0505]' : 'bg-[#0a0a0a]'} border-x-2 border-t-2 ${borderColor} text-[10px] uppercase tracking-[0.4em] ${titleColor}`}>
        {isSilksong ? "Pharloom's Journal" : "The Hunter's Journal"}
      </div>
      
      <div className="text-slate-200 text-lg sm:text-xl leading-relaxed tracking-wide italic text-center relative z-10 markdown-journal">
        <ReactMarkdown 
          remarkPlugins={REMARK_PLUGINS} 
          rehypePlugins={REHYPE_PLUGINS}
          components={markdownComponents as any}
        >
          {text}
        </ReactMarkdown>
      </div>
      
      <div className="mt-6 flex justify-center gap-3 relative z-10">
        {[0, 0.3, 0.6].map((delay, i) => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
            className={`w-1.5 h-1.5 ${dotColor} rounded-full`} 
          />
        ))}
      </div>

      {/* Decorative corners */}
      <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${cornerColor}`} />
      <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${cornerColor}`} />
      <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${cornerColor}`} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${cornerColor}`} />
    </motion.div>
  );
};

export const HollowKnightHeader: React.FC<{ 
  score: number; 
  total: number; 
  accent: string;
}> = ({ score, total, accent }) => {
  const isSilksong = accent === 'hollow-knight-silksong';
  const vesselColor = isSilksong ? '#e63946' : '#ffffff';
  const progress = (score / total) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        {/* Main Vessel */}
        <div className={`absolute inset-0 rounded-full border-4 ${isSilksong ? 'border-[#441111] dark:border-[#441111]' : 'border-slate-200 dark:border-[#333]'} bg-slate-100 dark:bg-[#111] overflow-hidden shadow-2xl`}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            className="absolute bottom-0 left-0 w-full transition-all duration-1000"
            style={{ 
              backgroundColor: vesselColor,
              boxShadow: isSilksong ? `0 0 20px ${vesselColor}88` : `0 0 20px rgba(0,0,0,0.1)`
            }}
          >
            {/* Liquid Effect */}
            <motion.div
              animate={{ x: [-5, 5, -5], y: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[120%] h-4 -translate-y-1/2 opacity-50 will-change-transform"
              style={{ backgroundColor: vesselColor, borderRadius: '50%' }}
            />
            <motion.div
              animate={{ x: [5, -5, 5], y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[120%] h-4 -translate-y-1/2 opacity-30 will-change-transform"
              style={{ backgroundColor: vesselColor, borderRadius: '50%' }}
            />
          </motion.div>
        </div>
        
        {/* Decorative Horns/Needles */}
        {!isSilksong ? (
          <>
            <div className="absolute -top-4 left-2 w-4 h-8 bg-slate-200 dark:bg-[#333] rounded-t-full -rotate-12 border-t-2 border-slate-400 dark:border-white/10" />
            <div className="absolute -top-4 right-2 w-4 h-8 bg-slate-200 dark:bg-[#333] rounded-t-full rotate-12 border-t-2 border-slate-400 dark:border-white/10" />
          </>
        ) : (
          <>
            {/* Hornet's Horns */}
            <div className="absolute -top-6 left-1 w-3 h-10 bg-[#441111] rounded-t-full -rotate-15 border-t-2 border-rose-500/30" />
            <div className="absolute -top-6 right-1 w-3 h-10 bg-[#441111] rounded-t-full rotate-15 border-t-2 border-rose-500/30" />
            {/* Silk Threads */}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scaleY: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1px] h-10 bg-rose-500/40" 
            />
          </>
        )}
      </div>

      <div className="flex flex-col">
        <span className={`text-[10px] uppercase tracking-[0.4em] font-serif ${isSilksong ? 'text-rose-600 dark:text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
          {isSilksong ? 'Silk' : 'Soul'}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-serif italic text-slate-800 dark:text-slate-200 tracking-tighter">
            {score}
          </span>
          <span className="text-slate-300 dark:text-slate-600 font-serif">/</span>
          <span className="text-lg font-serif text-slate-500 dark:text-slate-400">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
};

export const HollowKnightExamUI: React.FC<{
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  timeRemaining: number;
  accent: string;
  onShowMap: () => void;
}> = ({ currentQuestionIndex, totalQuestions, progress, timeRemaining, accent, onShowMap }) => {
  const isSilksong = accent === 'hollow-knight-silksong';
  const primaryColor = isSilksong ? 'text-rose-600 dark:text-rose-500' : 'text-slate-800 dark:text-white';
  const borderColor = isSilksong ? 'border-rose-900/50' : 'border-slate-200 dark:border-white/20';
  const bgColor = 'bg-white dark:bg-[#0a0a0a]';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-0 z-50 space-y-2 sm:space-y-4 pt-2 sm:pt-4 bg-transparent -mx-2 sm:-mx-4 px-2 sm:px-4">
      <div className={`flex flex-col xs:flex-row items-stretch xs:items-center justify-between ${bgColor} p-2 sm:p-4 md:p-5 rounded-sm shadow-2xl border-2 ${borderColor} gap-2 sm:gap-6 relative overflow-hidden`}>
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Floating Particles in Header Removed for Performance - Global Particles are enough */}
        
        <div className="flex items-center justify-between xs:justify-start gap-2 sm:gap-4 relative z-10">
          <button
            onClick={onShowMap}
            className={`p-2 sm:p-3 bg-slate-50 dark:bg-black/40 rounded-sm text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-white transition-all border-2 ${borderColor} active:translate-y-0.5 group/hk-btn`}
          >
            <Menu className="w-4 h-4 sm:w-5 h-5 md:w-6 md:h-6 group-hover/hk-btn:scale-110 transition-transform" />
          </button>
          <div className="flex flex-col">
            <p className={`text-[8px] sm:text-[10px] font-serif italic uppercase ${isSilksong ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'} tracking-[0.3em] leading-none`}>Journal Entry</p>
            <p className={`text-sm sm:text-lg md:text-xl font-serif italic ${primaryColor} leading-tight`}>{currentQuestionIndex + 1} <span className="text-slate-300 dark:text-slate-700 mx-0.5">/</span> {totalQuestions}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-2 sm:px-4 relative z-10">
           {/* Custom HK Progress Bar */}
           <div className="w-full max-w-md space-y-1">
             <div className={`h-3 sm:h-4 bg-slate-100 dark:bg-black/60 border-2 ${borderColor} rounded-sm relative overflow-hidden p-0.5`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 40, damping: 20 }}
                  className={`h-full ${isSilksong ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-slate-300 dark:bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'} rounded-sm relative overflow-hidden will-change-[width]`}
                >
                  {/* Silk/Soul shine */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12 will-change-transform"
                  />
                </motion.div>
             </div>
             <div className="flex justify-between items-center px-1">
                <span className={`text-[7px] sm:text-[8px] font-serif italic uppercase ${isSilksong ? 'text-rose-400' : 'text-slate-400'} tracking-[0.2em]`}>Completion</span>
                <span className={`text-[7px] sm:text-[8px] font-serif italic ${primaryColor}`}>{Math.round(progress)}%</span>
             </div>
           </div>
        </div>

        <div className="flex items-center justify-between xs:justify-end gap-2 sm:gap-4 relative z-10">
          <div className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-sm font-serif italic text-xs sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2 border-2 ${borderColor} transition-colors ${
            timeRemaining < 10 && timeRemaining > 0 ? 'bg-rose-500/10 text-rose-600 animate-pulse' : 
            'bg-slate-50 dark:bg-black/40 text-slate-800 dark:text-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Decorative corners */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${borderColor}`} />
        <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${borderColor}`} />
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${borderColor}`} />
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${borderColor}`} />
      </div>
    </div>
  );
};

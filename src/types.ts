export type QuestionType = 'mcq' | 'essay' | 'true_false' | 'matching' | 'fill_in_blanks' | 'multi_select' | 'locate_on_image';

export interface ImageTarget {
  id: string;
  x: number;
  y: number;
  radius: number;
  label?: string;
}

export interface EssayFeedback {
  score: number;
  grade: string;
  feedback: string;
  usedTerms: string[];
  missingTerms: string[];
  misspelledWords?: string[];
  length: number;
  hasParagraphs: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  imageUrl?: string;
  options?: string[]; // For MCQ, Multi-Select
  correctAnswer?: string; // For MCQ/Essay
  correctAnswers?: string[]; // For Multi-Select
  wrongPart?: string; // For True/False questions where answer is False
  explanation?: string;
  matchingPairs?: { term: string; definition: string }[]; // For Matching
  matchingDistractors?: string[]; // Extra definitions/matches for Matching
  blanks?: string[]; // For Fill in the Blanks (correct words)
  wordBank?: string[]; // For Fill in the Blanks (available words)
  imageTargets?: ImageTarget[]; // For locate_on_image
  keywords?: string[]; // For Essay hints
}

export type AccentColor = 
  | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'lime' 
  | 'brutal-red' | 'brutal-blue' | 'brutal-yellow' | 'brutal-green'
  | 'creeper-green' | 'enderman-purple'
  | 'tadc-kinger' | 'tadc-caine'
  | 'duck-yellow' | 'duck-orange' | 'duck-blue' | 'duck-white'
  | 'undertale-red' | 'undertale-blue'
  | 'saidi-white' | 'saidi-cream' | 'saidi-dark' | 'saidi-gold'
  | 'arcane-violet' | 'arcane-red' | 'arcane-blue' | 'arcane-gold' | 'arcane-green' | 'arcane-neon-pink' | 'arcane-plasma-cyan' | 'arcane-void-purple' | 'arcane-solar-flare'
  | 'finn-blue' | 'jake-yellow'
  | 'ultimate-cosmic' | 'ultimate-easter'
  | 'superhero-spiderman' | 'superhero-batman' | 'superhero-superman'
  | 'hollow-knight-pale' | 'hollow-knight-silksong' | 'hollow-knight-white' | 'hollow-knight-black' | 'silksong-red' | 'silksong-gold'
  | 'kitler';
export type VisualStyle = 'modern' | 'brutalist' | 'game-minecraft' | 'tadc' | 'duck' | 'undertale' | 'saidi' | 'minimal' | 'arcane' | 'adventure-time' | 'ultimate' | 'superhero' | 'hollow-knight' | 'kitler';

export type TextAnimationType = 'typewriter' | 'scramble' | 'fade-up' | 'blur-in' | 'glitch' | 'reveal' | 'bounce' | 'wave' | 'flip' | 'shimmer' | 'pop' | 'elastic';

export interface UICustomization {
  enabled: boolean;
  uiSize: number;
  customFontUrl: string | null;
  performanceMode: boolean;
  optimizationMode: boolean;
  dynamicBackgroundEnabled: boolean;
  dynamicBackgroundIntensity: number;
  borderRadius: number;
  spacing: number;
  blurEnabled: boolean;
  shadowsEnabled: boolean;
  textFontSize: number;
  textFontWeight: number;
  textLetterSpacing: number;
  textLineHeight: number;
  particleMaxConnections?: number;
  particleConnectionDistance?: number;
  particleMaxSize?: number;
  particleCount?: number;
  particleReduceLag?: boolean;
}

export type OverlayShape = 'circle' | 'rect' | 'triangle' | 'diamond' | 'blob';
export type BackgroundShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'heart' | 'hexagon' | 'pentagon';
export type ShapeAnimation = 'none' | 'hover' | 'spin' | 'pulse' | 'float' | 'bounce' | 'shake' | 'swing' | 'slide' | 'zoom' | 'glitch';

export interface BackgroundOverlay {
  id: string;
  shape: OverlayShape;
  color: string;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  animation?: ShapeAnimation;
  animationSpeed?: number;
  animationDuration?: number;
  animationDelay?: number;
  blur?: number;
  zIndex?: number;
}

export interface BackgroundShape {
  id: string;
  type: BackgroundShapeType;
  color: string;
  opacity: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  animation: ShapeAnimation;
  animationSpeed: number;
  animationDuration: number;
  animationDelay?: number;
  blur?: number;
  zIndex?: number;
}

export interface ButtonConfig {
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  paddingX: number;
  paddingY: number;
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  hoverScale: number;
  activeScale: number;
  animation: 'none' | 'pulse' | 'shimmer' | 'bounce' | 'glow';
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  italic: boolean;
}

export interface BackgroundConfig {
  backgroundColor: string;
  backgroundGradient?: {
    enabled: boolean;
    type: 'linear' | 'radial' | 'conic';
    colors: string[];
    angle: number;
    animation?: 'none' | 'spin' | 'shift' | 'pulse';
    animationSpeed?: number;
  };
  pattern?: {
    type: 'none' | 'dots' | 'grid' | 'stripes' | 'waves' | 'zigzag' | 'crosshatch' | 'polka' | 'chevrons';
    color: string;
    opacity: number;
    size: number;
    thickness: number;
    animation?: 'none' | 'slide' | 'fade' | 'zoom';
    animationSpeed?: number;
  };
  overlays: BackgroundOverlay[];
  shapes: BackgroundShape[];
}

export interface CustomTheme {
  id: string;
  name: string;
  backgroundColor: string;
  buttonColor: string;
  interfaceName: string;
  fontStyle: string;
  backgroundConfig?: BackgroundConfig;
  buttonConfig?: ButtonConfig;
}

export interface AppTheme {
  visualStyle: VisualStyle;
  accentColor: AccentColor;
  textAnimationEnabled: boolean;
  textAnimationType: TextAnimationType;
  textAnimationSpeed: number;
  uiCustomization?: UICustomization;
  superheroAttackIndex?: number;
  customTheme?: CustomTheme;
}

export type PowerType = 'advantage' | 'offensive' | 'interactive';

export interface Power {
  id: string;
  name: string;
  type: PowerType;
  description: string;
  icon: string; // Lucide icon name
  supportedQuestionTypes?: QuestionType[];
}

export interface ExamSettings {
  timeLimitType: 'per-question' | 'per-exam' | 'none';
  timeLimitValue: number; // in seconds
  instantFeedback: boolean;
  essaysLast: boolean;
  imagesLast: boolean;
  randomizeQuestions: boolean;
  powerSystemEnabled: boolean;
  guaranteedPowerPerCorrect: boolean;
  allowedPowerIds?: string[];
  powerDurations?: Record<string, number>;
}

export interface ExamHistoryItem {
  id: string;
  name: string;
  date: number; // timestamp
  score: number;
  totalQuestions: number;
  questions: Question[];
  settings: ExamSettings;
  results: Record<string, string>;
  wrongPartSelections?: Record<string, string>;
  essayFeedback: Record<string, EssayFeedback>;
}

export interface SavedTerm {
  id: string;
  word: string;
  definition: string;
  date: number;
}

export interface SavedExam {
  id: string;
  name: string;
  questions: Question[];
  date: number;
}

export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  essayFeedback?: Record<string, EssayFeedback>;
  wrongPartSelections?: Record<string, string>;
  isFinished: boolean;
  startTime: number;
  timeRemaining: number;
  questionTimes?: Record<string, number>;
  flags?: Record<string, { isFlagged: boolean; percentage?: number }>;
  obtainedPowers: Power[];
  activeOffensivePowers: string[];
  activeInteractivePowers: string[];
  powerEffects: {
    isFiftyFiftyActive?: boolean;
    isAbsolutelySmartActive?: boolean;
    isGlitchActive?: boolean;
    isInkSplashActive?: boolean;
    isMirrorActive?: boolean;
    isFogActive?: boolean;
    isEarthquakeActive?: boolean;
    isTimeWarpActive?: boolean;
    isHintActive?: boolean;
    isShieldActive?: boolean;
    isDoublePointsActive?: boolean;
    isAutoCompleteActive?: boolean;
    isClarityActive?: boolean;
    isStaticNoiseActive?: boolean;
    isUpsideDownActive?: boolean;
    isVibrationActive?: boolean;
    isColorShiftActive?: boolean;
    isClickChallengeActive?: boolean;
    isCircleHuntActive?: boolean;
    isSpinWheelActive?: boolean;
    isBugSquasherActive?: boolean;
    isPatternLockActive?: boolean;
    isSliderUnlockActive?: boolean;
    isPixelateActive?: boolean;
    isBlackoutActive?: boolean;
    isGravityActive?: boolean;
    isThermalActive?: boolean;
    isOldMovieActive?: boolean;
    isDrunkenActive?: boolean;
    isFrostActive?: boolean;
    isScannerActive?: boolean;
    isLowBatteryActive?: boolean;
    isJuiceActive?: boolean;
  };
}

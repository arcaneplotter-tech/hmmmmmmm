import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { Users, User, Play, LogOut, MessageSquare, Send, Clock, CheckCircle2, XCircle, Settings as SettingsIcon, Gamepad2, Copy, Check, X, Layers, FileText, ChevronRight } from 'lucide-react';
import { Question, ExamSettings, AppTheme } from './types';
import { Exam, Settings, Parser } from './App';

const DUCK_IMAGES = [
  'https://cdn3.emoji.gg/emojis/53449-yellow-quack.png',
  'https://cdn3.emoji.gg/emojis/21972-sombreroduck.png',
  'https://cdn3.emoji.gg/emojis/35724-iconicduck.png',
  'https://cdn3.emoji.gg/emojis/17822-duckkkk.png'
];

const DuckDuckEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [ducks, setDucks] = useState<any[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDucks(prev => {
        if (prev.length >= 8) return prev; // Reduced from 12
        const newDuck = {
          id: Math.random().toString(36).substring(2, 9),
          image: DUCK_IMAGES[Math.floor(Math.random() * DUCK_IMAGES.length)],
          left: Math.random() * 100, // percentage
          size: Math.random() * 40 + 40, // 40px to 80px
          duration: Math.random() * 2 + 3, // 3s to 5s
          rotation: Math.random() * 360,
          spinSpeed: Math.random() * 180 + 90, // degrees per second
        };
        return [...prev, newDuck];
      });
    }, 500); // Increased from 300

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onCompleteRef.current();
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
      {ducks.map(duck => (
        <motion.img
          key={duck.id}
          src={duck.image}
          initial={{ y: '-20vh', x: `${duck.left}vw`, rotate: duck.rotation }}
          animate={{ y: '120vh', rotate: duck.rotation + duck.spinSpeed * duck.duration }}
          transition={{ duration: duck.duration, ease: "linear" }}
          onAnimationComplete={() => setDucks(prev => prev.filter(d => d.id !== duck.id))}
          style={{
            position: 'absolute',
            width: duck.size,
            height: duck.size,
            objectFit: 'contain'
          }}
        />
      ))}
    </div>
  );
};

export const MultiplayerMode = ({ onExit, theme, onSyncModeChange, initialSettings }: { onExit: () => void, theme: AppTheme, onSyncModeChange?: (isSync: boolean) => void, initialSettings?: ExamSettings }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [name, setName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [view, setView] = useState<'join' | 'lobby' | 'settings' | 'parser' | 'exam' | 'leaderboard'>('join');
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; id: number } | null>(null);
  const [lastNotification, setLastNotification] = useState<{ message: string; id: number } | null>(null);
  const [isDuckDuckActive, setIsDuckDuckActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastChatCount = useRef(0);

  useEffect(() => {
    if (onSyncModeChange) {
      const isSync = view === 'exam' && room?.mode === 'synchronized';
      onSyncModeChange(isSync);
    }
  }, [view, room?.mode, onSyncModeChange]);

  useEffect(() => {
    // Generate or retrieve participantId
    let pId = localStorage.getItem('multiplayer_participant_id');
    if (!pId) {
      pId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('multiplayer_participant_id', pId);
    }

    // Try to recover session from localStorage
    const savedName = localStorage.getItem('multiplayer_name');
    const savedRoomId = localStorage.getItem('multiplayer_room_id');
    if (savedName) setName(savedName);

    const newSocket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      // If we have a saved room ID and name, try to rejoin
      const currentRoomId = localStorage.getItem('multiplayer_room_id');
      const currentName = localStorage.getItem('multiplayer_name');
      const currentPId = localStorage.getItem('multiplayer_participant_id');
      
      if (currentRoomId && currentName) {
        newSocket.emit("join_room", { 
          roomId: currentRoomId, 
          name: currentName,
          participantId: currentPId 
        }, (response: any) => {
          if (response.success) {
            setView('lobby');
          } else {
            // If rejoining fails, clear the saved room ID
            localStorage.removeItem('multiplayer_room_id');
          }
        });
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("room_update", (updatedRoom) => {
      setRoom(updatedRoom);
      
      // If we are in independent mode and we have finished, show the leaderboard
      const myParticipant = updatedRoom.participants.find((p: any) => p.id === newSocket.id);
      if (updatedRoom.mode === 'independent' && myParticipant?.finished && view === 'exam') {
        setView('leaderboard');
      }

      // Check for new system messages to show as notifications
      if (updatedRoom.chat.length > lastChatCount.current) {
        const newMessages = updatedRoom.chat.slice(lastChatCount.current);
        const lastSysMsg = [...newMessages].reverse().find((m: any) => m.isSystem);
        if (lastSysMsg) {
          setLastNotification({ message: lastSysMsg.message, id: Date.now() });
          if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
          notificationTimerRef.current = setTimeout(() => setLastNotification(null), 3000);
        }
        lastChatCount.current = updatedRoom.chat.length;
      }

      // Persist room ID
      localStorage.setItem('multiplayer_room_id', updatedRoom.id);
      
      if (updatedRoom.status === "playing" && view !== 'exam' && !(updatedRoom.mode === 'independent' && myParticipant?.finished)) {
        setView('exam');
      } else if (updatedRoom.status === "finished" && view !== 'leaderboard') {
        setView('leaderboard');
      } else if (updatedRoom.status === "lobby" && view !== 'lobby' && view !== 'settings' && view !== 'parser') {
        setView('lobby');
      }
    });

    newSocket.on("exam_started", () => {
      setView('exam');
    });

    newSocket.on("exam_finished", () => {
      setView('leaderboard');
    });

    newSocket.on("finish_order", ({ order }) => {
      const suffix = order === 1 ? 'st' : order === 2 ? 'nd' : order === 3 ? 'rd' : 'th';
      setLastNotification({ message: `You finished ${order}${suffix}!`, id: Date.now() });
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = setTimeout(() => setLastNotification(null), 5000);
    });

    newSocket.on("next_question", (index) => {
      // Handled by Exam component or we need to force it
    });

    newSocket.on("notification", (data: { message: string, type: string }) => {
      setLastNotification({ message: data.message, id: Date.now() });
      setTimeout(() => setLastNotification(null), 3000);
    });

    newSocket.on("force_answer", (data: { questionId: string, answer: string, isCorrect?: boolean }) => {
      window.dispatchEvent(new CustomEvent('force_answer', { detail: data }));
    });

    newSocket.on("power_used", (data: { power: any, name: string, userId: string }) => {
      window.dispatchEvent(new CustomEvent('power_used', { detail: data }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [room?.chat, showChat]);

  const handleCreateRoom = () => {
    if (!name.trim() || !socket) return;
    const pId = localStorage.getItem('multiplayer_participant_id');
    localStorage.setItem('multiplayer_name', name);
    socket.emit("create_room", { name, participantId: pId, settings: initialSettings }, (response: any) => {
      if (response.success) {
        setView('lobby');
      }
    });
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomIdInput.trim() || !socket) return;
    const pId = localStorage.getItem('multiplayer_participant_id');
    localStorage.setItem('multiplayer_name', name);
    socket.emit("join_room", { roomId: roomIdInput.toUpperCase(), name, participantId: pId }, (response: any) => {
      if (response.success) {
        setView('lobby');
      } else {
        setLastNotification({ message: response.error, id: Date.now() });
        if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
        notificationTimerRef.current = setTimeout(() => setLastNotification(null), 3000);
      }
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !socket || !room) return;
    socket.emit("send_chat", { roomId: room.id, message: chatMessage, name });
    setChatMessage('');
  };

  const handleStartExam = () => {
    if (socket && room) {
      socket.emit("start_exam", { roomId: room.id });
    }
  };

  const handleAnswer = (questionId: string, answer: string, isCorrect: boolean, timeTaken: number) => {
    if (socket && room) {
      socket.emit("submit_answer", { roomId: room.id, questionId, answer, isCorrect, timeTaken });
      
      // Show instant feedback overlay if enabled in room settings
      if (room.settings?.instantFeedback) {
        setLastFeedback({ isCorrect, id: Date.now() });
        // Clear feedback after 1.5 seconds
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = setTimeout(() => setLastFeedback(null), 1500);
      }
    }
  };

  const handleUsePower = (power: any) => {
    if (socket && room) {
      socket.emit("use_power", { roomId: room.id, power, name });
    }
  };

  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    };
  }, []);

  const handleFinish = (answers: Record<string, string>) => {
    if (socket && room && room.mode === 'independent') {
      const timeTaken = Date.now() - room.startTime;
      socket.emit("finish_exam", { roomId: room.id, timeTaken });
    }
  };

  const handleGenerateQuestions = (questions: Question[]) => {
    if (socket && room) {
      socket.emit("update_settings", { 
        roomId: room.id, 
        exam: questions, 
        settings: room.settings || initialSettings || {
          timeLimitType: 'none',
          timeLimitValue: 60,
          instantFeedback: true,
          essaysLast: false,
          imagesLast: false,
          randomizeQuestions: false
        },
        mode: room.mode
      });
      setView('lobby');
    }
  };

  const handleSaveSettings = (settings: ExamSettings) => {
    if (socket && room) {
      socket.emit("update_settings", { 
        roomId: room.id, 
        exam: room.exam, 
        settings,
        mode: room.mode
      });
      setView('lobby');
    }
  };

  const handleLeaveRoom = () => {
    if (socket && room) {
      socket.emit("leave_room", { roomId: room.id });
    }
    localStorage.removeItem('multiplayer_room_id');
    onExit();
  };

  const handleReturnToLobby = () => {
    if (socket && room && room.hostId === socket.id) {
      socket.emit("return_to_lobby", { roomId: room.id });
    }
  };

  const isHost = socket && room && socket.id === room.hostId;

  if (view === 'join') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black uppercase italic text-slate-900 dark:text-white leading-none">Multiplayer</h2>
                {!isConnected && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Connecting</span>
                  </div>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Join or create a room</p>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm sm:text-base"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleCreateRoom}
                disabled={!name.trim() || !isConnected}
                className="w-full py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs sm:text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] mb-4"
              >
                Create New Room
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <div className="mt-4 flex flex-col xs:flex-row gap-2">
                <input
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                  placeholder="ROOM CODE"
                  maxLength={6}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full xs:flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-black uppercase tracking-widest text-center text-sm sm:text-base"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!name.trim() || !roomIdInput.trim() || !isConnected}
                  className="w-full xs:w-auto px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs sm:text-sm rounded-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleLeaveRoom} className="mt-6 w-full py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentParticipant = room?.participants.find((p: any) => p.id === socket?.id);

  return (
    <div className="h-[calc(100vh-5rem)] sm:h-[calc(100vh-7.5rem)] flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-4 sm:mb-6 mx-2 sm:mx-4 mt-2 sm:mt-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-2 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-black tracking-widest flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
            <span className="hidden sm:inline">ROOM:</span> {room?.id}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(room?.id || '');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="ml-1 sm:ml-2 p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded"
            >
              {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>{room?.participants.filter((p: any) => p.connected).length}</span>
            <span className="hidden sm:inline ml-1">Joined</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 dark:bg-slate-800 rounded-xl relative"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            {room?.chat.length > 0 && !showChat && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>
          <button onClick={handleLeaveRoom} className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 sm:gap-6 px-2 sm:px-4 pb-4">
        <div className="flex-1 min-w-0 overflow-hidden">
          {view === 'lobby' && (
            <div className="h-full !overflow-y-auto bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-center">
              <h2 className="text-xl sm:text-3xl font-black uppercase italic mb-2">Waiting Room</h2>
              <p className="text-xs sm:text-base text-slate-500 mb-4 sm:mb-6">Waiting for host to start the exam...</p>

              {room?.exam && (
                <div className="max-w-md mx-auto mb-6 sm:mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Exam</p>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {room.exam.length} Questions Loaded
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                      {room.mode === 'synchronized' ? 'Synchronized' : 'Independent'}
                    </span>
                    {room.settings?.timeLimitType !== 'none' && (
                      <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                        {room.settings.timeLimitValue}s {room.settings.timeLimitType === 'per-question' ? '/ Question' : 'Total'}
                      </span>
                    )}
                    {room.settings?.instantFeedback && (
                      <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100 dark:border-slate-700">
                        Instant Feedback
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {room?.participants.map((p: any) => (
                  <div key={p.id} className={`p-3 sm:p-4 rounded-2xl border-2 transition-all ${p.connected ? 'border-emerald-100 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 opacity-50'}`}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-black text-sm sm:text-lg mb-2 shadow-sm">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-[10px] sm:text-sm truncate px-1">{p.name}</p>
                    {p.id === room.hostId && <p className="text-[8px] sm:text-[10px] font-black uppercase text-amber-500 mt-1">Host</p>}
                  </div>
                ))}
              </div>

              {isHost && (
                <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <SettingsIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-black uppercase tracking-[0.2em] text-xs sm:text-sm text-slate-500 dark:text-slate-400">Host Control Center</h3>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Exam Management Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content</span>
                        <div className={`w-2 h-2 rounded-full ${room?.exam ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      </div>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setView('parser')} 
                          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold">{room?.exam ? 'Change Exam' : 'Load Exam'}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                        </button>
                        <button 
                          onClick={() => setView('settings')} 
                          disabled={!room?.exam}
                          className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group disabled:opacity-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                              <SettingsIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold">Exam Settings</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>

                    {/* Mode Selection Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Mode</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => socket.emit('update_settings', { 
                            roomId: room.id, 
                            exam: room.exam, 
                            settings: { ...room.settings, instantFeedback: false }, 
                            mode: 'independent' 
                          })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all active:scale-[0.95] ${
                            room?.mode === 'independent' 
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                              : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:border-indigo-200'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-wider">Solo</span>
                        </button>

                        <button 
                          onClick={() => socket.emit('update_settings', { 
                            roomId: room.id, 
                            exam: room.exam, 
                            settings: { ...room.settings, instantFeedback: true }, 
                            mode: 'synchronized' 
                          })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all active:scale-[0.95] ${
                            room?.mode === 'synchronized' 
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                              : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:border-amber-200'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-wider">Sync</span>
                        </button>
                      </div>
                      <p className="text-[8px] font-medium text-slate-400 text-center italic">
                        {room?.mode === 'synchronized' ? 'Host controls the flow' : 'Everyone moves at their own pace'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleStartExam}
                      disabled={!room?.exam}
                      className="group relative w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.3em] text-xs sm:text-sm rounded-[2rem] hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Play className="w-4 h-4 fill-current relative z-10" />
                      <span className="relative z-10">Launch Mission</span>
                      <div className="absolute right-6 opacity-20 group-hover:translate-x-2 transition-transform">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </button>
                    {!room?.exam && (
                      <p className="text-center mt-3 text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">
                        Please load an exam to start
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'leaderboard' && room && (
            <div className="h-full !overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white leading-none">Leaderboard</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Independent Mode Results</p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    {room.participants.filter((p: any) => p.finished).length} / {room.participants.filter((p: any) => p.connected).length} Finished
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <AnimatePresence mode="popLayout">
                  {room.participants
                    .filter((p: any) => p.finished)
                    .sort((a: any, b: any) => {
                      if (b.score !== a.score) return b.score - a.score;
                      return a.time - b.time;
                    })
                    .map((p: any, index: number) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                          p.id === socket?.id 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                            index === 0 ? 'bg-amber-400 text-white' : 
                            index === 1 ? 'bg-slate-300 text-white' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-white dark:bg-slate-800 text-slate-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{p.name} {p.id === socket?.id && '(You)'}</p>
                            <p className="text-[10px] font-medium text-slate-400">
                              {Math.floor(p.time / 60000)}m {Math.floor((p.time % 60000) / 1000)}s
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{p.score}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Points</p>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
                
                {room.participants.filter((p: any) => !p.finished && p.connected).length > 0 && (
                  <div className="pt-8 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Waiting for others to finish...</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {room.participants
                        .filter((p: any) => !p.finished && p.connected)
                        .map((p: any) => (
                          <div key={p.id} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-400">
                            {p.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {isHost && room.participants.filter((p: any) => p.finished).length === room.participants.filter((p: any) => p.connected).length && (
                <button
                  onClick={handleReturnToLobby}
                  className="mt-8 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs sm:text-sm rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-[0.98]"
                >
                  Return to Lobby
                </button>
              )}
              
              {!isHost && (
                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Waiting for host to return to lobby
                </p>
              )}
            </div>
          )}

          {view === 'parser' && isHost && (
            <div className="h-full !overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <Parser onGenerate={handleGenerateQuestions} />
              <button onClick={() => setView('lobby')} className="mt-4 w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
            </div>
          )}

          {view === 'settings' && isHost && (
            <div className="h-full !overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <Settings 
                onStart={handleSaveSettings} 
                initialSettings={room?.settings} 
                theme={theme} 
                buttonText="SAVE SETTINGS" 
                isMultiplayer={true} 
                mode={room?.mode}
              />
              <button onClick={() => setView('lobby')} className="mt-4 w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
            </div>
          )}

          {view === 'exam' && room?.exam && room?.settings && (
            <div className="relative flex flex-col h-full overflow-y-auto custom-scrollbar">
              {room.mode === 'independent' ? (
                <Exam 
                  questions={room.exam} 
                  settings={room.settings} 
                  onFinish={handleFinish} 
                  onAnswer={handleAnswer} 
                  onUsePower={handleUsePower}
                  theme={theme}
                  isMultiplayer={true}
                  participantCount={room.participants.filter((p: any) => p.connected).length}
                  answeredCount={room.participants.filter((p: any) => p.connected && p.finished).length}
                  participants={room.participants.filter((p: any) => p.connected).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    answered: p.finished
                  }))}
                />
              ) : (
                <div key={room.currentQuestionIndex}>
                  <Exam 
                    questions={room.exam} 
                    settings={room.settings.timeLimitType === 'per-exam' ? {...room.settings, timeLimitType: 'none'} : room.settings} 
                    onFinish={() => {}} 
                    onAnswer={handleAnswer} 
                    onUsePower={handleUsePower}
                    theme={theme}
                    isMultiplayer={true}
                    isSynchronized={true}
                    isHost={isHost}
                    onForceNext={() => {}} 
                    participantCount={room.participants.filter((p: any) => p.connected).length}
                    answeredCount={room.participants.filter((p: any) => p.connected && room.answers[p.participantId] && room.answers[p.participantId][room.exam[room.currentQuestionIndex].id]).length}
                    participants={room.participants.filter((p: any) => p.connected).map((p: any) => ({
                      id: p.id,
                      name: p.name,
                      answered: !!(room.answers[p.participantId] && room.answers[p.participantId][room.exam[room.currentQuestionIndex].id])
                    }))}
                    externalQuestionIndex={room.currentQuestionIndex}
                  />
                </div>
              )}
            </div>
          )}

          {view === 'leaderboard' && (
            <div className="h-full !overflow-y-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter">Leaderboard</h2>
              </div>

              <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
                {[...room.participants]
                  .sort((a, b) => b.score - a.score || a.time - b.time)
                  .map((p: any, idx: number) => (
                  <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm sm:text-lg flex-shrink-0 ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base sm:text-lg truncate">{p.name} {p.id === socket?.id && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 sm:py-1 rounded-full ml-1 sm:ml-2 uppercase tracking-widest align-middle">You</span>}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500">{p.finished ? 'Finished' : 'In Progress'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400">{p.score} <span className="text-[10px] sm:text-sm text-slate-400">pts</span></p>
                      {p.time > 0 && <p className="text-[10px] sm:text-xs text-slate-500 font-mono">{Math.floor(p.time / 1000)}s</p>}
                    </div>
                  </div>
                ))}
              </div>

              {isHost && (
                <div className="mt-8 sm:mt-12 text-center">
                  <button onClick={handleReturnToLobby} className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors">
                    Return to Lobby
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <>
              {/* Mobile Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
                onClick={() => setShowChat(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 bottom-4 top-24 z-[110] lg:static lg:inset-auto lg:w-80 lg:flex-shrink-0 lg:z-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl lg:shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-black uppercase tracking-widest text-sm">Room Chat</h3>
                  <button onClick={() => setShowChat(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                    {room?.chat.map((msg: any) => (
                      msg.isSystem ? (
                        <div key={msg.id} className="flex justify-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                            {msg.message}
                          </span>
                        </div>
                      ) : (
                        <div key={msg.id} className={`flex flex-col ${msg.name === name ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">{msg.name}</span>
                          <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.name === name ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                            <p className="text-sm break-words">{msg.message}</p>
                          </div>
                        </div>
                      )
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" disabled={!chatMessage.trim()} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* System Notifications */}
        <AnimatePresence>
          {lastNotification && (
            <motion.div
              key={lastNotification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-24 right-4 z-[150] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-3 font-bold text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {lastNotification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instant Feedback Overlay */}
        <AnimatePresence>
          {lastFeedback && (
            <motion.div
              key={lastFeedback.id}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -50 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] px-12 py-6 rounded-[2rem] font-black text-4xl sm:text-6xl uppercase italic tracking-tighter shadow-2xl border-4 flex items-center gap-4 ${
                lastFeedback.isCorrect 
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/50' 
                  : 'bg-rose-500 text-white border-rose-400 shadow-rose-500/50'
              }`}
            >
              {lastFeedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-10 h-10 sm:w-16 sm:h-16" />
                  Correct!
                </>
              ) : (
                <>
                  <XCircle className="w-10 h-10 sm:w-16 sm:h-16" />
                  Incorrect!
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {isDuckDuckActive && <DuckDuckEffect onComplete={() => setIsDuckDuckActive(false)} />}
      </div>
    </div>
  );
};

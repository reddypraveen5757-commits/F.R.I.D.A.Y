import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Check, Volume2 } from 'lucide-react';
import { AssistantLanguage } from '../types';

interface VoiceOverlayProps {
  isListening: boolean;
  transcript: string;
  onStop: () => void;
  onSubmit: () => void;
  language: AssistantLanguage;
}

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  isListening,
  transcript,
  onStop,
  onSubmit,
  language,
}) => {
  if (!isListening) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        className="fixed inset-0 z-40 bg-slate-950/80 flex flex-col items-center justify-between p-6 sm:p-12 select-none"
      >
        {/* Top Header */}
        <div className="w-full max-w-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              AUDIO INPUT SENSOR ENGAGED
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-xs font-mono text-emerald-300">
            {language === 'te'
              ? 'తెలుగు మోడ్ (Telugu)'
              : language === 'en'
              ? 'English Mode'
              : 'Auto Bilingual Mode'}
          </span>
        </div>

        {/* Center: Holographic Audio Frequency Resonance & Live Speech Transcript */}
        <div className="w-full max-w-lg flex flex-col items-center text-center space-y-6">
          {/* Animated soundwave bars */}
          <div className="flex items-center justify-center gap-1.5 h-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [
                    '16px',
                    `${Math.max(16, Math.sin(i * 0.4) * 60 + 20)}px`,
                    '16px',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (i % 5) * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              />
            ))}
          </div>

          {/* Transcript Display Box */}
          <div className="w-full min-h-[100px] p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center">
            {transcript ? (
              <p className="text-lg sm:text-xl font-medium text-white font-sans tracking-wide leading-relaxed">
                "{transcript}"
              </p>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Mic className="w-8 h-8 text-emerald-400/60 animate-pulse mb-2" />
                <p className="text-sm font-mono text-emerald-300">
                  {language === 'te'
                    ? 'మాట్లాడండి, మీ వాయిస్‌ని వింటున్నాను...'
                    : 'Speak your command now, boss...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="w-full max-w-sm flex items-center justify-center gap-4">
          <button
            onClick={onStop}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2 transition-all"
          >
            <X className="w-4 h-4 text-red-400" /> Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={!transcript.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg shadow-emerald-950"
          >
            <Check className="w-4 h-4" /> Process Command
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

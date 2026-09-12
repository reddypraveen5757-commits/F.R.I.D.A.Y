import React from 'react';
import {
  Volume2,
  VolumeX,
  Settings,
  Zap,
  RotateCcw,
  Sparkles,
  Languages,
} from 'lucide-react';
import { VoiceSettings } from '../types';

interface HeaderProps {
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  onOpenSettings: () => void;
  onOpenQuickFeatures: () => void;
  onClearChat: () => void;
  istTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenQuickFeatures,
  onClearChat,
  istTime,
}) => {
  return (
    <header className="relative z-20 w-full px-4 py-3 border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
      {/* Left: Branding & Core status */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <span className="font-['Orbitron'] font-black text-lg text-cyan-300 tracking-tighter">
            F
          </span>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-['Orbitron'] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              F.R.I.D.A.Y.
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-[10px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              v4.2 NEURAL
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span>Bilingual Intelligence</span>
            <span className="text-cyan-500">•</span>
            <span className="text-cyan-300">తెలుగు / English</span>
          </p>
        </div>
      </div>

      {/* Center: Real-time IST / Chrono Telemetry (hidden on tiny screens) */}
      <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Zap className="w-3.5 h-3.5" />
          <span>STATUS:</span>
          <span className="text-emerald-400 font-semibold">NOMINAL</span>
        </div>
        <span className="text-slate-700">|</span>
        <div>
          <span className="text-slate-500">IST: </span>
          <span className="text-slate-200">{istTime || '14:30:00'}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1 text-cyan-300">
          <Languages className="w-3.5 h-3.5" />
          <span className="uppercase text-[11px]">
            {settings.preferredLanguage === 'auto'
              ? 'AUTO DUAL'
              : settings.preferredLanguage === 'te'
              ? 'TELUGU (తెలుగు)'
              : 'ENGLISH (EN)'}
          </span>
        </div>
      </div>

      {/* Right: Quick Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick features launcher */}
        <button
          onClick={onOpenQuickFeatures}
          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-950 hover:shadow-cyan-900/40"
          title="Quick features: Weather, Math, Translate, Coding, Time"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Features</span>
        </button>

        {/* Audio FX toggle */}
        <button
          onClick={() => onUpdateSettings({ soundEffects: !settings.soundEffects })}
          className={`p-2 rounded-lg border transition-all ${
            settings.soundEffects
              ? 'bg-slate-900/80 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400'
          }`}
          title={settings.soundEffects ? 'Sound FX Enabled' : 'Sound FX Muted'}
        >
          {settings.soundEffects ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Clear chat history */}
        <button
          onClick={onClearChat}
          className="p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
          title="Clear Conversation Telemetry"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Settings modal button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all shadow-sm shadow-cyan-950"
          title="Voice & Language Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Languages,
  Mic,
  Volume2,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';
import { VoiceSettings, AssistantLanguage, AssistantMode } from '../types';
import {
  getAvailableVoices,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
} from '../utils/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSaveSettings: (newSettings: Partial<VoiceSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testingVoice, setTestingVoice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAvailableVoices().then((v) => {
        setVoices(v);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = (lang: 'en' | 'te') => {
    setTestingVoice(true);
    const testPhrase =
      lang === 'te'
        ? 'నమస్కారం! నేను మీ ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ అసిస్టెంట్ ఫ్రైడే. నా వాయిస్ సిస్టమ్ సరిగ్గా పనిచేస్తోంది.'
        : 'Greetings, boss. F.R.I.D.A.Y. vocal synthesis calibrated and operating at peak performance.';

    speakText(testPhrase, {
      lang: lang,
      voiceURI: settings.voiceURI,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
      onEnd: () => setTestingVoice(false),
      onError: () => setTestingVoice(false),
    });
  };

  const hasRecognition = isSpeechRecognitionSupported();
  const hasSynthesis = isSpeechSynthesisSupported();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Orbitron'] text-base font-bold text-white tracking-wide">
                  SYSTEM SETTINGS & TELEMETRY
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Configure bilingual speech, voices, and neural parameters
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Section 1: Bilingual Intelligence */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Languages className="w-4 h-4" /> 1. Bilingual Language Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'auto',
                    title: 'Auto / Dual',
                    desc: 'Dynamically answers in Telugu or English matching prompt',
                  },
                  {
                    id: 'te',
                    title: 'తెలుగు (Telugu)',
                    desc: 'Prioritizes native Telugu script & spoken responses',
                  },
                  {
                    id: 'en',
                    title: 'English (US/UK)',
                    desc: 'Fluent, precise English holographic assistant tone',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onSaveSettings({ preferredLanguage: item.id as AssistantLanguage })
                    }
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.preferredLanguage === item.id
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{item.title}</span>
                      {settings.preferredLanguage === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Speech Recognition (Voice Input) */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Mic className="w-4 h-4" /> 2. Voice Input (Microphone)
                </h4>
                {hasRecognition ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Web Speech Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Mic Unsupported
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Speech Recognition Target Language:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'auto', label: 'Auto Detect' },
                    { id: 'te-IN', label: 'తెలుగు (te-IN)' },
                    { id: 'en-IN', label: 'English (en-IN)' },
                    { id: 'en-US', label: 'English (en-US)' },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() =>
                        onSaveSettings({
                          recognitionLanguage: loc.id as VoiceSettings['recognitionLanguage'],
                        })
                      }
                      className={`px-3 py-2 rounded-lg border text-xs font-mono transition-all text-center ${
                        settings.recognitionLanguage === loc.id
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Speech Synthesis (Voice Output) */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> 3. Voice Output & Vocal Synthesis
                </h4>
                {hasSynthesis ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synthesis Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Synthesis Unavailable
                  </span>
                )}
              </div>

              {/* Auto Speak Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="font-semibold text-sm text-slate-200">
                    Auto-Speak Assistant Replies
                  </span>
                  <p className="text-xs text-slate-400">
                    Automatically vocalizes incoming F.R.I.D.A.Y. telemetry
                  </p>
                </div>
                <button
                  onClick={() => onSaveSettings({ autoSpeak: !settings.autoSpeak })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoSpeak ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoSpeak ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Voice selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Select System Synthesizer Voice ({voices.length} detected):
                </label>
                <select
                  value={settings.voiceURI || ''}
                  onChange={(e) => onSaveSettings({ voiceURI: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-400"
                >
                  <option value="">Default F.R.I.D.A.Y. Adaptive Voice</option>
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}) {v.lang.startsWith('te') ? '★ TELUGU' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sliders: Rate, Pitch, Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Speed:</span>
                    <span className="text-cyan-400">{settings.rate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.1"
                    value={settings.rate}
                    onChange={(e) => onSaveSettings({ rate: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Pitch:</span>
                    <span className="text-cyan-400">{settings.pitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={settings.pitch}
                    onChange={(e) => onSaveSettings({ pitch: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Volume:</span>
                    <span className="text-cyan-400">{Math.round(settings.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.volume}
                    onChange={(e) => onSaveSettings({ volume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              {/* Test Voice Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleTestVoice('te')}
                  disabled={testingVoice}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> Test Telugu Voice (తెలుగు)
                </button>
                <button
                  onClick={() => handleTestVoice('en')}
                  disabled={testingVoice}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> Test English Voice
                </button>
              </div>
            </div>

            {/* Section 4: Assistant Personality Mode */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 4. Assistant Persona & Tone
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'concise',
                    title: 'Tactical HUD',
                    desc: 'Short, fast, high-efficiency answers',
                  },
                  {
                    id: 'technical',
                    title: 'Senior Engineer',
                    desc: 'In-depth code, STEM, and architectural reasoning',
                  },
                  {
                    id: 'companion',
                    title: 'Friendly Companion',
                    desc: 'Warm, encouraging, bilingual conversation partner',
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSaveSettings({ mode: p.id as AssistantMode })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.mode === p.id
                        ? 'bg-purple-950/70 border-purple-400 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold text-xs text-slate-200 block">{p.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 5: Audio FX & System Diagnostics */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="font-semibold text-sm text-slate-200">
                    Holographic Sci-Fi Sound FX
                  </span>
                  <p className="text-xs text-slate-400">
                    Play futuristic Web Audio synthesized chimes on actions
                  </p>
                </div>
                <button
                  onClick={() => onSaveSettings({ soundEffects: !settings.soundEffects })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Neural Protocol:
                </span>
                <span className="text-cyan-300">Gemini 3.8 Flash (Server-Side)</span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shadow-cyan-950"
            >
              Apply Calibration
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

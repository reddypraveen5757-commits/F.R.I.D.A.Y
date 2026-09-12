import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CloudSun,
  Clock,
  Calculator,
  Languages,
  Code2,
  ArrowRight,
  Sparkles,
  Search,
  Volume2,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface QuickFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecutePrompt: (prompt: string) => void;
}

type TabType = 'weather' | 'time' | 'math' | 'translate' | 'code';

export const QuickFeaturesModal: React.FC<QuickFeaturesModalProps> = ({
  isOpen,
  onClose,
  onExecutePrompt,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('weather');

  // Weather state
  const [cityInput, setCityInput] = useState('');

  // Math state
  const [mathInput, setMathInput] = useState('');

  // Translate state
  const [translateInput, setTranslateInput] = useState('');
  const [targetLang, setTargetLang] = useState<'Telugu' | 'English'>('Telugu');

  // Code state
  const [codeTask, setCodeTask] = useState('');
  const [codeLang, setCodeLang] = useState('React / TypeScript');

  if (!isOpen) return null;

  const handleLaunchPrompt = (prompt: string) => {
    onExecutePrompt(prompt);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Orbitron'] text-base font-bold text-white tracking-wide">
                  F.R.I.D.A.Y. CORE PROTOCOLS
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Instant specialized computational modules
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

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950 px-4 gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'weather', label: 'Weather', icon: CloudSun },
              { id: 'time', label: 'Time & World', icon: Clock },
              { id: 'math', label: 'Math Compute', icon: Calculator },
              { id: 'translate', label: 'Telugu Translation', icon: Languages },
              { id: 'code', label: 'Coding Lab', icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 py-3 px-3.5 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-cyan-400 text-cyan-300 font-semibold bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {/* Weather Module */}
            {activeTab === 'weather' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Meteorological Satellite Telemetry</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Query live conditions, temperature, humidity, and forecasts for any global or Indian city.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Enter city (e.g. Hyderabad, Visakhapatnam, London)..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-cyan-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && cityInput.trim()) {
                          handleLaunchPrompt(`What is the current weather forecast for ${cityInput.trim()}?`);
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (cityInput.trim()) {
                        handleLaunchPrompt(`What is the current weather forecast for ${cityInput.trim()}?`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    Scan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-2">QUICK TELEMETRY RADAR:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Hyderabad', 'Vijayawada', 'Bengaluru', 'Visakhapatnam'].map((city) => (
                      <button
                        key={city}
                        onClick={() => handleLaunchPrompt(`Show detailed weather for ${city}`)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 text-left transition-colors"
                      >
                        <span className="text-cyan-400 font-semibold block">{city}</span>
                        <span className="text-[10px] text-slate-500">Scan Atmosphere</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Time & World Clock */}
            {activeTab === 'time' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Chrono Temporal Grid</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live Indian Standard Time (IST), UTC coordinates, and international timezone comparisons.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-slate-200">
                    <span className="text-[10px] uppercase font-mono text-cyan-400">Current Local Time</span>
                    <div className="text-2xl font-bold font-mono text-white mt-1">
                      {new Date().toLocaleTimeString()}
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-200">
                    <span className="text-[10px] uppercase font-mono text-purple-400">Indian Standard Time (IST)</span>
                    <div className="text-2xl font-bold font-mono text-purple-200 mt-1">
                      {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">Asia/Kolkata (UTC +05:30)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-2">COMMON TEMPORAL QUERIES:</span>
                  <div className="space-y-1.5">
                    {[
                      'What time is it now in New York and London compared to IST?',
                      'How many days and hours until the new year?',
                      'Calculate time difference between Hyderabad and California',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLaunchPrompt(q)}
                        className="w-full p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-all"
                      >
                        <span>{q}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Math Compute */}
            {activeTab === 'math' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Quantum Computational Engine</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Perform arithmetic, algebra, percentages, unit conversions, or calculus.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    placeholder="Enter expression (e.g. 15% of 8500, sqrt(144) * 12, 100 USD to INR)..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-cyan-400 font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && mathInput.trim()) {
                        handleLaunchPrompt(`Calculate and explain step-by-step: ${mathInput.trim()}`);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (mathInput.trim()) {
                        handleLaunchPrompt(`Calculate and explain step-by-step: ${mathInput.trim()}`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    Compute <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {[
                    'Calculate 450 * 32',
                    'Convert 50 miles to kilometers',
                    'Compound interest on 10,000 for 3 years at 7%',
                    'What is 18% GST on 25,000 INR?',
                    'Solve: 2x + 15 = 45',
                    'Area of circle with radius 14 cm',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunchPrompt(preset)}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 text-left transition-colors font-mono"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bilingual Telugu Translation */}
            {activeTab === 'translate' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Neural Telugu ⇄ English Translator</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Translate between Telugu (తెలుగు) and English with phonetic transliteration and audio pronunciation.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setTargetLang(targetLang === 'Telugu' ? 'English' : 'Telugu')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300"
                  >
                    Target: {targetLang} (Click to switch)
                  </button>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                    placeholder={
                      targetLang === 'Telugu'
                        ? 'Type in English to translate into Telugu (e.g., Welcome to our home, how are you?)...'
                        : 'తెలుగులో టైప్ చేయండి (ఉదా: మీరు ఎక్కడ ఉంటారు?)...'
                    }
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-emerald-400 resize-none font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (translateInput.trim()) {
                          handleLaunchPrompt(
                            `Translate this into ${targetLang} with pronunciation guide: "${translateInput.trim()}"`
                          );
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                    >
                      Translate <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-2">QUICK TELUGU PHRASES:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'How to say "Thank you very much" in Telugu?',
                      'Translate "Nice to meet you" into Telugu with pronunciation',
                      'Translate "నమస్కారం, మీ పేరు ఏమిటి?" into English',
                      'Common Telugu greetings for visitors',
                    ].map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLaunchPrompt(phrase)}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 text-left transition-colors font-sans"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Coding Lab */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Full-Stack Code Architect</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate clean, production-ready code with syntax explanations and best practices.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['React / TypeScript', 'Python', 'Node.js Express', 'Tailwind CSS', 'SQL / Database'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setCodeLang(l)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                        codeLang === l
                          ? 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeTask}
                    onChange={(e) => setCodeTask(e.target.value)}
                    placeholder="Describe code needed (e.g. JWT Auth middleware, Debounced search hook)..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-cyan-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && codeTask.trim()) {
                        handleLaunchPrompt(`Write clean ${codeLang} code for: ${codeTask.trim()}`);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (codeTask.trim()) {
                        handleLaunchPrompt(`Write clean ${codeLang} code for: ${codeTask.trim()}`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  >
                    Generate <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {[
                    'Create a responsive modern navbar with Tailwind & React',
                    'Write a Python script for file hashing with SHA256',
                    'Build an Express.js rate limiter middleware',
                    'Implement quicksort in TypeScript with benchmarks',
                  ].map((task, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunchPrompt(task)}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 text-left transition-colors font-mono truncate"
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

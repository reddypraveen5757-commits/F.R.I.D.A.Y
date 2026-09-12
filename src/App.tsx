import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { AiOrb } from './components/AiOrb';
import { ChatInterface } from './components/ChatInterface';
import { SettingsModal } from './components/SettingsModal';
import { QuickFeaturesModal } from './components/QuickFeaturesModal';
import { VoiceOverlay } from './components/VoiceOverlay';
import {
  ChatMessage,
  VoiceSettings,
  OrbState,
  AssistantLanguage,
} from './types';
import { soundFx } from './utils/soundEffects';
import {
  startSpeechRecognition,
  stopSpeechRecognition,
  speakText,
  stopSpeaking,
} from './utils/speech';
import {
  Cpu,
  Zap,
  Activity,
  Radio,
  Clock,
  Sparkles,
  CloudSun,
  Calculator,
  Languages,
  Code2,
} from 'lucide-react';

const DEFAULT_SETTINGS: VoiceSettings = {
  autoSpeak: true,
  recognitionLanguage: 'auto',
  preferredLanguage: 'auto',
  voiceURI: null,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  soundEffects: true,
  mode: 'concise',
};

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem('friday_voice_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('friday_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // Default welcome message
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        text: `**F.R.I.D.A.Y. Online & Operational.**\n\nనమస్కారం! నేను F.R.I.D.A.Y. (ఫ్రైడే) — మీ అధునాతన ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ అసిస్టెంట్.\n\nI am equipped with native bilingual intelligence in **Telugu (తెలుగు)** and **English**. You can interact with me using your voice or keyboard. How may I assist you today?`,
        spokenText: 'F.R.I.D.A.Y. online. నమస్కారం, నేను ఫ్రైడే. How can I assist you today?',
        detectedLanguage: 'en',
        timestamp: Date.now(),
        suggestedActions: [
          'నమస్కారం! మీరు నాకు ఎలా సహాయం చేయగలరు?',
          'What is the current weather in Hyderabad?',
          'Translate "Have a great day" to Telugu',
          'Calculate 125 * 48 / 6',
          'Write a React TypeScript counter component',
        ],
      },
    ];
  });

  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQuickFeaturesOpen, setIsQuickFeaturesOpen] = useState(false);

  // Live clocks
  const [istTime, setIstTime] = useState('');
  const [utcTime, setUtcTime] = useState('');

  // Save settings
  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('friday_voice_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Save messages
  useEffect(() => {
    try {
      localStorage.setItem('friday_chat_history', JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  // Real-time clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        })
      );
      setUtcTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Voice output helper
  const handleSpeak = (text: string, lang?: 'en' | 'te') => {
    stopSpeaking();
    setOrbState('speaking');
    soundFx.click(settings.soundEffects);

    speakText(text, {
      lang: lang || (settings.preferredLanguage === 'te' ? 'te' : 'en'),
      voiceURI: settings.voiceURI,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
      onStart: () => setOrbState('speaking'),
      onEnd: () => setOrbState('idle'),
      onError: () => setOrbState('idle'),
    });
  };

  // Send message to backend
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    soundFx.sent(settings.soundEffects);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setOrbState('thinking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: settings.preferredLanguage,
          mode: settings.mode,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();

      soundFx.receive(settings.soundEffects);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.text || 'Command processed.',
        spokenText: data.spokenText,
        detectedLanguage: data.detectedLanguage,
        widget: data.widget,
        suggestedActions: data.suggestedActions,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto speak if enabled
      if (settings.autoSpeak && (data.spokenText || data.text)) {
        handleSpeak(data.spokenText || data.text, data.detectedLanguage);
      } else {
        setOrbState('idle');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        text: 'Neural telemetry link disrupted. Please retry your command.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setOrbState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle voice listening
  const handleToggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
      setIsListening(false);
      setOrbState('idle');
      soundFx.listenEnd(settings.soundEffects);

      if (speechTranscript.trim()) {
        handleSendMessage(speechTranscript.trim());
        setSpeechTranscript('');
      }
    } else {
      stopSpeaking();
      soundFx.listenStart(settings.soundEffects);
      setIsListening(true);
      setOrbState('listening');
      setSpeechTranscript('');

      // Determine speech recognition language
      let targetLang: 'te-IN' | 'en-US' | 'en-IN' | 'auto' = settings.recognitionLanguage;
      if (targetLang === 'auto') {
        targetLang = settings.preferredLanguage === 'te' ? 'te-IN' : 'en-US';
      }

      startSpeechRecognition(targetLang, {
        onStart: () => {
          setIsListening(true);
          setOrbState('listening');
        },
        onResult: (transcript, isFinal) => {
          setSpeechTranscript(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            stopSpeechRecognition();
            soundFx.listenEnd(settings.soundEffects);
            handleSendMessage(transcript.trim());
            setSpeechTranscript('');
          }
        },
        onError: (errMsg) => {
          console.warn('Speech error:', errMsg);
          setIsListening(false);
          setOrbState('idle');
          soundFx.listenEnd(settings.soundEffects);
        },
        onEnd: () => {
          setIsListening(false);
          if (orbState === 'listening') {
            setOrbState('idle');
          }
        },
      });
    }
  };

  const handleClearChat = () => {
    soundFx.click(settings.soundEffects);
    localStorage.removeItem('friday_chat_history');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: 'Telemetry memory purged. F.R.I.D.A.Y. standing by for new instructions.',
        spokenText: 'Telemetry memory purged. Ready for instructions.',
        timestamp: Date.now(),
        suggestedActions: [
          'నమస్కారం, మీ వివరాలు చెప్పండి',
          'Show Hyderabad weather telemetry',
          'Calculate square root of 529',
          'Translate "Good morning" to Telugu',
        ],
      },
    ]);
  };

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Background Cyber Nebula & Scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.18),rgba(2,6,23,1))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Futuristic Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,#000,#000_1px,transparent_1px,transparent_2px)]" />

      {/* Top HUD Header */}
      <Header
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenQuickFeatures={() => setIsQuickFeaturesOpen(true)}
        onClearChat={handleClearChat}
        istTime={istTime}
      />

      {/* Main Workspace Layout: Desktop Split, Mobile Stack */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden p-3 sm:p-5 gap-4">
        {/* Left Column: AI Orb, Holographic Telemetry, Quick Tools Launcher */}
        <section className="w-full lg:w-96 xl:w-[420px] flex flex-col items-center justify-between shrink-0 bg-slate-950/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative sci-fi HUD corner brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

          {/* Top Status Bar */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-400/80 border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>QUANTUM CORE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">UTC {utcTime || '00:00:00'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Center: The Glowing Animated AI Orb */}
          <div className="my-auto py-4 flex flex-col items-center justify-center">
            <AiOrb
              state={orbState}
              onClick={handleToggleListening}
              size="lg"
              transcript={isListening ? speechTranscript : undefined}
            />
          </div>

          {/* Bottom Telemetry & Quick Action Cards */}
          <div className="w-full space-y-3 pt-3 border-t border-cyan-500/20">
            {/* Telemetry Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Language</span>
                <span className="text-cyan-300 font-bold uppercase">{settings.preferredLanguage}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Voice Out</span>
                <span className="text-emerald-300 font-bold">
                  {settings.autoSpeak ? 'ACTIVE' : 'MUTED'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Latency</span>
                <span className="text-purple-300 font-bold">12ms</span>
              </div>
            </div>

            {/* Quick module launch buttons */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { icon: CloudSun, label: 'Weather', query: 'Show current weather forecast for Hyderabad' },
                { icon: Clock, label: 'Time', query: 'Compare Indian Standard Time with UTC and US Time' },
                { icon: Languages, label: 'తెలుగు', query: 'Translate "Welcome to F.R.I.D.A.Y. artificial intelligence" into Telugu' },
                { icon: Code2, label: 'Coding', query: 'Write a modern React hook with TypeScript for audio recording' },
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(tool.query)}
                    className="p-2 rounded-xl bg-slate-900/50 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex flex-col items-center gap-1 group"
                  >
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column: Chat Interface & Interactive Widgets */}
        <section className="flex-1 flex flex-col min-h-0 h-full">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isListening={isListening}
            onToggleListening={handleToggleListening}
            isLoading={isLoading}
            onSpeakMessage={handleSpeak}
            speechTranscript={speechTranscript}
            selectedLanguage={settings.preferredLanguage}
            onChangeLanguage={(lang) => updateSettings({ preferredLanguage: lang })}
          />
        </section>
      </main>

      {/* Voice Fullscreen Holographic Overlay while listening */}
      <VoiceOverlay
        isListening={isListening}
        transcript={speechTranscript}
        onStop={handleToggleListening}
        onSubmit={() => {
          if (speechTranscript.trim()) {
            handleToggleListening();
          }
        }}
        language={settings.preferredLanguage}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={updateSettings}
      />

      {/* Quick Features Modal */}
      <QuickFeaturesModal
        isOpen={isQuickFeaturesOpen}
        onClose={() => setIsQuickFeaturesOpen(false)}
        onExecutePrompt={handleSendMessage}
      />
    </div>
  );
}

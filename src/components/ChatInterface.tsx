import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  Languages,
  Sparkles,
  Bot,
  User,
  ArrowDown,
} from 'lucide-react';
import { ChatMessage, AssistantLanguage } from '../types';
import { WeatherCard, MathCard, TranslationCard, TimeCard, CodeCard } from './Widgets';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isLoading: boolean;
  onSpeakMessage: (text: string, lang?: 'en' | 'te') => void;
  speechTranscript: string;
  selectedLanguage: AssistantLanguage;
  onChangeLanguage: (lang: AssistantLanguage) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isListening,
  onToggleListening,
  isLoading,
  onSpeakMessage,
  speechTranscript,
  selectedLanguage,
  onChangeLanguage,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, speechTranscript]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!atBottom);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick prompt chips
  const quickPrompts = [
    { label: '🌤️ Hyderabad Weather', query: 'What is the current weather in Hyderabad?' },
    { label: '🗣️ Translate to Telugu', query: 'Translate "How can I help you today?" into Telugu with pronunciation' },
    { label: '🧮 Calculate 245 * 18', query: 'Calculate 245 * 18 with steps' },
    { label: '💻 Python Web Scraper', query: 'Show me a Python script to fetch webpage data' },
    { label: 'తెలుగు వాతావరణం', query: 'విజయవాడలో నేటి వాతావరణ సమాచారం తెలపండి' },
    { label: '🕒 World Time', query: 'What is the time difference between IST and UTC?' },
  ];

  return (
    <div className="relative flex flex-col h-full w-full bg-slate-950/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/30">
      {/* Messages Stream Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-['Orbitron'] text-lg font-bold text-slate-100 tracking-wide">
              F.R.I.D.A.Y. NEURAL INTERFACE
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Speak or type in English or Telugu (తెలుగు). Click the glowing orb or mic to activate vocal recognition.
            </p>

            {/* Quick starting suggestions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {quickPrompts.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(p.query)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-500/50 text-left text-xs text-slate-300 hover:text-cyan-200 transition-all group"
                >
                  <span className="block font-medium">{p.label}</span>
                  <span className="text-[11px] text-slate-500 truncate block mt-0.5 group-hover:text-cyan-400/80">
                    "{p.query}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)] mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-50 rounded-tr-none shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-100 rounded-tl-none shadow-lg shadow-black/40'
                }`}
              >
                {/* Assistant header badges */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <span>F.R.I.D.A.Y.</span>
                      {msg.detectedLanguage === 'te' && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                          తెలుగు
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSpeakMessage(msg.spokenText || msg.text, msg.detectedLanguage)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Speak response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-wrap font-sans space-y-2 text-slate-200">
                  {msg.text}
                </div>

                {/* Optional Structured Widget */}
                {msg.widget && (
                  <div className="mt-2">
                    {msg.widget.type === 'weather' && <WeatherCard data={msg.widget.data} />}
                    {msg.widget.type === 'math' && <MathCard data={msg.widget.data} />}
                    {msg.widget.type === 'translation' && <TranslationCard data={msg.widget.data} />}
                    {msg.widget.type === 'time' && <TimeCard data={msg.widget.data} />}
                    {msg.widget.type === 'code' && <CodeCard data={msg.widget.data} />}
                  </div>
                )}

                {/* Suggested follow-up chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(action)}
                        className="px-2.5 py-1 rounded-full bg-slate-950/70 hover:bg-cyan-950/50 border border-slate-700/60 hover:border-cyan-500/50 text-xs text-cyan-300/90 hover:text-cyan-200 transition-all font-sans"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 font-mono ${
                    msg.role === 'user' ? 'text-cyan-300/60 text-right' : 'text-slate-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {/* Neural Processing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-center text-xs font-mono text-cyan-400 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/20 max-w-xs"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>PROCESSING NEURAL TELEMETRY...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll Down button */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-24 right-6 p-2 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 shadow-lg hover:bg-cyan-900 transition-all z-20"
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Live Voice Input preview ticker banner when mic is listening */}
      {isListening && (
        <div className="px-4 py-2 bg-emerald-950/80 border-t border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold uppercase tracking-wider">Listening ({selectedLanguage.toUpperCase()}):</span>
            <span className="italic text-emerald-100 truncate">
              {speechTranscript || 'Speak now...'}
            </span>
          </div>
          <button
            onClick={onToggleListening}
            className="px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-[11px] text-emerald-200 shrink-0 ml-2"
          >
            Finish
          </button>
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-slate-500 font-mono shrink-0 pl-1">QUICK:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(p.query)}
            className="px-2.5 py-1 rounded-md bg-slate-900/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Action Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950/95 border-t border-cyan-500/20 flex items-center gap-2"
      >
        {/* Language selector toggle */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              const next: Record<AssistantLanguage, AssistantLanguage> = {
                auto: 'te',
                te: 'en',
                en: 'auto',
              };
              onChangeLanguage(next[selectedLanguage]);
            }}
            className="px-2.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors"
            title="Click to toggle language mode (Auto, Telugu, English)"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase">{selectedLanguage}</span>
          </button>
        </div>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedLanguage === 'te'
                ? 'తెలుగులో ఏదైనా అడగండి లేదా మాట్లాడండి...'
                : selectedLanguage === 'en'
                ? 'Ask F.R.I.D.A.Y. anything in English...'
                : 'Ask F.R.I.D.A.Y. in Telugu or English...'
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={onToggleListening}
          className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center relative ${
            isListening
              ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-105'
              : 'bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 hover:text-cyan-200'
          }`}
          title={isListening ? 'Stop Listening' : 'Start Voice Input'}
        >
          {isListening ? (
            <>
              <span className="absolute inset-0 rounded-xl bg-emerald-500 animate-ping opacity-50" />
              <MicOff className="w-5 h-5 relative z-10" />
            </>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all shrink-0"
          title="Send Telemetry"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

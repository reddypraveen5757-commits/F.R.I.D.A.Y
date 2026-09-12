import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Calculator,
  Languages,
  Clock,
  Code2,
  Copy,
  Check,
  Volume2,
} from 'lucide-react';
import {
  WeatherWidgetData,
  MathWidgetData,
  TranslationWidgetData,
  TimeWidgetData,
  CodeWidgetData,
} from '../types';
import { speakText } from '../utils/speech';

export const WeatherCard: React.FC<{ data: WeatherWidgetData }> = ({ data }) => {
  return (
    <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/30 text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <CloudSun className="w-3.5 h-3.5" /> Meteorological Telemetry
          </div>
          <h4 className="text-lg font-bold text-white mt-1 font-mono tracking-tight">{data.location}</h4>
          <p className="text-sm text-slate-300 capitalize">{data.condition}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tighter">
            {data.temperature}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>Humidity: <strong className="text-slate-200">{data.humidity}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <span>Wind: <strong className="text-slate-200">{data.wind}</strong></span>
        </div>
      </div>
      {data.forecast && (
        <p className="mt-2 text-xs text-cyan-200/80 bg-cyan-950/40 px-2.5 py-1.5 rounded border border-cyan-800/40">
          {data.forecast}
        </p>
      )}
    </div>
  );
};

export const MathCard: React.FC<{ data: MathWidgetData }> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyResult = () => {
    navigator.clipboard.writeText(data.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-950/30 text-slate-100">
      <div className="flex items-center justify-between text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">
        <span className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" /> Quantum Math Compute
        </span>
        <button
          onClick={copyResult}
          className="p-1 hover:text-purple-300 transition-colors flex items-center gap-1 text-[11px]"
          title="Copy result"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="text-sm font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded border border-slate-800">
        {data.expression}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-xs text-slate-400 uppercase font-mono">Result:</span>
        <span className="text-2xl font-bold font-mono text-purple-300">{data.result}</span>
      </div>
      {data.steps && data.steps.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
          {data.steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TranslationCard: React.FC<{ data: TranslationWidgetData }> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text: string, lang: string) => {
    setIsSpeaking(true);
    speakText(text, {
      lang: lang.toLowerCase().includes('te') || lang.toLowerCase().includes('telugu') ? 'te' : 'en',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const copyText = () => {
    navigator.clipboard.writeText(data.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-950/30 text-slate-100">
      <div className="flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
        <span className="flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5" /> Neural Linguistic Translate
        </span>
        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-[10px] text-emerald-300">
          {data.sourceLang} ⇄ {data.targetLang}
        </span>
      </div>

      <div className="space-y-2">
        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">{data.sourceLang}</span>
          <p className="text-slate-300 font-sans">{data.sourceText}</p>
        </div>

        <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/30 relative group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">{data.targetLang}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSpeak(data.translatedText, data.targetLang)}
                className={`p-1 rounded hover:bg-emerald-800/40 text-emerald-300 transition-colors ${
                  isSpeaking ? 'animate-pulse text-emerald-200' : ''
                }`}
                title="Pronounce translation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={copyText}
                className="p-1 rounded hover:bg-emerald-800/40 text-emerald-300 transition-colors"
                title="Copy translation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <p className="text-base font-medium text-emerald-100 font-sans tracking-wide">
            {data.translatedText}
          </p>
          {data.transliteration && (
            <p className="text-xs text-emerald-400/80 italic mt-1 font-mono">
              Pronunciation: {data.transliteration}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const TimeCard: React.FC<{ data: TimeWidgetData }> = ({ data }) => {
  return (
    <div className="mt-3 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/30 text-slate-100">
      <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Chrono Temporal Sensor
        </span>
        {data.utcOffset && (
          <span className="text-[10px] text-slate-400 font-mono">{data.utcOffset}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <div>
          <h4 className="text-2xl font-bold font-mono text-white tracking-wider">
            {data.currentTime}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">{data.date}</p>
        </div>
        <div className="text-right">
          <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800 text-xs font-mono text-cyan-300">
            {data.timezone}
          </span>
        </div>
      </div>
    </div>
  );
};

export const CodeCard: React.FC<{ data: CodeWidgetData }> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl text-slate-100">
      <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
          <Code2 className="w-3.5 h-3.5" />
          <span className="text-white font-medium">{data.title || 'Code Snippet'}</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] uppercase border border-cyan-800">
            {data.language}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-cyan-200/90 bg-slate-950">
        <code>{data.code}</code>
      </pre>

      {data.explanation && (
        <div className="p-2.5 bg-slate-900/50 border-t border-slate-900 text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">Note:</span> {data.explanation}
        </div>
      )}
    </div>
  );
};

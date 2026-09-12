// Speech recognition & synthesis helper for English & Telugu

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

let recognitionInstance: any = null;

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export function startSpeechRecognition(
  lang: 'te-IN' | 'en-US' | 'en-IN' | 'auto',
  handlers: SpeechRecognitionHandlers
) {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    return null;
  }

  stopSpeechRecognition();

  try {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Set recognition language (Telugu 'te-IN' or English 'en-IN'/'en-US')
    recognition.lang = lang === 'auto' ? 'en-US' : lang;

    recognition.onstart = () => {
      handlers.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      handlers.onResult?.(text, !!finalTranscript);
    };

    recognition.onerror = (event: any) => {
      let errorMsg = event.error || 'Voice input error';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone permission was denied. Please allow microphone access in your browser.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please speak closer to the microphone.';
      } else if (event.error === 'network') {
        errorMsg = 'Speech service network error.';
      }
      handlers.onError?.(errorMsg);
    };

    recognition.onend = () => {
      handlers.onEnd?.();
      recognitionInstance = null;
    };

    recognition.start();
    recognitionInstance = recognition;
    return recognition;
  } catch (err: any) {
    handlers.onError?.(err?.message || 'Failed to initialize microphone');
    return null;
  }
}

export function stopSpeechRecognition() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch {}
    recognitionInstance = null;
  }
}

// Speech Synthesis
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      return resolve([]);
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      return resolve(voices);
    }

    // Chrome requires waiting for onvoiceschanged
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    // Fallback timer
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

export function speakText(
  text: string,
  options: {
    lang?: 'en' | 'te' | 'auto';
    voiceURI?: string | null;
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
) {
  if (!isSpeechSynthesisSupported()) {
    options.onError?.('Speech synthesis not supported');
    return;
  }

  stopSpeaking();

  // Clean text: strip markdown code blocks, bold/italics markers, URLs
  const cleaned = text
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~>]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleaned) {
    options.onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleaned);

  // Check if text is predominantly Telugu
  const isTelugu = options.lang === 'te' || /[\u0C00-\u0C7F]/.test(cleaned);

  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  const voices = window.speechSynthesis.getVoices();

  if (options.voiceURI) {
    const selectedVoice = voices.find((v) => v.voiceURI === options.voiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  if (!utterance.voice) {
    if (isTelugu) {
      // Find Telugu voice if available
      const teluguVoice = voices.find((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
      if (teluguVoice) {
        utterance.voice = teluguVoice;
        utterance.lang = teluguVoice.lang;
      } else {
        // Fallback Indian English or general
        const inVoice = voices.find((v) => v.lang === 'en-IN');
        if (inVoice) {
          utterance.voice = inVoice;
          utterance.lang = 'en-IN';
        } else {
          utterance.lang = 'te-IN';
        }
      }
    } else {
      // Find best female or sleek assistant voice for F.R.I.D.A.Y.
      const englishFemale = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('karen') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('google us english') ||
            v.name.toLowerCase().includes('natural'))
      );
      const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
      utterance.voice = englishFemale || anyEnglish || null;
      utterance.lang = utterance.voice?.lang || 'en-US';
    }
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis utterance error:', e);
    options.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

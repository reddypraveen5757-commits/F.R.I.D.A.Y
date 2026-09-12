# F.R.I.D.A.Y. — Futuristic AI Voice Assistant

A futuristic, bilingual AI voice assistant web application inspired by advanced holographic digital assistants, crafted with an original cyberpunk HUD interface, animated glowing AI orb, and bilingual intelligence in **Telugu (తెలుగు)** and **English**.

---

## Key Features

- **Animated Glowing AI Orb**:
  - Multi-state quantum visualizer (`idle`, `listening`, `thinking`, `speaking`) powered by Canvas particle simulation and Framer Motion orbital gyro rings.
  - Interactive click-to-talk activation with audio-reactive frequency rings.

- **Bilingual Voice & Text Interaction (Telugu & English)**:
  - **Speech Recognition (Voice In)**: Web Speech API with support for `te-IN` (Telugu), `en-IN`, and `en-US`.
  - **Speech Synthesis (Voice Out)**: Text-to-Speech playback with voice selection, pitch, rate, volume sliders, and auto-speak toggle.
  - Real-time speech transcription preview with holographic audio resonance bars.

- **Intelligent Core Features**:
  - **Weather Telemetry**: Live meteorological conditions, humidity, wind, and forecast cards.
  - **Chrono & World Clocks**: Real-time Indian Standard Time (IST) and UTC clocks with temporal queries.
  - **Quantum Math Compute**: Calculation expressions with step-by-step resolution and copyable results.
  - **Linguistic Translation**: Telugu ⇄ English bidirectional translation with Romanized pronunciation transliteration.
  - **Coding Lab**: Code generator supporting React, TypeScript, Python, Node.js, and SQL with copy actions.

- **Futuristic Glassmorphism Interface**:
  - Dark sci-fi spatial canvas with neon cyan, teal, and purple glows.
  - Interactive sound synthesizer powered by the Web Audio API (zero external audio assets needed).
  - Telemetry badges, suggested action chips, and custom settings panel.

---

## Setup & Running Locally

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```
   *(In Google AI Studio, this is injected automatically via Settings > Secrets)*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion (`motion/react`), Lucide React
- **Voice APIs**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Web Audio API Synthesizer
- **Backend**: Node.js, Express, `@google/genai` (Gemini 3.8 Flash model)

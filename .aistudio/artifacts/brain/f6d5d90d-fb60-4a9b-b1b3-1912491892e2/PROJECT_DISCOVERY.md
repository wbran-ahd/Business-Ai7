# PROJECT_DISCOVERY.md — Sauti Baqaya (صوتی بقیہ)

## Overview
Sauti Baqaya is an advanced Urdu voice-controlled financial assistant and shop ledger (Khata Book) designed for Pakistani shopkeepers, freelancers, and individuals.

## Core Stack
- **Frontend Framework:** React 19 with Vite, TypeScript 5.9
- **Styling:** Tailwind CSS v4, Radix UI primitives, Framer Motion animations
- **State Management:** React hooks (`useKhata`, `useParties`, `useSync`, `useVoiceAssistant`)
- **Persistence & Cloud Sync:** localStorage + Firebase Firestore (`users/{userId}/entries`, `users/{userId}/parties`, `users/{userId}/partyTxns`)
- **Authentication:** Firebase Authentication (Email/Password, Google, Anonymous)
- **Voice & AI:** Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Gemini AI Integration
- **Export & Print:** CSV/JSON backups, PDF/HTML report exports, 58mm/80mm Thermal Receipt printing, WhatsApp sharing

## Application Architecture
- `src/pages/KhataApp.tsx`: Main dashboard container
- `src/hooks/use-khata.ts`: Core financial ledger math & state
- `src/hooks/use-parties.ts`: Customer & supplier ledger (PartyBook) with offline persistence & Firestore real-time sync
- `src/hooks/use-voice-assistant.tsx`: Speech-to-text dialog state machine (Urdu & Roman Urdu)
- `src/features/`: Domain-driven modular components (`ledger`, `analytics`, `settings`, `shop`, `ai-advisor`)

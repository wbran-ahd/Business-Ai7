# CHANGELOG.md — Sauti Baqaya (صوتی بقیہ)

## [1.0.0] - 2026-10-20
- **Fixed:** Historical transaction date and timestamp corruption on edit (`updateEntry` now preserves original dates and month keys).
- **Added:** Firestore real-time synchronization for Customer & Supplier PartyBook (`useParties`).
- **Refactored:** Modularized `KhataApp.tsx` into domain-driven feature components (`ledger`, `analytics`, `shop`, `settings`, `ai-advisor`).
- **Enhanced:** Thermal printer support and WhatsApp receipt sharing.
- **Verified:** Type checking and production builds (`npm run build`).

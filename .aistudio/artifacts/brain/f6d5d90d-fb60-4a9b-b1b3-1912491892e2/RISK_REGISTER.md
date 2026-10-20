# RISK_REGISTER.md — Sauti Baqaya (صوتی بقیہ)

## Identified Risks & Mitigations
1. **Network Disconnection / Offline Data Loss:** Mitigated by local-first persistence (`localStorage`) combined with background Firestore real-time sync (`onSnapshot`).
2. **Historical Date Corruption on Edit:** Mitigated by updating `updateEntry` to retain original `timestamp`, `date`, `time`, and `monthKey`.
3. **Voice Recognition Inaccuracies:** Mitigated by offering manual entry fallbacks, clear confirmation dialogs, and robust Roman Urdu/Urdu keyword parsing.
4. **Cross-User Data Leakage:** Mitigated by enforcing strict Firestore security rules (`users/{userId}/...`) keyed to authenticated `auth.currentUser.uid`.

# SECURITY_REVIEW.md — Sauti Baqaya (صوتی بقیہ)

## Security Architecture
- **Authentication:** Firebase Authentication secures user sessions.
- **Authorization & Firestore Rules:** Data is segregated strictly under `users/{userId}` paths. Firestore security rules enforce that users can only read and write their own documents.
- **Client-Side Storage:** Local persistence uses namespaced keys (`nabeelUltimateMasterRecord`, `sautiPartyBook`, `sautiBaqayaPrefs`) preventing cross-app pollution.
- **API Key Protection:** Sensitive API keys (Gemini) use server-side proxies or secure user-managed storage slots.

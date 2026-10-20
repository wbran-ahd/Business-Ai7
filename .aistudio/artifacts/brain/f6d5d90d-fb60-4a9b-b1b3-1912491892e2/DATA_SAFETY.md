# DATA_SAFETY.md — Sauti Baqaya (صوتی بقیہ)

## Data Storage & Backup Strategy
- **Local Source of Truth:** Instant read/write access via `localStorage` ensures sub-millisecond UI updates and full offline capabilities.
- **Cloud Replication:** Real-time Firestore synchronization (`onSnapshot`) replicates entries, customers, suppliers, and party transactions to the user's secure cloud collection.
- **Import & Export:** JSON and CSV backup/restore utilities allow users to export their complete ledger, validate file structures, and safely import records without data duplication.

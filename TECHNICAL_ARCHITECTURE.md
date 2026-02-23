# Jaclang Dojo Technical Architecture

## 1. Overview
Jaclang Dojo is a secure, offline-first, multi-language coding academy. It uses a **Cloud-Edge-Local** architecture to ensure high performance, AI-driven learning, and 100% availability regardless of network status.

---

## 2. Technology Stack
- **Frontend:** React 18 (Vite), TypeScript, Tailwind CSS.
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions).
- **Persistence:** IndexedDB (via Dexie.js) for offline, PostgreSQL for cloud.
- **AI:** Google Gemini 2.0 Flash (via Lovable AI Gateway).
- **PWA:** Service Workers for installability and asset caching.

---

## 3. Directory Structure & Key Files

### Cloud (Supabase)
- `supabase/migrations/`:
    - `20240320000000_initial_schema.sql`: Profiles, stats, and course tables.
    - `20240320000003_bug_hunt.sql`: Challenges and mistake tracking schema.
- `supabase/functions/`:
    - `jaclang-tutor/`: SSE streaming AI tutor (hardened with JWT).
    - `compile-code/`: Mock execution engine for 5+ languages.

### Frontend Core (`src/`)
- `db/localDb.ts`: Dexie.js schema definition for IndexedDB.
- `hooks/useSync.ts`: Bidirectional synchronization logic (Online/Offline reconciliation).
- `pages/Index.tsx`: Main application controller and state manager.

### Key Components
- `components/BugHuntGame.tsx`: Low-poly themed debugging environment.
- `components/CodeEditor.tsx`: Multi-language IDE with cloud execution.
- `components/AIAssistant.tsx`: Streaming AI chat interface.
- `components/LessonPath.tsx`: Dynamic roadmap with multi-level fallbacks.

---

## 4. Key Workflows

### Multi-Language State
The `selectedLanguage` state in `Index.tsx` acts as a global filter. When changed, it re-routes data fetching for lessons, challenges, and AI prompts, ensuring a consistent experience across different programming paths.

### Offline Sync Engine
1. **Mutation:** User saves progress locally to `localDb`.
2. **Detection:** `useSync` hook monitors `online` events.
3. **Reconciliation:** Unsynced records are pushed to Supabase; latest cloud data is pulled to local storage.

### AI Diagnostic Loop
When a user attempts a "Bug Hunt":
1. The attempt is compared against the solution.
2. The user's code + context is sent to the AI Tutor.
3. The AI provides a streaming explanation of the "Why" behind the result.
4. Mistakes are logged locally for future "Mistake Workouts".

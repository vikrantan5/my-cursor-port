# Vikrant Singh

Software engineering portfolio with two surfaces:

- **Desktop** — a Cursor editor window. Explorer is the site map, the editor opens pages, chat is an agent that only talks about Vikrant.
- **Mobile** — a short boot, then the same agent: about, chips, five replies, then it is broke.

## Where content lives

- File tree: `src/lib/workspace/tree.ts`
- Page bodies: `src/lib/workspace/documents.ts` plus `src/lib/workspace/project-documents.ts`
- Featured projects: `/projects/hireai`, `/projects/movielab`
- Mobile chips and copy: `src/lib/mobile/content.ts`
- Agent: `POST {BACKEND_URL}/api/chat` (FastAPI + Emergent LLM key, 5-message quota)
- GitHub activity + agent chat are served by the FastAPI backend, not Next.js API routes — see `/app/backend/server.py`.

## Desktop shortcuts

- `⌘P` / `Ctrl+P` — go to file
- `⌘B` / `Ctrl+B` — toggle explorer
- `⌘L` / `Ctrl+L` — toggle chat
- `⌘W` / `Ctrl+W` — close tab

```bash
yarn dev
```

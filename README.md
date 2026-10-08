# iresharma

Software engineering portfolio with two surfaces:

- **Desktop** — a Cursor editor window. Explorer is the site map, the editor opens pages, chat is an agent that only talks about Iresh.
- **Mobile** — a short boot, then the same agent: about, chips, five replies, then it is broke.

## Where content lives

- File tree: `src/lib/workspace/tree.ts`
- Page bodies: `src/lib/workspace/documents.ts` plus `src/lib/workspace/project-documents.ts`
- Featured projects: `/projects/codeloom`, `/projects/lens-distill`, `/projects/seeksphere`, `/projects/reach`, `/projects/g-notify`
- Mobile chips and copy: `src/lib/mobile/content.ts`
- Agent: `src/lib/agent/` plus `POST /api/chat` (OpenRouter, 5-message quota)

## Desktop shortcuts

- `⌘P` / `Ctrl+P` — go to file
- `⌘B` / `Ctrl+B` — toggle explorer
- `⌘L` / `Ctrl+L` — toggle chat
- `⌘W` / `Ctrl+W` — close tab

```bash
npm run dev
```

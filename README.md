# Oasis Company Public Website

Let's build the Oasisverse from here.

---

## Routing

| Path | Destination | Mechanism |
|------|-------------|-----------|
| `oasiscompany.org/` | Root (coming soon) | — |
| `oasiscompany.org/apply` | `apply.html` — Apply Oasis page | `functions/apply.js` (Pages Function) |
| `oasiscompany.org/apply/` | `apply.html` | `functions/apply.js` (Pages Function) |
| `oasiscompany.org/apply/api/*` | Pages Functions API | Auto-routed to `functions/apply/api/` |
| `oasiscompany.org/list` | `list.html` — Oasis Directory | `functions/list.js` (Pages Function) |
| `oasiscompany.org/list/` | `list.html` | `functions/list.js` (Pages Function) |

## Sub-projects

- **Apply Oasis** — [`/apply`](/apply) — Organization-wide application portal
  - [Deployment & API docs](APPLY-OASIS.md)
  - Cloudflare Pages: `oasis-apply` (KV + Functions)
  - Custom domain: `oasiscompany.org`
- **Oasis Directory** — [`/list`](/list) — Complete map of the Oasisverse

---

## Tech Stack

- **Hosting:** Cloudflare Pages
- **Backend:** Pages Functions + KV
- **Automation:** GitHub Actions
- **Design:** Swiss black-and-white minimalism

---

*Made by [CeaserZhao](https://ceaserzhao.com) · [ceo.oasiscompany.org](https://ceo.oasiscompany.org)*
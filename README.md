# Oasis Company Public Website

Let's build the Oasisverse from here.

---

## Routing

| Path | Destination | Mechanism |
|------|-------------|-----------|
| `oasiscompany.org/` | Root (coming soon) | — |
| `oasiscompany.org/apply` | `apply.html` — Apply Oasis page | `_redirects` (internal rewrite 200) |
| `oasiscompany.org/apply/` | `apply.html` | `_redirects` (internal rewrite 200) |
| `oasiscompany.org/apply/api/*` | Pages Functions API | Auto-routed to `functions/apply/api/` |

## Sub-projects

- **Apply Oasis** — [`/apply`](/apply) — Organization-wide application portal
  - [Deployment & API docs](APPLY-OASIS.md)
  - Cloudflare Pages: `oasis-apply` (KV + Functions)
  - Custom domain: `oasiscompany.org`

---

## Tech Stack

- **Hosting:** Cloudflare Pages
- **Backend:** Pages Functions + KV
- **Automation:** GitHub Actions
- **Design:** Swiss black-and-white minimalism

---

*Made by [CeaserZhao](https://ceaserzhao.com) · [ceo.oasiscompany.org](https://ceo.oasiscompany.org)*
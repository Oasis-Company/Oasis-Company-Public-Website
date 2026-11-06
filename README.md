# Oasis Company Public Website

Let's build the Oasisverse from here.

---

## Routing

| Path | Destination | Mechanism |
|------|-------------|-----------|
| `oasiscompany.org/` | `index.html` — Home page | `functions/index.js` (Pages Function) |
| `oasiscompany.org/apply` | `apply.html` — Apply Oasis page | `functions/apply.js` (Pages Function) |
| `oasiscompany.org/apply/` | `apply.html` | `functions/apply.js` (Pages Function) |
| `oasiscompany.org/apply/api/*` | Pages Functions API | Auto-routed to `functions/apply/api/` |
| `oasiscompany.org/list` | `list.html` — Oasis Directory | `functions/list.js` (Pages Function) |
| `oasiscompany.org/list/` | `list.html` | `functions/list.js` (Pages Function) |
| `oasiscompany.org/rally` | `rally.html` — The Gathering | `functions/rally.js` (Pages Function) |
| `oasiscompany.org/rally/` | `rally.html` | `functions/rally.js` (Pages Function) |
| `oasiscompany.org/ailab` | `ailab.html` — Oasis AI Lab | `functions/ailab.js` (Pages Function) |
| `oasiscompany.org/ailab/` | `ailab.html` | `functions/ailab.js` (Pages Function) |
| `oasiscompany.org/ailab/fundamental` | `fundamental.html` — AI Lab Skills | `functions/ailab/fundamental.js` (Pages Function) |
| `oasiscompany.org/ailab/fundamental/` | `fundamental.html` | `functions/ailab/fundamental.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao` | `people/ceaserzhao.html` — CeaserZhao | `functions/people/ceaserzhao.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/` | `people/ceaserzhao.html` | `functions/people/ceaserzhao.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/info` | `people/info.html` — CeaserZhao's info | `functions/people/ceaserzhao/info.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/info/` | `people/info.html` | `functions/people/ceaserzhao/info.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/info/paper` | `people/paper.html` — CeaserZhao's papers | `functions/people/ceaserzhao/info/paper.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/info/paper/` | `people/paper.html` | `functions/people/ceaserzhao/info/paper.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/info/project` | `people/project.html` — CeaserZhao's projects | `functions/people/ceaserzhao/info/project.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/info/project/` | `people/project.html` | `functions/people/ceaserzhao/info/project.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article` | `people/article.html` — CeaserZhao's articles (list) | `functions/people/ceaserzhao/article.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/` | `people/article.html` | `functions/people/ceaserzhao/article.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/oasis-containment-design` | `people/article/oasis-containment-design.html` — "I keep building the same container" | `functions/people/ceaserzhao/article/oasis-containment-design.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/oasis-containment-design/` | `people/article/oasis-containment-design.html` | `functions/people/ceaserzhao/article/oasis-containment-design.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/haa-is-absurd` | `people/article/haa-is-absurd.html` — "HAA IS ABSURD" | `functions/people/ceaserzhao/article/haa-is-absurd.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/haa-is-absurd/` | `people/article/haa-is-absurd.html` | `functions/people/ceaserzhao/article/haa-is-absurd.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/technology-influence-taxonomy` | `people/article/technology-influence-taxonomy.html` — "Technology Influence Taxonomy" | `functions/people/ceaserzhao/article/technology-influence-taxonomy.js` (Pages Function) |
| `oasiscompany.org/people/ceaserzhao/article/technology-influence-taxonomy/` | `people/article/technology-influence-taxonomy.html` | `functions/people/ceaserzhao/article/technology-influence-taxonomy.js` (Pages Function) |
| `oasiscompany.org/people` | `people/index.html` — People directory | `functions/people.js` (Pages Function) |
| `oasiscompany.org/people/` | `people/index.html` | `functions/people.js` (Pages Function) |

## Sub-projects

- **Apply Oasis** — [`/apply`](/apply) — Organization-wide application portal
  - [Deployment & API docs](APPLY-OASIS.md)
  - Cloudflare Pages: `oasis-apply` (KV + Functions)
  - Custom domain: `oasiscompany.org`
- **Oasis Directory** — [`/list`](/list) — Complete map of the Oasisverse
- **The Gathering** — [`/rally`](/rally) — 127 beacons across 10 zones, including Oasis Development Council territories
- **Oasis AI Lab** — [`/ailab`](/ailab) — Artificial intelligence, agents, and world-models built openly on [github.com/Oasis-Company](https://github.com/Oasis-Company)
  - **Fundamental** — [`/ailab/fundamental`](/ailab/fundamental) — Three open AI skills (Great-Expectations, Decomposer-Skill, Tension-Mining) with copyable prompts
- **People** — [`/people`](/people) — directory of Oasis Company GitHub org members (7 people / 9 accounts)
  - **CeaserZhao** — [`/people/ceaserzhao`](/people/ceaserzhao) — stark emotional-engineering intro; [`/people/ceaserzhao/info`](/people/ceaserzhao/info) reveals the bio (founded Oasis Company at 11, building a real world-narrative framework); [`/people/ceaserzhao/info/paper`](/people/ceaserzhao/info/paper) lists papers; [`/people/ceaserzhao/info/project`](/people/ceaserzhao/info/project) lists projects; [`/people/ceaserzhao/article`](/people/ceaserzhao/article) collects long-form writing (start with [`/article/oasis-containment-design`](/people/ceaserzhao/article/oasis-containment-design))

---

## Tech Stack

- **Hosting:** Cloudflare Pages
- **Backend:** Pages Functions + KV
- **Automation:** GitHub Actions
- **Design:** Swiss black-and-white minimalism

---

*Made by [CeaserZhao](https://ceaserzhao.com) · [ceo.oasiscompany.org](https://ceo.oasiscompany.org)*
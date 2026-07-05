# Apply Oasis — Deployment & Configuration

**Page:** `https://oasiscompany.org/apply`
**Default language:** English
**Deployed on:** Cloudflare Pages

---

## Project Structure

```
/ (Cloudflare Pages root — oasiscompany.org)
├── apply.html                          ← Apply Oasis page (Swiss design)
├── _redirects                          ← /apply → apply.html (internal rewrite)
├── _headers                            ← Security & cache headers
│
├── functions/
│   └── apply/api/
│       ├── _middleware.js              ← CORS middleware
│       └── [[catchall]].js             ← API router (9 endpoints)
│
├── .github/workflows/
│   └── org-member-automation.yml       ← GitHub Actions: auto-invite + Org README
│
├── assets/
│   ├── oasis_logo.svg                  ← Oasis company logo
│   └── oasisbio-logo-horizontal.svg    ← OasisBio logo
│
├── APPLY-OASIS.md                      ← This file
├── wrangler.toml                       ← Cloudflare Pages config
├── .gitignore
└── README.md                           ← Project root docs
```

---

## Routing (`oasiscompany.org`)

| Path | Source | Destination | Type |
|------|--------|-------------|------|
| `/` | Root | — (coming soon) | Static |
| `/apply` | `_redirects` | `apply.html` | Internal rewrite (200) |
| `/apply/` | `_redirects` | `apply.html` | Internal rewrite (200) |
| `/apply/api/*` | Pages Functions | `functions/apply/api/[[catchall]].js` | Auto-routed |

The `_redirects` file uses status code `200` — this is an **internal rewrite**, meaning the browser URL stays as `oasiscompany.org/apply` while Cloudflare serves `apply.html` behind the scenes.

The Pages Functions at `functions/apply/api/[[catchall]].js` are automatically invoked for `/apply/api/*` paths — no additional routing config needed.

---

## Build Configuration

### wrangler.toml

```toml
name = "oasis-apply"
compatibility_date = "2026-07-01"
pages_build_output_dir = "."

[build]
command = ""              # No build step — static files + Functions
output_dir = "."
```

**Key points:**
- **Build command:** Empty (`""`) — the HTML/CSS/JS is pre-compiled, no framework build needed
- **Output directory:** `.` (project root) — `apply.html`, `_redirects`, `_headers`, and `functions/` are all at the root
- **Pages Functions** are automatically detected in the `functions/` directory — they don't need to be in the build output
- **`_redirects`** and **`_headers`** files are uploaded alongside static assets

### GitHub Integration Build Settings

If connecting the repo to Cloudflare Pages for auto-deploy:

| Setting | Value |
|---------|-------|
| Build command | *(leave empty)* |
| Build output directory | `.` |
| Root directory | `/` |
| Production branch | `main` |

These are the same settings as `wrangler.toml` — no build step, just deploy the files as-is.

---

## API Endpoints (Pages Functions)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/apply/api/health` | Health check |
| `GET` | `/apply/api/blocks` | List 16 blocks |
| `POST` | `/apply/api/applications` | Submit application |
| `GET` | `/apply/api/applications/query?q=` | Query by ID / GitHub / name |
| `GET` | `/apply/api/applications/:id` | Get application details |
| `PUT` | `/apply/api/applications/:id/approve` | Approve → triggers GitHub dispatch |
| `POST` | `/apply/api/proposals` | Submit new block proposal |
| `GET` | `/apply/api/proposals` | List proposals |
| `POST` | `/apply/api/proposals/:id/vote` | Vote on proposal |

All responses include CORS headers via `functions/apply/api/_middleware.js`.

---

## KV Namespace

- **Name:** `APPLICATIONS_KV`
- **ID:** `ff342f38b08345b9a1b26d6d537bf00a`
- **Binding:** `APPLICATIONS_KV` (in `wrangler.toml` + Cloudflare Dashboard)
- **Bound to both** production and preview environments

### KV Key Schema

| Key Pattern | Description |
|-------------|-------------|
| `app:<id>` | Application record (JSON) |
| `app:by-github:<username>` | GitHub username → App ID |
| `app:by-name:<name>` | Applicant name → App ID |
| `proposal:<id>` | Proposal record (JSON) |
| `proposal:list` | List of all proposal IDs (JSON array) |
| `counter:apps` | Auto-incrementing app counter |
| `counter:props` | Auto-incrementing proposal counter |

### Seeded Data

- 4 sample proposals (Bio Lab, Robotics, Education, Media Lab)
- Counters: `apps=0`, `props=4`

---

## Cloudflare Pages Project

| Property | Value |
|----------|-------|
| **Project name** | `oasis-apply` |
| **Production branch** | `main` |
| **Account ID** | `0cb18e5a945d697b7538241117e17ae2` |
| **Deployment URL** | `https://<hash>.oasis-apply.pages.dev` |
| **Custom domain** | `oasiscompany.org` |

### Setting Up the Custom Domain

Since the site is deployed at `oasiscompany.org` (not a subdomain), the Pages project needs `oasiscompany.org` as its custom domain. Do this in the Cloudflare Dashboard:

1. Go to **Cloudflare Dashboard → Pages → oasis-apply → Custom domains**
2. Click **Set up a custom domain**
3. Enter `oasiscompany.org`
4. Cloudflare will automatically:
   - Add a CNAME record (`@` → `oasis-apply.pages.dev`) in the DNS zone
   - Provision an SSL certificate
5. Wait ~30 seconds for DNS propagation

After this, `oasiscompany.org/apply` will serve the Apply Oasis page.

> **Note:** If `oasiscompany.org` already has DNS records (e.g., for the main site), the CNAME record for `@` may conflict. In that case, use a subdomain approach:
> - Add `apply.oasiscompany.org` as a custom domain
> - Then in `_redirects`: `/apply /apply.html 200` still works since `apply.html` is at root
> - Or configure a Cloudflare Page Rule to rewrite `/apply` → `apply.oasiscompany.org`

---

## GitHub Automation

### Workflow: `org-member-automation.yml`

**Triggers:**
- `workflow_dispatch` — manual trigger with GitHub username, block, and name
- `repository_dispatch` — triggered by API (`PUT /apply/api/applications/:id/approve`)

**Actions:**
1. Invites the applicant to `Oasis-Company` GitHub organization
2. Clones `Oasis-Company/.github` repo and appends new member entry to `profile/README.md`
3. Commits and pushes the updated Org README

**Prerequisite:**
- Set repository secret `ORG_ADMIN_TOKEN` — a GitHub PAT with `org:admin` and `repo:all` scopes
- The token must belong to an owner or admin of the `Oasis-Company` organization
- To set it: GitHub → Oasis-Company-Public-Website → Settings → Secrets and variables → Actions → New repository secret

---

## Application Flow

```
┌──────────────────────────────────────────────────────────┐
│  User visits oasiscompany.org/apply                       │
│  ↓                                                        │
│  Cloudflare Pages serves apply.html (via _redirects)      │
│  ↓                                                        │
│  User fills form → POST /apply/api/applications           │
│  ↓                                                        │
│  Pages Function receives request → stores in KV           │
│  ↓                                                        │
│  Returns application ID to user                           │
│  ↓                                                        │
│  User can query status: GET /apply/api/applications/query │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Admin approves: PUT /apply/api/applications/:id/approve │
│  ↓                                                        │
│  Updates KV status → "approved"                           │
│  ↓                                                        │
│  Dispatches repository_dispatch to GitHub Actions          │
│  ↓                                                        │
│  GitHub Actions: Invite + Update Org README               │
└──────────────────────────────────────────────────────────┘
```

---

## Development Commands

```bash
# ── Login ──
npx wrangler login
npx wrangler whoami

# ── Deploy to Cloudflare Pages ──
npx wrangler pages deploy . --project-name oasis-apply --branch main

# ── KV Operations ──
npx wrangler kv key put --remote --binding=APPLICATIONS_KV "<key>" "<value>"
npx wrangler kv key get --remote --binding=APPLICATIONS_KV "<key>"
npx wrangler kv bulk put --remote --binding=APPLICATIONS_KV "<path-to-json>"

# ── Secrets ──
npx wrangler pages secret put ORG_ADMIN_TOKEN --project-name oasis-apply

# ── Local dev (with Functions) ──
npx wrangler pages dev . --binding APPLICATIONS_KV=ff342f38b08345b9a1b26d6d537bf00a
```

> **Local dev note:** Opening `apply.html` directly from the file system will fall back to `localStorage` for API operations. To test Pages Functions locally, use `npx wrangler pages dev`.

---

## Page Features

- **Swiss black-and-white minimalist design** with red accents (#e60000)
- **Typography:** Archivo Black (display) + DM Sans (body)
- **16 Blocks** with custom SVG logos and [E]/[X] tags
- **Two application methods:** structured template form + creative free-form
- **Public query** by application ID or GitHub username
- **GitHub auto-invite** + Org README auto-fill (via API + Actions)
- **Community voting** for new block proposals
- **"Made by CeaserZhao"** footer with links to ceaserzhao.com and ceo.oasiscompany.org

---

*This page is made by [CeaserZhao](https://ceaserzhao.com) · [ceo.oasiscompany.org](https://ceo.oasiscompany.org)*
# Oasis Apply API

Cloudflare Workers + KV backend for the Apply Oasis application page.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/apply/api/applications` | Submit a new application |
| `GET` | `/apply/api/applications/query?q=` | Query application by ID/GitHub/name |
| `GET` | `/apply/api/applications/:id` | Get full application details |
| `PUT` | `/apply/api/applications/:id/approve` | Approve an application (triggers GitHub dispatch) |
| `POST` | `/apply/api/proposals` | Submit a new proposal |
| `GET` | `/apply/api/proposals` | List all proposals |
| `POST` | `/apply/api/proposals/:id/vote` | Vote on a proposal |
| `GET` | `/apply/api/blocks` | List all available blocks |
| `GET` | `/apply/api/health` | Health check |

## Deployment

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Create KV namespace
npx wrangler kv:namespace create "APPLICATIONS_KV"

# Copy and configure
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your KV namespace IDs

# Set secrets
npx wrangler secret put ORG_ADMIN_TOKEN

# Seed initial data
npx wrangler kv:key put --binding=APPLICATIONS_KV "counter:apps" "0"

# Deploy
npx wrangler deploy
```

## Seeding Proposals

Run the commands in `seed.js` to populate initial proposal data.
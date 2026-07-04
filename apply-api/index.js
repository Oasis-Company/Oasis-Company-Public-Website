/**
 * Oasis Apply API — Cloudflare Worker
 * =====================================
 * Backend for the Apply Oasis page.
 * Handles application submissions, queries, proposals, and GitHub dispatch.
 *
 * KV Namespace: APPLICATIONS_KV
 *   Key format:
 *     app:<id>           — Application record (JSON)
 *     app:by-github:<gh> — GitHub username → Application ID mapping
 *     proposal:<id>      — Proposal record (JSON)
 *     counter:apps       — Auto-incrementing application counter
 *     counter:props      — Auto-incrementing proposal counter
 */

// CORS headers for the apply page
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Block ID to display name mapping
const BLOCK_NAMES = {
  'oasis-company': 'Oasis Company',
  'oasis-event': 'Oasis Event Commitee',
  'oits': 'OITS',
  'oasis-standard': 'OasisStandardCommitee',
  'statuz': 'Statuz',
  'edilon': 'Edilon.org',
  'amar-engine': 'Amar-Engine.org',
  'front-fireman': 'FrontFireman',
  'p2p-keeper': 'Oasis P2P Keeper',
  'insane-dream': 'InsaneDreamBuilder',
  'sandboxer': 'SandBoxer',
  'singularity-lab': 'OasisSingularityLab',
  'ai-lab': 'OasisAIlab',
  'cell-lab': 'OasisCell Lab',
  'game-lab': 'Oasis Game Lab',
  'mens-lab': 'Oasis Mens Lab',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { ...CORS_HEADERS, 'Allow': 'GET, POST, PUT, DELETE, OPTIONS' },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace('/apply/api', '').replace(/\/$/, '');
    const method = request.method;

    try {
      let response;

      // Route: POST /apply/api/applications — Submit a new application
      if (path === '/applications' && method === 'POST') {
        response = await handleSubmitApplication(request, env);
      }
      // Route: GET /apply/api/applications/query — Query an application
      else if (path === '/applications/query' && method === 'GET') {
        response = await handleQueryApplication(url, env);
      }
      // Route: GET /apply/api/applications/:id — Get a specific application
      else if (path.match(/^\/applications\/(.+)$/) && method === 'GET') {
        const id = path.match(/^\/applications\/(.+)$/)[1];
        response = await handleGetApplication(id, env);
      }
      // Route: PUT /apply/api/applications/:id/approve — Approve an application
      else if (path.match(/^\/applications\/(.+)\/approve$/) && method === 'PUT') {
        const id = path.match(/^\/applications\/(.+)\/approve$/)[1];
        response = await handleApproveApplication(id, env);
      }
      // Route: POST /apply/api/proposals — Submit a new proposal
      else if (path === '/proposals' && method === 'POST') {
        response = await handleSubmitProposal(request, env);
      }
      // Route: GET /apply/api/proposals — List all proposals
      else if (path === '/proposals' && method === 'GET') {
        response = await handleListProposals(env);
      }
      // Route: POST /apply/api/proposals/:id/vote — Vote on a proposal
      else if (path.match(/^\/proposals\/(.+)\/vote$/) && method === 'POST') {
        const id = path.match(/^\/proposals\/(.+)\/vote$/)[1];
        response = await handleVoteProposal(id, env);
      }
      // Route: GET /apply/api/blocks — List all blocks
      else if (path === '/blocks' && method === 'GET') {
        response = await handleListBlocks();
      }
      // Route: GET /apply/api/health — Health check
      else if (path === '/health' && method === 'GET') {
        response = new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      // 404
      else {
        response = new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      return response;
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  },
};

// ==========================================
// HANDLERS
// ==========================================

/**
 * Submit a new application
 */
async function handleSubmitApplication(request, env) {
  const body = await request.json();

  // Validate required fields
  if (!body.name || !body.block) {
    return new Response(JSON.stringify({ error: 'Name and block are required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Validate block
  if (!BLOCK_NAMES[body.block]) {
    return new Response(JSON.stringify({ error: 'Invalid block ID' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Generate application ID
  const count = await env.APPLICATIONS_KV.get('counter:apps');
  const nextNum = (parseInt(count || '0') + 1).toString();
  await env.APPLICATIONS_KV.put('counter:apps', nextNum);

  const appId = `OASIS-${Date.now().toString(36).toUpperCase()}-${nextNum.padStart(4, '0')}`;

  const application = {
    id: appId,
    type: body.type || 'template',
    name: body.name,
    email: body.email || '',
    github: body.github || '',
    contact: body.contact || '',
    block: body.block,
    block_name: BLOCK_NAMES[body.block],
    skills: body.skills || '',
    why: body.why || '',
    content: body.content || '',
    status: 'pending',
    submitted: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  // Store in KV
  await env.APPLICATIONS_KV.put(`app:${appId}`, JSON.stringify(application));

  // Index by GitHub username if provided
  if (body.github) {
    await env.APPLICATIONS_KV.put(`app:by-github:${body.github.toLowerCase()}`, appId);
  }

  // Index by name for query
  await env.APPLICATIONS_KV.put(`app:by-name:${body.name.toLowerCase()}`, appId);

  return new Response(JSON.stringify({
    success: true,
    id: appId,
    message: 'Application submitted successfully',
  }), {
    status: 201,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * Query applications by ID, GitHub username, or name
 */
async function handleQueryApplication(url, env) {
  const q = url.searchParams.get('q')?.trim().toLowerCase();

  if (!q) {
    return new Response(JSON.stringify({ error: 'Query parameter "q" is required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Try direct ID lookup first
  let appData = await env.APPLICATIONS_KV.get(`app:${q.toUpperCase()}`);

  // Try GitHub lookup
  if (!appData) {
    const idByGithub = await env.APPLICATIONS_KV.get(`app:by-github:${q}`);
    if (idByGithub) {
      appData = await env.APPLICATIONS_KV.get(`app:${idByGithub}`);
    }
  }

  // Try name lookup
  if (!appData) {
    const idByName = await env.APPLICATIONS_KV.get(`app:by-name:${q}`);
    if (idByName) {
      appData = await env.APPLICATIONS_KV.get(`app:${idByName}`);
    }
  }

  if (!appData) {
    return new Response(JSON.stringify({ found: false, message: 'No application found' }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const app = JSON.parse(appData);

  // Return limited public info
  return new Response(JSON.stringify({
    found: true,
    application: {
      id: app.id,
      type: app.type,
      status: app.status,
      block_name: app.block_name,
      submitted: app.submitted,
      name: app.name,
    },
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * Get full application details (admin only)
 */
async function handleGetApplication(id, env) {
  const appData = await env.APPLICATIONS_KV.get(`app:${id}`);

  if (!appData) {
    return new Response(JSON.stringify({ error: 'Application not found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(appData, {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * Approve an application — triggers GitHub workflow dispatch
 */
async function handleApproveApplication(id, env) {
  const appData = await env.APPLICATIONS_KV.get(`app:${id}`);

  if (!appData) {
    return new Response(JSON.stringify({ error: 'Application not found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const app = JSON.parse(appData);
  app.status = 'approved';
  app.updated = new Date().toISOString();
  await env.APPLICATIONS_KV.put(`app:${id}`, JSON.stringify(app));

  // Trigger GitHub Actions workflow dispatch
  if (app.github) {
    const org = env.ORG_NAME || 'Oasis-Company';
    const repo = 'Oasis-Company-Public-Website';
    const token = env.ORG_ADMIN_TOKEN;

    if (token) {
      try {
        const githubResponse = await fetch(
          `https://api.github.com/repos/${org}/${repo}/dispatches`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event_type: 'application-approved',
              client_payload: {
                github_username: app.github,
                block_id: app.block,
                applicant_name: app.name,
              },
            }),
          }
        );

        if (!githubResponse.ok) {
          console.error('GitHub dispatch failed:', await githubResponse.text());
        }
      } catch (err) {
        console.error('GitHub dispatch error:', err);
      }
    }
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Application approved',
    application: app,
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * Submit a new proposal
 */
async function handleSubmitProposal(request, env) {
  const body = await request.json();

  if (!body.name || !body.description) {
    return new Response(JSON.stringify({ error: 'Name and description are required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const count = await env.APPLICATIONS_KV.get('counter:props');
  const nextNum = (parseInt(count || '0') + 1).toString();
  await env.APPLICATIONS_KV.put('counter:props', nextNum);

  const proposal = {
    id: `prop-${nextNum}`,
    name: body.name,
    description: body.description,
    proposer: body.proposer || 'Anonymous',
    votes: 0,
    total: 50,
    status: 'voting',
    submitted: new Date().toISOString(),
  };

  await env.APPLICATIONS_KV.put(`proposal:${proposal.id}`, JSON.stringify(proposal));

  return new Response(JSON.stringify({
    success: true,
    id: proposal.id,
    message: 'Proposal submitted for voting',
  }), {
    status: 201,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * List all proposals
 */
async function handleListProposals(env) {
  // KV doesn't support listing directly, so we use a list key
  // For simplicity, we store all proposal IDs in a list
  const listData = await env.APPLICATIONS_KV.get('proposal:list');
  const ids = listData ? JSON.parse(listData) : ['prop-1', 'prop-2', 'prop-3', 'prop-4'];

  const proposals = [];
  for (const id of ids) {
    const data = await env.APPLICATIONS_KV.get(`proposal:${id}`);
    if (data) {
      proposals.push(JSON.parse(data));
    }
  }

  return new Response(JSON.stringify(proposals), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * Vote on a proposal
 */
async function handleVoteProposal(id, env) {
  const data = await env.APPLICATIONS_KV.get(`proposal:${id}`);

  if (!data) {
    return new Response(JSON.stringify({ error: 'Proposal not found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const proposal = JSON.parse(data);

  if (proposal.votes >= proposal.total) {
    return new Response(JSON.stringify({ error: 'Voting closed for this proposal' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  proposal.votes += 1;
  await env.APPLICATIONS_KV.put(`proposal:${id}`, JSON.stringify(proposal));

  return new Response(JSON.stringify({
    success: true,
    votes: proposal.votes,
    total: proposal.total,
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * List all blocks
 */
async function handleListBlocks() {
  const blocks = Object.entries(BLOCK_NAMES).map(([id, name]) => ({
    id,
    name,
  }));

  return new Response(JSON.stringify(blocks), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
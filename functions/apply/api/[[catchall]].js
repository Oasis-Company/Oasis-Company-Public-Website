/**
 * Oasis Apply API — Pages Functions Router
 * ==========================================
 * Catches all /apply/api/* requests and routes them.
 *
 * KV namespace binding: APPLICATIONS_KV (configured in wrangler.toml)
 *
 * Endpoints:
 *   POST /apply/api/applications       — Submit application
 *   GET  /apply/api/applications/query  — Query application
 *   GET  /apply/api/applications/:id    — Get application details
 *   PUT  /apply/api/applications/:id/approve — Approve application
 *   POST /apply/api/proposals           — Submit proposal
 *   GET  /apply/api/proposals           — List proposals
 *   POST /apply/api/proposals/:id/vote  — Vote on proposal
 *   GET  /apply/api/blocks              — List blocks
 *   GET  /apply/api/health              — Health check
 */

// Block ID → display name mapping
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

const CT_JSON = { 'Content-Type': 'application/json' };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CT_JSON });
}

function jsonError(message, status = 400) {
  return json({ error: message }, status);
}

// Parse path segments after /apply/api
function parsePath(url) {
  const p = new URL(url).pathname.replace(/\/$/, '');
  const segments = p.split('/').filter(Boolean);
  // remove "apply", "api"
  const s = segments[0] === 'apply' ? segments.slice(2) : segments;
  return s;
}

// ==========================================
// EMAIL NOTIFICATION
// ==========================================

async function sendEmailNotification(application, env) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  const emailTo = env.EMAIL_TO || '2791351776@qq.com';
  const emailFrom = env.EMAIL_FROM || 'apply@oasiscompany.org';

  const subject = `[Apply Oasis] New Application: ${application.name} → ${application.block_name}`;

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="border-bottom: 3px solid #000; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-family: 'Archivo Black', sans-serif; font-size: 24px; margin: 0; text-transform: uppercase;">
          Apply Oasis
        </h1>
        <p style="color: #666; margin: 4px 0 0;">New application received</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; width: 120px; border: 1px solid #e5e5e5;">Application ID</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Type</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5; text-transform: capitalize;">${application.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.name}</td>
        </tr>
        ${application.email ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Email</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.email}</td></tr>` : ''}
        ${application.github ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">GitHub</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.github}</td></tr>` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Block</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.block_name}</td>
        </tr>
        ${application.skills ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Skills</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.skills}</td></tr>` : ''}
        ${application.why ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Why</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5; white-space: pre-wrap;">${application.why}</td></tr>` : ''}
        ${application.content ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Content</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5; white-space: pre-wrap;">${application.content}</td></tr>` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Status</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5; text-transform: capitalize;">${application.status}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Submitted</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${new Date(application.submitted).toLocaleString()}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
        <p>This notification was sent automatically by Apply Oasis.</p>
        <p>oasiscompany.org/apply</p>
      </div>
    </div>
  `;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [emailTo],
        subject,
        html,
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error('Email send failed:', resp.status, errBody);
    } else {
      console.log('Email notification sent successfully');
    }
  } catch (err) {
    console.error('Email send error:', err);
  }
}

// ==========================================
// HANDLERS
// ==========================================

async function handleSubmitApplication(request, env) {
  const body = await request.json();
  if (!body.name) return jsonError('Name is required');

  // Preacher applications don't need a block
  const isPreacher = body.type === 'preacher';
  if (!isPreacher) {
    if (!body.block) return jsonError('Block is required');
    if (!BLOCK_NAMES[body.block]) return jsonError('Invalid block ID');
  }

  const countRaw = await env.APPLICATIONS_KV.get('counter:apps');
  const nextNum = ((parseInt(countRaw) || 0) + 1).toString();
  await env.APPLICATIONS_KV.put('counter:apps', nextNum);

  const prefix = isPreacher ? 'PRC' : 'OASIS';
  const appId = `${prefix}-${Date.now().toString(36).toUpperCase()}-${nextNum.padStart(4, '0')}`;

  const application = {
    id: appId,
    type: body.type || 'template',
    name: body.name,
    email: body.email || '',
    github: body.github || '',
    contact: body.contact || '',
    block: isPreacher ? 'preacher' : body.block,
    block_name: isPreacher ? 'Preacher' : (BLOCK_NAMES[body.block] || ''),
    zone: body.zone || null,
    beacon_city: body.beacon_city || '',
    skills: body.skills || '',
    why: body.why || '',
    vision: body.vision || '',
    experience: body.experience || '',
    content: body.content || '',
    status: 'pending',
    submitted: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  await env.APPLICATIONS_KV.put(`app:${appId}`, JSON.stringify(application));
  if (body.github) await env.APPLICATIONS_KV.put(`app:by-github:${body.github.toLowerCase()}`, appId);
  await env.APPLICATIONS_KV.put(`app:by-name:${body.name.toLowerCase()}`, appId);

  // Fire-and-forget email notification (don't block the response)
  env.RESEND_API_KEY && sendEmailNotification(application, env);

  return json({ success: true, id: appId, message: 'Application submitted successfully' }, 201);
}

async function handleQueryApplication(url, env) {
  const q = url.searchParams.get('q')?.trim().toLowerCase();
  if (!q) return jsonError('Query parameter "q" is required');

  let appData = await env.APPLICATIONS_KV.get(`app:${q.toUpperCase()}`);
  if (!appData) {
    const idByGithub = await env.APPLICATIONS_KV.get(`app:by-github:${q}`);
    if (idByGithub) appData = await env.APPLICATIONS_KV.get(`app:${idByGithub}`);
  }
  if (!appData) {
    const idByName = await env.APPLICATIONS_KV.get(`app:by-name:${q}`);
    if (idByName) appData = await env.APPLICATIONS_KV.get(`app:${idByName}`);
  }

  if (!appData) return json({ found: false, message: 'No application found' });

  const app = JSON.parse(appData);
  return json({
    found: true,
    application: {
      id: app.id,
      type: app.type,
      status: app.status,
      block_name: app.block_name,
      submitted: app.submitted,
      name: app.name,
    },
  });
}

async function handleGetApplication(id, env) {
  const data = await env.APPLICATIONS_KV.get(`app:${id}`);
  if (!data) return jsonError('Application not found', 404);
  return json(JSON.parse(data));
}

async function handleApproveApplication(id, env) {
  const raw = await env.APPLICATIONS_KV.get(`app:${id}`);
  if (!raw) return jsonError('Application not found', 404);

  const app = JSON.parse(raw);
  app.status = 'approved';
  app.updated = new Date().toISOString();
  await env.APPLICATIONS_KV.put(`app:${id}`, JSON.stringify(app));

  // Trigger GitHub dispatch
  if (app.github && env.ORG_ADMIN_TOKEN) {
    try {
      const org = env.ORG_NAME || 'Oasis-Company';
      const repo = 'Oasis-Company-Public-Website';
      const resp = await fetch(`https://api.github.com/repos/${org}/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${env.ORG_ADMIN_TOKEN}`,
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
      });
      if (!resp.ok) console.error('GitHub dispatch failed:', await resp.text());
    } catch (err) {
      console.error('GitHub dispatch error:', err);
    }
  }

  return json({ success: true, message: 'Application approved', application: app });
}

async function handleSubmitProposal(request, env) {
  const body = await request.json();
  if (!body.name || !body.description) return jsonError('Name and description are required');

  const countRaw = await env.APPLICATIONS_KV.get('counter:props');
  const nextNum = ((parseInt(countRaw) || 0) + 1).toString();
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

  // Update proposal list
  const listRaw = await env.APPLICATIONS_KV.get('proposal:list');
  const list = listRaw ? JSON.parse(listRaw) : [];
  list.push(proposal.id);
  await env.APPLICATIONS_KV.put('proposal:list', JSON.stringify(list));

  return json({ success: true, id: proposal.id, message: 'Proposal submitted for voting' }, 201);
}

async function handleListProposals(env) {
  const listRaw = await env.APPLICATIONS_KV.get('proposal:list');
  const ids = listRaw ? JSON.parse(listRaw) : ['prop-1', 'prop-2', 'prop-3', 'prop-4'];

  const proposals = [];
  for (const id of ids) {
    const data = await env.APPLICATIONS_KV.get(`proposal:${id}`);
    if (data) proposals.push(JSON.parse(data));
  }
  return json(proposals);
}

async function handleVoteProposal(id, env) {
  const raw = await env.APPLICATIONS_KV.get(`proposal:${id}`);
  if (!raw) return jsonError('Proposal not found', 404);

  const proposal = JSON.parse(raw);
  if (proposal.votes >= proposal.total) return jsonError('Voting closed for this proposal');

  proposal.votes += 1;
  await env.APPLICATIONS_KV.put(`proposal:${id}`, JSON.stringify(proposal));

  return json({ success: true, votes: proposal.votes, total: proposal.total });
}

function handleListBlocks() {
  const blocks = Object.entries(BLOCK_NAMES).map(([id, name]) => ({ id, name }));
  return json(blocks);
}

// ==========================================
// ROUTER
// ==========================================

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const segments = parsePath(url);
  const method = request.method;

  // GET /apply/api/health
  if (segments.length === 1 && segments[0] === 'health' && method === 'GET') {
    return json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // GET /apply/api/blocks
  if (segments.length === 1 && segments[0] === 'blocks' && method === 'GET') {
    return handleListBlocks();
  }

  // POST /apply/api/applications
  if (segments.length === 1 && segments[0] === 'applications' && method === 'POST') {
    return handleSubmitApplication(request, env);
  }

  // POST /apply/api/proposals
  if (segments.length === 1 && segments[0] === 'proposals' && method === 'POST') {
    return handleSubmitProposal(request, env);
  }

  // GET /apply/api/proposals
  if (segments.length === 1 && segments[0] === 'proposals' && method === 'GET') {
    return handleListProposals(env);
  }

  // GET /apply/api/applications/query
  if (segments.length === 2 && segments[0] === 'applications' && segments[1] === 'query' && method === 'GET') {
    return handleQueryApplication(url, env);
  }

  // GET /apply/api/applications/:id
  if (segments.length === 2 && segments[0] === 'applications' && method === 'GET') {
    return handleGetApplication(segments[1], env);
  }

  // PUT /apply/api/applications/:id/approve
  if (segments.length === 3 && segments[0] === 'applications' && segments[2] === 'approve' && method === 'PUT') {
    return handleApproveApplication(segments[1], env);
  }

  // POST /apply/api/proposals/:id/vote
  if (segments.length === 3 && segments[0] === 'proposals' && segments[2] === 'vote' && method === 'POST') {
    return handleVoteProposal(segments[1], env);
  }

  return jsonError('Not found', 404);
}
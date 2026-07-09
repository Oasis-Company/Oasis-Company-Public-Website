var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// apply/api/[[catchall]].js
var BLOCK_NAMES = {
  "oasis-company": "Oasis Company",
  "oasis-event": "Oasis Event Commitee",
  "oits": "OITS",
  "oasis-standard": "OasisStandardCommitee",
  "statuz": "Statuz",
  "edilon": "Edilon.org",
  "amar-engine": "Amar-Engine.org",
  "front-fireman": "FrontFireman",
  "p2p-keeper": "Oasis P2P Keeper",
  "insane-dream": "InsaneDreamBuilder",
  "sandboxer": "SandBoxer",
  "singularity-lab": "OasisSingularityLab",
  "ai-lab": "OasisAIlab",
  "cell-lab": "OasisCell Lab",
  "game-lab": "Oasis Game Lab",
  "mens-lab": "Oasis Mens Lab"
};
var CT_JSON = { "Content-Type": "application/json" };
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CT_JSON });
}
__name(json, "json");
function jsonError(message, status = 400) {
  return json({ error: message }, status);
}
__name(jsonError, "jsonError");
function parsePath(url) {
  const p = new URL(url).pathname.replace(/\/$/, "");
  const segments = p.split("/").filter(Boolean);
  const s = segments[0] === "apply" ? segments.slice(2) : segments;
  return s;
}
__name(parsePath, "parsePath");
async function sendEmailNotification(application, env) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not configured, skipping email notification");
    return;
  }
  const emailTo = env.EMAIL_TO || "2791351776@qq.com";
  const emailFrom = env.EMAIL_FROM || "apply@oasiscompany.org";
  const subject = `[Apply Oasis] New Application: ${application.name} \u2192 ${application.block_name}`;
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
        ${application.email ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Email</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.email}</td></tr>` : ""}
        ${application.github ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">GitHub</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.github}</td></tr>` : ""}
        <tr>
          <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Block</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.block_name}</td>
        </tr>
        ${application.skills ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Skills</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${application.skills}</td></tr>` : ""}
        ${application.why ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Why</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5; white-space: pre-wrap;">${application.why}</td></tr>` : ""}
        ${application.content ? `<tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; border: 1px solid #e5e5e5;">Content</td><td style="padding: 8px 12px; border: 1px solid #e5e5e5; white-space: pre-wrap;">${application.content}</td></tr>` : ""}
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
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [emailTo],
        subject,
        html
      })
    });
    if (!resp.ok) {
      const errBody = await resp.text();
      console.error("Email send failed:", resp.status, errBody);
    } else {
      console.log("Email notification sent successfully");
    }
  } catch (err) {
    console.error("Email send error:", err);
  }
}
__name(sendEmailNotification, "sendEmailNotification");
async function handleSubmitApplication(request, env) {
  const body = await request.json();
  if (!body.name || !body.block) return jsonError("Name and block are required");
  if (!BLOCK_NAMES[body.block]) return jsonError("Invalid block ID");
  const countRaw = await env.APPLICATIONS_KV.get("counter:apps");
  const nextNum = ((parseInt(countRaw) || 0) + 1).toString();
  await env.APPLICATIONS_KV.put("counter:apps", nextNum);
  const appId = `OASIS-${Date.now().toString(36).toUpperCase()}-${nextNum.padStart(4, "0")}`;
  const application = {
    id: appId,
    type: body.type || "template",
    name: body.name,
    email: body.email || "",
    github: body.github || "",
    contact: body.contact || "",
    block: body.block,
    block_name: BLOCK_NAMES[body.block],
    skills: body.skills || "",
    why: body.why || "",
    content: body.content || "",
    status: "pending",
    submitted: (/* @__PURE__ */ new Date()).toISOString(),
    updated: (/* @__PURE__ */ new Date()).toISOString()
  };
  await env.APPLICATIONS_KV.put(`app:${appId}`, JSON.stringify(application));
  if (body.github) await env.APPLICATIONS_KV.put(`app:by-github:${body.github.toLowerCase()}`, appId);
  await env.APPLICATIONS_KV.put(`app:by-name:${body.name.toLowerCase()}`, appId);
  env.RESEND_API_KEY && sendEmailNotification(application, env);
  return json({ success: true, id: appId, message: "Application submitted successfully" }, 201);
}
__name(handleSubmitApplication, "handleSubmitApplication");
async function handleQueryApplication(url, env) {
  const q = url.searchParams.get("q")?.trim().toLowerCase();
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
  if (!appData) return json({ found: false, message: "No application found" });
  const app = JSON.parse(appData);
  return json({
    found: true,
    application: {
      id: app.id,
      type: app.type,
      status: app.status,
      block_name: app.block_name,
      submitted: app.submitted,
      name: app.name
    }
  });
}
__name(handleQueryApplication, "handleQueryApplication");
async function handleGetApplication(id, env) {
  const data = await env.APPLICATIONS_KV.get(`app:${id}`);
  if (!data) return jsonError("Application not found", 404);
  return json(JSON.parse(data));
}
__name(handleGetApplication, "handleGetApplication");
async function handleApproveApplication(id, env) {
  const raw = await env.APPLICATIONS_KV.get(`app:${id}`);
  if (!raw) return jsonError("Application not found", 404);
  const app = JSON.parse(raw);
  app.status = "approved";
  app.updated = (/* @__PURE__ */ new Date()).toISOString();
  await env.APPLICATIONS_KV.put(`app:${id}`, JSON.stringify(app));
  if (app.github && env.ORG_ADMIN_TOKEN) {
    try {
      const org = env.ORG_NAME || "Oasis-Company";
      const repo = "Oasis-Company-Public-Website";
      const resp = await fetch(`https://api.github.com/repos/${org}/${repo}/dispatches`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${env.ORG_ADMIN_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event_type: "application-approved",
          client_payload: {
            github_username: app.github,
            block_id: app.block,
            applicant_name: app.name
          }
        })
      });
      if (!resp.ok) console.error("GitHub dispatch failed:", await resp.text());
    } catch (err) {
      console.error("GitHub dispatch error:", err);
    }
  }
  return json({ success: true, message: "Application approved", application: app });
}
__name(handleApproveApplication, "handleApproveApplication");
async function handleSubmitProposal(request, env) {
  const body = await request.json();
  if (!body.name || !body.description) return jsonError("Name and description are required");
  const countRaw = await env.APPLICATIONS_KV.get("counter:props");
  const nextNum = ((parseInt(countRaw) || 0) + 1).toString();
  await env.APPLICATIONS_KV.put("counter:props", nextNum);
  const proposal = {
    id: `prop-${nextNum}`,
    name: body.name,
    description: body.description,
    proposer: body.proposer || "Anonymous",
    votes: 0,
    total: 50,
    status: "voting",
    submitted: (/* @__PURE__ */ new Date()).toISOString()
  };
  await env.APPLICATIONS_KV.put(`proposal:${proposal.id}`, JSON.stringify(proposal));
  const listRaw = await env.APPLICATIONS_KV.get("proposal:list");
  const list = listRaw ? JSON.parse(listRaw) : [];
  list.push(proposal.id);
  await env.APPLICATIONS_KV.put("proposal:list", JSON.stringify(list));
  return json({ success: true, id: proposal.id, message: "Proposal submitted for voting" }, 201);
}
__name(handleSubmitProposal, "handleSubmitProposal");
async function handleListProposals(env) {
  const listRaw = await env.APPLICATIONS_KV.get("proposal:list");
  const ids = listRaw ? JSON.parse(listRaw) : ["prop-1", "prop-2", "prop-3", "prop-4"];
  const proposals = [];
  for (const id of ids) {
    const data = await env.APPLICATIONS_KV.get(`proposal:${id}`);
    if (data) proposals.push(JSON.parse(data));
  }
  return json(proposals);
}
__name(handleListProposals, "handleListProposals");
async function handleVoteProposal(id, env) {
  const raw = await env.APPLICATIONS_KV.get(`proposal:${id}`);
  if (!raw) return jsonError("Proposal not found", 404);
  const proposal = JSON.parse(raw);
  if (proposal.votes >= proposal.total) return jsonError("Voting closed for this proposal");
  proposal.votes += 1;
  await env.APPLICATIONS_KV.put(`proposal:${id}`, JSON.stringify(proposal));
  return json({ success: true, votes: proposal.votes, total: proposal.total });
}
__name(handleVoteProposal, "handleVoteProposal");
function handleListBlocks() {
  const blocks = Object.entries(BLOCK_NAMES).map(([id, name]) => ({ id, name }));
  return json(blocks);
}
__name(handleListBlocks, "handleListBlocks");
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const segments = parsePath(url);
  const method = request.method;
  if (segments.length === 1 && segments[0] === "health" && method === "GET") {
    return json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  }
  if (segments.length === 1 && segments[0] === "blocks" && method === "GET") {
    return handleListBlocks();
  }
  if (segments.length === 1 && segments[0] === "applications" && method === "POST") {
    return handleSubmitApplication(request, env);
  }
  if (segments.length === 1 && segments[0] === "proposals" && method === "POST") {
    return handleSubmitProposal(request, env);
  }
  if (segments.length === 1 && segments[0] === "proposals" && method === "GET") {
    return handleListProposals(env);
  }
  if (segments.length === 2 && segments[0] === "applications" && segments[1] === "query" && method === "GET") {
    return handleQueryApplication(url, env);
  }
  if (segments.length === 2 && segments[0] === "applications" && method === "GET") {
    return handleGetApplication(segments[1], env);
  }
  if (segments.length === 3 && segments[0] === "applications" && segments[2] === "approve" && method === "PUT") {
    return handleApproveApplication(segments[1], env);
  }
  if (segments.length === 3 && segments[0] === "proposals" && segments[2] === "vote" && method === "POST") {
    return handleVoteProposal(segments[1], env);
  }
  return jsonError("Not found", 404);
}
__name(onRequest, "onRequest");

// apply/api/_middleware.js
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
async function onRequest2(context) {
  const { request } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: { ...CORS_HEADERS, Allow: "GET, POST, PUT, DELETE, OPTIONS" }
    });
  }
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
__name(onRequest2, "onRequest");

// apply.js
async function onRequest3(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path !== "/apply") {
    return context.next();
  }
  const assetUrl = new URL("/apply.html", url);
  const response = await env.ASSETS.fetch(assetUrl);
  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}
__name(onRequest3, "onRequest");

// list.js
async function onRequest4(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path !== "/list") {
    return context.next();
  }
  const assetUrl = new URL("/list.html", url);
  const response = await env.ASSETS.fetch(assetUrl);
  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}
__name(onRequest4, "onRequest");

// rally.js
async function onRequest5(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path !== "/rally") {
    return context.next();
  }
  const assetUrl = new URL("/rally.html", url);
  const response = await env.ASSETS.fetch(assetUrl);
  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}
__name(onRequest5, "onRequest");

// ../.wrangler/tmp/pages-c94Wuo/functionsRoutes-0.7111948341201404.mjs
var routes = [
  {
    routePath: "/apply/api/:catchall*",
    mountPath: "/apply/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/apply/api",
    mountPath: "/apply/api",
    method: "",
    middlewares: [onRequest2],
    modules: []
  },
  {
    routePath: "/apply",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/list",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/rally",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  }
];

// C:/Users/chkev/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// C:/Users/chkev/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};

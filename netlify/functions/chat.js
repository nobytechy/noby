/**
 * /.netlify/functions/chat — streaming Ask Noby endpoint.
 *
 * Architecture
 *   1. Read ai_settings + portfolio context (profile/projects/skills) from Supabase
 *      using the SERVICE_ROLE key.
 *   2. Stream the LLM response back to the browser as Server-Sent Events.
 *   3. Inside the stream, run a tool-use loop — when the model calls a tool
 *      (e.g. find_projects_by_tech), we execute it against Supabase, feed the
 *      result back to the model, and continue. Max 5 iterations per turn.
 *   4. Best-effort log of the final transcript to ai_chat_messages.
 *
 * SSE event types written to the client:
 *   start       { provider, model }
 *   delta       { text }
 *   tool_start  { name }
 *   tool_end    { name, summary }
 *   usage       { tokens_in, tokens_out }
 *   done        { latency_ms }
 *   error       { error }
 *
 * Providers supported with tool-use + streaming: Anthropic, Groq, DeepSeek.
 * Gemini streams text only (no tool calls in this version).
 *
 * Same module is reused for /api/chat in dev via vite.config.js — it imports
 * `runChat` and pipes the events out manually.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase = null;
function admin() {
  if (_supabase) return _supabase;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  }
  _supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabase;
}

const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;
const _rateBuckets = new Map();
function checkRate(ip) {
  const now = Date.now();
  const arr = (_rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_LIMIT) return false;
  arr.push(now);
  _rateBuckets.set(ip, arr);
  return true;
}

// ─── Tool definitions (shared schema, two encodings) ──────────────────────

const TOOLS = [
  {
    name: 'find_projects_by_tech',
    description: "List Noby's projects that use a specific technology (e.g. React, PHP, Laravel, Supabase, Python, PayNow). Returns project titles, live URLs, and stacks. Use this whenever a visitor asks 'how many', 'do you have', or 'show me' projects with a given tech.",
    schema: {
      type: 'object',
      properties: { tech: { type: 'string', description: 'The technology to filter by (case-insensitive partial match)' } },
      required: ['tech'],
    },
  },
  {
    name: 'get_project_detail',
    description: "Get full information about a specific project by title or slug. Use this when the visitor names a project (e.g. 'tell me about CAG' or 'what's ManishaPay?').",
    schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Project name or slug (partial match OK)' } },
      required: ['query'],
    },
  },
  {
    name: 'list_skills',
    description: "List Noby's skills, optionally filtered by category. Use when the visitor asks about specific skills or technologies.",
    schema: {
      type: 'object',
      properties: { category: { type: 'string', description: "Optional category filter (e.g. 'Frontend', 'Backend', 'Database')" } },
    },
  },
];

async function execTool(name, args) {
  const sb = admin();
  if (name === 'find_projects_by_tech') {
    const tech = String(args?.tech || '').toLowerCase().trim();
    if (!tech) return { error: 'Missing tech argument' };
    const { data } = await sb.from('projects').select('title, slug, short_description, tech_stack, live_url, github_url, featured').limit(50);
    const matches = (data || []).filter((p) => (p.tech_stack || []).some((t) => String(t).toLowerCase().includes(tech)));
    return {
      count: matches.length,
      tech,
      projects: matches.slice(0, 8).map((p) => ({
        title: p.title,
        slug: p.slug,
        description: p.short_description,
        live_url: p.live_url,
        github_url: p.github_url,
        stack: p.tech_stack,
        featured: p.featured,
      })),
    };
  }
  if (name === 'get_project_detail') {
    const q = String(args?.query || '').toLowerCase().trim();
    if (!q) return { error: 'Missing query argument' };
    const { data } = await sb.from('projects').select('*').limit(50);
    const match = (data || []).find((p) =>
      String(p.title || '').toLowerCase().includes(q) || String(p.slug || '').toLowerCase().includes(q)
    );
    if (!match) return { error: `No project matches "${q}"` };
    return {
      title: match.title,
      slug: match.slug,
      short_description: match.short_description,
      long_description: match.long_description,
      stack: match.tech_stack,
      tags: match.tags,
      live_url: match.live_url,
      github_url: match.github_url,
      featured: match.featured,
    };
  }
  if (name === 'list_skills') {
    const cat = args?.category ? String(args.category).toLowerCase() : null;
    const { data } = await sb.from('skills').select('name, category, level').limit(200);
    const all = data || [];
    const filtered = cat ? all.filter((s) => String(s.category || '').toLowerCase().includes(cat)) : all;
    return {
      count: filtered.length,
      filter: cat,
      skills: filtered.map((s) => ({ name: s.name, category: s.category, level: s.level })),
    };
  }
  return { error: `Unknown tool: ${name}` };
}

function toolSummary(name, result) {
  if (!result || result.error) return result?.error || 'no result';
  if (name === 'find_projects_by_tech') return `${result.count} project${result.count === 1 ? '' : 's'} using ${result.tech}`;
  if (name === 'get_project_detail') return result.title || 'project';
  if (name === 'list_skills') return `${result.count} skill${result.count === 1 ? '' : 's'}${result.filter ? ' in ' + result.filter : ''}`;
  return 'done';
}

// ─── Context builder ──────────────────────────────────────────────────────

async function buildContext() {
  const sb = admin();
  const [profileRes, projRes, skillsRes] = await Promise.all([
    sb.from('profile').select('full_name, headline, tagline, bio, location, email, socials').limit(1).maybeSingle(),
    sb.from('projects').select('title, slug, short_description, tech_stack, live_url, github_url, featured').order('featured', { ascending: false }).order('sort_order', { ascending: true }).limit(12),
    sb.from('skills').select('name, category').order('sort_order', { ascending: true }).limit(40),
  ]);
  const p = profileRes.data || {};
  const profile = [
    p.full_name && `Name: ${p.full_name}`,
    p.headline && `Headline: ${p.headline}`,
    p.tagline  && `Tagline: ${p.tagline}`,
    p.location && `Location: ${p.location}`,
    p.email    && `Email: ${p.email}`,
    p.bio      && `Bio: ${p.bio}`,
  ].filter(Boolean).join('\n');
  const projects = (projRes.data || []).map((pr) => {
    const stack = (pr.tech_stack || []).join(', ');
    const links = [pr.live_url && `live: ${pr.live_url}`, pr.github_url && `code: ${pr.github_url}`].filter(Boolean).join(' · ');
    return `- ${pr.title}${pr.featured ? ' (featured)' : ''} — ${pr.short_description || ''}${stack ? ` [${stack}]` : ''}${links ? ` (${links})` : ''}`;
  }).join('\n');
  const byCat = new Map();
  (skillsRes.data || []).forEach((s) => { const c = s.category || 'Other'; if (!byCat.has(c)) byCat.set(c, []); byCat.get(c).push(s.name); });
  const skills = [...byCat.entries()].map(([cat, list]) => `${cat}: ${list.join(', ')}`).join('\n');
  return { profile: profile || '(no profile data)', projects: projects || '(no projects yet)', skills: skills || '(no skills listed)' };
}

function fillTemplate(template, ctx) {
  return String(template || '')
    .replaceAll('{{profile}}', ctx.profile)
    .replaceAll('{{projects}}', ctx.projects)
    .replaceAll('{{skills}}', ctx.skills);
}

// ─── Streaming adapters (one per provider family) ─────────────────────────

// OpenAI-compatible streaming with tools — used by Groq and DeepSeek.
async function* streamOpenAICompat(baseUrl, label, opts) {
  const { apiKey, model, systemPrompt, messages, maxTokens, temperature } = opts;
  const tools = TOOLS.map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.schema } }));
  let convo = [{ role: 'system', content: systemPrompt }, ...messages];

  for (let iter = 0; iter < 5; iter++) {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: convo, max_tokens: maxTokens, temperature, stream: true, tools, stream_options: { include_usage: true } }),
    });
    if (!res.ok) throw new Error(`${label} ${res.status}: ${(await res.text()).slice(0, 200)}`);

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let textOut = '';
    let toolCalls = {};
    let usage = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (!payload || payload === '[DONE]') continue;
        let ev;
        try { ev = JSON.parse(payload); } catch { continue; }
        if (ev.usage) usage = ev.usage;
        const choice = ev.choices?.[0];
        if (!choice) continue;
        if (choice.delta?.content) {
          const t = choice.delta.content;
          textOut += t;
          yield { type: 'delta', text: t };
        }
        if (choice.delta?.tool_calls) {
          for (const tc of choice.delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (!toolCalls[idx]) {
              toolCalls[idx] = { id: tc.id || '', name: tc.function?.name || '', args: '' };
              if (tc.function?.name) yield { type: 'tool_start', name: tc.function.name };
            }
            if (tc.id) toolCalls[idx].id = tc.id;
            if (tc.function?.name && !toolCalls[idx].name) {
              toolCalls[idx].name = tc.function.name;
              yield { type: 'tool_start', name: tc.function.name };
            }
            if (tc.function?.arguments) toolCalls[idx].args += tc.function.arguments;
          }
        }
      }
    }
    if (usage) yield { type: 'usage', tokens_in: usage.prompt_tokens, tokens_out: usage.completion_tokens };

    const calls = Object.values(toolCalls).filter((c) => c.name);
    if (calls.length === 0) return;

    convo.push({
      role: 'assistant',
      content: textOut || null,
      tool_calls: calls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: c.args || '{}' } })),
    });

    for (const c of calls) {
      let parsed;
      try { parsed = JSON.parse(c.args || '{}'); } catch { parsed = {}; }
      const result = await execTool(c.name, parsed);
      yield { type: 'tool_end', name: c.name, summary: toolSummary(c.name, result) };
      convo.push({ role: 'tool', tool_call_id: c.id, content: JSON.stringify(result) });
    }
  }
}

// Anthropic streaming with tools.
async function* streamAnthropic(opts) {
  const { apiKey, model, systemPrompt, messages, maxTokens, temperature } = opts;
  const tools = TOOLS.map((t) => ({ name: t.name, description: t.description, input_schema: t.schema }));
  let convo = [...messages];

  for (let iter = 0; iter < 5; iter++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, system: systemPrompt, messages: convo, max_tokens: maxTokens, temperature, stream: true, tools }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let textOut = '';
    let blocks = {}; // index -> { type, id?, name?, input? (text accumulating json) }
    let usageIn = 0, usageOut = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (!payload) continue;
        let ev;
        try { ev = JSON.parse(payload); } catch { continue; }
        if (ev.type === 'message_start' && ev.message?.usage) {
          usageIn = ev.message.usage.input_tokens || 0;
        }
        if (ev.type === 'content_block_start') {
          const cb = ev.content_block;
          blocks[ev.index] = cb.type === 'tool_use' ? { type: 'tool_use', id: cb.id, name: cb.name, input: '' } : { type: 'text' };
          if (cb.type === 'tool_use') yield { type: 'tool_start', name: cb.name };
        }
        if (ev.type === 'content_block_delta') {
          const d = ev.delta;
          if (d.type === 'text_delta') {
            textOut += d.text;
            yield { type: 'delta', text: d.text };
          } else if (d.type === 'input_json_delta' && blocks[ev.index]) {
            blocks[ev.index].input = (blocks[ev.index].input || '') + (d.partial_json || '');
          }
        }
        if (ev.type === 'message_delta' && ev.usage?.output_tokens) {
          usageOut = ev.usage.output_tokens;
        }
      }
    }
    if (usageIn || usageOut) yield { type: 'usage', tokens_in: usageIn, tokens_out: usageOut };

    const toolUses = Object.values(blocks).filter((b) => b.type === 'tool_use');
    if (toolUses.length === 0) return;

    // Build assistant content array with text + tool_use blocks
    const assistantContent = [];
    if (textOut) assistantContent.push({ type: 'text', text: textOut });
    for (const tu of toolUses) {
      let parsed;
      try { parsed = JSON.parse(tu.input || '{}'); } catch { parsed = {}; }
      assistantContent.push({ type: 'tool_use', id: tu.id, name: tu.name, input: parsed });
    }
    convo.push({ role: 'assistant', content: assistantContent });

    // Run tools, append results as a single user message with tool_result blocks
    const toolResults = [];
    for (const tu of toolUses) {
      let parsed;
      try { parsed = JSON.parse(tu.input || '{}'); } catch { parsed = {}; }
      const result = await execTool(tu.name, parsed);
      yield { type: 'tool_end', name: tu.name, summary: toolSummary(tu.name, result) };
      toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(result) });
    }
    convo.push({ role: 'user', content: toolResults });
  }
}

// Gemini — non-streaming fallback (no tool use in v1; just one round-trip).
async function* streamGemini(opts) {
  const { apiKey, model, systemPrompt, messages, maxTokens, temperature } = opts;
  const contents = messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents, generationConfig: { maxOutputTokens: maxTokens, temperature } }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const text = (json.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  // Chunk the text so the UI still feels live.
  const chunk = 24;
  for (let i = 0; i < text.length; i += chunk) {
    yield { type: 'delta', text: text.slice(i, i + chunk) };
    await new Promise((r) => setTimeout(r, 18));
  }
  if (json.usageMetadata) {
    yield { type: 'usage', tokens_in: json.usageMetadata.promptTokenCount || 0, tokens_out: json.usageMetadata.candidatesTokenCount || 0 };
  }
}

// ─── Main runner — async generator yielding SSE events ────────────────────

export async function* runChat({ body, ip, userAgent }) {
  // Validate
  const messages = Array.isArray(body?.messages) ? body.messages : null;
  if (!messages || messages.length === 0) { yield { type: 'error', error: 'messages[] required' }; return; }
  const safeMessages = messages.slice(-20).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 4000) }));
  const sessionId = String(body?.sessionId || '').slice(0, 64) || `anon-${Date.now()}`;

  if (!checkRate(ip || 'unknown')) { yield { type: 'error', error: 'Rate limit — wait a minute.' }; return; }

  let sb;
  try { sb = admin(); } catch (e) { yield { type: 'error', error: e.message }; return; }

  const { data: settings, error: setErr } = await sb.from('ai_settings').select('*').eq('id', 1).maybeSingle();
  if (setErr || !settings) { yield { type: 'error', error: 'ai_settings not initialised — run migration 007.' }; return; }
  if (!settings.is_enabled) { yield { type: 'error', error: 'Chat is currently disabled.' }; return; }

  const provider = settings.provider;
  const apiKey = provider === 'groq'      ? settings.groq_api_key
              : provider === 'deepseek'   ? settings.deepseek_api_key
              : provider === 'anthropic'  ? settings.anthropic_api_key
              : provider === 'gemini'     ? settings.gemini_api_key
              : null;
  if (!apiKey) { yield { type: 'error', error: `No API key for "${provider}". Set one in /admin/ai.` }; return; }

  const model = provider === 'groq'      ? settings.groq_model
              : provider === 'deepseek'  ? settings.deepseek_model
              : provider === 'anthropic' ? settings.anthropic_model
              : settings.gemini_model;

  const ctx = await buildContext();
  const systemPrompt = fillTemplate(settings.system_prompt, ctx);

  yield { type: 'start', provider, model };

  const t0 = Date.now();
  let fullText = '';
  let tokensIn = 0, tokensOut = 0;

  try {
    const args = { apiKey, model, systemPrompt, messages: safeMessages, maxTokens: settings.max_tokens, temperature: Number(settings.temperature) };
    let gen;
    if (provider === 'groq')      gen = streamOpenAICompat('https://api.groq.com/openai/v1/chat/completions', 'Groq', args);
    else if (provider === 'deepseek') gen = streamOpenAICompat('https://api.deepseek.com/v1/chat/completions', 'DeepSeek', args);
    else if (provider === 'anthropic') gen = streamAnthropic(args);
    else if (provider === 'gemini')    gen = streamGemini(args);
    else throw new Error(`Unknown provider: ${provider}`);

    for await (const evt of gen) {
      if (evt.type === 'delta') fullText += evt.text;
      if (evt.type === 'usage') { tokensIn = evt.tokens_in || tokensIn; tokensOut = evt.tokens_out || tokensOut; }
      yield evt;
    }
  } catch (err) {
    yield { type: 'error', error: err.message || 'Upstream provider error.' };
    return;
  }

  const latencyMs = Date.now() - t0;
  yield { type: 'done', latency_ms: latencyMs, tokens_in: tokensIn, tokens_out: tokensOut };

  // Best-effort log
  try {
    const lastUser = safeMessages[safeMessages.length - 1];
    await sb.from('ai_chat_messages').insert([
      { session_id: sessionId, role: 'user',      content: lastUser.content,  ip, user_agent: userAgent },
      { session_id: sessionId, role: 'assistant', content: fullText, provider, model, tokens_in: tokensIn, tokens_out: tokensOut, latency_ms: latencyMs, ip, user_agent: userAgent },
    ]);
  } catch (e) { console.warn('[chat] log skipped:', e.message); }
}

// ─── Netlify Functions v2 entry (streaming Response) ──────────────────────

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (req.method !== 'POST')    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: { ...cors(), 'Content-Type': 'application/json' } });

  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...cors(), 'Content-Type': 'application/json' } }); }

  const ip = (req.headers.get('x-nf-client-connection-ip')
            || req.headers.get('client-ip')
            || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || 'unknown').toLowerCase();
  const userAgent = (req.headers.get('user-agent') || '').slice(0, 240);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const evt of runChat({ body, ip, userAgent })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message || 'stream error' })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...cors(),
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

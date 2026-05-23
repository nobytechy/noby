/**
 * /.netlify/functions/suggest — generate 3 short follow-up questions.
 *
 * Called by Chat.jsx after the main reply finishes streaming. Reuses the same
 * provider settings as /chat. Returns JSON, not SSE — small + fast.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase = null;
function admin() {
  if (_supabase) return _supabase;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing supabase env');
  _supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  return _supabase;
}

const SYS = `You generate 3 short follow-up question suggestions for a portfolio chatbot visitor.
Rules:
- Each suggestion must be a single question, max 8 words.
- Make them concrete and useful for a recruiter screening Noby Tebulo.
- They must be questions the chatbot itself can answer about Noby's work.
- Output strict JSON only — no markdown, no commentary:
{"suggestions": ["q1", "q2", "q3"]}`;

export async function runSuggest({ body }) {
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-6) : [];
  if (messages.length === 0) return { status: 200, json: { suggestions: [] } };

  const sb = admin();
  const { data: settings } = await sb.from('ai_settings').select('provider, groq_api_key, deepseek_api_key, anthropic_api_key, gemini_api_key, groq_model, deepseek_model, anthropic_model, gemini_model, is_enabled').eq('id', 1).maybeSingle();
  if (!settings || !settings.is_enabled) return { status: 200, json: { suggestions: [] } };

  const provider = settings.provider;
  const apiKey = settings[`${provider}_api_key`];
  const model  = settings[`${provider}_model`];
  if (!apiKey) return { status: 200, json: { suggestions: [] } };

  // Build the conversation summary the suggester reasons over.
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lastBot  = [...messages].reverse().find((m) => m.role === 'assistant')?.content || '';
  const userPrompt = `Recent visitor question: "${(lastUser || '').slice(0, 400)}"\nBot reply: "${(lastBot || '').slice(0, 600)}"\n\nNow return 3 follow-up questions as JSON.`;

  try {
    const text = await callForJson({ provider, apiKey, model, system: SYS, user: userPrompt });
    const parsed = extractJson(text);
    const list = Array.isArray(parsed?.suggestions) ? parsed.suggestions : [];
    const clean = list.filter((s) => typeof s === 'string' && s.length > 0 && s.length < 120).slice(0, 3);
    return { status: 200, json: { suggestions: clean } };
  } catch (e) {
    console.warn('[suggest]', e.message);
    return { status: 200, json: { suggestions: [] } };
  }
}

async function callForJson({ provider, apiKey, model, system, user }) {
  if (provider === 'groq' || provider === 'deepseek') {
    const baseUrl = provider === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.deepseek.com/v1/chat/completions';
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        max_tokens: 200,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(`${provider} ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }
  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model,
        system,
        messages: [{ role: 'user', content: user }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const json = await res.json();
    return (json.content || []).map((b) => b.text || '').join('');
  }
  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.7, responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const json = await res.json();
    return (json.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  }
  throw new Error(`unknown provider ${provider}`);
}

function extractJson(text) {
  if (!text) return null;
  const trimmed = String(text).trim();
  // Try direct parse first
  try { return JSON.parse(trimmed); } catch {}
  // Fall back to extracting the first {...} block
  const m = trimmed.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

// ─── Netlify Functions v2 entry ───────────────────────────────────────────

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (req.method !== 'POST')    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: { ...cors(), 'Content-Type': 'application/json' } });

  let body;
  try { body = await req.json(); } catch { body = {}; }

  const out = await runSuggest({ body });
  return new Response(JSON.stringify(out.json), { status: out.status, headers: { ...cors(), 'Content-Type': 'application/json' } });
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

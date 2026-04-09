async function verifyToken(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  try {
    const token = auth.slice(7);
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const payload = JSON.parse(atob(parts[0]));
    if (payload.exp < Date.now()) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(env.JWT_SECRET || 'default-secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sigBytes = Uint8Array.from(atob(parts[1]), function(c) { return c.charCodeAt(0); });
    return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(JSON.stringify(payload)));
  } catch (e) { return false; }
}
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Content-Type': 'application/json' };
export async function onRequestGet(context) {
  const { env, params } = context;
  const page = (params.page || []).join('/');
  if (!page) return new Response(JSON.stringify({ error: 'Page requise' }), { status: 400, headers: CORS });
  try {
    const data = await env.CONTENT.get(page, 'json');
    if (!data) return new Response(JSON.stringify(null), { status: 404, headers: CORS });
    return new Response(JSON.stringify(data), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Erreur lecture' }), { status: 500, headers: CORS });
  }
}
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const page = (params.page || []).join('/');
  if (!await verifyToken(request, env)) return new Response(JSON.stringify({ error: 'Non autorise' }), { status: 401, headers: CORS });
  try {
    const data = await request.json();
    data._lastModified = new Date().toISOString();
    await env.CONTENT.put(page, JSON.stringify(data));
    return new Response(JSON.stringify({ ok: true, page: page, lastModified: data._lastModified }), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Erreur ecriture' }), { status: 500, headers: CORS });
  }
}
export async function onRequestOptions() { return new Response(null, { headers: CORS }); }

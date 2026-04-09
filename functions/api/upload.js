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
export async function onRequestPost(context) {
  const { request, env } = context;
  if (!await verifyToken(request, env)) {
    return new Response(JSON.stringify({ error: 'Non autorise' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return new Response(JSON.stringify({ error: 'Aucun fichier' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return new Response(JSON.stringify({ error: 'Format non supporte' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    if (file.size > 5 * 1024 * 1024) return new Response(JSON.stringify({ error: 'Max 5 Mo' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const key = 'uploads/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    await env.ASSETS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    return new Response(JSON.stringify({ ok: true, url: '/assets/' + key, key: key }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Erreur upload' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}

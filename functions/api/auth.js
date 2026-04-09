export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { password } = await request.json();
    if (!password || password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Mot de passe incorrect' }), {
        status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const payload = JSON.stringify({ exp: expiry });
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(env.JWT_SECRET || 'default-secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const sigArray = Array.from(new Uint8Array(signature));
    const token = btoa(payload) + '.' + btoa(String.fromCharCode.apply(null, sigArray));
    return new Response(JSON.stringify({ token, expires: expiry }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}

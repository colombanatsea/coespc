// Decap CMS OAuth callback — échange code GitHub contre token, renvoie vers Decap
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Code OAuth manquant', { status: 400 });

  const clientId = env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = env.OAUTH_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response('OAuth GitHub non configuré. Ajouter OAUTH_GITHUB_CLIENT_ID + OAUTH_GITHUB_CLIENT_SECRET dans Cloudflare Pages.', { status: 500 });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const payload = await tokenRes.json();
    const content = payload.error
      ? { error: payload.error_description || payload.error }
      : { token: payload.access_token, provider: 'github' };
    const status = payload.error ? 'error' : 'success';
    const body = JSON.stringify(content);

    // HTML qui renvoie le token au parent (Decap) via postMessage
    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Authentification&hellip;</title></head>
<body style="font-family:system-ui;padding:2rem;text-align:center;background:#FDF6E8;color:#142477">
<p>Connexion en cours&hellip;</p>
<script>
(function(){
  var receiveMessage = function(e) {
    window.opener.postMessage('authorization:github:${status}:${body.replace(/'/g, "\\'").replace(/"/g, '\\"')}', e.origin);
  };
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  } catch (err) {
    return new Response('Erreur OAuth : ' + err.message, { status: 500 });
  }
}

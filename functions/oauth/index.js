// Decap CMS OAuth — handshake GitHub
// Redirige vers GitHub pour autoriser l'accès au repo
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const clientId = env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('OAUTH_GITHUB_CLIENT_ID non configuré. Voir le dashboard Cloudflare Pages.', { status: 500 });
  }
  const redirectUri = `${url.origin}/oauth/callback`;
  const state = crypto.randomUUID();
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('state', state);
  return Response.redirect(githubAuthUrl.toString(), 302);
}

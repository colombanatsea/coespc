// Cloudflare Pages Function : /api/instagram-feed
// Connecteur Instagram maison (Instagram API with Instagram Login).
// Lit un jeton longue duree depuis KV (binding "IG"), le rafraichit tout seul
// avant l'expiration des 60 jours, et renvoie les derniers medias en JSON.
// Cache 30 min via Cache API. Aucun script tiers, aucun cron externe.
//
// Pre-requis (voir docs/INSTAGRAM-CONNECTOR.md) :
//   - Compte @fete_villageoise en mode professionnel (Business/Createur)
//   - App Meta + jeton longue duree initial, depose dans KV sous la cle "token"
//   - Binding KV "IG" sur le projet Cloudflare Pages

const GRAPH = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const LIMIT = 12;
const CACHE_TTL_SECONDS = 1800;              // 30 min cote edge/navigateur
const REFRESH_AFTER_MS = 45 * 86400 * 1000;  // rafraichit le jeton apres 45 jours
const CACHE_VERSION = 'v1';                  // bump pour invalider le cache edge

export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  u.searchParams.set('_v', CACHE_VERSION);
  const cacheKey = new Request(u.toString(), request);
  const cache = caches.default;

  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const kv = env.IG;
  if (!kv) return short({ items: [], error: 'kv-absent' });

  let token = await kv.get('token');
  if (!token) return short({ items: [], error: 'token-absent' });

  token = await maybeRefresh(kv, token);

  try {
    const url = `${GRAPH}/me/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!r.ok) return short({ items: [], error: 'api-' + r.status });
    const data = await r.json();
    const items = (data.data || []).map(toItem).filter((it) => it.image);
    const res = cached({ items, fetchedAt: new Date().toISOString() });
    await cache.put(cacheKey, res.clone());
    return res;
  } catch (_) {
    return short({ items: [], error: 'fetch-fail' });
  }
}

function toItem(m) {
  return {
    id: m.id,
    caption: m.caption || '',
    type: m.media_type,
    image: m.media_type === 'VIDEO' ? (m.thumbnail_url || '') : (m.media_url || ''),
    permalink: m.permalink || 'https://www.instagram.com/fete_villageoise',
    timestamp: m.timestamp || '',
  };
}

// Rafraichissement paresseux : on prolonge le jeton (+60 jours) bien avant
// son expiration. Un jeton fraichement depose (token_ts absent) est juste
// horodate, sans appel de refresh (Meta exige un jeton age d'au moins 24 h).
async function maybeRefresh(kv, token) {
  try {
    const tsRaw = await kv.get('token_ts');
    if (!tsRaw) {
      await kv.put('token_ts', String(Date.now()));
      return token;
    }
    if (Date.now() - parseInt(tsRaw, 10) < REFRESH_AFTER_MS) return token;
    const r = await fetch(`${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
    if (r.ok) {
      const d = await r.json();
      if (d.access_token) {
        await kv.put('token', d.access_token);
        await kv.put('token_ts', String(Date.now()));
        return d.access_token;
      }
    }
  } catch (_) {
    /* en cas d'echec on garde le jeton courant */
  }
  return token;
}

function cached(obj) {
  return new Response(JSON.stringify(obj), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${CACHE_TTL_SECONDS}`,
      'access-control-allow-origin': '*',
    },
  });
}

// Reponse non mise en cache edge (etats vides/erreurs), TTL court cote client.
function short(obj) {
  return new Response(JSON.stringify(obj), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
      'access-control-allow-origin': '*',
    },
  });
}

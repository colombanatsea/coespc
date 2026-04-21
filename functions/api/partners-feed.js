// Cloudflare Pages Function : /api/partners-feed
// Agrege les flux RSS des partenaires (AVOC, Ancilevienne).
// Cache 1h via Cache API pour eviter de surcharger les partenaires.

const FEEDS = [
  { source: 'AVOC',         url: 'https://www.avoc.fr/feed/' },
  { source: 'Ancilevienne', url: 'https://www.ancilevienne.fr/feed/' },
];

const MAX_ITEMS_PER_FEED = 3;
const CACHE_TTL_SECONDS  = 3600; // 1h

export async function onRequestGet({ request }) {
  const cacheKey = new Request(new URL(request.url).toString(), request);
  const cache = caches.default;

  // Sert depuis le cache si dispo
  let response = await cache.match(cacheKey);
  if (response) return response;

  // Sinon fetch les flux en parallele
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const items = results
    .flatMap((r, i) => r.status === 'fulfilled' ? r.value.map(it => ({ ...it, source: FEEDS[i].source })) : [])
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, FEEDS.length * MAX_ITEMS_PER_FEED);

  const body = JSON.stringify({ items, fetchedAt: new Date().toISOString() });
  response = new Response(body, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${CACHE_TTL_SECONDS}`,
      'access-control-allow-origin': '*',
    },
  });
  await cache.put(cacheKey, response.clone());
  return response;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'user-agent': 'CoespcFeedAggregator/1.0 (+https://coespc.org)' },
      cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml).slice(0, MAX_ITEMS_PER_FEED);
  } catch (_) {
    return [];
  }
}

// Parser RSS/Atom minimal (pas de dep externe, Workers V8 only)
function parseRss(xml) {
  const items = [];
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    items.push({
      title:   extract(block, 'title'),
      link:    extract(block, 'link'),
      pubDate: extract(block, 'pubDate') || extract(block, 'dc:date'),
    });
  }
  if (items.length === 0) {
    // Fallback Atom
    const entryRegex = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
    while ((m = entryRegex.exec(xml)) !== null) {
      const block = m[1];
      const linkMatch = block.match(/<link\b[^>]*href="([^"]+)"/i);
      items.push({
        title:   extract(block, 'title'),
        link:    linkMatch ? linkMatch[1] : '',
        pubDate: extract(block, 'updated') || extract(block, 'published'),
      });
    }
  }
  return items;
}

function extract(block, tag) {
  const re = new RegExp('<' + tag + '\\b[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
  const m = block.match(re);
  if (!m) return '';
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

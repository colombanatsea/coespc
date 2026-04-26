// Cloudflare Pages Function : /api/partners-feed
// Agrege les flux RSS des partenaires (AVOC, Ancilevienne).
// Cache 1h via Cache API pour eviter de surcharger les partenaires.

const FEEDS = [
  { source: 'AVOC',         url: 'https://www.avoc.fr/feed/' },
  { source: 'Ancilevienne', url: 'https://www.ancilevienne.fr/feed/' },
];

const MAX_ITEMS_PER_FEED = 3;
const CACHE_TTL_SECONDS  = 3600; // 1h
// Bump cette version pour invalider tous les caches Cloudflare Edge
// (ex: changement du parser, ajout d'un decodeur d'entites HTML).
const CACHE_VERSION = 'v2';

export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  u.searchParams.set('_v', CACHE_VERSION);
  const cacheKey = new Request(u.toString(), request);
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
  return decodeEntities(
    m[1]
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .trim()
  );
}

// Decode entites HTML emises par WordPress (numeriques + nommees courantes).
// Sans ca, les titres contiennent &#8211; (en-dash), &#8217; (apostrophe typo), etc.
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00A0',
  laquo: '\u00AB', raquo: '\u00BB', hellip: '\u2026',
  ndash: '\u2013', mdash: '\u2014',
  lsquo: '\u2018', rsquo: '\u2019', sbquo: '\u201A',
  ldquo: '\u201C', rdquo: '\u201D', bdquo: '\u201E',
  eacute: '\u00E9', egrave: '\u00E8', ecirc: '\u00EA', euml: '\u00EB',
  agrave: '\u00E0', acirc: '\u00E2', auml: '\u00E4',
  iuml: '\u00EF', icirc: '\u00EE',
  ouml: '\u00F6', ocirc: '\u00F4',
  uuml: '\u00FC', ucirc: '\u00FB', ugrave: '\u00F9',
  ccedil: '\u00E7', oelig: '\u0153', aelig: '\u00E6',
  Eacute: '\u00C9', Egrave: '\u00C8', Agrave: '\u00C0', Ccedil: '\u00C7',
  copy: '\u00A9', reg: '\u00AE', trade: '\u2122', deg: '\u00B0',
  middot: '\u00B7', bull: '\u2022', euro: '\u20AC',
};
function decodeEntities(s) {
  if (!s) return s;
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] != null ? NAMED_ENTITIES[name] : m);
}

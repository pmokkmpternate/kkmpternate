// ============================================================
// Vercel Routing Middleware — pratinjau tautan berita (Open Graph).
// Berjalan SEBELUM berkas statis disajikan (aturan "rewrites" di vercel.json
// tidak berlaku untuk "/" karena index.html sudah ada, jadi dipakai middleware).
//  - /?hal=detail&id=BRT-007  → dialihkan (rewrite internal) ke /api/pratinjau?id=BRT-007
//  - robot pratinjau di halaman lain → /api/pratinjau (judul + sampul portal)
//  - selain itu → index.html statis seperti biasa
// Alamat di browser pengunjung tidak berubah.
// ============================================================
export const config = { matcher: '/' };

const ROBOT = /WhatsApp|facebookexternalhit|Facebot|meta-externalagent|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|SkypeUriPreview|Pinterest|vkShare|redditbot|Applebot|Line\/|KAKAOTALK|Iframely|Embedly|opengraph|Google-InspectionTool|Googlebot|bingbot/i;

export default function middleware(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  const detail = url.searchParams.get('hal') === 'detail' && /^[A-Za-z]{2,5}-\d{1,6}$/.test(id);
  const robot = ROBOT.test(request.headers.get('user-agent') || '');
  if (!detail && !robot) return; // lanjut ke index.html statis
  const tujuan = new URL('/api/pratinjau', url);
  if (detail) tujuan.searchParams.set('id', id);
  return new Response(null, { headers: { 'x-middleware-rewrite': tujuan.toString() } });
}

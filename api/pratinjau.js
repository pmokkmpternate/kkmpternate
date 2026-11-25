// ============================================================
// Pratinjau tautan (Open Graph) untuk WhatsApp, Facebook, Telegram, X, dll.
// Dipanggil (lihat vercel.json) untuk semua tautan berita ?hal=detail&id=… — agar pratinjau
// tampil di aplikasi apa pun — dan untuk robot pratinjau di halaman lain. Hasil di-cache CDN Vercel.
//  - ?id=BRT-007 → judul, ringkasan, dan foto berita tersebut
//  - tanpa id    → judul portal + gambar sampul img/og-cover.jpg
// Data diambil dari backend GAS (publikDetailBerita) memakai GAS_URL di js/config.js.
// ============================================================
const NAMA_SITUS = 'Portal Monitoring KKMP Kota Ternate';
const DESK_BAWAAN = 'Informasi dan pemantauan perkembangan Koperasi Kelurahan Merah Putih (KKMP) hasil pendampingan PMO Kota Ternate.';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const polos = (s) => String(s || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/^\s*(>|[-*]\s|—\s)/gm, '')
  .replace(/[*_#`]/g, '')
  .replace(/\s+/g, ' ').trim();
const potong = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

async function ambil(url, opsi, ms) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, Object.assign({ signal: ctl.signal, redirect: 'follow' }, opsi || {})); }
  finally { clearTimeout(t); }
}

// Foto Google Drive (lh3.googleusercontent.com/d/ID) diperkecil agar cepat dimuat WhatsApp.
function gambarPratinjau(u) {
  u = String(u || '').trim();
  if (!/^https:\/\/[^\s"'<>]+$/.test(u)) return '';
  const m = u.match(/^https:\/\/lh3\.googleusercontent\.com\/d\/([\w-]+)$/);
  if (m) return 'https://lh3.googleusercontent.com/d/' + m[1] + '=w1200';
  const d = u.match(/drive\.google\.com\/.*(?:id=|\/d\/)([\w-]{20,})/);
  if (d) return 'https://lh3.googleusercontent.com/d/' + d[1] + '=w1200';
  return u;
}

function blokMeta(m) {
  const baris = [
    '<meta name="description" content="' + esc(m.desk) + '">',
    '<link rel="canonical" href="' + esc(m.url) + '">',
    '<meta property="og:site_name" content="' + esc(NAMA_SITUS) + '">',
    '<meta property="og:locale" content="id_ID">',
    '<meta property="og:type" content="' + (m.artikel ? 'article' : 'website') + '">',
    '<meta property="og:url" content="' + esc(m.url) + '">',
    '<meta property="og:title" content="' + esc(m.judul) + '">',
    '<meta property="og:description" content="' + esc(m.desk) + '">',
    '<meta property="og:image" content="' + esc(m.gambar) + '">',
    '<meta property="og:image:secure_url" content="' + esc(m.gambar) + '">',
    '<meta property="og:image:alt" content="' + esc(m.alt || m.judul) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(m.judul) + '">',
    '<meta name="twitter:description" content="' + esc(m.desk) + '">',
    '<meta name="twitter:image" content="' + esc(m.gambar) + '">'
  ];
  if (m.sampul) baris.push('<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:type" content="image/jpeg">');
  if (m.terbit) baris.push('<meta property="article:published_time" content="' + esc(m.terbit) + '">');
  return '<!-- OG:MULAI -->\n  ' + baris.join('\n  ') + '\n  <!-- OG:SELESAI -->';
}

module.exports = async (req, res) => {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  const asal = 'https://' + host;
  const id = String((req.query && req.query.id) || '').trim();
  const idSah = /^[A-Za-z]{2,5}-\d{1,6}$/.test(id) ? id : '';

  let html = '';
  try { const r = await ambil(asal + '/index.html', {}, 5000); if (r.ok) html = await r.text(); } catch (e) { /* lanjut */ }
  if (!html) html = '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>' + esc(NAMA_SITUS) + '</title></head><body><a href="' + esc(asal + '/') + '">' + esc(NAMA_SITUS) + '</a></body></html>';

  const meta = { judul: NAMA_SITUS, desk: DESK_BAWAAN, url: asal + '/', gambar: asal + '/img/og-cover.jpg', sampul: true, artikel: false };

  if (idSah) {
    meta.url = asal + '/?hal=detail&id=' + encodeURIComponent(idSah);
    try {
      const rc = await ambil(asal + '/js/config.js', {}, 4000);
      const cfg = rc.ok ? await rc.text() : '';
      const g = cfg.match(/GAS_URL\s*:\s*['"]([^'"]+)['"]/);
      const gasUrl = g && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(g[1]) ? g[1] : '';
      if (gasUrl) {
        const r = await ambil(gasUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: 'publikDetailBerita', args: [idSah] }) }, 9000);
        const j = r.ok ? await r.json() : null;
        const b = j && j.ok && j.data && j.data.berita;
        if (b) {
          meta.judul = potong(polos(b.Judul) || NAMA_SITUS, 110);
          meta.desk = potong(polos(b.Ringkasan) || polos(b.IsiBerita) || DESK_BAWAAN, 200);
          meta.artikel = true; meta.terbit = b.TanggalTerbit || '';
          meta.alt = polos(b.KeteranganFoto) || meta.judul;
          const foto = gambarPratinjau(b.GambarURL);
          if (foto) { meta.gambar = foto; meta.sampul = false; }
        }
      }
    } catch (e) { /* gagal mengambil berita → pakai pratinjau umum portal */ }
  }

  const blok = blokMeta(meta);
  if (/<!-- OG:MULAI -->[\s\S]*?<!-- OG:SELESAI -->/.test(html)) html = html.replace(/<!-- OG:MULAI -->[\s\S]*?<!-- OG:SELESAI -->/, blok);
  else html = html.replace(/<\/title>/i, '</title>\n  ' + blok);
  if (meta.artikel) html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + esc(meta.judul + ' — ' + NAMA_SITUS) + '</title>');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache di CDN Vercel 10 menit; boleh dipakai sampai 1 hari sambil diperbarui di latar.
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(html);
};

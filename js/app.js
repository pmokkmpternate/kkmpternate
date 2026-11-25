// ===== BLOK: SCRIPT_CORE =====
const ASET = { hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRwLroWEJlHmr4m21ZMLa5kB8vsoAqG_golqVfCRktNnF9IgSF5LcPPcz-XPmppnYTAGrAQNmXsjy9ZO6lgpHwLJzNi4EzMFCSG2EzGuLhIILQnParR8wdHuyer_C-kgqNerIGAXq-Cvs3DGaEpozseYwVIj-IOG87D8L_fwTnf5JkJjC2tRXMF5QX6i4pW9V31jxxX3PX4D6dSRFx-944CllmAbPhcuflObLoM8zX', login: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7C8bA3Pn5dmmwQXnztsy6qx2sVgH9sasg4OsOsfvcj1YM7Om460awVhI_LPUDFtoDRzD9tac1evKq5H0RuoB4ySu1g8i5tc_9qrTvoifjWNysVU1khS8O6oPQlanA2WonSHi_R04P7Pd_26Fuabk78KgnaWqBedRdImFezJrOhir2jAoxGVzpgZgrAHKmP_4370YjAB7WddFPkSnjMWnoNMinqK1k8CU7Dgjc9M4OT-zmTPqEVL7tRMGWOq7SkexToh-6fEMFVrBTKCs', peta: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyO9q9Okfo89NdV3-A4yyMT6TZPAyTuV8NJfHT9vnzhoyzb7TWvkyWuTEnNxxHRAMm9Xcthl73aBQBZv4yhc-HMf90nE97SVVh6lvI-tdu_i6OMxe-SDIwkP7pROtrdweI48vov72VY98377l87nHyuZDssmkMsU3visi2Cq38H6QcpmXLNKy_gxKNgcxu8MYKJT3laarL7MvuvQtjY6UrR-Zs35YlJc3qQivkwcPmw_617wplPtlPAg' };
// IKON_LAIN:picture_as_pdf,image,open_in_new,download,link,location_on,schedule,edit,delete,event,calendar_today,photo_camera,chevron_left,chevron_right,visibility,visibility_off,check_circle,warning,delete_forever,progress_activity,check,close,pending,cancel,priority_high,description,gavel,assignment,lightbulb,smart_toy,person,insights,construction,storefront,groups,badge

const FN_PUBLIK = ['publikMuatAwal', 'publikDashboard', 'publikPustaka', 'publikBerita', 'publikDetailBerita', 'publikBermanfaat', 'publikKirimPesan', 'publikCaptcha', 'login'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BLN3 = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const GERAK_MINIM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const S = {
  token: bacaSimpan('kkmp_token', sessionStorage), cfg: {}, maint: false, halAktif: '', pub: {},
  hero: { slide: [], idx: 0, timer: null }, ig: { item: [], idx: 0 },
  pilihan: {}, koperasi: [], ringkasan: null, ad: {}, adAktif: '', st: {}, kecMetrik: 'kop', kecPilih: ''
};

function $(id) { return document.getElementById(id); }
function esc(v) {
  return String(v === null || v === undefined ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Ikon Lucide ArrowUpRight (arrow-up-right, lisensi ISC) — penanda tautan menuju halaman/informasi lain.
const IK_PANAH = '<svg class="ik-panah" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path vector-effect="non-scaling-stroke" d="M7 7h10v10"/><path vector-effect="non-scaling-stroke" d="M7 17 17 7"/></svg>';
function ik(nama, kelas) { return '<span class="ik' + (kelas ? ' ' + kelas : '') + '" aria-hidden="true">' + nama + '</span>'; }
function bacaSimpan(k, wadah) { try { return (wadah || localStorage).getItem(k) || ''; } catch (e) { return ''; } }
function tulisSimpan(k, v, wadah) { try { const w = wadah || localStorage; if (v) w.setItem(k, v); else w.removeItem(k); } catch (e) { /* penyimpanan tidak tersedia */ } }

// ===== Adaptor platform =====
// MODE GAS : portal dibuka dari alamat Apps Script (…/exec) → memakai google.script.run.
// MODE API : portal dibuka dari GitHub Pages / hosting lain → memakai fetch() ke Apps Script (REST API).
const MODE_API = !(typeof google !== 'undefined' && google.script && google.script.run);
const GAS_URL = String((window.KKMP_CONFIG && window.KKMP_CONFIG.GAS_URL) || '').trim();
function panggilApi(fn, kirim) {
  if (!GAS_URL || /XXXX/.test(GAS_URL)) return Promise.reject(new Error('Alamat backend belum diatur. Isi GAS_URL di js/config.js dengan URL /exec Apps Script.'));
  // text/plain WAJIB: header JSON memicu CORS preflight yang ditolak Apps Script
  return fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: fn, args: kirim }), redirect: 'follow' })
    .then(function (r) { if (!r.ok) throw new Error('Server merespons kode ' + r.status + '.'); return r.json(); })
    .catch(function (e) { throw new Error(/JSON|Unexpected token/i.test(e.message) ? 'Respon server tidak valid. Pastikan GAS_URL benar dan deployment Apps Script memakai "Siapa saja".' : (/Failed to fetch|NetworkError|Load failed/i.test(e.message) ? 'Koneksi ke server gagal. Periksa internet Anda.' : e.message)); });
}
function parameterUrl() {
  const o = {};
  try { new URLSearchParams(location.search).forEach(function (v, k) { o[k] = v; }); } catch (e) { /* abaikan */ }
  return o;
}
function catatRiwayat(st) {
  if (MODE_API) {
    const q = st.hal && st.hal !== 'beranda' ? '?hal=' + encodeURIComponent(st.hal) + (st.id ? '&id=' + encodeURIComponent(st.id) : '') : location.pathname;
    try { history.pushState(st, '', q); } catch (e) { /* abaikan */ }
  } else if (google.script.history) google.script.history.push(st, st);
}
function panggil(fn) {
  const args = Array.prototype.slice.call(arguments, 1);
  const kirim = FN_PUBLIK.indexOf(fn) > -1 ? args : [S.token].concat(args);
  const olah = function (r, res, rej) {
    if (!r) return rej(new Error('Respon server kosong. Coba muat ulang halaman.'));
    if (r.ok) return res(r.data);
    if (/Sesi berakhir/.test(r.pesan || '')) sesiHabis();
    rej(new Error(r.pesan || 'Terjadi kesalahan.'));
  };
  if (MODE_API) return new Promise(function (res, rej) { panggilApi(fn, kirim).then(function (r) { olah(r, res, rej); }, rej); });
  return new Promise(function (res, rej) {
    const run = google.script.run
      .withSuccessHandler(function (r) { olah(r, res, rej); })
      .withFailureHandler(function (e) { rej(new Error(e && e.message ? e.message : 'Koneksi ke server gagal. Periksa internet Anda.')); });
    run[fn].apply(run, kirim);
  });
}

let toastTimer = null;
function toast(pesan, gagal) {
  const t = $('toast');
  $('toast-teks').textContent = pesan;
  $('toast-ikon').textContent = gagal ? 'error' : 'check_circle';
  t.classList.toggle('gagal', !!gagal);
  t.setAttribute('role', gagal ? 'alert' : 'status');
  t.classList.add('tampil');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove('tampil'); }, gagal ? 6000 : 3500);
}

function keTanggal(s) {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  return m ? { y: +m[1], m: +m[2], d: +m[3], h: m[4] ? +m[4] : 0, i: m[5] ? +m[5] : 0 } : null;
}
function dua(n) { return ('0' + n).slice(-2); }
function tglPanjang(s) { const t = keTanggal(s); if (!t) return '-'; return HARI[new Date(Date.UTC(t.y, t.m - 1, t.d)).getUTCDay()] + ', ' + t.d + ' ' + BULAN[t.m - 1] + ' ' + t.y; }
function tglSedang(s) { const t = keTanggal(s); return t ? t.d + ' ' + BULAN[t.m - 1] + ' ' + t.y : '-'; }
function tglPendek(s) { const t = keTanggal(s); return t ? dua(t.d) + '/' + dua(t.m) + '/' + t.y : '-'; }
function tglBln(s) { const t = keTanggal(s); return t ? t.d + ' ' + BLN3[t.m - 1] + ' ' + t.y : '-'; }
function waktuWIT(s) { const t = keTanggal(s); return t ? dua(t.d) + '/' + dua(t.m) + '/' + t.y + ', ' + dua(t.h) + '.' + dua(t.i) + ' WIT' : '-'; }
function tglUpdate(s) { const t = keTanggal(s); return t ? t.d + ' ' + BLN3[t.m - 1] + ' ' + t.y + ', ' + dua(t.h) + '.' + dua(t.i) + ' WIT' : '-'; }
function relatif(s) {
  const t = keTanggal(s); if (!t) return '-';
  const sel = Date.now() - Date.UTC(t.y, t.m - 1, t.d, t.h - 9, t.i), jam = Math.floor(sel / 3600000);
  if (sel < 0) return tglPendek(s);
  if (sel < 3600000) return Math.max(1, Math.floor(sel / 60000)) + ' menit lalu';
  if (jam < 24) return jam + ' jam lalu';
  if (jam < 48) return 'Kemarin';
  return tglBln(s);
}
function hariIni() { const d = new Date(Date.now() + 9 * 3600000); return d.getUTCFullYear() + '-' + dua(d.getUTCMonth() + 1) + '-' + dua(d.getUTCDate()); }
function angka(n) { return (Number(n) || 0).toLocaleString('id-ID'); }
function persen(n) { return (Math.round((Number(n) || 0) * 10) / 10).toLocaleString('id-ID') + '%'; }
function pct(a, b) { return b > 0 ? Math.round(a / b * 1000) / 10 : 0; }
function inisial(nama) { const p = String(nama || '?').trim().split(/\s+/); return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
function tunda(fn, ms) { let t; return function () { const a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(null, a); }, ms || 250); }; }
function cocok(obj, kolom, q) { if (!q) return true; q = q.toLowerCase(); return kolom.some(function (k) { return String(obj[k] || '').toLowerCase().indexOf(q) > -1; }); }
function gambar(url, alt) { return '<img src="' + esc(url || ASET.hero) + '" alt="' + esc(alt || '') + '" loading="lazy" onerror="this.onerror=null;this.src=ASET.hero">'; }
function isiOpsi(sel, daftar, awal) {
  sel.innerHTML = (awal || '') + daftar.map(function (o) {
    const v = typeof o === 'object' ? o.v : o, l = typeof o === 'object' ? o.l : o;
    return '<option value="' + esc(v) + '">' + esc(l) + '</option>';
  }).join('');
}
function lencana(teks, kelas, ikon) { return '<span class="lencana ' + kelas + '">' + (ikon ? ik(ikon) : '') + esc(teks) + '</span>'; }
function lnYa(v) { return v === 'Ya' ? lencana('Ya', 'ln-sukses', 'check') : lencana('Tidak', 'ln-bahaya', 'close'); }
function lnStatus(v) {
  const peta = {
    'Sudah': ['ln-sukses', 'check_circle'], 'Draft': ['ln-perhatian', 'pending'], 'Belum': ['ln-bahaya', 'schedule'],
    'Sudah Dilaporkan': ['ln-sukses', 'description'], 'Belum Dilaporkan': ['ln-netral', 'pending'],
    'Dalam Proses': ['ln-perhatian', 'pending'], 'Terbit': ['ln-sukses', 'check_circle'],
    'Tampil': ['ln-sukses', 'visibility'], 'Sembunyi': ['ln-netral', 'visibility_off'],
    'Baru': ['ln-merah', 'mark_email_unread'], 'Dibaca': ['ln-info', 'drafts'], 'Ditanggapi': ['ln-sukses', 'check_circle']
  };
  const p = peta[v] || ['ln-netral', ''];
  return lencana(v || '-', p[0], p[1]);
}
// Status SARPRAS: Sudah (Check Circle), Dalam Proses (Loader), Belum (Circle X). Data kosong ditampilkan sebagai Belum.
// g (opsional): data gerai; bila status berasal dari KIB, angka realisasinya tampil sebagai keterangan (tooltip).
function lnSarpras(v, g) {
  const peta = { 'Sudah': ['ln-sukses', 'check_circle'], 'Dalam Proses': ['ln-perhatian', 'progress_activity'], 'Belum': ['ln-bahaya', 'cancel'] };
  const k = peta[v] ? v : 'Belum';
  const html = lencana(k, peta[k][0], peta[k][1]);
  if (!g || !g.SumberSarpras) return html;
  if (g.SumberSarpras !== 'KIB') return html.replace('<span class="lencana ', '<span title="Sumber: Hasil Verval (data KIB belum terisi)" class="lencana ');
  const ket = 'Realisasi KIB: ' + angka(g.SarprasRealisasi || 0) + ' dari ' + angka(g.SarprasTarget || 0) + ' item (' + String(g.SarprasPersen || 0).replace('.', ',') + '%)';
  return html.replace('<span class="lencana ', '<span title="' + esc(ket) + '" aria-label="' + esc(k + '. ' + ket) + '" class="lencana ');
}
function warnaProgres(p) { return p >= 75 ? 'pi-hijau' : p >= 50 ? 'pi-kuning' : 'pi-merah'; }
function isiCfg() {
  document.querySelectorAll('[data-cfg]').forEach(function (el) { const v = S.cfg[el.getAttribute('data-cfg')]; if (v) el.textContent = v; });
  document.querySelectorAll('.tahun-ini').forEach(function (el) { el.textContent = hariIni().slice(0, 4); });
}
function salinTeks(teks) {
  return new Promise(function (res) {
    const cadangan = function () {
      const ta = document.createElement('textarea');
      ta.value = teks; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta); res(ok);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(teks).then(function () { res(true); }, cadangan); else cadangan();
  });
}
function sibuk(btn, aktif, teks) {
  if (!btn) return;
  if (aktif) { btn.dataset.asli = btn.innerHTML; btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.innerHTML = ik('progress_activity', 'putar') + '<span>' + esc(teks || 'Menyimpan...') + '</span>'; }
  else { btn.disabled = false; btn.removeAttribute('aria-busy'); if (btn.dataset.asli) btn.innerHTML = btn.dataset.asli; }
}
function bacaFile(input, maksMB, jenis) {
  const f = input.files && input.files[0];
  if (!f) return Promise.resolve(null);
  if (f.size > maksMB * 1048576) return Promise.reject(new Error('Ukuran berkas maksimal ' + maksMB + ' MB.'));
  if (jenis === 'gambar' && !/^image\/(png|jpe?g|webp)$/.test(f.type)) return Promise.reject(new Error('Format gambar harus JPG, PNG, atau WEBP.'));
  if (jenis === 'pdf' && f.type !== 'application/pdf') return Promise.reject(new Error('Berkas harus berformat PDF.'));
  return new Promise(function (res, rej) {
    const r = new FileReader();
    r.onload = function () { res({ nama: f.name, mime: f.type, isi: String(r.result).split(',')[1] }); };
    r.onerror = function () { rej(new Error('Berkas gagal dibaca.')); };
    r.readAsDataURL(f);
  });
}
function wajibIsi(daftar) {
  let pertama = null;
  daftar.forEach(function (id) {
    const el = $(id), kosong = !String(el.value || '').trim();
    el.classList.toggle('salah', kosong);
    if (kosong) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    if (kosong && !pertama) pertama = el;
  });
  if (pertama) { pertama.focus(); throw new Error('Lengkapi kolom yang wajib diisi.'); }
}

// Animasi angka (counter) & indikator
function hitungAngka(el, nilai, akhiran) {
  if (!el) return;
  const target = Number(nilai) || 0, desimal = target % 1 !== 0;
  const tulis = function (v) { el.textContent = (desimal ? (Math.round(v * 10) / 10).toLocaleString('id-ID') : Math.round(v).toLocaleString('id-ID')) + (akhiran || ''); };
  if (GERAK_MINIM || target === 0) return tulis(target);
  const mulai = performance.now(), durasi = 900;
  (function langkah(t) {
    const p = Math.min(1, (t - mulai) / durasi), e = 1 - Math.pow(1 - p, 3);
    tulis(target * e);
    if (p < 1) requestAnimationFrame(langkah);
  })(mulai);
}
function isiProgres(el, nilai) { if (el) requestAnimationFrame(function () { el.style.width = Math.max(0, Math.min(100, Number(nilai) || 0)) + '%'; }); }
function isiCincin(kunci, nilai) {
  const c = document.querySelector('[data-cincin="' + kunci + '"] .cincin-isi');
  if (c) requestAnimationFrame(function () { c.style.strokeDasharray = Math.max(0, Math.min(100, nilai)) + ' 100'; });
}
function isiDonat(ids, nilai, keliling) {
  const total = Math.max(1, nilai.reduce(function (a, b) { return a + b; }, 0));
  let offset = 0;
  ids.forEach(function (id, i) {
    const el = $(id), panjang = nilai[i] / total * keliling;
    el.style.strokeDasharray = panjang.toFixed(2) + ' ' + keliling;
    el.style.strokeDashoffset = (-offset).toFixed(2);
    el.setAttribute('aria-label', el.querySelector('title').textContent + ': ' + nilai[i]);
    offset += panjang;
  });
}

function paginasi(wadah, total, hal, per, varian, onGo) {
  const jml = Math.max(1, Math.ceil(total / per)), el = $(wadah);
  if (total <= per) { el.innerHTML = ''; return; }
  const no = [];
  if (jml <= 5) { for (let i = 1; i <= jml; i++) no.push(i); }
  else {
    no.push(1); if (hal > 3) no.push('...');
    for (let i = Math.max(2, hal - 1); i <= Math.min(jml - 1, hal + 1); i++) no.push(i);
    if (hal < jml - 2) no.push('...'); no.push(jml);
  }
  el.innerHTML = '<button type="button" class="pag-btn" data-hal="' + (hal - 1) + '"' + (hal <= 1 ? ' disabled' : '') + ' aria-label="Halaman sebelumnya">' + ik('chevron_left') + '</button>' +
    no.map(function (n) {
      return n === '...' ? '<span class="pag-elip" aria-hidden="true">…</span>'
        : '<button type="button" class="pag-btn' + (n === hal ? ' aktif' : '') + '" data-hal="' + n + '"' + (n === hal ? ' aria-current="page"' : '') + ' aria-label="Halaman ' + n + '">' + n + '</button>';
    }).join('') +
    '<button type="button" class="pag-btn" data-hal="' + (hal + 1) + '"' + (hal >= jml ? ' disabled' : '') + ' aria-label="Halaman berikutnya">' + ik('chevron_right') + '</button>';
  el.onclick = function (e) {
    const b = e.target.closest('[data-hal]');
    if (!b || b.disabled) return;
    const n = +b.getAttribute('data-hal');
    if (n >= 1 && n <= jml) onGo(n);
  };
}
function irisan(arr, hal, per) { return arr.slice((hal - 1) * per, hal * per); }
function batasHal(st, total, per) { const jml = Math.max(1, Math.ceil(total / per)); if (st.hal > jml) st.hal = jml; if (st.hal < 1) st.hal = 1; }
function infoRentang(awal, per, total, satuan) { return total ? 'Menampilkan ' + (awal + 1) + '–' + Math.min(awal + per, total) + ' dari ' + total + ' ' + satuan : ''; }
// ===== AKHIR BLOK: SCRIPT_CORE =====


// ===== BLOK: AKSESIBILITAS_DIALOG =====
let fokusSebelum = null;
function elemenFokus(wadah) {
  return Array.prototype.filter.call(wadah.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    function (el) { return el.offsetParent !== null || el === document.activeElement; });
}
function dialogTeratas() {
  if (!$('modal-hapus').hidden) return $('modal-hapus');
  if (!$('modal-foto').hidden) return $('modal-foto');
  if (!$('modal-item').hidden) return $('modal-item');
  const d = document.querySelector('.drawer.buka');
  if (d) return d;
  return null;
}
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Tab') return;
  const d = dialogTeratas(); if (!d) return;
  const f = elemenFokus(d); if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
});

let resolveHapus = null;
function konfirmasi(o) {
  fokusSebelum = document.activeElement;
  $('mh-ikon').textContent = o.ikon || 'warning';
  $('mh-judul').textContent = o.judul || 'Konfirmasi Hapus Data';
  $('mh-sub').textContent = o.sub || 'Tindakan ini tidak dapat dibatalkan';
  $('mh-teks').innerHTML = o.teks || '';
  $('mh-ok').textContent = o.tombol || 'Hapus Data';
  $('modal-hapus').hidden = false;
  setTimeout(function () { $('mh-batal').focus(); }, 30);
  return new Promise(function (res) { resolveHapus = res; });
}
function tutupKonfirmasi(hasil) {
  $('modal-hapus').hidden = true;
  if (fokusSebelum && fokusSebelum.focus) fokusSebelum.focus();
  if (resolveHapus) { resolveHapus(hasil); resolveHapus = null; }
}
let fokusDrawer = null;
function bukaDrawer(id) {
  fokusDrawer = document.activeElement;
  document.querySelectorAll('.drawer.buka').forEach(function (d) { d.classList.remove('buka'); d.hidden = true; });
  const d = $(id);
  d.hidden = false; $('drawer-backdrop').hidden = false;
  requestAnimationFrame(function () { d.classList.add('buka'); });
  setTimeout(function () { const f = d.querySelector('.drawer-body .input:not([type="hidden"])'); if (f) f.focus(); }, 260);
}
function tutupDrawer() {
  const terbuka = document.querySelectorAll('.drawer.buka');
  if (!terbuka.length) return;
  terbuka.forEach(function (d) { d.classList.remove('buka'); setTimeout(function () { d.hidden = true; }, 320); });
  $('drawer-backdrop').hidden = true;
  document.querySelectorAll('.input.salah').forEach(function (el) { el.classList.remove('salah'); el.removeAttribute('aria-invalid'); });
  if (fokusDrawer && fokusDrawer.focus) fokusDrawer.focus();
}
function bukaFoto(url, judul, lokasi, status) {
  fokusSebelum = document.activeElement;
  $('mf-judul').textContent = judul || 'Dokumentasi Lapangan Gerai';
  $('mf-box').innerHTML = url ? '<img src="' + esc(url) + '" alt="' + esc((judul || 'Dokumentasi') + ' — ' + (lokasi || '')) + '">' : '<span class="kosong-kecil">Belum ada foto dokumentasi.</span>';
  $('mf-lokasi').textContent = lokasi || ''; $('mf-status').textContent = status || '';
  $('modal-foto').hidden = false;
  setTimeout(function () { $('mf-tutup').focus(); }, 30);
}
function tutupFoto() { $('modal-foto').hidden = true; if (fokusSebelum && fokusSebelum.focus) fokusSebelum.focus(); }

function pasangTab(tombol, onPilih) {
  tombol.forEach(function (b, i) {
    b.addEventListener('click', function () { aktifkan(i); });
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? tombol.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tombol.length) % tombol.length;
      aktifkan(n); tombol[n].focus();
    });
  });
  function aktifkan(n) {
    tombol.forEach(function (b, i) {
      const aktif = i === n;
      b.classList.toggle('aktif', aktif); b.setAttribute('aria-selected', aktif ? 'true' : 'false'); b.tabIndex = aktif ? 0 : -1;
      const p = $(b.getAttribute('aria-controls')); if (p) p.hidden = !aktif;
    });
    if (onPilih) onPilih(tombol[n]);
  }
  return aktifkan;
}
// ===== AKHIR BLOK: AKSESIBILITAS_DIALOG =====


// ===== BLOK: TEMA =====
function terapkanTema(t, animasi) {
  const html = document.documentElement;
  if (animasi && !GERAK_MINIM) { html.classList.add('tema-transisi'); setTimeout(function () { html.classList.remove('tema-transisi'); }, 450); }
  html.setAttribute('data-tema', t);
  tulisSimpan('kkmp_tema', t);
  document.querySelectorAll('[data-tema-toggle]').forEach(function (b) {
    b.setAttribute('aria-label', t === 'gelap' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    b.title = t === 'gelap' ? 'Mode terang' : 'Mode gelap';
  });
}
// ===== AKHIR BLOK: TEMA =====


// ===== BLOK: NAVIGASI_PUBLIK =====
function tampilApp(app) {
  $('app-publik').hidden = app !== 'publik';
  $('app-login').hidden = app !== 'login';
  $('app-admin').hidden = app !== 'admin';
  $('fab-asisten').hidden = app === 'login';
  $('fab-asisten').classList.toggle('fab-admin', app === 'admin');
  if (app === 'login') tutupAsisten();
  if (app !== 'publik') hentikanHero();
  window.scrollTo(0, 0);
}
const TEKS_TUJUAN_LOGIN = {
  verval: '<b>Hasil Verval bersifat terbatas.</b> Masuk sebagai Admin, Petugas Verval, atau Akses Monitoring untuk melihat hasil pemeriksaan.',
  ekspor: '<b>Silakan login terlebih dahulu untuk mengakses dan mengunduh data rekapitulasi koperasi.</b> Unduhan dilanjutkan otomatis setelah berhasil masuk.'
};
function tandaTujuanLogin() {
  const t = S.tujuanLogin || '', jenis = /^verval-/.test(t) ? 'verval' : t === 'ekspor-koperasi' ? 'ekspor' : '';
  $('login-tujuan').hidden = !jenis;
  if (jenis) $('login-tujuan-teks').innerHTML = TEKS_TUJUAN_LOGIN[jenis];
}
function sesiHabis() {
  // kembalikan pengguna ke halaman yang sedang dibuka setelah login ulang
  if (!$('app-admin').hidden && S.adAktif) S.tujuanLogin = S.adAktif === 'verval-input' || S.adAktif === 'verval-detail' ? 'verval-daftar' : S.adAktif;
  tulisSimpan('kkmp_token', '', sessionStorage); S.token = ''; S.ad = {}; S.adAktif = '';
  if (typeof bersihkanVerval === 'function') bersihkanVerval();
  if (!$('app-admin').hidden) {
    tutupDrawer(); tampilApp('login');
    $('login-pesan').textContent = 'Sesi Anda telah berakhir. Silakan masuk kembali.';
    $('login-pesan').hidden = false; tandaTujuanLogin();
  }
}
function bukaHal(nama, param, tanpaRiwayat) {
  if (nama === 'login') return bukaLogin();
  if (nama === 'verval') return bukaLogin('verval-rekap');
  if (nama === 'ekspor') return bukaLogin('ekspor-koperasi');
  S.tujuanLogin = '';
  if (S.maint) nama = 'maint';
  if (['beranda', 'dashboard', 'pustaka', 'berita', 'detail', 'kontak', 'maint'].indexOf(nama) === -1) nama = 'beranda';
  tampilApp('publik');
  document.querySelectorAll('#app-publik .halaman').forEach(function (h) { h.hidden = h.getAttribute('data-hal') !== nama; });
  const navNama = nama === 'detail' ? 'berita' : nama;
  document.querySelectorAll('.nav-link, .tab-bawah-link').forEach(function (a) {
    const aktif = a.getAttribute('data-go') === navNama;
    a.classList.toggle('aktif', aktif);
    if (aktif) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const pertamaKali = !S.halAktif;
  S.halAktif = nama;
  window.scrollTo(0, 0);
  if (!pertamaKali) $('konten-utama').focus({ preventScroll: true });
  if (!tanpaRiwayat) { const st = { hal: nama }; if (param) st.id = param; catatRiwayat(st); }
  if (nama === 'beranda' && S.berandaBasi) { S.berandaBasi = false; muatPublik(); }
  if (nama === 'beranda') mulaiHero(); else hentikanHero();
  if (nama === 'dashboard') muatDashboard();
  if (nama === 'pustaka') muatPustaka();
  if (nama === 'berita') muatBerita();
  if (nama === 'detail') muatDetail(param);
  if (nama === 'kontak') siapkanKontak();
}
// tujuan: halaman admin yang dibuka setelah login berhasil (mis. 'verval-rekap' dari tombol Lihat Hasil Verval).
// Ini hanya pengarah tampilan; setiap data tetap diperiksa sesi & perannya di server (cekSesi).
function bukaLogin(tujuan) {
  S.tujuanLogin = tujuan || '';
  if (S.token) { tampilApp('admin'); muatAdmin().catch(function () { tampilApp('login'); tandaTujuanLogin(); }); return; }
  tampilApp('login');
  $('login-pesan').hidden = true; tandaTujuanLogin();
  setTimeout(function () { $('login-user').focus(); }, 60);
}
function muatPublik() {
  return panggil('publikMuatAwal').then(function (d) {
    S.versiServer = d.versi; S.urlApp = d.urlApp || '';
    S.cfg = d.pengaturan || {};
    S.maint = !!d.maintenance;
    isiCfg(); isiTautanSosial();
    if (!S.maint) renderBeranda(d);
  }).catch(function (e) {
    S.galatMuat = e.message; // dipakai saat mulai: tampilkan penyebab sebenarnya, bukan peringatan versi
    $('beranda-unggulan').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>';
    toast(e.message, true);
  });
}
function isiTautanSosial() {
  const c = S.cfg;
  const set = function (id, href) { const el = $(id); if (!el) return; if (href) { el.href = href; el.hidden = false; } else el.hidden = true; };
  // Tautan yang wajib selalu tampil: bila URL belum diisi, ikon tetap terlihat tetapi tidak menjadi tautan aktif (tidak ada tautan rusak).
  const setTetap = function (id, href, ketKosong) {
    const el = $(id); if (!el) return;
    el.hidden = false;
    el.classList.toggle('tautan-nonaktif', !href);
    if (href) { el.href = href; el.removeAttribute('aria-disabled'); el.removeAttribute('title'); el.removeAttribute('tabindex'); }
    else { el.removeAttribute('href'); el.setAttribute('aria-disabled', 'true'); el.title = ketKosong; el.tabIndex = -1; }
  };
  const tel = c.contact_helpdesk_phone ? 'tel:' + c.contact_helpdesk_phone.replace(/[^\d+]/g, '') : '';
  const mail = c.contact_official_email ? 'mailto:' + c.contact_official_email : '';
  const aman = function (u) { u = String(u || '').trim(); return /^https:\/\/[^\s"'<>]+$/.test(u) ? u : ''; };
  setTetap('ft-ig', aman(c.link_instagram), 'Tautan Instagram belum tersedia'); set('ft-yt', c.link_youtube); set('ft-mail', mail); set('ft-tel', tel);
  set('kt-tel', tel); set('kt-mail', mail);
}
// ===== AKHIR BLOK: NAVIGASI_PUBLIK =====


// ===== BLOK: M1_BERANDA =====
function renderBeranda(d) {
  const st = d.statistik || {};
  hitungAngka($('st-kelurahan'), st.kelurahan);
  // Koperasi Terbentuk: persentase koperasi berbadan hukum
  hitungAngka($('st-nib'), st.pctBh, '%'); isiProgres($('st-nib-bar'), st.pctBh);
  hitungAngka($('st-verif'), st.pctVerifRat, '%'); isiProgres($('st-verif-bar'), st.pctVerifRat);
  hitungAngka($('st-gerai'), st.geraiAktif);

  siapkanHero(d.slider);

  const u = d.unggulan;
  $('beranda-unggulan').innerHTML = u ? kartuBerita(u, 'unggulan') : '<div class="kosong">Belum ada berita yang diterbitkan.</div>';
  const lain = d.beritaLain || [];
  $('beranda-daftar').innerHTML = lain.length ? lain.map(kartuBeritaKecil).join('') : (u ? '' : '<div class="kosong-kecil">Berita lainnya akan tampil di sini.</div>');

  S.ig.item = d.infografis || []; S.ig.idx = 0;
  tampilInfografis(false);
}
function kartuBerita(b, jenis) {
  const utama = jenis === 'unggulan' || jenis === 'utama';
  return '<article class="kartu ' + (jenis === 'unggulan' ? 'brt-unggulan' : 'brt-kartu' + (jenis === 'utama' ? ' brt-kartu-utama' : '')) + '" data-berita="' + esc(b.ID) + '">' +
    '<div class="brt-media">' + gambar(b.GambarURL, '') +
      (jenis === 'unggulan' ? '<span class="lencana lencana-unggulan">' + ik('star') + 'Unggulan</span>' : '<span class="lencana">' + esc(b.Kategori) + '</span>') + '</div>' +
    '<div class="brt-badan">' +
      '<div class="brt-meta">' + ik('calendar_today') + '<span>' + esc(tglPanjang(b.TanggalTerbit)) + '</span>' + (b.menitBaca ? '<span aria-hidden="true">·</span><span>' + b.menitBaca + ' menit baca</span>' : '') + '</div>' +
      '<h3 class="brt-judul' + (utama ? ' brt-judul-besar' : '') + '"><a href="#" data-berita="' + esc(b.ID) + '">' + esc(b.Judul) + '</a></h3>' +
      '<p class="brt-ringkas">' + esc(b.Ringkasan) + '</p>' +
      '<div class="brt-kaki"><span class="penulis"><span class="avatar avatar-kecil" aria-hidden="true">' + esc(inisial(b.Penulis)) + '</span>' + esc(b.Penulis || 'Humas PMO') + '</span>' +
      '<span class="brt-baca" aria-hidden="true">Baca' + IK_PANAH + '</span></div>' +
    '</div></article>';
}
function kartuBeritaKecil(b) {
  return '<article class="kartu brt-kecil" data-berita="' + esc(b.ID) + '">' +
    '<div class="brt-kecil-thumb">' + gambar(b.GambarURL, '') + '</div>' +
    '<div class="brt-kecil-teks"><span class="brt-meta">' + ik('event') + esc(tglSedang(b.TanggalTerbit)) + '</span>' +
    '<h3 class="brt-kecil-judul"><a href="#" data-berita="' + esc(b.ID) + '">' + esc(b.Judul) + '</a></h3></div></article>';
}
// Slider hero: satu sumber state (S.hero.idx) mengendalikan gambar latar, nama sorotan, label kapsul, judul, sub judul, dan indikator.
function slideBawaan() {
  return { NamaSlider: 'Portal Monitoring', LabelKapsul: 'Portal Resmi · ' + (S.cfg.app_tagline || 'Kota Ternate'), JudulUtama: 'Portal Monitoring KKMP Kota Ternate',
    SubJudul: 'Pusat integrasi data, pengawasan transparansi usaha bersama, dan akselerasi kemandirian Koperasi Kelurahan Merah Putih se-Kota Ternate.', GambarURL: '' };
}
function siapkanHero(slider) {
  S.hero.slide = (slider && slider.length ? slider : [slideBawaan()]).map(function (x) {
    return { nama: String(x.NamaSlider || '').trim(), kapsul: String(x.LabelKapsul || '').trim(), judul: String(x.JudulUtama || '').trim(), sub: String(x.SubJudul || '').trim(), gambar: String(x.GambarURL || '').trim() };
  });
  S.hero.idx = 0; S.hero.versi = (S.hero.versi || 0) + 1;
  const n = S.hero.slide.length;
  $('hero-nav').hidden = n < 2;
  $('hero-titik').innerHTML = n > 1 ? S.hero.slide.map(function (s, i) {
    return '<button type="button" class="titik-btn" data-slide="' + i + '" aria-label="Sorotan ' + (i + 1) + ' dari ' + n + ': ' + esc(s.nama || s.judul) + '"></button>';
  }).join('') : '';
  S.hero.slide.forEach(function (s) { if (s.gambar) { const im = new Image(); im.src = s.gambar; } });
  tampilSlide(false);
}
function judulKinetik(teks) {
  return String(teks || '').split(/\s+/).filter(String).map(function (k) {
    return '<span class="kata' + (/^KKMP\b/i.test(k) ? ' teks-merah' : '') + '">' + esc(k) + '</span>';
  }).join(' ');
}
function gantiLatarHero(url, versi) {
  const pakai = function (u) {
    if (versi !== S.hero.versi) return;
    const a = $('hero-bg'), b = $('hero-bg-b'), aktif = a.classList.contains('aktif') ? a : b, cadangan = aktif === a ? b : a;
    const css = 'url("' + u.replace(/"/g, '%22') + '")';
    if (aktif.style.backgroundImage === css) return;
    cadangan.style.backgroundImage = css;
    cadangan.classList.add('aktif'); aktif.classList.remove('aktif');
  };
  const target = url || ASET.hero, im = new Image();
  im.onload = function () { pakai(target); };
  im.onerror = function () { pakai(ASET.hero); };
  im.src = target;
  if (im.complete && im.naturalWidth) pakai(target);
}
function tampilSlide(animasi) {
  const idx = S.hero.idx, s = S.hero.slide[idx], n = S.hero.slide.length, isi = $('hero-isi');
  const versi = S.hero.versi = (S.hero.versi || 0) + 1;
  // indikator & penomoran langsung mengikuti state aktif
  document.querySelectorAll('.titik-btn[data-slide]').forEach(function (b, i) {
    b.classList.toggle('aktif', i === idx);
    if (i === idx) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
  });
  $('hero-nomor').textContent = dua(idx + 1) + ' / ' + dua(n);
  $('hero-nama').textContent = s.nama || s.kapsul || 'Sorotan';
  gantiLatarHero(s.gambar, versi);
  const pasang = function () {
    if (versi !== S.hero.versi) return;
    $('hero-atas').textContent = s.kapsul || 'Sorotan';
    const j = $('hero-judul');
    j.innerHTML = judulKinetik(s.judul || 'Portal Monitoring KKMP Kota Ternate');
    $('hero-h1').classList.toggle('panjang', (s.judul || '').length > 48);
    $('hero-sub').textContent = s.sub; $('hero-sub').hidden = !s.sub;
    isi.classList.remove('ganti');
  };
  if (animasi && !GERAK_MINIM) { isi.classList.add('ganti'); setTimeout(pasang, 320); } else pasang();
}
function geserSlide(arah, ke, manual) {
  const n = S.hero.slide.length; if (n < 2) return;
  const baru = ke !== undefined ? ((ke % n) + n) % n : (S.hero.idx + arah + n) % n;
  if (baru === S.hero.idx && ke !== undefined) return;
  S.hero.idx = baru;
  $('hero-isi').setAttribute('aria-live', manual ? 'polite' : 'off');
  tampilSlide(true);
  if (manual) mulaiHero();
}
function mulaiHero() { hentikanHero(); if (S.hero.slide.length > 1 && !GERAK_MINIM && !S.hero.hover && S.halAktif === 'beranda') S.hero.timer = setInterval(function () { geserSlide(1); }, 8000); }
function hentikanHero() { if (S.hero.timer) { clearInterval(S.hero.timer); S.hero.timer = null; } }

function tampilInfografis(animasi) {
  const n = S.ig.item.length;
  $('ig-prev').hidden = n < 2; $('ig-next').hidden = n < 2;
  $('ig-indikator').innerHTML = n > 1 ? S.ig.item.map(function (x, i) {
    return '<button type="button" class="titik-btn' + (i === S.ig.idx ? ' aktif' : '') + '" data-ig="' + i + '" aria-label="Infografis ' + (i + 1) + ': ' + esc(x.Judul) + '"' + (i === S.ig.idx ? ' aria-current="true"' : '') + '></button>';
  }).join('') : '';
  const papan = $('ig-papan');
  const pasang = function () {
    if (!n) {
      $('ig-kicker').textContent = 'Infografis';
      $('ig-judul').textContent = 'Info Grafis KKMP';
      $('ig-validasi').textContent = 'Validasi PMO ' + hariIni().slice(0, 4);
      $('ig-visual').innerHTML = '<div class="kosong-kecil">Belum ada infografis yang ditayangkan.</div>';
      $('ig-ket').textContent = 'Infografis resmi program KKMP Kota Ternate akan tampil di bagian ini.';
      $('ig-unduh').hidden = true;
    } else {
      const it = S.ig.item[S.ig.idx], pdf = it.JenisBerkas === 'PDF';
      $('ig-ikon').textContent = pdf ? 'picture_as_pdf' : 'insert_chart';
      $('ig-kicker').textContent = 'Infografis ' + (S.ig.idx + 1) + ' dari ' + n;
      $('ig-judul').textContent = it.Judul;
      $('ig-validasi').textContent = 'Validasi PMO ' + String(it.Dibuat || hariIni()).slice(0, 4);
      $('ig-visual').innerHTML = pdf
        ? '<a class="ig-pdf" href="' + esc(it.BerkasURL) + '" target="_blank" rel="noopener">' + ik('picture_as_pdf') + '<span>Buka dokumen PDF infografis</span></a>'
        : '<img class="ig-img" src="' + esc(it.BerkasURL) + '" alt="' + esc(it.Judul + (it.Keterangan ? '. ' + it.Keterangan : '')) + '" data-buka="' + esc(it.BerkasURL) + '">';
      $('ig-ket').textContent = it.Keterangan || '-';
      // "Buka berkas resmi" menuju Tautan resmi (diisi di backend); bila kosong, membuka berkas infografis.
      const tautanIg = /^https:\/\/[^\s"'<>]+$/.test(String(it.TautanURL || '').trim()) ? String(it.TautanURL).trim() : '';
      $('ig-unduh').hidden = !(tautanIg || it.BerkasURL); $('ig-unduh').href = tautanIg || it.BerkasURL || '#';
      $('ig-unduh-ikon').textContent = !tautanIg && pdf ? 'download' : 'open_in_new';
    }
    papan.classList.remove('ganti');
  };
  if (animasi && !GERAK_MINIM) { papan.classList.add('ganti'); setTimeout(pasang, 250); } else pasang();
}
function geserIg(arah) { const n = S.ig.item.length; if (n < 2) return; S.ig.idx = (S.ig.idx + arah + n) % n; tampilInfografis(true); }
// ===== AKHIR BLOK: M1_BERANDA =====


// ===== BLOK: M2_DASHBOARD =====
S.st.dbKel = { hal: 1, per: 10 }; S.st.dbRat = { hal: 1, per: 10 }; S.st.dbGer = { hal: 1, per: 10 };

function ambilDashboard() {
  if (S.pub.dashboard && S.pub.dashboard !== 'memuat') return Promise.resolve(S.pub.dashboard);
  if (S.pub.dashboardJanji) return S.pub.dashboardJanji;
  S.pub.dashboard = 'memuat';
  S.pub.dashboardJanji = panggil('publikDashboard').then(function (d) { S.pub.dashboard = d; S.pub.dashboardJanji = null; return d; })
    .catch(function (e) { S.pub.dashboard = null; S.pub.dashboardJanji = null; throw e; });
  return S.pub.dashboardJanji;
}
function muatDashboard() {
  if (S.pub.dashboard && S.pub.dashboard !== 'memuat') return renderDashboard(S.pub.dashboard);
  ambilDashboard().then(renderDashboard).catch(function (e) {
    if (e.message === 'MAINTENANCE') { S.maint = true; return bukaHal('maint'); }
    ['db-kel-body', 'db-rat-body', 'db-gerai-body'].forEach(function (id) { $(id).innerHTML = '<tr><td colspan="10" class="sel-gagal">' + esc(e.message) + '</td></tr>'; });
    $('kec-chart').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>';
  });
}
function statKecamatan(d) {
  const peta = {};
  d.kecamatan.forEach(function (k) { peta[k] = { nama: k, kop: 0, nib: 0, bh: 0, npwp: 0, ratSudah: 0, gerai: 0, progres: 0, selesai: 0 }; });
  d.koperasi.forEach(function (k) {
    const p = peta[k.Kecamatan] || (peta[k.Kecamatan] = { nama: k.Kecamatan, kop: 0, nib: 0, bh: 0, npwp: 0, ratSudah: 0, gerai: 0, progres: 0, selesai: 0 });
    p.kop++; if (k.MemilikiNIB === 'Ya') p.nib++; if (k.BerbadanHukum === 'Ya') p.bh++; if (k.MemilikiNPWP === 'Ya') p.npwp++; if (k.StatusRAT === 'Sudah') p.ratSudah++;
  });
  d.gerai.forEach(function (g) { const p = peta[g.Kecamatan]; if (!p) return; const v = Number(g.ProgresFisik) || 0; p.gerai++; p.progres += v; if (v >= 100) p.selesai++; });
  return Object.keys(peta).map(function (k) { const p = peta[k]; p.rataProgres = p.gerai ? Math.round(p.progres / p.gerai) : 0; return p; });
}
function renderDashboard(d) {
  const st = d.statistik;
  $('db-update').textContent = tglUpdate(st.lastUpdate);
  hitungAngka($('db-total'), st.total);
  $('db-kec-terdata').textContent = st.kecamatanTerdata;
  const pctTarget = pct(st.total, st.target);
  $('db-target-pct').textContent = persen(pctTarget); isiProgres($('db-target-bar'), pctTarget);
  $('db-target-ket').textContent = angka(st.total) + ' dari target ' + angka(st.target) + ' kelurahan';
  [['bh', st.bh, st.pctBh], ['nib', st.nib, st.pctNib], ['npwp', st.npwp, st.pctNpwp], ['akun', st.akun, st.pctAkun]].forEach(function (x) {
    $('db-' + x[0]).textContent = angka(x[1]); $('db-' + x[0] + '-pct').textContent = persen(x[2]); isiCincin('db-' + x[0], x[2]);
  });
  $('db-indeks').textContent = persen(Math.round(((st.pctBh || 0) + st.pctNib + st.pctNpwp + st.pctAkun) / 4 * 10) / 10);
  isiDonat(['dn2-sudah', 'dn2-draft', 'dn2-belum'], [st.ratSudah, st.ratDraft, st.ratBelum], 289.03);
  $('db-rat-pct').textContent = persen(st.pctRatSudah);
  $('db-rat-sudah').textContent = angka(st.ratSudah); $('db-rat-draft').textContent = angka(st.ratDraft); $('db-rat-belum').textContent = angka(st.ratBelum);
  $('db-rat-lapor').textContent = angka(st.laporanRat); $('db-rat-verif').textContent = angka(st.verifDinas);
  $('db-selesai-angka').textContent = persen(st.pctSelesai); isiProgres($('db-selesai-bar'), st.pctSelesai);
  $('db-selesai-pct').textContent = angka(st.selesai) + ' gerai selesai dari target ' + angka(st.target) + ' kelurahan';
  $('db-selesai-bar-teks').textContent = persen(st.pctSelesai); $('db-selesai-bar').classList.toggle('kosong', !(st.pctSelesai > 0));
  // Rata-rata progres fisik dari seluruh gerai yang sudah memiliki data
  $('db-rata-progres').textContent = persen(st.rataProgres || 0); isiProgres($('db-rata-bar'), st.rataProgres || 0);
  $('db-rata-ket').textContent = st.totalGerai ? 'Dihitung dari ' + angka(st.totalGerai) + ' gerai yang sudah memiliki data progres.' : 'Belum ada data progres gerai.';
  // Belum mulai = target kelurahan − (sedang dibangun + selesai); kelurahan tanpa data gerai dihitung belum mulai.
  const belumMulai = Math.max(0, (Number(st.target) || 0) - st.sedangBangun - st.selesai);
  $('db-belum-mulai').textContent = angka(belumMulai); $('db-sedang').textContent = angka(st.sedangBangun); $('db-selesai').textContent = angka(st.selesai);
  $('db-lahan').textContent = angka(st.lahanVerif); $('db-verval').textContent = angka(st.vervalSudah); $('db-simkopdes').textContent = angka(st.simkopdesSudah);

  S.pub.kecStat = statKecamatan(d);
  ['db-kel-kec', 'db-rat-kec'].forEach(function (id) { const v = $(id).value; isiOpsi($(id), d.kecamatan, '<option value="">Semua Kecamatan</option>'); $(id).value = v; });
  renderKecChart(); renderDbKel(); renderDbRat(); renderDbGerai();
}
const METRIK = {
  kop: { label: 'Jumlah koperasi', nilai: function (p) { return p.kop; }, teks: function (p) { return angka(p.kop); }, kelas: '' },
  nib: { label: 'Kelengkapan NIB', nilai: function (p) { return pct(p.nib, p.kop); }, teks: function (p) { return persen(pct(p.nib, p.kop)); }, kelas: 'km-nib', persen: true },
  rat: { label: 'Sudah RAT', nilai: function (p) { return pct(p.ratSudah, p.kop); }, teks: function (p) { return persen(pct(p.ratSudah, p.kop)); }, kelas: 'km-rat', persen: true },
  gerai: { label: 'Rata-rata progres gerai', nilai: function (p) { return p.rataProgres; }, teks: function (p) { return p.rataProgres + '%'; }, kelas: 'km-gerai', persen: true }
};
function renderKecChart() {
  const data = S.pub.kecStat || [], m = METRIK[S.kecMetrik];
  const maks = m.persen ? 100 : Math.max(1, Math.max.apply(null, data.map(m.nilai)));
  const urut = data.slice().sort(function (a, b) { return m.nilai(b) - m.nilai(a); });
  $('kec-chart').innerHTML = urut.map(function (p) {
    return '<button type="button" class="kec-bar" role="listitem" data-kec="' + esc(p.nama) + '" aria-pressed="' + (S.kecPilih === p.nama ? 'true' : 'false') + '" aria-label="' + esc(p.nama + ', ' + m.label + ' ' + m.teks(p)) + '">' +
      '<span class="kec-nama">' + esc(p.nama) + '</span><span class="kec-jalur" aria-hidden="true"><span class="kec-isi ' + m.kelas + '" data-lebar="' + (m.nilai(p) / maks * 100) + '"></span></span>' +
      '<span class="kec-nilai">' + m.teks(p) + '</span></button>';
  }).join('') || '<div class="kosong-kecil">Belum ada data kecamatan.</div>';
  $('kec-chart').querySelectorAll('.kec-isi').forEach(function (el) { isiProgres(el, el.getAttribute('data-lebar')); });
  renderKecDetail();
}
function renderKecDetail() {
  const p = (S.pub.kecStat || []).filter(function (x) { return x.nama === S.kecPilih; })[0];
  if (!p) {
    $('kec-detail').innerHTML = '<span class="eyebrow">Rincian</span><h3 class="h-kartu">Pilih kecamatan</h3><p class="teks-redup">Pilih salah satu batang untuk melihat rincian dan menyaring tabel data di bawah.</p>';
    return;
  }
  $('kec-detail').innerHTML = '<span class="eyebrow">Kecamatan</span><h3 class="h-kartu">' + esc(p.nama) + '</h3>' +
    '<div class="kec-detail-grid">' +
      '<div class="kec-detail-item"><b>' + angka(p.kop) + '</b><span>Koperasi</span></div>' +
      '<div class="kec-detail-item"><b>' + persen(pct(p.bh, p.kop)) + '</b><span>Berbadan hukum</span></div>' +
      '<div class="kec-detail-item"><b>' + persen(pct(p.nib, p.kop)) + '</b><span>Ber-NIB</span></div>' +
      '<div class="kec-detail-item"><b>' + persen(pct(p.ratSudah, p.kop)) + '</b><span>Sudah RAT</span></div>' +
      '<div class="kec-detail-item"><b>' + p.rataProgres + '%</b><span>Progres gerai</span></div>' +
      '<div class="kec-detail-item"><b>' + angka(p.selesai) + '</b><span>Gerai selesai</span></div></div>' +
    '<button type="button" class="btn btn-sekunder btn-kecil" data-kec-reset>' + ik('filter_alt_off') + 'Hapus filter</button>';
}
function pilihKecamatan(nama) {
  S.kecPilih = S.kecPilih === nama ? '' : nama;
  ['db-kel-kec', 'db-rat-kec'].forEach(function (id) { $(id).value = S.kecPilih; });
  S.st.dbKel.hal = 1; S.st.dbRat.hal = 1;
  renderKecChart(); renderDbKel(); renderDbRat();
}
function renderDbKel() {
  const d = S.pub.dashboard; if (!d || d === 'memuat') return;
  const kec = $('db-kel-kec').value, q = $('db-kel-cari').value.trim();
  const rows = d.koperasi.filter(function (k) { return (!kec || k.Kecamatan === kec) && cocok(k, ['NamaKKMP', 'Kelurahan', 'Kecamatan'], q); })
    .sort(function (a, b) { return (a.Kecamatan + a.Kelurahan).localeCompare(b.Kecamatan + b.Kelurahan); });
  const st = S.st.dbKel; batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('db-kel-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (k, i) {
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="nowrap">' + esc(k.Kecamatan) + '</td><td class="sel-utama nowrap">' + esc(k.Kelurahan) + '</td>' +
      '<td class="nowrap">' + esc(k.NamaKKMP) + '</td><td class="tc">' + lnAda(k.BerbadanHukum) + '</td><td class="tc">' + lnAda(k.MemilikiNIKOP) + '</td><td class="tc">' + lnAda(k.MemilikiNIB) + '</td>' +
      '<td class="tc">' + lnAda(k.MemilikiNPWP) + '</td><td class="tc">' + lnAda(k.MemilikiAkun) + '</td><td class="tc">' + lnStatus(k.StatusRAT) + '</td></tr>';
  }).join('') : '<tr><td colspan="10" class="sel-kosong">Belum ada data koperasi yang sesuai.</td></tr>';
  $('db-kel-info').textContent = infoRentang(awal, st.per, rows.length, 'koperasi');
  paginasi('db-kel-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderDbKel(); });
}
function renderDbRat() {
  const d = S.pub.dashboard; if (!d || d === 'memuat') return;
  const kec = $('db-rat-kec').value, q = $('db-rat-cari').value.trim();
  const rows = d.rat.filter(function (r) { return (!kec || r.Kecamatan === kec) && cocok(r, ['NamaKKMP', 'Kelurahan', 'Kecamatan', 'Tempat'], q); });
  const st = S.st.dbRat; batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('db-rat-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (r, i) {
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="nowrap">' + esc(r.Kecamatan) + '</td><td class="nowrap">' + esc(r.Kelurahan) + '</td>' +
      '<td class="sel-utama nowrap">' + esc(r.NamaKKMP) + '</td>' +
      '<td class="tc">' + esc(r.PelaksanaanKe) + '</td><td class="tc">' + esc(r.TahunBuku) + '</td><td class="nowrap">' + tglBln(r.TanggalRAT) + '</td>' +
      '<td class="nowrap">' + esc(r.Tempat) + '</td><td class="tc">' + lnStatus(r.StatusRAT) + '</td></tr>';
  }).join('') : '<tr><td colspan="9" class="sel-kosong">Belum ada data RAT yang sesuai.</td></tr>';
  $('db-rat-info').textContent = infoRentang(awal, st.per, rows.length, 'data RAT');
  paginasi('db-rat-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderDbRat(); });
}
function geraiDbTerfilter() {
  const d = S.pub.dashboard; if (!d || d === 'memuat') return [];
  const q = $('db-gerai-cari').value.trim();
  return d.gerai.filter(function (g) { return (!S.kecPilih || g.Kecamatan === S.kecPilih) && cocok(g, ['NamaKKMP', 'Kelurahan', 'Kecamatan', 'AlamatGedung'], q); });
}
function selProgres(p, tahap) {
  return '<div class="prog-sel"><div class="progres" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progres fisik"><div class="progres-isi ' + warnaProgres(p) + '" style="width:' + Math.min(100, p) + '%"></div></div><b>' + p + '%</b>' + (tahap ? '<small>' + esc(tahap) + '</small>' : '') + '</div>';
}
function renderDbGerai() {
  const d = S.pub.dashboard; if (!d || d === 'memuat') return;
  const rows = geraiDbTerfilter(), st = S.st.dbGer; batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('db-gerai-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (g, i) {
    const p = Number(g.ProgresFisik) || 0;
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="sel-utama nowrap">' + esc(g.NamaKKMP) + '<span class="sel-sub">' + esc(g.Kelurahan) + ', ' + esc(g.Kecamatan) + '</span></td>' +
      '<td class="tc nowrap">' + angka(g.LuasLahan) + ' m²</td><td class="tc nowrap">' + angka(g.LuasBangunan) + ' m²</td>' +
      '<td class="sel-trunc" title="' + esc(g.AlamatGedung) + '">' + esc(g.AlamatGedung) + '</td><td class="sel-mono">' + (g.Latitude && g.Longitude ? esc(g.Latitude) + ', ' + esc(g.Longitude) : '-') + '</td>' +
      '<td class="tc"><button type="button" class="btn btn-ikon btn-hantu btn-kecil" data-foto-db="' + esc(g.ID) + '"' + (g.FotoURL ? '' : ' disabled') + ' aria-label="' + (g.FotoURL ? 'Lihat foto dokumentasi ' : 'Belum ada foto ') + esc(g.NamaKKMP) + '">' + ik('photo_camera') + '</button></td>' +
      '<td>' + selProgres(p, g.TahapPekerjaan) + '</td><td class="tc">' + lnSarpras(g.StatusSarpras, g) + '</td><td class="tc">' + lnStatus(g.StatusVerval) + '</td></tr>';
  }).join('') : '<tr><td colspan="10" class="sel-kosong">Belum ada data gedung/gerai yang sesuai.</td></tr>';
  paginasi('db-gerai-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderDbGerai(); });
}
function eksporGerai() {
  const rows = geraiDbTerfilter();
  if (!rows.length) return toast('Tidak ada data untuk diekspor.', true);
  const kol = ['No', 'Nama Koperasi Kelurahan', 'Kecamatan', 'Kelurahan', 'Luas Lahan (m2)', 'Luas Bangunan (m2)', 'Alamat', 'Latitude', 'Longitude', 'Progres Fisik (%)', 'Tahap Pekerjaan', 'Status SARPRAS', 'Status Verval', 'Laporan SIMKOPDES', 'Terakhir Diperbarui'];
  const isi = rows.map(function (g, i) { return [i + 1, g.NamaKKMP, g.Kecamatan, g.Kelurahan, g.LuasLahan, g.LuasBangunan, g.AlamatGedung, g.Latitude, g.Longitude, g.ProgresFisik, g.TahapPekerjaan, g.StatusSarpras || 'Belum', g.StatusVerval, g.LaporanSIMKOPDES, g.TerakhirDiperbarui]; });
  const html = '<html><head><meta charset="utf-8"></head><body><table border="1"><tr>' + kol.map(function (k) { return '<th>' + esc(k) + '</th>'; }).join('') + '</tr>' +
    isi.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></body></html>';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + html], { type: 'application/vnd.ms-excel' }));
  a.download = 'Rekap_Gerai_KKMP_' + hariIni() + '.xls';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  toast('Rekapitulasi gerai berhasil diekspor.');
}
// ===== AKHIR BLOK: M2_DASHBOARD =====


// ===== BLOK: M3_PUSTAKA =====
S.st.pus = { hal: 1, per: 9, kat: '', urut: 'baru' };
function muatPustaka() {
  if (S.pub.pustaka) return renderPustaka();
  panggil('publikPustaka').then(function (d) {
    S.pub.pustaka = d;
    const kat = Array.from(new Set(d.map(function (p) { return p.Kategori; }).filter(String))).sort();
    $('pus-kat').innerHTML = ['<button type="button" class="chip aktif" data-pus-kat="" aria-pressed="true">Semua</button>'].concat(kat.map(function (k) {
      return '<button type="button" class="chip" data-pus-kat="' + esc(k) + '" aria-pressed="false">' + esc(k) + '</button>';
    })).join('');
    renderPustaka();
  }).catch(function (e) {
    if (e.message === 'MAINTENANCE') { S.maint = true; return bukaHal('maint'); }
    $('pus-grid').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>';
  });
}
function ikonDok(kat) { return { 'Dasar Hukum': ['gavel', ''], 'Laporan': ['assignment', 'dk-laporan'], 'Perencanaan': ['insights', 'dk-perencanaan'], 'Referensi': ['menu_book', 'dk-referensi'] }[kat] || ['description', '']; }
function renderPustaka() {
  const st = S.st.pus, semua = S.pub.pustaka || [], q = $('pus-cari').value.trim();
  $('pus-jumlah').textContent = semua.length + ' Berkas Tersedia';
  document.querySelectorAll('[data-pus-kat]').forEach(function (c) { const a = c.getAttribute('data-pus-kat') === st.kat; c.classList.toggle('aktif', a); c.setAttribute('aria-pressed', a ? 'true' : 'false'); });
  let rows = semua.filter(function (p) { return (!st.kat || p.Kategori === st.kat) && cocok(p, ['JudulDokumen', 'Kategori', 'Keterangan'], q); });
  rows = rows.slice().sort(function (a, b) {
    if (st.urut === 'az' || st.urut === 'za') return (st.urut === 'az' ? 1 : -1) * a.JudulDokumen.localeCompare(b.JudulDokumen, 'id');
    return (st.urut === 'baru' ? -1 : 1) * String(a.TanggalDokumen).localeCompare(String(b.TanggalDokumen));
  });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('pus-grid').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (p) {
    const i = ikonDok(p.Kategori);
    return '<article class="kartu dok-kartu"><div class="dok-atas"><span class="dok-ikon ' + i[1] + '" aria-hidden="true"><span class="ik">' + i[0] + '</span></span>' + lencana(p.Kategori, 'ln-netral') + '</div>' +
      '<h2 class="dok-judul">' + esc(p.JudulDokumen) + '</h2><p class="dok-ket">' + esc(p.Keterangan || 'Dokumen resmi program KKMP Kota Ternate.') + '</p>' +
      '<div class="dok-meta"><span>' + ik('calendar_today', 'ik-16') + tglSedang(p.TanggalDokumen) + '</span>' + (p.UkuranMB ? '<span>' + ik('description', 'ik-16') + esc(p.UkuranMB) + ' MB</span>' : '') + '</div>' +
      '<a class="btn btn-sekunder btn-blok" href="' + esc(p.BerkasURL) + '" target="_blank" rel="noopener">' + ik('download') + '<span>Unduh / Buka<span class="sr"> ' + esc(p.JudulDokumen) + ' (tab baru)</span></span></a></article>';
  }).join('') : '<div class="kosong">' + (semua.length ? 'Dokumen tidak ditemukan. Coba kata kunci atau kategori lain.' : 'Belum ada dokumen yang dipublikasikan.') + '</div>';
  $('pus-info').textContent = infoRentang(awal, st.per, rows.length, 'dokumen');
  paginasi('pus-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderPustaka(); window.scrollTo(0, 0); });
}
// ===== AKHIR BLOK: M3_PUSTAKA =====


// ===== BLOK: M4_BERITA =====
S.st.brt = { hal: 1, per: 7, kat: '' };
function muatBerita() {
  if (S.pub.berita) return renderBerita();
  panggil('publikBerita').then(function (d) {
    S.pub.berita = d.berita;
    $('brt-chips').innerHTML = ['<button type="button" class="chip aktif" data-kat="" aria-pressed="true">Semua Berita</button>'].concat(d.kategori.map(function (k) {
      return '<button type="button" class="chip" data-kat="' + esc(k) + '" aria-pressed="false">' + esc(k) + '</button>';
    })).join('');
    renderBerita();
  }).catch(function (e) {
    if (e.message === 'MAINTENANCE') { S.maint = true; return bukaHal('maint'); }
    $('brt-grid').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>';
  });
}
function renderBerita() {
  const st = S.st.brt, semua = S.pub.berita || [], q = $('brt-cari').value.trim();
  const rows = semua.filter(function (b) { return (!st.kat || b.Kategori === st.kat) && cocok(b, ['Judul', 'Ringkasan', 'Tagar', 'Kategori'], q); });
  document.querySelectorAll('[data-kat]').forEach(function (c) { const a = c.getAttribute('data-kat') === st.kat; c.classList.toggle('aktif', a); c.setAttribute('aria-pressed', a ? 'true' : 'false'); });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('brt-grid').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (b, i) {
    return kartuBerita(b, i === 0 && st.hal === 1 ? 'utama' : 'biasa');
  }).join('') : '<div class="kosong">' + (semua.length ? 'Berita tidak ditemukan. Coba kata kunci lain.' : 'Belum ada berita yang diterbitkan.') + '</div>';
  $('brt-info').textContent = infoRentang(awal, st.per, rows.length, 'warta');
  paginasi('brt-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderBerita(); window.scrollTo(0, 0); });
}
function formatIsi(teks) {
  const inline = function (s) {
    return esc(s).replace(/&lt;(\/?)(b|strong|i|em)&gt;/g, '<$1$2>')
      .replace(/&lt;a href=&quot;(https?:\/\/[^&\s]+)&quot;&gt;(.*?)&lt;\/a&gt;/g, '<a href="$1" target="_blank" rel="noopener">$2</a>');
  };
  const blok = String(teks || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (b) { return b.trim(); }).filter(String);
  let pertama = true;
  return blok.map(function (b) {
    const baris = b.split('\n');
    if (/^>/.test(baris[0].trim()) && baris.every(function (l) { return /^>/.test(l.trim()) || /^[—-]{1,2}\s/.test(l.trim()); })) {
      const kutip = baris.filter(function (l) { return /^>/.test(l.trim()); }).map(function (l) { return l.trim().replace(/^>\s?/, ''); }).join(' ');
      const cite = baris.filter(function (l) { return /^[—-]{1,2}\s/.test(l.trim()); }).map(function (l) { return l.trim().replace(/^[—-]{1,2}\s/, ''); })[0];
      return '<figure class="dt-kutipan"><blockquote>' + inline(kutip) + '</blockquote>' + (cite ? '<figcaption><cite>— ' + inline(cite) + '</cite></figcaption>' : '') + '</figure>';
    }
    if (baris.every(function (l) { return /^[-*•]\s/.test(l.trim()); })) return '<ul>' + baris.map(function (l) { return '<li>' + inline(l.trim().replace(/^[-*•]\s/, '')) + '</li>'; }).join('') + '</ul>';
    const cls = pertama ? ' class="dt-p-pertama"' : ''; pertama = false;
    return '<p' + cls + '>' + baris.map(inline).join('<br>') + '</p>';
  }).join('');
}
function muatDetail(id) {
  if (!id) return bukaHal('berita');
  S.pub.detailId = id;
  S.pub.detailCache = S.pub.detailCache || {};
  if (S.pub.detailCache[id]) return renderDetail(S.pub.detailCache[id]);
  $('dt-judul').textContent = 'Memuat berita...';
  $('dt-isi').innerHTML = '<div class="skel skel-baris"></div>';
  $('dt-lainnya').innerHTML = '';
  panggil('publikDetailBerita', id).then(function (d) { S.pub.detailCache[id] = d; if (S.pub.detailId === id) renderDetail(d); }).catch(function (e) {
    if (e.message === 'MAINTENANCE') { S.maint = true; return bukaHal('maint'); }
    $('dt-judul').textContent = 'Berita tidak tersedia';
    $('dt-isi').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>';
  });
}
function sudahManfaat(id) { return bacaSimpan('kkmp_manfaat', sessionStorage).split(',').indexOf(id) > -1; }
function tandaiManfaat(id) { const v = bacaSimpan('kkmp_manfaat', sessionStorage); tulisSimpan('kkmp_manfaat', v ? v + ',' + id : id, sessionStorage); }
function renderDetail(d) {
  const b = d.berita;
  $('dt-judul').textContent = b.Judul;
  $('dt-penulis').textContent = b.Penulis || '-';
  $('dt-tanggal').textContent = tglPanjang(b.TanggalTerbit) + ' · ' + b.menitBaca + ' menit baca';
  $('dt-kategori').textContent = b.Kategori;
  const img = $('dt-gambar');
  img.src = b.GambarURL || ASET.hero; img.alt = b.KeteranganFoto || ('Foto ilustrasi: ' + b.Judul);
  img.onerror = function () { this.onerror = null; this.src = ASET.hero; };
  $('dt-caption').textContent = b.KeteranganFoto || ''; $('dt-caption-wrap').hidden = !b.KeteranganFoto;
  $('dt-isi').innerHTML = formatIsi(b.IsiBerita);
  const tag = String(b.Tagar || '').split(',').map(function (t) { return t.trim().replace(/^#/, ''); }).filter(String);
  $('dt-tagar-wrap').hidden = !tag.length;
  $('dt-tagar').innerHTML = tag.map(function (t) { return '<a class="chip" href="#" data-tagar="' + esc(t) + '">#' + esc(t) + '</a>'; }).join('');
  const jml = Number(b.JumlahBermanfaat) || 0;
  $('dt-manfaat-teks').textContent = jml ? 'Bermanfaat (' + jml + ')' : 'Bermanfaat';
  $('dt-manfaat').disabled = sudahManfaat(b.ID);
  $('dt-lainnya').innerHTML = d.lainnya.length ? d.lainnya.map(kartuBeritaKecil).join('') : '<div class="kosong-kecil">Belum ada berita lainnya.</div>';
  aturProgresBaca();
}
// Tautan langsung ke satu berita: alamat web app (/exec) + ?hal=detail&id=… (dibuka otomatis saat portal dimuat).
function tautanBerita(id) {
  const dasar = MODE_API ? location.origin + location.pathname : (String(S.urlApp || '').split('?')[0].split('#')[0] || String(document.referrer || '').split('?')[0].split('#')[0]);
  return dasar && id ? dasar + '?hal=detail&id=' + encodeURIComponent(id) : '';
}
function salinTautanKb(id) {
  const b = ((S.ad && S.ad.berita) || []).filter(function (x) { return x.ID === id; })[0];
  const url = tautanBerita(id);
  if (!url) return toast('Alamat portal belum diketahui. Isi "url_portal" di Konten & Pengaturan.', true);
  salinTeks(url).then(function (ok) {
    toast(ok ? 'Tautan berita disalin' + (b && b.Status !== 'Terbit' ? ' — berita ini belum terbit, tautan baru bisa dibuka setelah diterbitkan.' : '.') : 'Tautan: ' + url, !ok || (b && b.Status !== 'Terbit'));
  });
}
function aturProgresBaca() {
  if (S.halAktif !== 'detail') return;
  const art = document.querySelector('.dt-artikel'); if (!art) return;
  const r = art.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight);
  $('dt-progres').style.width = Math.max(0, Math.min(100, -r.top / total * 100)) + '%';
}
// ===== AKHIR BLOK: M4_BERITA =====


// ===== BLOK: M5_KONTAK =====
function siapkanKontak() {
  const peta = $('kt-peta'), url = S.cfg.maps_embed_url || '', ada = peta.querySelector('.kt-iframe');
  if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(url)) {
    peta.style.backgroundImage = '';
    if (!ada) {
      const f = document.createElement('iframe');
      f.className = 'kt-iframe'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      f.title = 'Peta lokasi ' + (S.cfg.office_name || 'kantor sekretariat'); f.src = url;
      peta.appendChild(f);
    } else if (ada.src !== url) ada.src = url;
  } else {
    if (ada) ada.remove();
    peta.style.backgroundImage = 'url("' + ASET.peta + '")';
  }
  const alamat = S.cfg.office_address || 'Kota Ternate';
  if (!S.captcha.id || Date.now() > S.captcha.habis) muatCaptcha();
  $('kt-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((S.cfg.office_name ? S.cfg.office_name + ', ' : '') + alamat);
}
// CAPTCHA formulir kontak: kode dibuat & divalidasi di server (sekali pakai, berlaku 5 menit).
S.captcha = { id: '', habis: 0, memuat: false };
function galatCaptcha(pesan) {
  const g = $('kt-captcha-galat');
  if (pesan) { g.innerHTML = ik('error', 'ik-18') + '<span>' + esc(pesan) + '</span>'; g.hidden = false; $('kt-captcha').classList.add('salah'); $('kt-captcha').setAttribute('aria-invalid', 'true'); }
  else { g.hidden = true; g.textContent = ''; $('kt-captcha').classList.remove('salah'); $('kt-captcha').removeAttribute('aria-invalid'); }
}
function muatCaptcha(pertahankanGalat) {
  if (S.captcha.memuat) return S.captcha.janji;
  S.captcha.memuat = true;
  const wadah = $('kt-captcha-wadah'), btn = $('kt-captcha-baru');
  wadah.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.classList.add('berputar');
  $('kt-captcha').value = '';
  if (!pertahankanGalat) galatCaptcha('');
  S.captcha.janji = panggil('publikCaptcha', S.captcha.id || '').then(function (c) {
    S.captcha.id = c.id; S.captcha.habis = Date.now() + (c.berlaku - 10) * 1000;
    $('kt-captcha-img').src = c.gambar;
  }).catch(function (e) {
    S.captcha.id = ''; galatCaptcha(e.message === 'MAINTENANCE' ? 'Portal sedang dalam pemeliharaan.' : 'Kode verifikasi gagal dimuat. Pilih tombol Ganti kode.');
  }).then(function () { S.captcha.memuat = false; wadah.setAttribute('aria-busy', 'false'); btn.disabled = false; btn.classList.remove('berputar'); });
  return S.captcha.janji;
}
function kirimKontak(e) {
  e.preventDefault();
  const btn = $('btn-kirim');
  try {
    wajibIsi(['kt-nama', 'kt-email', 'kt-subjek', 'kt-isi', 'kt-captcha']);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('kt-email').value.trim())) { $('kt-email').classList.add('salah'); $('kt-email').setAttribute('aria-invalid', 'true'); $('kt-email').focus(); throw new Error('Format alamat e-mail tidak valid.'); }
    const kode = $('kt-captcha').value.replace(/\s+/g, '');
    if (kode.length !== 5) { galatCaptcha('Kode verifikasi terdiri dari 5 karakter.'); $('kt-captcha').focus(); throw new Error('Kode verifikasi belum lengkap.'); }
    if (!S.captcha.id || Date.now() > S.captcha.habis) { muatCaptcha(true).then(function () { galatCaptcha('Kode verifikasi sudah kedaluwarsa. Silakan ketik kode yang baru.'); $('kt-captcha').focus(); }); throw new Error('Kode verifikasi sudah kedaluwarsa.'); }
  } catch (err) { return toast(err.message, true); }
  const data = { NamaLengkap: $('kt-nama').value.trim(), Email: $('kt-email').value.trim(), Subjek: $('kt-subjek').value.trim(), IsiPesan: $('kt-isi').value.trim(), Telepon: $('kt-telp').value.trim(),
    captchaId: S.captcha.id, captchaKode: $('kt-captcha').value.replace(/\s+/g, '') };
  galatCaptcha('');
  sibuk(btn, true, 'Mengirim...');
  panggil('publikKirimPesan', data).then(function () {
    $('form-kontak').reset(); $('kt-feedback').hidden = false;
    setTimeout(function () { $('kt-feedback').hidden = true; }, 9000);
    toast('Pesan berhasil dikirim.'); S.ringkasan = null;
    muatCaptcha();
  }).catch(function (err) {
    const pesan = err.message === 'MAINTENANCE' ? 'Portal sedang dalam pemeliharaan.' : err.message;
    const soalKode = /kode verifikasi/i.test(pesan);
    // kode di server bersifat sekali pakai, jadi selalu ambil kode baru setelah percobaan gagal
    muatCaptcha(soalKode).then(function () { if (soalKode) { galatCaptcha(pesan); $('kt-captcha').focus(); } });
    toast(pesan, true);
  }).then(function () { sibuk(btn, false); });
}
// ===== AKHIR BLOK: M5_KONTAK =====


// ===== BLOK: AUTH =====
function prosesLogin(e) {
  e.preventDefault();
  const u = $('login-user').value.trim(), p = $('login-pass').value, pesan = $('login-pesan');
  if (!u || !p) { pesan.textContent = 'Username dan password wajib diisi.'; pesan.hidden = false; (u ? $('login-pass') : $('login-user')).focus(); return; }
  pesan.hidden = true;
  const btn = $('btn-login'); sibuk(btn, true, 'Memeriksa...');
  panggil('login', u, p).then(function (d) {
    S.token = d.token; tulisSimpan('kkmp_token', d.token, sessionStorage);
    $('login-pass').value = ''; S.ad = {}; S.ringkasan = null;
    tampilApp('admin'); return muatAdmin();
  }).catch(function (err) { pesan.textContent = err.message; pesan.hidden = false; })
    .then(function () { sibuk(btn, false); });
}
function keluar(e) {
  if (e) e.preventDefault();
  const t = S.token;
  tulisSimpan('kkmp_token', '', sessionStorage); S.token = ''; S.ad = {}; S.ringkasan = null; S.adAktif = '';
  bersihkanVerval();
  if (t) { if (MODE_API) panggilApi('logout', [t]).catch(function () { /* abaikan */ }); else google.script.run.logout(t); }
  tutupDrawer(); tampilApp('login'); $('login-pesan').hidden = true;
  toast('Anda telah keluar dari panel admin.');
}
// ===== AKHIR BLOK: AUTH =====


// ===== BLOK: LAYOUT_ADMIN =====
function muatAdmin() {
  return panggil('muatAwal').then(function (d) {
    $('ad-nama').textContent = d.pengguna.nama;
    $('ad-role').textContent = d.pengguna.role === 'Admin' ? 'Pengelola Sektor' : d.pengguna.role;
    S.pilihan = d.pilihan; S.koperasi = d.koperasi; S.ringkasan = d.ringkasan;
    S.peran = d.pengguna.role; S.penggunaId = d.pengguna.id; S.instrumen = d.instrumenVerval; S.wilayah = d.wilayah || {};
    terapkanAksesMenu();
    isiOpsi($('kop-filter-kec'), S.pilihan.Kecamatan, '<option value="">Semua Kecamatan</option>');
    isiOpsi($('kf-kec'), S.pilihan.Kecamatan, '<option value="" disabled selected>Pilih Kecamatan</option>');
    isiOpsi($('kb-filter-kategori'), S.pilihan.KategoriBerita, '<option value="">Semua Kategori</option>');
    isiOpsi($('bf-kategori'), S.pilihan.KategoriBerita);
    isiOpsi($('kp-filter-kategori'), S.pilihan.KategoriPustaka, '<option value="">Semua Kategori</option>');
    isiOpsi($('pf-kategori'), S.pilihan.KategoriPustaka, '<option value="" disabled selected>Pilih kategori berkas</option>');
    const tujuan = S.tujuanLogin; S.tujuanLogin = ''; $('login-tujuan').hidden = true;
    if (tujuan === 'ekspor-koperasi') {
      // lanjutkan unduhan yang diminta sebelum login; hak akses tetap diperiksa server
      bukaAd(bolehAd('koperasi') ? 'koperasi' : (S.peran === 'Admin' ? 'ringkasan' : 'verval-rekap'));
      return eksporRekapKop();
    }
    bukaAd(tujuan && bolehAd(tujuan) ? tujuan : (S.peran === 'Admin' ? 'ringkasan' : 'verval-rekap'));
  });
}
function bukaAd(nama) {
  if (!bolehAd(nama)) { toast('Akses ditolak: peran Anda tidak memiliki izin membuka halaman ini.', true); return; }
  if (S.adAktif === 'verval-input' && S.vf.kotor) return keluarFormVf(function () { bukaAd(nama); });
  $('fab-asisten').hidden = nama === 'verval-input';
  document.querySelectorAll('.ad-hal').forEach(function (h) { h.hidden = h.getAttribute('data-adhal') !== nama; });
  document.querySelectorAll('.ad-nav-link[data-ad]').forEach(function (a) {
    const aktif = a.getAttribute('data-ad') === nama;
    a.classList.toggle('aktif', aktif);
    if (aktif) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  tutupSidebar();
  const pindah = S.adAktif && S.adAktif !== nama;
  S.adAktif = nama; window.scrollTo(0, 0);
  if (pindah) $('ad-main').focus({ preventScroll: true });
  ({ ringkasan: muatRingkasan, koperasi: muatKop, rat: muatRat, gerai: muatGerai, berita: muatKb, pustaka: muatKp, konten: muatKonten, pesan: muatPesan,
    'verval-rekap': function () { muatRekapVerval(true); }, 'verval-daftar': function () { muatDaftarHal(true); }, 'verval-detail': muatDetailVerval,
    'verval-input': function () { const o = S.vfBuka || {}; S.vfBuka = null; bukaFormVerval(o); }, pengguna: function () { muatPengguna(true); } })[nama]();
}
function bukaSidebar() { $('ad-sidebar').classList.add('buka'); $('ad-backdrop').hidden = false; $('ad-toggle').setAttribute('aria-expanded', 'true'); const a = $('ad-sidebar').querySelector('.ad-nav-link'); if (a) a.focus(); }
function tutupSidebar() { $('ad-sidebar').classList.remove('buka'); $('ad-backdrop').hidden = true; $('ad-toggle').setAttribute('aria-expanded', 'false'); }
function opsiKoperasi(sel, pilih) {
  isiOpsi(sel, S.koperasi.map(function (k) { return { v: k.ID, l: k.NamaKKMP + ' (' + k.Kecamatan + ')' }; }), '<option value="">Pilih koperasi KKMP...</option>');
  sel.value = pilih || '';
}
function tandaiBasi() { S.ringkasan = null; S.pub = {}; S.berandaBasi = true; }
function muatUlangKoperasiRingkas(rows) { S.koperasi = rows.map(function (k) { return { ID: k.ID, NamaKKMP: k.NamaKKMP, Kecamatan: k.Kecamatan, Kelurahan: k.Kelurahan }; }); }
function gagalTabel(id, kol, e) { $(id).innerHTML = '<tr><td colspan="' + kol + '" class="sel-gagal">' + esc(e.message) + '</td></tr>'; }
function gantiBaris(wadah, kunci, baris) { const arr = wadah[kunci] || (wadah[kunci] = []); const i = arr.findIndex(function (x) { return x.ID === baris.ID; }); if (i > -1) arr[i] = baris; else arr.unshift(baris); }
function tombolAksi(attrUbah, attrHapus, id, nama) {
  return '<div class="aksi-sel"><button type="button" class="btn btn-ikon btn-hantu btn-kecil" ' + attrUbah + '="' + esc(id) + '" aria-label="Ubah ' + esc(nama) + '">' + ik('edit') + '</button>' +
    '<button type="button" class="btn btn-ikon btn-hantu btn-kecil teks-merah" ' + attrHapus + '="' + esc(id) + '" aria-label="Hapus ' + esc(nama) + '">' + ik('delete') + '</button></div>';
}
// ===== AKHIR BLOK: LAYOUT_ADMIN =====


// ===== BLOK: M6_RINGKASAN_ADMIN =====
function muatRingkasan(paksa) {
  if (S.ringkasan && !paksa) { renderRingkasan(S.ringkasan); return Promise.resolve(); }
  const btn = $('rk-muat'); btn.classList.add('berputar'); btn.setAttribute('aria-busy', 'true');
  return panggil('ringkasanAdmin').then(function (d) { S.ringkasan = d; renderRingkasan(d); })
    .catch(function (e) { toast(e.message, true); })
    .then(function () { btn.classList.remove('berputar'); btn.removeAttribute('aria-busy'); });
}
function itemSederhana(judul, sub, kanan) { return '<div class="item"><div class="item-kol"><span class="item-judul">' + esc(judul) + '</span><span class="item-sub">' + esc(sub) + '</span></div>' + (kanan || '') + '</div>'; }
function renderRingkasan(d) {
  const st = d.statistik;
  hitungAngka($('rk-total'), st.total); $('rk-kec').textContent = st.kecamatanTerdata + ' kecamatan terdata';
  hitungAngka($('rk-sudah'), st.ratSudah); $('rk-sudah-pct').textContent = persen(st.pctRatSudah) + ' terlaksana';
  hitungAngka($('rk-progres'), st.rataProgres, '%'); hitungAngka($('rk-berita'), d.beritaTerbit); hitungAngka($('rk-pesan'), d.pesanBaru);
  $('rk-total-kop').textContent = 'Total ' + angka(st.total) + ' koperasi';
  isiDonat(['dn-sudah', 'dn-draft', 'dn-belum'], [st.ratSudah, st.ratDraft, st.ratBelum], 289.03);
  $('dn-angka').textContent = angka(st.ratSudah);
  $('lg-sudah').textContent = angka(st.ratSudah); $('lg-draft').textContent = angka(st.ratDraft); $('lg-belum').textContent = angka(st.ratBelum);
  $('rk-kepatuhan').textContent = persen(st.pctRatSudah) + ' terpenuhi';
  $('rk-bar-list').innerHTML = st.progresKecamatan.length ? st.progresKecamatan.map(function (k) {
    return '<div class="bar-item"><div class="bar-kepala"><span>' + esc(k.kecamatan) + '</span><b>' + k.progres + '%</b></div><div class="progres" role="progressbar" aria-label="Progres ' + esc(k.kecamatan) + '" aria-valuenow="' + k.progres + '" aria-valuemin="0" aria-valuemax="100"><div class="progres-isi ' + warnaProgres(k.progres) + '" data-lebar="' + k.progres + '"></div></div></div>';
  }).join('') : '<div class="kosong-kecil">Belum ada data pembangunan gerai.</div>';
  $('rk-bar-list').querySelectorAll('[data-lebar]').forEach(function (el) { isiProgres(el, el.getAttribute('data-lebar')); });
  $('rk-belum-total').textContent = d.belumRat.total + ' Koperasi';
  $('rk-belum-list').innerHTML = d.belumRat.daftar.length ? d.belumRat.daftar.map(function (k) { return itemSederhana(k.NamaKKMP, 'Kecamatan ' + k.Kecamatan, lnStatus('Belum')); }).join('') : '<div class="kosong-kecil">Seluruh koperasi telah melaksanakan RAT.</div>';
  $('rk-rendah-list').innerHTML = d.progresRendah.daftar.length ? d.progresRendah.daftar.map(function (g) {
    const p = Number(g.ProgresFisik) || 0;
    return '<div class="item"><div class="item-kol" style="flex:1"><span class="item-judul">' + esc(g.NamaKKMP) + ' · ' + p + '%</span><span class="item-sub">' + esc(g.Catatan || '-') + '</span>' +
      '<div class="progres"><div class="progres-isi ' + warnaProgres(p) + '" style="width:' + p + '%"></div></div></div></div>';
  }).join('') : '<div class="kosong-kecil">Tidak ada gerai dengan progres di bawah 50%.</div>';
  $('rk-verval-list').innerHTML = d.menungguVerval.daftar.length ? d.menungguVerval.daftar.map(function (g) { return itemSederhana(g.NamaKKMP, 'Kelurahan ' + g.Kelurahan + ', ' + g.Kecamatan, lencana('Menunggu verval', 'ln-perhatian', 'pending')); }).join('') : '<div class="kosong-kecil">Tidak ada gerai yang menunggu verifikasi lapangan.</div>';
  $('rk-pesan-chip').textContent = d.pesanBaru + ' Pesan Baru';
  $('rk-pesan-list').innerHTML = d.pesanTerbaru.length ? d.pesanTerbaru.map(function (p) {
    return '<button type="button" class="item item-klik" data-pesan="' + esc(p.ID) + '"><span class="item-kiri"><span class="avatar avatar-kecil" aria-hidden="true">' + esc(inisial(p.NamaLengkap)) + '</span>' +
      '<span class="item-kol"><span class="item-judul">' + esc(p.NamaLengkap) + '</span><span class="item-sub">' + esc(p.Subjek) + '</span></span></span><span class="teks-kecil teks-redup nowrap">' + esc(relatif(p.Dibuat)) + '</span></button>';
  }).join('') : '<div class="kosong-kecil">Belum ada pesan masuk.</div>';
}
// ===== AKHIR BLOK: M6_RINGKASAN_ADMIN =====


// ===== BLOK: XLSX_MINI =====
// Penulis & pembaca .xlsx mandiri (tanpa pustaka luar/CDN). Penulis memakai ZIP "stored" + gaya sel;
// pembaca memakai DecompressionStream('deflate-raw') bawaan peramban modern.
const XLSX_MINI = (function () {
  const enc = new TextEncoder();
  let tabelCrc = null;
  function crc32(u8) {
    if (!tabelCrc) { tabelCrc = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tabelCrc[n] = c >>> 0; } }
    let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = tabelCrc[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(berkas) { // berkas: [{nama, isi:string}]
    const bagian = [], pusat = []; let offset = 0;
    berkas.forEach(function (b) {
      const nama = enc.encode(b.nama), data = enc.encode(b.isi), crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true); lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true);
      lh.setUint16(26, nama.length, true); lh.setUint16(28, 0, true);
      bagian.push(new Uint8Array(lh.buffer), nama, data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true); ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, nama.length, true); ch.setUint32(42, offset, true);
      pusat.push(new Uint8Array(ch.buffer), nama);
      offset += 30 + nama.length + data.length;
    });
    const besarPusat = pusat.reduce(function (t, u) { return t + u.length; }, 0);
    const eo = new DataView(new ArrayBuffer(22));
    eo.setUint32(0, 0x06054b50, true); eo.setUint16(8, berkas.length, true); eo.setUint16(10, berkas.length, true);
    eo.setUint32(12, besarPusat, true); eo.setUint32(16, offset, true);
    return new Blob(bagian.concat(pusat, [new Uint8Array(eo.buffer)]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  function xe(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''); }
  function kol(i) { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function serial(iso) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? (Date.UTC(+m[1], +m[2] - 1, +m[3]) - Date.UTC(1899, 11, 30)) / 86400000 : null; }
  // Gaya: 0 bawaan · 1 judul · 2 header · 3 data tengah · 4 data kiri bungkus · 5 angka #,##0 · 6 teks (@) tengah · 7 tanggal d-mmm-yy · 8 data kiri
  const STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="d\\-mmm\\-yy"/></numFmts>' +
    '<fonts count="4"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><sz val="10"/><name val="Bookman Old Style"/><family val="1"/></font>' +
    '<font><b/><sz val="10"/><name val="Bookman Old Style"/><family val="1"/></font><font><b/><sz val="14"/><name val="Bookman Old Style"/><family val="1"/></font></fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFCCCC"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="9">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="3" fontId="1" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="49" fontId="1" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="164" fontId="1" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  // lembar: {nama, kolom:[lebar], baris:{nomor:{tinggi, sel:[{k:indeksKolom, v, t:'s'|'n'|'d', s, f}]}}, gabung:['B4:B5'], beku:5}
  function sheetXml(l) {
    const nomor = Object.keys(l.baris).map(Number).sort(function (a, b) { return a - b; });
    let maks = 0;
    const rows = nomor.map(function (r) {
      const b = l.baris[r];
      return '<row r="' + r + '"' + (b.tinggi ? ' ht="' + b.tinggi + '" customHeight="1"' : '') + '>' + b.sel.map(function (c) {
        maks = Math.max(maks, c.k); const ref = kol(c.k) + r, st = c.s ? ' s="' + c.s + '"' : '';
        if (c.t === 'n' || c.t === 'd') {
          const v = c.t === 'd' ? serial(c.v) : (c.v === '' || c.v === null || c.v === undefined ? null : Number(c.v));
          if (v === null || isNaN(v)) return '<c r="' + ref + '"' + st + (c.f ? '><f>' + xe(c.f) + '</f></c>' : '/>');
          return '<c r="' + ref + '"' + st + '>' + (c.f ? '<f>' + xe(c.f) + '</f>' : '') + '<v>' + v + '</v></c>';
        }
        if (c.v === '' || c.v === null || c.v === undefined) return '<c r="' + ref + '"' + st + '/>';
        return '<c r="' + ref + '"' + st + ' t="inlineStr"><is><t xml:space="preserve">' + xe(c.v) + '</t></is></c>';
      }).join('') + '</row>';
    }).join('');
    const atas = nomor[0] || 1, bawah = nomor[nomor.length - 1] || 1;
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<dimension ref="A' + atas + ':' + kol(maks) + bawah + '"/><sheetViews><sheetView workbookViewId="0" zoomScale="' + (l.zoom || 100) + '">' +
      (l.beku ? '<pane ySplit="' + l.beku + '" topLeftCell="A' + (l.beku + 1) + '" activePane="bottomLeft" state="frozen"/>' : '') + '</sheetView></sheetViews>' +
      '<sheetFormatPr defaultRowHeight="15"/><cols>' + l.kolom.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols>' +
      '<sheetData>' + rows + '</sheetData>' + (l.gabung && l.gabung.length ? '<mergeCells count="' + l.gabung.length + '">' + l.gabung.map(function (g) { return '<mergeCell ref="' + g + '"/>'; }).join('') + '</mergeCells>' : '') +
      '<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" fitToHeight="0"/></worksheet>';
  }
  function buat(lembar) {
    const f = [];
    f.push({ nama: '[Content_Types].xml', isi: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      lembar.map(function (l, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' });
    f.push({ nama: '_rels/.rels', isi: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' });
    f.push({ nama: 'xl/workbook.xml', isi: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
      lembar.map(function (l, i) { return '<sheet name="' + xe(l.nama.slice(0, 31)) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>' });
    f.push({ nama: 'xl/_rels/workbook.xml.rels', isi: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      lembar.map(function (l, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
      '<Relationship Id="rId' + (lembar.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' });
    f.push({ nama: 'xl/styles.xml', isi: STYLES });
    lembar.forEach(function (l, i) { f.push({ nama: 'xl/worksheets/sheet' + (i + 1) + '.xml', isi: sheetXml(l) }); });
    return zip(f);
  }
  // ---- Pembaca ----
  function bacaZip(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    if (u8[0] !== 0x50 || u8[1] !== 0x4B) return Promise.reject(new Error('File bukan .xlsx yang valid. Simpan ulang file dari Excel sebagai "Excel Workbook (.xlsx)".'));
    let e = -1; for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
    if (e < 0) return Promise.reject(new Error('Struktur file .xlsx rusak.'));
    const n = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true);
    const ent = {}, dec = new TextDecoder();
    for (let i = 0; i < n; i++) {
      const metode = dv.getUint16(p + 10, true), ukuran = dv.getUint32(p + 20, true), pn = dv.getUint16(p + 28, true), pe = dv.getUint16(p + 30, true), pk = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
      const nama = dec.decode(u8.subarray(p + 46, p + 46 + pn));
      const awal = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
      ent[nama] = { metode: metode, data: u8.subarray(awal, awal + ukuran) };
      p += 46 + pn + pe + pk;
    }
    return Promise.resolve(ent);
  }
  function inflate(x) {
    if (x.metode === 0) return Promise.resolve(new TextDecoder().decode(x.data));
    if (x.metode !== 8) return Promise.reject(new Error('Metode kompresi file tidak didukung.'));
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('Peramban ini belum mendukung pembacaan .xlsx. Gunakan Chrome, Edge, Firefox, atau Safari versi terbaru.'));
    const ds = new DecompressionStream('deflate-raw');
    return new Response(new Blob([x.data]).stream().pipeThrough(ds)).text();
  }
  function xml(s) { return new DOMParser().parseFromString(s, 'application/xml'); }
  function semua(doc, tag) { return Array.prototype.slice.call(doc.getElementsByTagNameNS('*', tag)); }
  function teksSi(si) { return semua(si, 't').filter(function (t) { return !t.parentNode || t.parentNode.localName !== 'rPh'; }).map(function (t) { return t.textContent; }).join(''); }
  function kolIdx(ref) { const m = /^([A-Z]+)/.exec(ref || ''); if (!m) return -1; let n = 0; for (let i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64); return n - 1; }
  // Hasil: grid[nomorBaris][indeksKolom] = {v: teks, n: true bila sel angka}
  function baca(file) {
    return file.arrayBuffer().then(bacaZip).then(function (ent) {
      const ambil = function (nama) { return ent[nama] ? inflate(ent[nama]) : Promise.resolve(null); };
      return Promise.all([ambil('xl/workbook.xml'), ambil('xl/_rels/workbook.xml.rels'), ambil('xl/sharedStrings.xml')]).then(function (r) {
        if (!r[0]) throw new Error('File bukan workbook Excel (.xlsx).');
        const wb = xml(r[0]), rels = r[1] ? xml(r[1]) : null, sheet = semua(wb, 'sheet')[0];
        if (!sheet) throw new Error('Workbook tidak memiliki sheet.');
        const rid = sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') || sheet.getAttribute('r:id');
        let target = 'worksheets/sheet1.xml';
        if (rels) semua(rels, 'Relationship').forEach(function (x) { if (x.getAttribute('Id') === rid) target = x.getAttribute('Target'); });
        const jalur = target.charAt(0) === '/' ? target.slice(1) : 'xl/' + target.replace(/^\.\//, '');
        const sst = r[2] ? semua(xml(r[2]), 'si').map(teksSi) : [];
        return ambil(jalur).then(function (s) {
          if (!s) throw new Error('Sheet pertama tidak dapat dibaca.');
          const grid = {};
          semua(xml(s), 'row').forEach(function (row) {
            const rn = Number(row.getAttribute('r')); const g = grid[rn] = {}; let urut = 0;
            Array.prototype.forEach.call(row.childNodes, function (c) {
              if (c.localName !== 'c') return;
              const ci = c.getAttribute('r') ? kolIdx(c.getAttribute('r')) : urut; urut = ci + 1;
              const t = c.getAttribute('t'), vEl = semua(c, 'v')[0], v = vEl ? vEl.textContent : '';
              let nilai = '', angka = false;
              if (t === 's') nilai = sst[Number(v)] || '';
              else if (t === 'inlineStr') nilai = semua(c, 't').map(function (x) { return x.textContent; }).join('');
              else if (t === 'str' || t === 'b') nilai = v;
              else if (t === 'e') nilai = '';
              else { nilai = v; angka = v !== ''; }
              g[ci] = { v: nilai, n: angka };
            });
          });
          return { grid: grid, sheet: sheet.getAttribute('name') };
        });
      });
    });
  }
  return { buat: buat, baca: baca, kol: kol };
})();
function unduhBlob(blob, nama) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = nama; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
}
// ===== AKHIR BLOK: XLSX_MINI =====


// ===== BLOK: M7_DATA_KOPERASI =====
S.st.kop = { hal: 1, per: 10 };
// Indikator legalitas: ✓ Ya (hijau) / ✕ Belum (merah) — dibaca dari status yang diturunkan otomatis di server.
function lnAda(v) { return v === 'Ya' ? lencana('Ya', 'ln-sukses', 'check') : lencana('Belum', 'ln-bahaya', 'close'); }
function lnSudah(v) { return v === 'Ya' ? lencana('Sudah', 'ln-sukses', 'check') : lencana('Belum', 'ln-bahaya', 'close'); }
function fmtRibu(v) { return v === '' || v === undefined || v === null ? '–' : angka(Number(v)); }
function muatKop(paksa) {
  if (S.ad.kop && !paksa) return renderKop();
  $('kop-body').innerHTML = '<tr><td colspan="13" class="sel-memuat">Memuat data...</td></tr>';
  panggil('listKoperasi').then(function (d) { S.ad.kop = d; muatUlangKoperasiRingkas(d); renderKop(); }).catch(function (e) { gagalTabel('kop-body', 13, e); });
}
function renderKop() {
  const semua = S.ad.kop || [], st = S.st.kop;
  const hit = function (k) { return semua.filter(function (r) { return r[k] === 'Ya'; }).length; };
  $('kop-total').textContent = angka(semua.length); $('kop-bh').textContent = angka(hit('BerbadanHukum')); $('kop-akun').textContent = angka(hit('MemilikiAkun'));
  $('kop-npwp').textContent = angka(hit('MemilikiNPWP')); $('kop-nib').textContent = angka(hit('MemilikiNIB'));
  $('kop-terdaftar').textContent = 'Terdaftar: ' + semua.length + ' KKMP';
  const kec = $('kop-filter-kec').value, q = $('kop-cari').value.trim();
  const rows = semua.filter(function (r) { return (!kec || r.Kecamatan === kec) && cocok(r, ['NamaKKMP', 'Kelurahan', 'Kecamatan', 'Alamat', 'NIB', 'NomorSKAHU', 'NIKOP'], q); });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('kop-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (r, i) {
    const no = r.Nomor || (awal + i + 1);
    // Total = Laki-laki + Perempuan (dihitung otomatis)
    const total = r.PendudukL === '' && r.PendudukP === '' || (r.PendudukL === undefined && r.PendudukP === undefined) ? '' : (Number(r.PendudukL) || 0) + (Number(r.PendudukP) || 0);
    const sk = r.NomorSKAHU ? '<span class="kop-sk">' + esc(r.NomorSKAHU) + '</span><span class="sel-sub">' + (r.TanggalSKAHU ? tglSedang(r.TanggalSKAHU) : 'Tanggal belum diisi') + '</span>' : '<span class="teks-redup">Belum ada</span>';
    return '<tr><td class="sel-no">' + esc(no) + '</td><td class="nowrap">' + esc(r.Kecamatan) + '</td><td class="nowrap">' + esc(r.Kelurahan) + '</td>' +
      '<td class="sel-utama nowrap">' + esc(r.NamaKKMP) + '<span class="sel-sub sel-trunc" title="' + esc(r.Alamat) + '">' + esc(r.Alamat || '') + '</span></td>' +
      '<td class="tc angka-sel">' + fmtRibu(r.PendudukL) + '</td><td class="tc angka-sel">' + fmtRibu(r.PendudukP) + '</td><td class="tc angka-sel"><b>' + fmtRibu(total) + '</b></td>' +
      '<td class="kop-sel-sk">' + sk + '</td>' +
      '<td class="tc kode nowrap">' + (r.NIKOP ? esc(r.NIKOP) : '<span class="teks-redup">–</span>') + '</td>' +
      '<td class="tc kode nowrap">' + (r.NIB ? esc(r.NIB) : '<span class="teks-redup">–</span>') + '</td>' +
      '<td class="tc">' + lnSudah(r.MemilikiNPWP) + '</td><td class="tc">' + lnAda(r.MemilikiAkun) + '</td>' +
      '<td class="tc kop-aksi-sel">' + (S.peran === 'Admin' ? tombolAksi('data-ubah-kop', 'data-hapus-kop', r.ID, r.NamaKKMP) : '') + '</td></tr>';
  }).join('') : '<tr><td colspan="13" class="sel-kosong">' + (semua.length ? 'Data koperasi tidak ditemukan.' : 'Belum ada data koperasi. Pilih "Import Data Excel" atau "Tambah Koperasi".') + '</td></tr>';
  $('kop-info').textContent = infoRentang(awal, st.per, rows.length, 'data');
  paginasi('kop-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderKop(); });
}
// --- Formulir ---
function opsiKelurahanKf(kec, pilih) {
  const sel = $('kf-kel'), daftar = ((S.wilayah || {})[kec] || []).slice();
  if (pilih && daftar.indexOf(pilih) === -1) daftar.unshift(pilih); // nama lama di luar daftar resmi tetap dapat dipertahankan
  sel.innerHTML = '<option value="" disabled' + (pilih ? '' : ' selected') + '>' + (kec ? 'Pilih Kelurahan' : 'Pilih kecamatan dahulu') + '</option>' +
    daftar.map(function (k) { return '<option' + (k === pilih ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('');
  sel.disabled = !kec;
}
function hitungTotalKf() {
  const l = $('kf-l').value.replace(/\D/g, ''), p = $('kf-p').value.replace(/\D/g, '');
  $('kf-total').textContent = l === '' && p === '' ? '–' : angka((Number(l) || 0) + (Number(p) || 0));
}
function indikatorKf() {
  const r = S.kfLama, sk = $('kf-sk').value.trim(), nib = $('kf-nib').value.trim();
  const item = [['Badan Hukum', sk, 'Nomor SK AHU'], ['NIB', nib, 'NIB'], ['NPWP', $('kf-npwp').value === 'Sudah' ? 'x' : '', ''], ['Akun', $('kf-akun').value === 'Ya' ? 'x' : '', '']];
  $('kf-indikator').innerHTML = item.map(function (x) { return '<span class="kf-ind"><span>' + x[0] + '</span>' + lnAda(x[1] ? 'Ya' : 'Tidak') + '</span>'; }).join('');
  const hilang = r ? item.slice(0, 2).filter(function (x, i) { return !x[1] && r[['BerbadanHukum', 'MemilikiNIB'][i]] === 'Ya'; }) : [];
  $('kf-lama').hidden = !hilang.length;
  if (hilang.length) $('kf-lama').innerHTML = 'Data lama tercatat <b>Ya</b> untuk ' + hilang.map(function (x) { return x[0]; }).join(', ') + '. Isi ' + hilang.map(function (x) { return x[2]; }).join(', ') + ' agar statusnya tetap <b>Ya</b> setelah disimpan.';
}
function formKop(id) {
  const r = id ? (S.ad.kop || []).filter(function (x) { return x.ID === id; })[0] : null;
  S.kfLama = r;
  $('dr-kop-judul').textContent = r ? 'Ubah Data Koperasi' : 'Tambah Data Koperasi';
  $('kf-id').value = r ? r.ID : ''; $('kf-kec').value = r ? r.Kecamatan : '';
  opsiKelurahanKf(r ? r.Kecamatan : '', r ? r.Kelurahan : '');
  $('kf-nama').value = r ? r.NamaKKMP : ''; $('kf-alamat').value = r ? r.Alamat : ''; $('kf-nomor').value = r ? (r.Nomor || '') : '';
  $('kf-l').value = r ? (r.PendudukL || '') : ''; $('kf-p').value = r ? (r.PendudukP || '') : '';
  $('kf-nik').value = r ? (r.NIKOP || '') : ''; $('kf-nib').value = r ? (r.NIB || '') : ''; $('kf-sk').value = r ? (r.NomorSKAHU || '') : '';
  $('kf-tgl-sk').value = r ? (r.TanggalSKAHU || '') : ''; $('kf-npwp').value = r ? (r.MemilikiNPWP === 'Ya' ? 'Sudah' : 'Belum') : 'Sudah'; $('kf-akun').value = r ? (r.MemilikiAkun || 'Tidak') : 'Ya';
  hitungTotalKf(); indikatorKf();
  bukaDrawer('dr-koperasi');
}
function simpanKop(e) {
  e.preventDefault();
  try {
    wajibIsi(['kf-kec', 'kf-kel', 'kf-nama', 'kf-alamat']);
    const cek = function (id, re, pesan) { const el = $(id), v = el.value.trim(); if (v && !re.test(v)) { el.classList.add('salah'); el.focus(); throw new Error(pesan); } };
    cek('kf-nomor', /^\d{1,4}$/, 'No. urut harus berupa angka.');
    cek('kf-l', /^[\d.]+$/, 'Jumlah Laki-Laki harus berupa angka.'); cek('kf-p', /^[\d.]+$/, 'Jumlah Perempuan harus berupa angka.');
    cek('kf-nik', /^\d{8,20}$/, 'NIKOP hanya berisi angka (8–20 digit).'); cek('kf-nib', /^\d{13}$/, 'NIB harus 13 digit angka.');
    if ($('kf-tgl-sk').value && !$('kf-sk').value.trim()) { $('kf-sk').classList.add('salah'); $('kf-sk').focus(); throw new Error('Isi Nomor SK AHU untuk tanggal SK yang diisi.'); }
  } catch (err) { return toast(err.message, true); }
  const d = { ID: $('kf-id').value, Kecamatan: $('kf-kec').value, Kelurahan: $('kf-kel').value, NamaKKMP: $('kf-nama').value.trim(), Alamat: $('kf-alamat').value.trim(),
    Nomor: $('kf-nomor').value.trim(), PendudukL: $('kf-l').value.trim(), PendudukP: $('kf-p').value.trim(), NIKOP: $('kf-nik').value.trim(), NIB: $('kf-nib').value.trim(),
    NomorSKAHU: $('kf-sk').value.trim(), TanggalSKAHU: $('kf-tgl-sk').value, StatusNPWP: $('kf-npwp').value, MemilikiAkun: $('kf-akun').value };
  const btn = $('kf-simpan'); sibuk(btn, true);
  panggil('simpanKoperasi', d).then(function (r) {
    gantiBaris(S.ad, 'kop', r); muatUlangKoperasiRingkas(S.ad.kop); S.ad.rat = null; S.ad.gerai = null; tandaiBasi();
    renderKop(); tutupDrawer(); toast(d.ID ? 'Data koperasi diperbarui.' : 'Koperasi baru ditambahkan.');
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusKop(id) {
  const r = (S.ad.kop || []).filter(function (x) { return x.ID === id; })[0]; if (!r) return;
  konfirmasi({ judul: 'Hapus Data Koperasi?', sub: 'Data yang terhapus tidak dapat dikembalikan', teks: 'Data koperasi <b>' + esc(r.NamaKKMP) + '</b> akan dihapus permanen.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusKoperasi', id).then(function () { S.ad.kop = S.ad.kop.filter(function (x) { return x.ID !== id; }); muatUlangKoperasiRingkas(S.ad.kop); tandaiBasi(); renderKop(); toast('Data koperasi dihapus.'); })
      .catch(function (err) { toast(err.message, true); });
  });
}
function pasangEventKop() {
  $('kf-kec').addEventListener('change', function () { opsiKelurahanKf(this.value, ''); });
  $('kf-kel').addEventListener('change', function () { if (!$('kf-nama').value.trim() && this.value) $('kf-nama').value = 'KKMP ' + this.value; });
  ['kf-l', 'kf-p'].forEach(function (id) { $(id).addEventListener('input', hitungTotalKf); });
  ['kf-sk', 'kf-nib', 'kf-npwp', 'kf-akun'].forEach(function (id) { $(id).addEventListener('input', indikatorKf); $(id).addEventListener('change', indikatorKf); });
  $('kop-impor').addEventListener('click', bukaImpor);
  $('im-tutup').addEventListener('click', tutupImpor); $('im-batal').addEventListener('click', tutupImpor);
  $('im-file').addEventListener('change', function () { if (this.files[0]) bacaFileImpor(this.files[0]); this.value = ''; });
  const drop = $('im-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('seret'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('seret'); }); });
  drop.addEventListener('drop', function (e) { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) bacaFileImpor(f); });
  $('im-konfirmasi').addEventListener('click', konfirmasiImpor);
  $('im-lihat').addEventListener('click', function () { tutupImpor(); $('kop-filter-kec').value = ''; $('kop-cari').value = ''; S.st.kop.hal = 1; renderKop(); });
  $('im-laporan').addEventListener('click', unduhLaporanImpor);
}

// --- Ekspor rekapitulasi (Excel) ---
// Pemeriksaan sesi & peran dilakukan di server (eksporKoperasi); file dibuat di peramban dari data yang diizinkan,
// tanpa URL publik. Tanpa login -> diarahkan ke halaman login, lalu unduhan dilanjutkan setelah berhasil masuk.
function eksporRekapKop(btn) {
  if (!S.token) return bukaLogin('ekspor-koperasi');
  if (btn) sibuk(btn, true, 'Menyiapkan...');
  return panggil('eksporKoperasi').then(function (d) {
    unduhBlob(XLSX_MINI.buat([lembarRekapKop(d)]), d.nama);
    toast('Rekapitulasi ' + d.rows.length + ' KKMP diunduh (' + d.nama + ').');
  }).catch(function (err) {
    if (/Sesi berakhir/.test(err.message)) { if ($('app-admin').hidden) { tulisSimpan('kkmp_token', '', sessionStorage); S.token = ''; bukaLogin('ekspor-koperasi'); } else { S.tujuanLogin = 'ekspor-koperasi'; tandaTujuanLogin(); } return; }
    toast(/Akses ditolak/.test(err.message) ? 'Anda tidak memiliki hak akses untuk mengunduh rekapitulasi data koperasi.' : err.message, true);
  }).then(function () { if (btn) sibuk(btn, false); });
}
function lembarRekapKop(d) {
  const baris = {};
  baris[2] = { tinggi: 17.5, sel: [{ k: 1, v: d.judul, s: 1 }] };
  const h1 = ['No', 'Kecamatan', 'Kelurahan', 'Nama KKMP', 'Alamat', 'Jumlah Penduduk', '', '', 'NIKOP', 'NIB', 'Surat Keputusan Badan Hukum (SK AHU)', ''];
  const h2 = ['', '', '', '', '', 'Laki-Laki', 'Perempuan', 'Total', '', '', 'Nomor SK', 'Tanggal SK'];
  baris[4] = { tinggi: 20, sel: h1.map(function (v, i) { return { k: i + 1, v: v, s: 2 }; }) };
  baris[5] = { tinggi: 20, sel: h2.map(function (v, i) { return { k: i + 1, v: v, s: 2 }; }) };
  d.rows.forEach(function (r, i) {
    const n = 6 + i;
    baris[n] = { tinggi: 26, sel: [
      { k: 1, v: r.Nomor || i + 1, t: 'n', s: 3 }, { k: 2, v: r.Kecamatan, s: 8 }, { k: 3, v: r.Kelurahan, s: 8 }, { k: 4, v: r.NamaKKMP, s: 8 }, { k: 5, v: r.Alamat, s: 4 },
      { k: 6, v: r.PendudukL, t: 'n', s: 5 }, { k: 7, v: r.PendudukP, t: 'n', s: 5 },
      { k: 8, v: r.PendudukTotal, t: 'n', s: 5, f: r.PendudukL !== '' || r.PendudukP !== '' ? 'SUM(G' + n + ':H' + n + ')' : '' },
      { k: 9, v: r.NIKOP, s: 6 }, { k: 10, v: r.NIB, s: 6 }, { k: 11, v: r.NomorSKAHU, s: 4 }, { k: 12, v: r.TanggalSKAHU, t: 'd', s: 7 }
    ] };
  });
  return { nama: 'Legalitas', zoom: 85, beku: 5, kolom: [3.82, 3.82, 19.82, 19.82, 26.82, 71.82, 11.5, 11.5, 11.5, 16.82, 16.82, 37.82, 12],
    gabung: ['B2:M2', 'B4:B5', 'C4:C5', 'D4:D5', 'E4:E5', 'F4:F5', 'G4:I4', 'J4:J5', 'K4:K5', 'L4:M4'], baris: baris };
}

// --- Impor dari Excel ---
S.imp = { baris: null, hasil: null, nama: '', sibuk: false };
let fokusImpor = null;
function langkahImpor(n) { [1, 2, 3].forEach(function (i) { $('im-l' + i).classList.toggle('aktif', i === n); $('im-l' + i).classList.toggle('selesai', i < n); if (i === n) $('im-l' + i).setAttribute('aria-current', 'step'); else $('im-l' + i).removeAttribute('aria-current'); }); }
function bukaImpor() {
  fokusImpor = document.activeElement;
  S.imp = { baris: null, hasil: null, nama: '', sibuk: false };
  $('im-tahap1').hidden = false; $('im-tahap2').hidden = true; $('im-konfirmasi').hidden = true; $('im-lihat').hidden = true; $('im-laporan').hidden = true;
  $('im-batal').textContent = 'Batal'; langkahImpor(1);
  $('modal-impor').hidden = false; setTimeout(function () { $('im-file').focus(); }, 40);
}
function tutupImpor() { if (S.imp.sibuk || $('modal-impor').hidden) return; $('modal-impor').hidden = true; if (fokusImpor && fokusImpor.focus) fokusImpor.focus(); }
const PETA_KOLOM_IMPOR = {
  no: 'Nomor', nomor: 'Nomor', nourut: 'Nomor', kecamatan: 'Kecamatan', kelurahan: 'Kelurahan', desakelurahan: 'Kelurahan', namakkmp: 'NamaKKMP', namakoperasi: 'NamaKKMP',
  alamat: 'Alamat', alamatlengkap: 'Alamat', nik: 'NIKOP', nikop: 'NIKOP', nib: 'NIB', nomorsk: 'NomorSKAHU', nomorskahu: 'NomorSKAHU', noskahu: 'NomorSKAHU',
  tanggalsk: 'TanggalSKAHU', tanggalskahu: 'TanggalSKAHU', tglsk: 'TanggalSKAHU', l: 'PendudukL', lakilaki: 'PendudukL', jumlahpendudukl: 'PendudukL', pendudukl: 'PendudukL',
  p: 'PendudukP', perempuan: 'PendudukP', jumlahpendudukp: 'PendudukP', pendudukp: 'PendudukP', jumlah: 'PendudukTotal', total: 'PendudukTotal', jumlahpenduduk: 'PendudukTotal', jumlahpenduduktotal: 'PendudukTotal'
};
function normKolom(s) { const t = String(s || '').trim(); if (t === 'Σ' || t === '∑') return 'total'; return t.toLowerCase().replace(/[^a-z0-9]/g, ''); }
const BULAN_ID = { jan: 1, feb: 2, peb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, nop: 11, des: 12, dec: 12 };
function tanggalImpor(c) {
  if (!c || c.v === '') return '';
  const iso = function (y, m, d) { return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2); };
  if (c.n) { const n = Number(c.v); if (n > 20000 && n < 80000) { const t = new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 86400000); return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); } return '?' + c.v; }
  const s = String(c.v).trim(); let m;
  if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s))) return iso(m[1], m[2], m[3]);
  if ((m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/.exec(s))) return iso(m[3].length === 2 ? '20' + m[3] : m[3], m[2], m[1]);
  if ((m = /^(\d{1,2})[\s\-]+([A-Za-z]{3})[A-Za-z]*[\s\-]+(\d{2,4})$/.exec(s)) && BULAN_ID[m[2].toLowerCase()]) return iso(m[3].length === 2 ? '20' + m[3] : m[3], BULAN_ID[m[2].toLowerCase()], m[1]);
  return '?' + s; // ditandai tidak valid oleh server
}
function teksAngkaImpor(c, panjang) {
  if (!c) return '';
  let s = String(c.v).trim();
  if (c.n && /e/i.test(s)) s = Number(s).toLocaleString('fullwide', { useGrouping: false });
  if (c.n && panjang && /^\d+$/.test(s) && s.length < panjang) s = ('0'.repeat(panjang) + s).slice(-panjang); // nol di depan yang hilang karena sel angka
  return s;
}
function petakanImpor(grid) {
  const nomor = Object.keys(grid).map(Number).sort(function (a, b) { return a - b; });
  let hr = -1;
  for (let i = 0; i < Math.min(nomor.length, 40) && hr < 0; i++) {
    const lab = Object.keys(grid[nomor[i]]).map(function (c) { return normKolom(grid[nomor[i]][c].v); });
    if (lab.indexOf('kecamatan') > -1 && lab.indexOf('kelurahan') > -1) hr = nomor[i];
  }
  if (hr < 0) throw new Error('Struktur kolom tidak dikenali: baris judul dengan kolom "Kecamatan" dan "Kelurahan" tidak ditemukan.');
  const atas = grid[hr] || {}, bawah = grid[hr + 1] || {}, peta = {};
  let pakaiBawah = false;
  const semuaKol = Object.keys(atas).concat(Object.keys(bawah)).map(Number).filter(function (v, i, a) { return a.indexOf(v) === i; });
  semuaKol.forEach(function (c) {
    const b = bawah[c] ? normKolom(bawah[c].v) : '', a = atas[c] ? normKolom(atas[c].v) : '';
    let f = '';
    if (b && PETA_KOLOM_IMPOR[b] && !(a && PETA_KOLOM_IMPOR[a] && ['Kecamatan', 'Kelurahan', 'NamaKKMP', 'Alamat', 'NIKOP', 'NIB'].indexOf(PETA_KOLOM_IMPOR[a]) > -1)) { f = PETA_KOLOM_IMPOR[b]; pakaiBawah = true; }
    else if (a && PETA_KOLOM_IMPOR[a]) f = PETA_KOLOM_IMPOR[a];
    if (f && Object.keys(peta).map(function (k) { return peta[k]; }).indexOf(f) === -1) peta[c] = f;
  });
  const ditemukan = Object.keys(peta).map(function (k) { return peta[k]; });
  const wajib = ['Kecamatan', 'Kelurahan'], tidak = wajib.filter(function (k) { return ditemukan.indexOf(k) === -1; });
  if (tidak.length) throw new Error('Kolom wajib tidak ditemukan: ' + tidak.join(', ') + '.');
  const mulai = pakaiBawah ? hr + 2 : hr + 1, baris = [];
  nomor.filter(function (n) { return n >= mulai; }).forEach(function (n) {
    const g = grid[n], o = { _baris: n };
    Object.keys(peta).forEach(function (c) {
      const f = peta[c], sel = g[c];
      if (f === 'TanggalSKAHU') o[f] = tanggalImpor(sel);
      else if (f === 'NIB') o[f] = teksAngkaImpor(sel, 13);
      else if (f === 'NIKOP') o[f] = teksAngkaImpor(sel, 0);
      else if (f === 'PendudukL' || f === 'PendudukP' || f === 'PendudukTotal' || f === 'Nomor') o[f] = sel && sel.v !== '' ? (sel.n ? String(Math.round(Number(sel.v))) : String(sel.v).trim()) : '';
      else o[f] = sel ? String(sel.v).trim() : '';
    });
    if (!o.Kecamatan && !o.Kelurahan) return; // baris kosong / catatan kaki
    baris.push(o);
  });
  const LABEL = { Nomor: 'No', Kecamatan: 'Kecamatan', Kelurahan: 'Kelurahan', NamaKKMP: 'Nama KKMP', Alamat: 'Alamat', PendudukL: 'Laki-Laki', PendudukP: 'Perempuan', PendudukTotal: 'Total', NIKOP: 'NIKOP', NIB: 'NIB', NomorSKAHU: 'Nomor SK', TanggalSKAHU: 'Tanggal SK' };
  const opsional = ['Nomor', 'NamaKKMP', 'Alamat', 'PendudukL', 'PendudukP', 'PendudukTotal', 'NIKOP', 'NIB', 'NomorSKAHU', 'TanggalSKAHU'].filter(function (k) { return ditemukan.indexOf(k) === -1; });
  return { baris: baris, kolom: ditemukan.map(function (k) { return LABEL[k]; }), kurang: opsional.map(function (k) { return LABEL[k]; }) };
}
function bacaFileImpor(file) {
  if (!/\.xlsx$/i.test(file.name)) return toast('Format file harus .xlsx (Excel Workbook).', true);
  if (file.size > 5 * 1048576) return toast('Ukuran file maksimal 5 MB.', true);
  S.imp.sibuk = true; S.imp.nama = file.name;
  $('im-drop').classList.add('memuat'); $('im-drop').setAttribute('aria-busy', 'true');
  XLSX_MINI.baca(file).then(function (h) {
    const p = petakanImpor(h.grid);
    if (!p.baris.length) throw new Error('Tidak ada baris data di bawah judul kolom.');
    S.imp.baris = p.baris; S.imp.kolom = p;
    return panggil('pratinjauImporKoperasi', { nama: file.name, baris: p.baris }).then(function (r) {
      S.imp.hasil = r; tampilHasilImpor(r, false);
    });
  }).catch(function (err) { toast(err.message, true); })
    .then(function () { S.imp.sibuk = false; $('im-drop').classList.remove('memuat'); $('im-drop').removeAttribute('aria-busy'); });
}
const STATUS_IMPOR = { baru: ['Baru', 'ln-sukses', 'add_circle'], perbarui: ['Diperbarui', 'ln-info', 'sync'], tetap: ['Tidak berubah', 'ln-netral', 'check'], duplikat: ['Duplikat', 'ln-perhatian', 'content_copy'], gagal: ['Gagal', 'ln-bahaya', 'error'] };
function tampilHasilImpor(r, selesai) {
  const h = r.ringkas;
  $('im-tahap1').hidden = true; $('im-tahap2').hidden = false; langkahImpor(selesai ? 3 : 2);
  $('im-judul').textContent = selesai ? 'Hasil Import Data Excel' : 'Pratinjau Import Data Excel';
  $('im-berkas').innerHTML = (selesai ? 'Import selesai ' + esc(waktuWIT(r.waktu)) + ' · ' : '') + 'File: <b>' + esc(S.imp.nama) + '</b>';
  const kartu = function (label, n, kls, ket) { return '<div class="im-r ' + kls + '"><span>' + label + '</span><b>' + n + '</b>' + (ket ? '<small>' + ket + '</small>' : '') + '</div>'; };
  $('im-ringkas').innerHTML = kartu('Total data di file', h.total, '') +
    kartu(selesai ? 'Berhasil ditambahkan' : 'Data baru', h.baru, 'im-baru') + kartu(selesai ? 'Berhasil diperbarui' : 'Akan diperbarui', h.perbarui, 'im-perbarui') +
    kartu('Tidak berubah', h.tetap, 'im-tetap') + kartu('Duplikat dilewati', h.duplikat, 'im-duplikat') + kartu(selesai ? 'Gagal diimport' : 'Bermasalah', h.gagal, 'im-gagal', h.peringatan ? h.peringatan + ' baris dengan peringatan' : '');
  const p = S.imp.kolom || {};
  $('im-kolom').textContent = selesai ? '' : 'Kolom terbaca: ' + (p.kolom || []).join(', ') + '.' + ((p.kurang || []).length ? ' Tidak ditemukan: ' + p.kurang.join(', ') + ' (data lama untuk kolom ini tidak diubah).' : '');
  const urut = { gagal: 0, duplikat: 1, perbarui: 2, baru: 3, tetap: 4 };
  $('im-body').innerHTML = r.baris.slice().sort(function (a, b) { return (urut[a.status] - urut[b.status]) || (a.baris - b.baris); }).map(function (x) {
    const st = STATUS_IMPOR[x.status] || ['-', 'ln-netral', ''];
    const ket = x.pesan.map(function (m) { return '<span class="im-galat">' + esc(m) + '</span>'; }).concat(
      x.berubah && x.berubah.length ? ['<span>Berubah: ' + esc(x.berubah.join(', ')) + '</span>'] : [],
      x.peringatan.map(function (m) { return '<span class="im-peringatan">' + esc(m) + '</span>'; })).join('');
    return '<tr><td class="sel-no">' + x.baris + '</td><td class="nowrap">' + esc(x.Kecamatan || '-') + '</td><td class="nowrap">' + esc(x.Kelurahan || '-') + '</td><td class="nowrap">' + esc(x.NamaKKMP || '-') + '</td>' +
      '<td class="tc">' + lencana(st[0], st[1], st[2]) + '</td><td class="im-ket">' + (ket || '<span class="teks-redup">–</span>') + '</td></tr>';
  }).join('');
  const bisa = h.baru + h.perbarui;
  $('im-konfirmasi').hidden = selesai || !bisa; $('im-lihat').hidden = !selesai; $('im-laporan').hidden = false;
  $('im-batal').textContent = selesai ? 'Tutup' : 'Batal';
  if (!selesai && !bisa) toast('Tidak ada data baru atau perubahan untuk diimport.', true);
}
function konfirmasiImpor() {
  if (!S.imp.baris) return;
  const btn = $('im-konfirmasi'); S.imp.sibuk = true; sibuk(btn, true, 'Menyimpan...'); $('im-batal').disabled = true;
  panggil('imporKoperasi', { nama: S.imp.nama, baris: S.imp.baris }).then(function (r) {
    S.imp.hasil = r; tampilHasilImpor(r, true);
    S.ad.kop = null; S.ad.rat = null; S.ad.gerai = null; tandaiBasi(); muatKop(true);
    toast('Import selesai: ' + r.ringkas.baru + ' data baru, ' + r.ringkas.perbarui + ' diperbarui.');
  }).catch(function (err) { toast(err.message, true); })
    .then(function () { S.imp.sibuk = false; sibuk(btn, false); $('im-batal').disabled = false; });
}
function unduhLaporanImpor() {
  const r = S.imp.hasil; if (!r) return;
  const baris = {}, judul = 'LAPORAN IMPORT DATA KOPERASI — ' + S.imp.nama;
  baris[1] = { tinggi: 20, sel: [{ k: 0, v: judul, s: 1 }] };
  baris[2] = { sel: [{ k: 0, v: (r.waktu ? 'Diimport: ' + r.waktu + ' WIT' : 'Pratinjau (belum disimpan)') + ' · Total ' + r.ringkas.total + ' · Baru ' + r.ringkas.baru + ' · Diperbarui ' + r.ringkas.perbarui + ' · Tidak berubah ' + r.ringkas.tetap + ' · Duplikat ' + r.ringkas.duplikat + ' · Gagal ' + r.ringkas.gagal, s: 8 }] };
  baris[4] = { tinggi: 20, sel: ['Baris File', 'Kecamatan', 'Kelurahan', 'Nama KKMP', 'Status', 'Keterangan'].map(function (v, i) { return { k: i, v: v, s: 2 }; }) };
  r.baris.forEach(function (x, i) {
    const ket = x.pesan.concat(x.berubah && x.berubah.length ? ['Berubah: ' + x.berubah.join(', ')] : [], x.peringatan).join(' | ');
    baris[5 + i] = { sel: [{ k: 0, v: x.baris, t: 'n', s: 3 }, { k: 1, v: x.Kecamatan, s: 8 }, { k: 2, v: x.Kelurahan, s: 8 }, { k: 3, v: x.NamaKKMP, s: 8 }, { k: 4, v: (STATUS_IMPOR[x.status] || [x.status])[0], s: 3 }, { k: 5, v: ket || '-', s: 4 }] };
  });
  unduhBlob(XLSX_MINI.buat([{ nama: 'Laporan Import', beku: 4, kolom: [10, 18, 20, 26, 16, 90], gabung: ['A1:F1', 'A2:F2'], baris: baris }]), 'LAPORAN_IMPORT_KOPERASI_' + (r.waktu || hariIni()).replace(/[: ]/g, '-') + '.xlsx');
}
// ===== AKHIR BLOK: M7_DATA_KOPERASI =====


// ===== BLOK: M8_DATA_RAT =====
S.st.rat = { hal: 1, per: 10 };
function muatRat(paksa) {
  $('rat-terdaftar').textContent = S.koperasi.length + ' Kelurahan Terdaftar';
  if (S.ad.rat && !paksa) return renderRat();
  $('rat-body').innerHTML = '<tr><td colspan="10" class="sel-memuat">Memuat data...</td></tr>';
  panggil('listRAT').then(function (d) { S.ad.rat = d; isiTahunRat(); renderRat(); }).catch(function (e) { gagalTabel('rat-body', 10, e); });
}
function isiTahunRat() {
  const sel = $('rat-filter-tahun'), pilih = sel.value;
  const th = Array.from(new Set((S.ad.rat || []).map(function (r) { return r.TahunBuku; }).filter(String))).sort().reverse();
  isiOpsi(sel, th.map(function (t) { return { v: t, l: 'Tahun Buku ' + t }; }), '<option value="">Semua Tahun Buku</option>');
  sel.value = th.indexOf(pilih) > -1 ? pilih : '';
}
function renderRat() {
  const semua = S.ad.rat || [], st = S.st.rat;
  const th = $('rat-filter-tahun').value, stt = $('rat-filter-status').value, q = $('rat-cari').value.trim();
  const rows = semua.filter(function (r) { return (!th || r.TahunBuku === th) && (!stt || r.StatusRAT === stt) && cocok(r, ['NamaKKMP', 'Tempat', 'Kecamatan', 'Kelurahan'], q); });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('rat-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (r, i) {
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="sel-utama nowrap">' + esc(r.NamaKKMP) + '<span class="sel-sub">' + esc(r.Kelurahan) + ', ' + esc(r.Kecamatan) + '</span></td>' +
      '<td class="tc">' + esc(r.PelaksanaanKe) + '</td><td class="tc">' + esc(r.TahunBuku) + '</td><td class="nowrap">' + tglBln(r.TanggalRAT) + '</td><td>' + esc(r.Tempat) + '</td>' +
      '<td class="tc">' + lnStatus(r.StatusRAT) + '</td><td class="tc">' + lnStatus(r.LaporanRAT) + '</td><td class="tc">' + lnStatus(r.VerifikasiDinas) + '</td>' +
      '<td class="tc">' + tombolAksi('data-ubah-rat', 'data-hapus-rat', r.ID, 'RAT ' + r.NamaKKMP) + '</td></tr>';
  }).join('') : '<tr><td colspan="10" class="sel-kosong">' + (semua.length ? 'Data RAT tidak ditemukan.' : 'Belum ada data RAT. Pilih "Tambah Data RAT".') + '</td></tr>';
  $('rat-info').textContent = infoRentang(awal, st.per, rows.length, 'data');
  paginasi('rat-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderRat(); });
}
function formRat(id) {
  if (!S.koperasi.length) return toast('Tambahkan data koperasi terlebih dahulu.', true);
  const r = id ? (S.ad.rat || []).filter(function (x) { return x.ID === id; })[0] : null;
  $('rf-judul').textContent = r ? 'Ubah Pelaksanaan RAT' : 'Tambah Pelaksanaan RAT';
  $('rf-id').value = r ? r.ID : ''; opsiKoperasi($('rf-kop'), r ? r.IDKoperasi : '');
  $('rf-ke').value = r ? r.PelaksanaanKe : 1; $('rf-tahun').value = r ? r.TahunBuku : (+hariIni().slice(0, 4) - 1);
  $('rf-tanggal').value = r ? r.TanggalRAT : hariIni(); $('rf-tempat').value = r ? r.Tempat : '';
  $('rf-status').value = r ? r.StatusRAT : 'Sudah'; $('rf-laporan').value = r ? r.LaporanRAT : 'Sudah Dilaporkan'; $('rf-verif').value = r ? r.VerifikasiDinas : 'Belum';
  bukaDrawer('dr-rat');
}
function simpanRat(e) {
  e.preventDefault();
  try { wajibIsi(['rf-kop', 'rf-ke', 'rf-tahun', 'rf-tanggal', 'rf-tempat']); } catch (err) { return toast(err.message, true); }
  const d = { ID: $('rf-id').value, IDKoperasi: $('rf-kop').value, PelaksanaanKe: $('rf-ke').value, TahunBuku: $('rf-tahun').value, TanggalRAT: $('rf-tanggal').value,
    Tempat: $('rf-tempat').value.trim(), StatusRAT: $('rf-status').value, LaporanRAT: $('rf-laporan').value, VerifikasiDinas: $('rf-verif').value };
  const btn = $('rf-simpan'); sibuk(btn, true);
  panggil('simpanRAT', d).then(function (r) { gantiBaris(S.ad, 'rat', r); tandaiBasi(); isiTahunRat(); renderRat(); tutupDrawer(); toast(d.ID ? 'Data RAT diperbarui.' : 'Data RAT ditambahkan.'); })
    .catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusRat(id) {
  const r = (S.ad.rat || []).filter(function (x) { return x.ID === id; })[0]; if (!r) return;
  konfirmasi({ ikon: 'delete_forever', judul: 'Hapus Data Pelaksanaan RAT?', teks: 'Arsip pelaksanaan RAT untuk <b>' + esc(r.NamaKKMP) + '</b> beserta status laporannya akan dihapus permanen.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusRAT', id).then(function () { S.ad.rat = S.ad.rat.filter(function (x) { return x.ID !== id; }); tandaiBasi(); renderRat(); toast('Data RAT dihapus.'); }).catch(function (err) { toast(err.message, true); });
  });
}
// ===== AKHIR BLOK: M8_DATA_RAT =====


// ===== BLOK: M9_DATA_GERAI =====
S.st.ger = { hal: 1, per: 10 };
function muatGerai(paksa) {
  if (S.ad.gerai && !paksa) return renderGerai();
  $('ger-body').innerHTML = '<tr><td colspan="12" class="sel-memuat">Memuat data...</td></tr>';
  panggil('listGerai').then(function (d) { S.ad.gerai = d; renderGerai(); }).catch(function (e) { gagalTabel('ger-body', 12, e); });
}
function renderGerai() {
  const semua = S.ad.gerai || [], st = S.st.ger;
  const lh = $('ger-filter-lahan').value, vv = $('ger-filter-verval').value, q = $('ger-cari').value.trim();
  const rows = semua.filter(function (g) { return (!lh || g.StatusLahan === lh) && (!vv || g.StatusVerval === vv) && cocok(g, ['NamaKKMP', 'Kelurahan', 'Kecamatan', 'AlamatGedung'], q); });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('ger-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (g, i) {
    const p = Number(g.ProgresFisik) || 0;
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="sel-utama nowrap">' + esc(g.NamaKKMP) + '<span class="sel-sub">Kel. ' + esc(g.Kelurahan) + ', ' + esc(g.Kecamatan) + '</span></td>' +
      '<td class="tc nowrap">' + angka(g.LuasLahan) + ' m²</td><td class="tc nowrap">' + angka(g.LuasBangunan) + ' m²</td>' +
      '<td class="sel-trunc" title="' + esc(g.AlamatGedung) + '">' + esc(g.AlamatGedung) + '</td><td>' + selProgres(p, g.TahapPekerjaan) + '</td>' +
      '<td class="tc">' + lnSarpras(g.StatusSarpras, g) + '</td><td class="tc">' + lnStatus(g.StatusVerval) + '</td><td class="tc">' + lnStatus(g.LaporanSIMKOPDES) + '</td>' +
      '<td class="tc"><button type="button" class="btn btn-ikon btn-hantu btn-kecil" data-foto-ger="' + esc(g.ID) + '"' + (g.FotoURL ? '' : ' disabled') + ' aria-label="' + (g.FotoURL ? 'Lihat foto ' : 'Belum ada foto ') + esc(g.NamaKKMP) + '">' + ik('image') + '</button></td>' +
      '<td class="nowrap">' + tglBln(g.TerakhirDiperbarui) + '</td><td class="tc">' + tombolAksi('data-ubah-ger', 'data-hapus-ger', g.ID, 'gerai ' + g.NamaKKMP) + '</td></tr>';
  }).join('') : '<tr><td colspan="12" class="sel-kosong">' + (semua.length ? 'Data gerai tidak ditemukan.' : 'Belum ada data gerai. Pilih "Tambah Data Gerai".') + '</td></tr>';
  $('ger-info').textContent = infoRentang(awal, st.per, rows.length, 'data gerai');
  paginasi('ger-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderGerai(); });
}
// Status VERVAL & SARPRAS dibaca dari Hasil Verval (dihitung server); SIMKOPDES aktif hanya bila VERVAL = Sudah.
function statusOtomatisKop(idKop, g) {
  const sumber = g || (S.ad.gerai || []).filter(function (x) { return x.IDKoperasi === idKop; })[0];
  return sumber ? { verval: sumber.StatusVerval || 'Belum', sarpras: sumber.StatusSarpras || 'Belum', g: sumber } : { verval: 'Belum', sarpras: 'Belum', g: null };
}
function aturStatusOtomatisGf(g) {
  const st = statusOtomatisKop($('gf-kop').value, g && g.IDKoperasi === $('gf-kop').value ? g : null);
  $('gf-sarpras-auto').innerHTML = lnSarpras(st.sarpras, st.g);
  $('gf-verval-auto').innerHTML = lnStatus(st.verval);
  const sel = $('gf-simkopdes'), aktif = st.verval === 'Sudah';
  sel.disabled = !aktif;
  sel.value = aktif ? (S.gfSimkopdes === 'Sudah' ? 'Sudah' : 'Belum') : 'Belum';
  $('gf-simkopdes-bantu').textContent = aktif ? 'Verval sudah dinyatakan Sudah — status laporan SIMKOPDES dapat dipilih.' : 'Otomatis Belum. Pilihan aktif setelah Verval dinyatakan Sudah (hasil verval final tersimpan).';
}
function formGerai(id) {
  if (!S.koperasi.length) return toast('Tambahkan data koperasi terlebih dahulu.', true);
  const g = id ? (S.ad.gerai || []).filter(function (x) { return x.ID === id; })[0] : null;
  $('gf-id').value = g ? g.ID : ''; opsiKoperasi($('gf-kop'), g ? g.IDKoperasi : '');
  $('gf-lahan').value = g ? g.LuasLahan : ''; $('gf-bangunan').value = g ? g.LuasBangunan : '';
  $('gf-alamat').value = g ? g.AlamatGedung : ''; $('gf-lat').value = g ? g.Latitude : ''; $('gf-lng').value = g ? g.Longitude : '';
  $('gf-lahan-status').value = g ? g.StatusLahan : 'Terverifikasi'; $('gf-progres').value = g ? g.ProgresFisik : 0;
  $('gf-tahap').value = g ? g.TahapPekerjaan : ''; $('gf-catatan').value = g ? g.CatatanKendala : '';
  S.gfSimkopdes = g ? g.LaporanSIMKOPDES : 'Belum';
  aturStatusOtomatisGf(g);
  $('gf-foto').value = '';
  $('gf-foto-box').innerHTML = g && g.FotoURL ? '<img class="img-cover" src="' + esc(g.FotoURL) + '" alt="Foto dokumentasi saat ini">' : ik('image');
  $('gf-update').value = g && g.TerakhirDiperbarui ? g.TerakhirDiperbarui : hariIni();
  bukaDrawer('dr-gerai');
}
function simpanGer(e) {
  e.preventDefault();
  try { wajibIsi(['gf-kop', 'gf-lahan', 'gf-bangunan', 'gf-alamat', 'gf-progres']); } catch (err) { return toast(err.message, true); }
  const btn = $('gf-simpan'); sibuk(btn, true);
  bacaFile($('gf-foto'), 5, 'gambar').then(function (berkas) {
    const d = { ID: $('gf-id').value, IDKoperasi: $('gf-kop').value, LuasLahan: $('gf-lahan').value, LuasBangunan: $('gf-bangunan').value,
      AlamatGedung: $('gf-alamat').value.trim(), Latitude: $('gf-lat').value, Longitude: $('gf-lng').value, StatusLahan: $('gf-lahan-status').value, ProgresFisik: $('gf-progres').value,
      TahapPekerjaan: $('gf-tahap').value.trim(), CatatanKendala: $('gf-catatan').value.trim(), LaporanSIMKOPDES: $('gf-simkopdes').disabled ? 'Belum' : $('gf-simkopdes').value, berkas: berkas };
    return panggil('simpanGerai', d).then(function (r) { gantiBaris(S.ad, 'gerai', r); tandaiBasi(); renderGerai(); tutupDrawer(); toast(d.ID ? 'Data gerai diperbarui.' : 'Data gerai ditambahkan.'); });
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusGer(id) {
  const g = (S.ad.gerai || []).filter(function (x) { return x.ID === id; })[0]; if (!g) return;
  konfirmasi({ judul: 'Hapus Data Gerai?', sub: g.NamaKKMP, teks: 'Catatan data fisik dan verifikasi gerai <b>' + esc(g.NamaKKMP) + '</b> akan dihapus permanen.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusGerai', id).then(function () { S.ad.gerai = S.ad.gerai.filter(function (x) { return x.ID !== id; }); tandaiBasi(); renderGerai(); toast('Data gerai dihapus.'); }).catch(function (err) { toast(err.message, true); });
  });
}
// ===== AKHIR BLOK: M9_DATA_GERAI =====


// ===== BLOK: M10_KELOLA_BERITA =====
S.st.kb = { hal: 1, per: 10 };
function muatKb(paksa) {
  if (S.ad.berita && !paksa) return renderKb();
  $('kb-body').innerHTML = '<tr><td colspan="8" class="sel-memuat">Memuat data...</td></tr>';
  panggil('listBeritaAdmin').then(function (d) { S.ad.berita = d; renderKb(); }).catch(function (e) { gagalTabel('kb-body', 8, e); });
}
function renderKb() {
  const semua = S.ad.berita || [], st = S.st.kb;
  $('kb-total').textContent = angka(semua.length);
  $('kb-kategori').textContent = new Set(semua.map(function (b) { return b.Kategori; })).size;
  $('kb-terbit').textContent = semua.filter(function (b) { return b.Status === 'Terbit'; }).length;
  $('kb-draft').textContent = semua.filter(function (b) { return b.Status === 'Draft'; }).length;
  const kat = $('kb-filter-kategori').value, stt = $('kb-filter-status').value, q = $('kb-cari').value.trim();
  const rows = semua.filter(function (b) { return (!kat || b.Kategori === kat) && (!stt || b.Status === stt) && cocok(b, ['Judul', 'Ringkasan', 'Penulis'], q); });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('kb-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (b, i) {
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td>' + (b.GambarURL ? '<img class="thumb-tabel" src="' + esc(b.GambarURL) + '" alt="" loading="lazy">' : '<div class="thumb-tabel">' + ik('image') + '</div>') + '</td>' +
      '<td><span class="sel-utama">' + esc(b.Judul) + '</span><span class="sel-sub">' + (b.Unggulan === 'Ya' ? '★ Unggulan · ' : '') + esc(b.Ringkasan) + '</span></td>' +
      '<td class="nowrap">' + tglBln(b.TanggalTerbit) + '</td><td>' + lencana(b.Kategori, 'ln-netral') + '</td><td class="nowrap">' + esc(b.Penulis) + '</td>' +
      '<td class="tc">' + lnStatus(b.Status) + '</td><td class="tc">' + tombolAksi('data-ubah-kb', 'data-hapus-kb', b.ID, 'berita ' + b.Judul).replace('<div class="aksi-sel">', '<div class="aksi-sel"><button type="button" class="btn btn-ikon btn-hantu btn-kecil" data-salin-kb="' + esc(b.ID) + '" aria-label="Salin tautan langsung berita ' + esc(b.Judul) + '" title="Salin tautan langsung">' + ik('link') + '</button>') + '</td></tr>';
  }).join('') : '<tr><td colspan="8" class="sel-kosong">' + (semua.length ? 'Berita tidak ditemukan.' : 'Belum ada berita. Pilih "Tambah Berita".') + '</td></tr>';
  $('kb-info').textContent = infoRentang(awal, st.per, rows.length, 'entri');
  paginasi('kb-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderKb(); });
}
function formKb(id) {
  const b = id ? (S.ad.berita || []).filter(function (x) { return x.ID === id; })[0] : null;
  $('dr-brt-judul').textContent = b ? 'Ubah Warta Berita' : 'Tambah Warta Berita';
  $('bf-id').value = b ? b.ID : ''; $('bf-judul').value = b ? b.Judul : ''; $('bf-tanggal').value = b ? b.TanggalTerbit : hariIni();
  $('bf-kategori').value = b ? b.Kategori : S.pilihan.KategoriBerita[0];
  $('bf-caption').value = b ? b.KeteranganFoto : ''; $('bf-ringkasan').value = b ? b.Ringkasan : '';
  $('bf-isi').value = b ? b.IsiBerita : ''; $('bf-tagar').value = b ? b.Tagar : '';
  $('bf-penulis').value = b ? b.Penulis : $('ad-nama').textContent;
  $('bf-unggulan').value = b ? (b.Unggulan || 'Tidak') : 'Tidak'; $('bf-status').value = b ? b.Status : 'Terbit';
  $('bf-file').value = ''; $('bf-file-nama').textContent = b && b.GambarURL ? 'Ganti gambar sampul' : 'Unggah berkas baru';
  $('bf-thumb').innerHTML = b && b.GambarURL ? '<img class="img-cover" src="' + esc(b.GambarURL) + '" alt="Gambar sampul saat ini">' : ik('image');
  hitungRingkasan(); bukaDrawer('dr-berita');
}
function hitungRingkasan() { $('bf-hitung').textContent = $('bf-ringkasan').value.length + '/200'; }
function formatEditor(jenis) {
  const ta = $('bf-isi'), a = ta.selectionStart, z = ta.selectionEnd, pilih = ta.value.slice(a, z);
  let sisip;
  if (jenis === 'b') sisip = '<b>' + (pilih || 'teks tebal') + '</b>';
  else if (jenis === 'i') sisip = '<i>' + (pilih || 'teks miring') + '</i>';
  else if (jenis === 'ul') sisip = (a > 0 && ta.value[a - 1] !== '\n' ? '\n\n' : '') + (pilih || 'poin pertama\npoin kedua').split('\n').map(function (l) { return '- ' + l.replace(/^[-*•]\s/, ''); }).join('\n') + '\n\n';
  else {
    const url = window.prompt('Masukkan alamat tautan (diawali https://):', 'https://');
    if (!url || !/^https?:\/\//.test(url)) return;
    sisip = '<a href="' + url.replace(/"/g, '') + '">' + (pilih || url) + '</a>';
  }
  ta.setRangeText(sisip, a, z, 'end'); ta.focus();
}
function simpanKb(e) {
  e.preventDefault();
  try { wajibIsi(['bf-judul', 'bf-tanggal', 'bf-ringkasan', 'bf-isi']); } catch (err) { return toast(err.message, true); }
  const btn = $('bf-simpan'); sibuk(btn, true);
  bacaFile($('bf-file'), 2, 'gambar').then(function (berkas) {
    const d = { ID: $('bf-id').value, Judul: $('bf-judul').value.trim(), TanggalTerbit: $('bf-tanggal').value, Kategori: $('bf-kategori').value, KeteranganFoto: $('bf-caption').value.trim(),
      Ringkasan: $('bf-ringkasan').value.trim(), IsiBerita: $('bf-isi').value, Tagar: $('bf-tagar').value.trim(), Penulis: $('bf-penulis').value.trim(),
      Unggulan: $('bf-unggulan').value, Status: $('bf-status').value, berkas: berkas };
    return panggil('simpanBerita', d).then(function (r) { gantiBaris(S.ad, 'berita', r); tandaiBasi(); renderKb(); tutupDrawer(); toast(d.ID ? 'Berita diperbarui.' : 'Berita ditambahkan.'); });
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusKb(id) {
  const b = (S.ad.berita || []).filter(function (x) { return x.ID === id; })[0]; if (!b) return;
  konfirmasi({ ikon: 'delete_forever', judul: 'Hapus Warta Berita?', teks: 'Berita <b>' + esc(b.Judul) + '</b> akan dihapus permanen dan tidak lagi tampil di portal publik.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusBerita', id).then(function () { S.ad.berita = S.ad.berita.filter(function (x) { return x.ID !== id; }); tandaiBasi(); renderKb(); toast('Berita dihapus.'); }).catch(function (err) { toast(err.message, true); });
  });
}
// ===== AKHIR BLOK: M10_KELOLA_BERITA =====


// ===== BLOK: M11_KELOLA_PUSTAKA =====
S.st.kp = { hal: 1, per: 10 }; S.pfSumber = 'Unggah PDF';
function muatKp(paksa) {
  if (S.ad.pustaka && !paksa) return renderKp();
  $('kp-body').innerHTML = '<tr><td colspan="7" class="sel-memuat">Memuat data...</td></tr>';
  const btn = $('kp-sinkron'); btn.classList.add('berputar');
  panggil('listPustakaAdmin').then(function (d) { S.ad.pustaka = d; renderKp(); }).catch(function (e) { gagalTabel('kp-body', 7, e); }).then(function () { btn.classList.remove('berputar'); });
}
function renderKp() {
  const semua = S.ad.pustaka || [], st = S.st.kp;
  const mb = semua.reduce(function (t, p) { return t + (Number(p.UkuranMB) || 0); }, 0);
  $('kp-total').textContent = semua.length;
  $('kp-tampil').textContent = semua.filter(function (p) { return p.Status === 'Tampil'; }).length;
  $('kp-sembunyi').textContent = semua.filter(function (p) { return p.Status === 'Sembunyi'; }).length;
  $('kp-mb').textContent = (Math.round(mb * 10) / 10).toLocaleString('id-ID'); isiProgres($('kp-mb-bar'), mb / 500 * 100);
  const kat = $('kp-filter-kategori').value, stt = $('kp-filter-status').value, q = $('kp-cari').value.trim();
  const rows = semua.filter(function (p) { return (!kat || p.Kategori === kat) && (!stt || p.Status === stt) && cocok(p, ['JudulDokumen', 'Keterangan', 'Kategori'], q); });
  $('kp-terlihat').textContent = rows.length; $('kp-semua').textContent = semua.length;
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('kp-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (p, i) {
    const pdf = p.SumberBerkas === 'Unggah PDF';
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td><span class="sel-utama">' + esc(p.JudulDokumen) + '</span><span class="sel-sub">' + esc(p.Keterangan) + '</span></td>' +
      '<td>' + lencana(p.Kategori, 'ln-netral') + '</td><td class="nowrap">' + tglBln(p.TanggalDokumen) + '</td><td class="tc">' + lnStatus(p.Status) + '</td>' +
      '<td class="tc"><a class="btn btn-sekunder btn-kecil" href="' + esc(p.BerkasURL) + '" target="_blank" rel="noopener">' + ik(pdf ? 'picture_as_pdf' : 'link') + (p.UkuranMB ? esc(p.UkuranMB) + ' MB' : (pdf ? 'PDF' : 'Drive')) + '<span class="sr"> (tab baru)</span></a></td>' +
      '<td class="tc">' + tombolAksi('data-ubah-kp', 'data-hapus-kp', p.ID, 'dokumen ' + p.JudulDokumen) + '</td></tr>';
  }).join('') : '<tr><td colspan="7" class="sel-kosong">' + (semua.length ? 'Dokumen tidak ditemukan.' : 'Belum ada dokumen. Pilih "Tambah Dokumen".') + '</td></tr>';
  $('kp-info').textContent = infoRentang(awal, st.per, rows.length, 'arsip');
  paginasi('kp-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderKp(); });
}
function setSumber(s) {
  S.pfSumber = s;
  document.querySelectorAll('.pf-tab').forEach(function (t) { const a = t.getAttribute('data-sumber') === s; t.classList.toggle('aktif', a); t.setAttribute('aria-checked', a ? 'true' : 'false'); });
  $('pf-panel-unggah').hidden = s !== 'Unggah PDF'; $('pf-panel-drive').hidden = s === 'Unggah PDF';
}
function formKp(id) {
  const p = id ? (S.ad.pustaka || []).filter(function (x) { return x.ID === id; })[0] : null;
  $('dr-pus-judul').textContent = p ? 'Ubah Dokumen Pustaka' : 'Tambah Dokumen Pustaka';
  $('pf-id').value = p ? p.ID : ''; $('pf-judul').value = p ? p.JudulDokumen : ''; $('pf-kategori').value = p ? p.Kategori : '';
  $('pf-tanggal').value = p ? p.TanggalDokumen : hariIni(); $('pf-ket').value = p ? p.Keterangan : ''; $('pf-status').value = p ? p.Status : 'Tampil';
  $('pf-file').value = '';
  $('pf-file-nama').textContent = p && p.SumberBerkas === 'Unggah PDF' ? 'Berkas PDF tersimpan — pilih berkas baru untuk mengganti' : 'Tarik & lepaskan file PDF di sini';
  $('pf-link').value = p && p.SumberBerkas !== 'Unggah PDF' ? p.BerkasURL : ''; $('pf-ukuran').value = p && p.SumberBerkas !== 'Unggah PDF' ? p.UkuranMB : '';
  setSumber(p ? p.SumberBerkas : 'Unggah PDF'); bukaDrawer('dr-pustaka');
}
function simpanKp(e) {
  e.preventDefault();
  try {
    wajibIsi(['pf-judul', 'pf-kategori', 'pf-tanggal'].concat(S.pfSumber === 'Unggah PDF' ? [] : ['pf-link']));
    if (S.pfSumber === 'Unggah PDF' && !$('pf-file').files.length && !$('pf-id').value) throw new Error('Pilih berkas PDF yang akan diunggah.');
  } catch (err) { return toast(err.message, true); }
  const btn = $('pf-simpan'); sibuk(btn, true, 'Mengunggah...');
  (S.pfSumber === 'Unggah PDF' ? bacaFile($('pf-file'), 10, 'pdf') : Promise.resolve(null)).then(function (berkas) {
    const d = { ID: $('pf-id').value, JudulDokumen: $('pf-judul').value.trim(), Kategori: $('pf-kategori').value, TanggalDokumen: $('pf-tanggal').value, SumberBerkas: S.pfSumber,
      BerkasURL: $('pf-link').value.trim(), UkuranMB: $('pf-ukuran').value, Keterangan: $('pf-ket').value.trim(), Status: $('pf-status').value, berkas: berkas };
    return panggil('simpanPustaka', d).then(function (r) { gantiBaris(S.ad, 'pustaka', r); tandaiBasi(); renderKp(); tutupDrawer(); toast(d.ID ? 'Dokumen diperbarui.' : 'Dokumen ditambahkan.'); });
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusKp(id) {
  const p = (S.ad.pustaka || []).filter(function (x) { return x.ID === id; })[0]; if (!p) return;
  konfirmasi({ ikon: 'delete_forever', judul: 'Hapus Dokumen Pustaka?', teks: 'Dokumen <b>' + esc(p.JudulDokumen) + '</b> akan dihapus dari daftar pustaka portal.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusPustaka', id).then(function () { S.ad.pustaka = S.ad.pustaka.filter(function (x) { return x.ID !== id; }); tandaiBasi(); renderKp(); toast('Dokumen dihapus.'); }).catch(function (err) { toast(err.message, true); });
  });
}
// ===== AKHIR BLOK: M11_KELOLA_PUSTAKA =====


// ===== BLOK: M12_KONTEN_BERANDA =====
S.slEdit = '';
let aktifkanTabKonten = null;
const LABEL_CFG = { link_instagram: 'Link Instagram', link_youtube: 'Link YouTube', kib_api_url: 'URL Backend KIB Digital' };
const PLACEHOLDER_CFG = { link_instagram: 'https://www.instagram.com/namaakun', link_youtube: 'https://www.youtube.com/@kanal' };
function muatKonten(paksa) {
  if (!S.ringkasan) muatRingkasan(true).then(renderVisIg);
  if (S.ad.konten && !paksa) { renderKonten(); return; }
  $('kn-slider-list').innerHTML = '<div class="kartu skel skel-baris"></div>';
  $('kn-sinkron').textContent = 'Memuat';
  panggil('listKontenBeranda').then(function (d) { S.ad.konten = d; $('kn-sinkron').textContent = 'Terbaru'; renderKonten(); })
    .catch(function (e) { $('kn-sinkron').textContent = 'Gagal'; $('kn-slider-list').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>'; });
}
function renderKonten() {
  const k = S.ad.konten; if (!k) return;
  $('kn-jumlah').textContent = k.slider.length + ' Materi';
  $('kn-slider-list').innerHTML = k.slider.length ? k.slider.map(function (s) {
    const aktif = s.StatusTayang === 'Ya';
    return '<div class="item item-klik' + (s.ID === S.slEdit ? ' aktif' : '') + '" data-pilih-sl="' + esc(s.ID) + '">' +
      '<span class="item-kiri"><span class="item-no">' + esc(s.Urutan) + '</span><span class="item-thumb">' + gambar(s.GambarURL, '') + '</span>' +
      '<span class="item-kol"><span class="item-judul">' + esc(s.NamaSlider) + '</span><span class="item-sub">' + esc(s.JudulUtama) + '</span><span class="item-sub">Terkait: ' + esc(s.Terkait || '-') + '</span></span></span>' +
      (aktif ? lencana('Aktif', 'ln-sukses', 'check_circle') : lencana('Arsip', 'ln-netral', 'visibility_off')) + tombolAksi('data-ubah-sl', 'data-hapus-sl', s.ID, 'sorotan ' + s.NamaSlider) + '</div>';
  }).join('') : '<div class="kosong">Belum ada sorotan. Isi editor untuk menambah sorotan pertama.</div>';
  if (!S.slEdit && !$('sl-judul').value) formSlider(k.slider[0] ? k.slider[0].ID : ''); else pratinjauSlider();
  $('kn-ig-list').innerHTML = k.infografis.length ? k.infografis.map(function (f) {
    const pdf = f.JenisBerkas === 'PDF';
    return '<div class="berkas"><div class="berkas-ikon">' + (pdf ? ik('picture_as_pdf') : gambar(f.BerkasURL, '')) + '</div>' +
      '<div class="item-kol"><span class="item-judul">' + esc(f.Judul) + '</span><span class="item-sub">' + (pdf ? 'PDF' : 'Gambar') + ' · Urutan ' + esc(f.Urutan) + ' · ' + (f.StatusTayang === 'Ya' ? 'Tayang' : 'Arsip') + '</span>' +
      '<div class="berkas-aksi"><a class="tautan" href="' + esc(f.BerkasURL) + '" target="_blank" rel="noopener">Lihat<span class="sr"> ' + esc(f.Judul) + ' (tab baru)</span></a>' +
      '<button type="button" class="tautan" data-ubah-ig="' + esc(f.ID) + '">Ubah<span class="sr"> ' + esc(f.Judul) + '</span></button>' +
      '<button type="button" class="tautan teks-merah" data-hapus-ig="' + esc(f.ID) + '">Hapus<span class="sr"> ' + esc(f.Judul) + '</span></button></div></div></div>';
  }).join('') : '<div class="kosong-kecil">Belum ada infografis tersemat.</div>';
  renderVisIg();
  $('kn-cfg-body').innerHTML = k.pengaturan.map(function (c) {
    const idI = 'cfg-' + c.Kunci;
    const input = c.Kunci === 'maintenance_mode'
      ? '<select class="input input-ringkas" id="' + esc(idI) + '" data-kunci="maintenance_mode"><option value="Ya"' + (c.Nilai === 'Ya' ? ' selected' : '') + '>Aktif (mode pemeliharaan)</option><option value="Tidak"' + (c.Nilai !== 'Ya' ? ' selected' : '') + '>Tidak (portal tayang normal)</option></select>'
      : '<input class="input input-ringkas" id="' + esc(idI) + '" type="' + (c.Kunci === 'total_target_kelurahan' ? 'number' : /^link_/.test(c.Kunci) ? 'url' : 'text') + '" data-kunci="' + esc(c.Kunci) + '" value="' + esc(c.Nilai) + '" maxlength="500"' + (PLACEHOLDER_CFG[c.Kunci] ? ' placeholder="' + esc(PLACEHOLDER_CFG[c.Kunci]) + '"' : '') + '>';
    const label = LABEL_CFG[c.Kunci];
    return '<tr><td><label for="' + esc(idI) + '">' + (label ? '<span class="sel-utama">' + esc(label) + '</span><span class="sel-sub">' + esc(c.Kunci) + '</span>' : esc(c.Kunci)) + '</label></td><td>' + esc(c.Keterangan) + '</td><td>' + input + '</td></tr>';
  }).join('');
}
function renderVisIg() {
  const r = S.ringkasan; if (!r) return;
  const st = r.statistik, mx = Math.max(1, st.ratSudah, st.ratDraft, st.ratBelum);
  const batang = function (v, cls, lbl, maks) { return '<span class="mini-batang"><i class="' + cls + '" style="height:' + Math.round(v / maks * 80) + 'px"></i>' + esc(lbl) + ' (' + v + ')</span>'; };
  $('kn-vis-rat').innerHTML = '<div class="mini-batang-wadah">' + batang(st.ratSudah, 'mb-teal', 'Sudah', mx) + batang(st.ratDraft, 'mb-kuning', 'Draft', mx) + batang(st.ratBelum, '', 'Belum', mx) + '</div>';
  $('kn-ket-rat').textContent = 'Total ' + st.total + ' koperasi';
  const per = {};
  S.koperasi.forEach(function (k) { per[k.Kecamatan] = (per[k.Kecamatan] || 0) + 1; });
  const top = Object.keys(per).sort(function (a, b) { return per[b] - per[a]; }).slice(0, 4), mk = top.length ? per[top[0]] : 1;
  $('kn-vis-kop').innerHTML = top.length ? '<div class="mini-batang-wadah">' + top.map(function (k) { return batang(per[k], '', k.replace('Ternate ', 'T. ').replace('Pulau ', 'P. '), mk); }).join('') + '</div>' : '<span class="kosong-kecil">Belum ada data koperasi.</span>';
  $('kn-ket-kop').textContent = S.koperasi.length + ' koperasi terdata';
  $('kn-ket-gerai').textContent = st.selesai + '/' + st.target + ' gerai selesai';
}
function formSlider(id) {
  const s = id && S.ad.konten ? S.ad.konten.slider.filter(function (x) { return x.ID === id; })[0] : null;
  S.slEdit = s ? s.ID : '';
  $('sl-id').value = s ? s.ID : ''; $('sl-nama').value = s ? s.NamaSlider : ''; $('sl-kapsul').value = s ? s.LabelKapsul : '';
  $('sl-judul').value = s ? s.JudulUtama : ''; $('sl-sub').value = s ? s.SubJudul : ''; $('sl-terkait').value = s ? s.Terkait : '';
  $('sl-urutan').value = s ? s.Urutan : ((S.ad.konten ? S.ad.konten.slider.length : 0) + 1); $('sl-status').value = s ? s.StatusTayang : 'Ya';
  $('sl-file').value = ''; $('sl-file-nama').textContent = 'Pilih atau seret gambar';
  $('kn-editor-judul').textContent = s ? 'Editor Sorotan #' + s.Urutan : 'Editor Sorotan Baru';
  $('kn-editor-mode').textContent = s ? 'Mode Sunting' : 'Mode Tambah';
  S.slGambar = s ? s.GambarURL : '';
  document.querySelectorAll('[data-pilih-sl]').forEach(function (el) { el.classList.toggle('aktif', el.getAttribute('data-pilih-sl') === S.slEdit); });
  pratinjauSlider();
}
function pratinjauSlider() {
  $('kn-hero-bg').style.backgroundImage = 'url("' + (S.slGambar || ASET.hero).replace(/"/g, '%22') + '")';
  $('kn-pv-kapsul').textContent = $('sl-kapsul').value || 'Sorotan';
  $('kn-pv-judul').textContent = $('sl-judul').value || 'Judul utama sorotan';
  $('kn-pv-sub').textContent = $('sl-sub').value || 'Sub judul sorotan tampil di sini.';
}
function simpanSl(e) {
  e.preventDefault();
  try { wajibIsi(['sl-nama', 'sl-judul', 'sl-urutan']); } catch (err) { return toast(err.message, true); }
  const btn = $('sl-simpan'); sibuk(btn, true);
  bacaFile($('sl-file'), 3, 'gambar').then(function (berkas) {
    const d = { ID: $('sl-id').value, NamaSlider: $('sl-nama').value.trim(), LabelKapsul: $('sl-kapsul').value.trim(), JudulUtama: $('sl-judul').value.trim(),
      SubJudul: $('sl-sub').value.trim(), Terkait: $('sl-terkait').value.trim(), Urutan: $('sl-urutan').value, StatusTayang: $('sl-status').value, berkas: berkas };
    return panggil('simpanSlider', d).then(function (r) {
      gantiBaris(S.ad.konten, 'slider', r); S.ad.konten.slider.sort(function (a, b) { return (+a.Urutan || 0) - (+b.Urutan || 0); });
      tandaiBasi(); S.slEdit = r.ID; S.slGambar = r.GambarURL; renderKonten(); formSlider(r.ID);
      toast(d.ID ? 'Sorotan diperbarui.' : 'Sorotan baru ditambahkan.');
    });
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusSl(id) {
  const s = S.ad.konten.slider.filter(function (x) { return x.ID === id; })[0]; if (!s) return;
  konfirmasi({ ikon: 'delete_forever', judul: 'Hapus Sorotan Beranda?', teks: 'Sorotan <b>' + esc(s.NamaSlider) + '</b> akan dihapus dari beranda.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusSlider', id).then(function () {
      S.ad.konten.slider = S.ad.konten.slider.filter(function (x) { return x.ID !== id; }); tandaiBasi();
      if (S.slEdit === id) { S.slEdit = ''; formSlider(''); }
      renderKonten(); toast('Sorotan dihapus.');
    }).catch(function (err) { toast(err.message, true); });
  });
}
function formIg(id) {
  const f = id ? S.ad.konten.infografis.filter(function (x) { return x.ID === id; })[0] : null;
  $('if-id').value = f ? f.ID : ''; $('if-judul').value = f ? f.Judul : ''; $('if-ket').value = f ? f.Keterangan : ''; $('if-tautan').value = f ? (f.TautanURL || '') : '';
  $('if-urutan').value = f ? f.Urutan : (S.ad.konten.infografis.length + 1); $('if-status').value = f ? f.StatusTayang : 'Ya';
  $('if-file').value = ''; $('if-file-nama').textContent = f ? 'Berkas tersimpan — pilih berkas baru untuk mengganti' : 'Pilih gambar atau PDF';
  bukaDrawer('dr-infografis');
}
function simpanIg(e) {
  e.preventDefault();
  try {
    wajibIsi(['if-judul', 'if-urutan']); if (!$('if-id').value && !$('if-file').files.length) throw new Error('Pilih berkas infografis yang akan diunggah.');
    const tu = $('if-tautan').value.trim(); if (tu && !/^https:\/\/[^\s"'<>]+$/.test(tu)) { $('if-tautan').focus(); throw new Error('Tautan resmi harus berupa alamat lengkap yang diawali https://'); }
  }
  catch (err) { return toast(err.message, true); }
  const btn = $('if-simpan'); sibuk(btn, true, 'Mengunggah...');
  const f = $('if-file').files[0];
  bacaFile($('if-file'), 5, f && f.type === 'application/pdf' ? 'pdf' : 'gambar').then(function (berkas) {
    const d = { ID: $('if-id').value, Judul: $('if-judul').value.trim(), Keterangan: $('if-ket').value.trim(), TautanURL: $('if-tautan').value.trim(), Urutan: $('if-urutan').value, StatusTayang: $('if-status').value, berkas: berkas };
    return panggil('simpanInfografis', d).then(function (r) {
      gantiBaris(S.ad.konten, 'infografis', r); S.ad.konten.infografis.sort(function (a, b) { return (+a.Urutan || 0) - (+b.Urutan || 0); });
      tandaiBasi(); renderKonten(); tutupDrawer(); toast(d.ID ? 'Infografis diperbarui.' : 'Infografis ditambahkan.');
    });
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusIg(id) {
  const f = S.ad.konten.infografis.filter(function (x) { return x.ID === id; })[0]; if (!f) return;
  konfirmasi({ ikon: 'delete_forever', judul: 'Hapus Infografis?', teks: 'Infografis <b>' + esc(f.Judul) + '</b> tidak akan tampil lagi di beranda.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusInfografis', id).then(function () { S.ad.konten.infografis = S.ad.konten.infografis.filter(function (x) { return x.ID !== id; }); tandaiBasi(); renderKonten(); toast('Infografis dihapus.'); }).catch(function (err) { toast(err.message, true); });
  });
}
function simpanCfg(btn) {
  const nilai = {};
  document.querySelectorAll('#kn-cfg-body [data-kunci]').forEach(function (el) { nilai[el.getAttribute('data-kunci')] = el.value; });
  const tombol = document.querySelectorAll('.btn-simpan-cfg');
  tombol.forEach(function (b) { b.disabled = true; }); sibuk(btn, true);
  panggil('simpanPengaturan', nilai).then(function (rows) {
    S.ad.konten.pengaturan = rows; rows.forEach(function (r) { S.cfg[r.Kunci] = r.Nilai; });
    isiCfg(); isiTautanSosial(); tandaiBasi(); toast('Pengaturan portal disimpan.');
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); tombol.forEach(function (b) { b.disabled = false; }); });
}
// ===== AKHIR BLOK: M12_KONTEN_BERANDA =====


// ===== BLOK: M13_PESAN_MASUK =====
S.psPilih = '';
function muatPesan(paksa, pilihId) {
  if (pilihId) S.psPilih = pilihId;
  if (S.ad.pesan && !paksa) { renderPesan(); if (pilihId) pilihPesan(pilihId); return; }
  $('ps-list').innerHTML = '<div class="kartu skel skel-baris"></div><div class="kartu skel skel-baris"></div>';
  const btn = $('ps-refresh'); btn.classList.add('berputar');
  panggil('listPesan').then(function (d) {
    S.ad.pesan = d; renderPesan();
    if (S.psPilih && d.some(function (p) { return p.ID === S.psPilih; })) pilihPesan(S.psPilih); else tampilDetailPesan(null);
  }).catch(function (e) { $('ps-list').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>'; }).then(function () { btn.classList.remove('berputar'); });
}
function renderPesan() {
  const semua = S.ad.pesan || [], hit = function (s) { return semua.filter(function (p) { return p.Status === s; }).length; };
  $('ps-total').textContent = semua.length; $('ps-baru').textContent = hit('Baru'); $('ps-dibaca').textContent = hit('Dibaca'); $('ps-tanggap').textContent = hit('Ditanggapi');
  const f = $('ps-filter').value, q = $('ps-cari').value.trim();
  const rows = semua.filter(function (p) { return (!f || p.Status === f) && cocok(p, ['NamaLengkap', 'Subjek', 'IsiPesan', 'Email', 'NamaKKMP'], q); });
  $('ps-hitung').textContent = rows.length + ' pesan · ' + hit('Baru') + ' baru';
  $('ps-list').innerHTML = rows.length ? rows.map(function (p) {
    const baru = p.Status === 'Baru';
    return '<button type="button" role="listitem" class="item item-klik ps-item' + (baru ? ' baru' : '') + (p.ID === S.psPilih ? ' aktif' : '') + '" data-ps="' + esc(p.ID) + '"' + (p.ID === S.psPilih ? ' aria-current="true"' : '') + '>' +
      '<span class="ps-item-atas"><span class="item-judul">' + esc(p.NamaLengkap) + '</span>' + lnStatus(p.Status) + '</span>' +
      '<span class="ps-item-subjek">' + esc(p.Subjek) + '</span><span class="item-sub">' + esc(p.NamaKKMP || 'Masyarakat umum') + ' · ' + esc(waktuWIT(p.Dibuat)) + '</span></button>';
  }).join('') : '<div class="kosong-kecil">' + (semua.length ? 'Pesan tidak ditemukan.' : 'Belum ada pesan masuk dari formulir kontak.') + '</div>';
}
function pilihPesan(id) {
  const p = (S.ad.pesan || []).filter(function (x) { return x.ID === id; })[0];
  S.psPilih = p ? id : '';
  document.querySelectorAll('.ps-item').forEach(function (el) { const a = el.getAttribute('data-ps') === S.psPilih; el.classList.toggle('aktif', a); if (a) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current'); });
  tampilDetailPesan(p);
  if (p && p.Status === 'Baru') {
    panggil('ubahStatusPesan', id, 'Dibaca').then(function (r) { gantiBaris(S.ad, 'pesan', r); S.ringkasan = null; renderPesan(); $('ps-status').value = r.Status; }).catch(function (err) { toast(err.message, true); });
  }
}
function tampilDetailPesan(p) {
  $('ps-detail').hidden = !p; $('ps-kosong').hidden = !!p;
  if (!p) return;
  $('ps-avatar').textContent = inisial(p.NamaLengkap); $('ps-nama').textContent = p.NamaLengkap;
  $('ps-peran').textContent = p.NamaKKMP ? 'Pengurus KKMP' : 'Masyarakat umum';
  $('ps-email').textContent = p.Email; $('ps-telp').textContent = p.Telepon || '-'; $('ps-waktu').textContent = waktuWIT(p.Dibuat);
  $('ps-subjek').textContent = p.Subjek; $('ps-entitas').textContent = p.NamaKKMP || 'Masyarakat umum'; $('ps-isi').textContent = p.IsiPesan;
  $('ps-status').value = p.Status === 'Baru' ? 'Dibaca' : p.Status;
  $('ps-balas').href = 'mailto:' + encodeURIComponent(p.Email) + '?subject=' + encodeURIComponent('Re: ' + p.Subjek) + '&body=' + encodeURIComponent('Yth. ' + p.NamaLengkap + ',\n\n\n\nHormat kami,\nTim PMO KKMP Kota Ternate');
}
function simpanStatusPesan() {
  if (!S.psPilih) return;
  const btn = $('ps-simpan'); sibuk(btn, true);
  panggil('ubahStatusPesan', S.psPilih, $('ps-status').value).then(function (r) { gantiBaris(S.ad, 'pesan', r); S.ringkasan = null; renderPesan(); toast('Perubahan status berhasil disimpan.'); })
    .catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function hapusPesanIni() {
  const id = S.psPilih; if (!id) return;
  konfirmasi({ judul: 'Hapus Pesan?', sub: 'Tindakan ini bersifat permanen', teks: 'Pesan ini akan dihapus dari basis data dan tidak dapat dikembalikan.', tombol: 'Ya, Hapus Permanen' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusPesan', id).then(function () { S.ad.pesan = S.ad.pesan.filter(function (x) { return x.ID !== id; }); S.psPilih = ''; S.ringkasan = null; renderPesan(); tampilDetailPesan(null); toast('Pesan dihapus.'); })
      .catch(function (err) { toast(err.message, true); });
  });
}
// ===== AKHIR BLOK: M13_PESAN_MASUK =====


// ===== BLOK: ASISTEN_DATA =====
// Asisten berbasis aturan: seluruh jawaban dihitung dari data publikDashboard, tanpa layanan AI.
let fokusAsisten = null;
function bukaAsisten() {
  fokusAsisten = document.activeElement;
  $('asisten').hidden = false;
  document.querySelectorAll('[data-asisten]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
  setTimeout(function () { $('as-input').focus(); }, 60);
  if (!$('as-log').children.length) {
    pesanAsisten('<b>Halo!</b> Saya membantu merangkum data monitoring KKMP. Pilih topik cepat, atur filter wilayah, atau tulis pertanyaan seperti <i>"progres gerai Ternate Utara"</i>.');
  }
  ambilDashboard().then(isiFilterAsisten).catch(function (e) { pesanAsisten(e.message === 'MAINTENANCE' ? 'Portal sedang dalam pemeliharaan, data belum dapat dianalisis.' : 'Data belum dapat dimuat: ' + esc(e.message)); });
}
function tutupAsisten() {
  if ($('asisten').hidden) return;
  $('asisten').hidden = true;
  document.querySelectorAll('[data-asisten]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  if (fokusAsisten && fokusAsisten.focus) fokusAsisten.focus();
}
function isiFilterAsisten() {
  const d = S.pub.dashboard; if (!d || d === 'memuat') return;
  const kec = $('as-kec').value;
  if ($('as-kec').options.length <= 1) isiOpsi($('as-kec'), d.kecamatan, '<option value="">Semua kecamatan</option>');
  $('as-kec').value = kec;
  const kel = d.koperasi.filter(function (k) { return !kec || k.Kecamatan === kec; }).map(function (k) { return { v: k.ID, l: k.Kelurahan + ' (' + k.NamaKKMP + ')' }; })
    .sort(function (a, b) { return a.l.localeCompare(b.l); });
  const pilih = $('as-kel').value;
  isiOpsi($('as-kel'), kel, '<option value="">Semua kelurahan</option>');
  $('as-kel').value = kel.some(function (x) { return x.v === pilih; }) ? pilih : '';
}
function pesanAsisten(html, pengguna) {
  const el = document.createElement('div');
  el.className = 'as-pesan ' + (pengguna ? 'as-pengguna' : 'as-asisten');
  el.innerHTML = html;
  $('as-log').appendChild(el);
  $('as-log').scrollTop = $('as-log').scrollHeight;
}
function cakupanAsisten(kecPaksa, kelPaksa) {
  const d = S.pub.dashboard;
  const kec = kecPaksa !== undefined ? kecPaksa : $('as-kec').value, kelId = kelPaksa !== undefined ? kelPaksa : $('as-kel').value;
  const kop = d.koperasi.filter(function (k) { return (!kec || k.Kecamatan === kec) && (!kelId || k.ID === kelId); });
  const ids = {}; kop.forEach(function (k) { ids[k.ID] = 1; });
  const gerai = d.gerai.filter(function (g) { return ids[g.IDKoperasi]; });
  const label = kelId && kop[0] ? 'Kelurahan ' + kop[0].Kelurahan + ' (' + kop[0].NamaKKMP + ')' : kec ? 'Kecamatan ' + kec : 'seluruh Kota Ternate';
  return { kop: kop, gerai: gerai, label: label, kec: kec, kel: kelId };
}
function daftarNama(arr, maks) {
  if (!arr.length) return '';
  return '<ul>' + arr.slice(0, maks || 5).map(function (x) { return '<li>' + x + '</li>'; }).join('') + (arr.length > (maks || 5) ? '<li>…dan ' + (arr.length - (maks || 5)) + ' lainnya</li>' : '') + '</ul>';
}
function jawabAsisten(topik, c) {
  const n = c.kop.length;
  if (!n) return 'Belum ada data koperasi untuk ' + esc(c.label) + '.';
  const hit = function (f) { return c.kop.filter(f).length; };
  const bh = hit(function (k) { return k.BerbadanHukum === 'Ya'; }), nib = hit(function (k) { return k.MemilikiNIB === 'Ya'; }),
    npwp = hit(function (k) { return k.MemilikiNPWP === 'Ya'; }), akun = hit(function (k) { return k.MemilikiAkun === 'Ya'; });
  const sudah = hit(function (k) { return k.StatusRAT === 'Sudah'; }), draft = hit(function (k) { return k.StatusRAT === 'Draft'; }), belum = n - sudah - draft;
  const prog = c.gerai.map(function (g) { return Number(g.ProgresFisik) || 0; });
  const rata = prog.length ? Math.round(prog.reduce(function (a, b) { return a + b; }, 0) / prog.length) : 0;
  const selesai = prog.filter(function (p) { return p >= 100; }).length;
  const rendah = c.gerai.filter(function (g) { return (Number(g.ProgresFisik) || 0) < 50; }).sort(function (a, b) { return a.ProgresFisik - b.ProgresFisik; });
  const vervalProses = c.gerai.filter(function (g) { return g.StatusVerval !== 'Sudah'; });
  const simBelum = c.gerai.filter(function (g) { return g.LaporanSIMKOPDES !== 'Sudah'; });
  const L = '<b>' + esc(c.label) + '</b>';
  if (topik === 'ringkasan') {
    return 'Ringkasan perkembangan ' + L + ':<ul>' +
      '<li><b>' + n + '</b> koperasi terdata; berbadan hukum ' + persen(pct(bh, n)) + ', NIB ' + persen(pct(nib, n)) + ', NPWP ' + persen(pct(npwp, n)) + '.</li>' +
      '<li>RAT: <b>' + sudah + '</b> sudah, ' + draft + ' draft, ' + belum + ' belum (' + persen(pct(sudah, n)) + ' terlaksana).</li>' +
      '<li>Gerai: ' + prog.length + ' tercatat, rata-rata progres <b>' + rata + '%</b>, ' + selesai + ' selesai 100%.</li></ul>';
  }
  if (topik === 'wilayah') {
    if (c.kel) {
      const k = c.kop[0], g = c.gerai[0];
      return L + ' (Kecamatan ' + esc(k.Kecamatan) + '):<ul><li>Badan hukum: ' + esc(k.BerbadanHukum) + ' · NIB: ' + esc(k.MemilikiNIB) + ' · NPWP: ' + esc(k.MemilikiNPWP) + ' · Akun: ' + esc(k.MemilikiAkun) + '</li>' +
        '<li>Status RAT terakhir: <b>' + esc(k.StatusRAT) + '</b></li>' +
        '<li>' + (g ? 'Gerai: progres <b>' + esc(g.ProgresFisik) + '%</b>' + (g.TahapPekerjaan ? ' (' + esc(g.TahapPekerjaan) + ')' : '') + ', verval ' + esc(g.StatusVerval) : 'Belum ada data pembangunan gerai.') + '</li></ul>';
    }
    if (c.kec) return jawabAsisten('ringkasan', c);
    const kec = (S.pub.kecStat || statKecamatan(S.pub.dashboard)).filter(function (p) { return p.kop; }).sort(function (a, b) { return b.kop - a.kop; });
    return 'Sebaran koperasi per kecamatan:' + daftarNama(kec.map(function (p) { return '<b>' + esc(p.nama) + '</b>: ' + p.kop + ' koperasi, NIB ' + persen(pct(p.nib, p.kop)) + ', RAT ' + persen(pct(p.ratSudah, p.kop)) + ', gerai ' + p.rataProgres + '%'; }), 8) +
      'Pilih kecamatan atau kelurahan pada filter untuk rincian.';
  }
  if (topik === 'gerai') {
    return 'Progres pembangunan gerai ' + L + ': rata-rata <b>' + rata + '%</b>, ' + selesai + ' dari ' + prog.length + ' gerai selesai.' +
      (rendah.length ? ' Progres di bawah 50%:' + daftarNama(rendah.map(function (g) { return esc(g.NamaKKMP) + ' — ' + esc(g.ProgresFisik) + '%' + (g.CatatanKendala ? ' (' + esc(g.CatatanKendala) + ')' : ''); })) : ' Tidak ada gerai dengan progres di bawah 50%.') +
      (vervalProses.length ? 'Belum tuntas verval: <b>' + vervalProses.length + '</b> gerai.' : '');
  }
  if (topik === 'rat') {
    const daftarBelum = c.kop.filter(function (k) { return k.StatusRAT !== 'Sudah'; }).map(function (k) { return esc(k.NamaKKMP) + ' — ' + esc(k.StatusRAT); });
    return 'Perkembangan RAT ' + L + ': <b>' + sudah + '</b> sudah (' + persen(pct(sudah, n)) + '), ' + draft + ' sedang/draft, ' + belum + ' belum.' +
      (daftarBelum.length ? ' Koperasi yang belum tuntas RAT:' + daftarNama(daftarBelum) : ' Seluruh koperasi telah melaksanakan RAT.');
  }
  if (topik === 'administrasi') {
    const kurang = c.kop.map(function (k) {
      const x = []; if (k.BerbadanHukum !== 'Ya') x.push('badan hukum'); if (k.MemilikiNIB !== 'Ya') x.push('NIB'); if (k.MemilikiNPWP !== 'Ya') x.push('NPWP'); if (k.MemilikiAkun !== 'Ya') x.push('akun sistem');
      return x.length ? esc(k.NamaKKMP) + ': belum ' + x.join(', ') : '';
    }).filter(String);
    return 'Kelengkapan administrasi ' + L + ':<ul><li>Berbadan hukum: ' + bh + '/' + n + ' (' + persen(pct(bh, n)) + ')</li><li>NIB: ' + nib + '/' + n + ' (' + persen(pct(nib, n)) + ')</li>' +
      '<li>NPWP: ' + npwp + '/' + n + ' (' + persen(pct(npwp, n)) + ')</li><li>Akun sistem: ' + akun + '/' + n + ' (' + persen(pct(akun, n)) + ')</li></ul>' +
      (kurang.length ? 'Perlu dilengkapi:' + daftarNama(kurang) : 'Seluruh koperasi telah lengkap administrasinya.');
  }
  if (topik === 'rekomendasi') {
    const r = [];
    if (belum + draft) r.push('Jadwalkan pendampingan RAT untuk <b>' + (belum + draft) + '</b> koperasi yang belum tuntas, prioritaskan yang berstatus "Belum".');
    if (n - nib) r.push('Fasilitasi pengurusan NIB melalui OSS untuk <b>' + (n - nib) + '</b> koperasi.');
    if (n - bh) r.push('Percepat pengesahan badan hukum untuk <b>' + (n - bh) + '</b> koperasi.');
    if (n - npwp) r.push('Koordinasikan penerbitan NPWP untuk <b>' + (n - npwp) + '</b> koperasi.');
    if (rendah.length) r.push('Lakukan monitoring lapangan pada <b>' + rendah.length + '</b> gerai dengan progres di bawah 50%, terutama ' + esc(rendah[0].NamaKKMP) + ' (' + esc(rendah[0].ProgresFisik) + '%).');
    if (vervalProses.length) r.push('Selesaikan verifikasi & validasi lapangan untuk <b>' + vervalProses.length + '</b> gerai.');
    if (simBelum.length) r.push('Ingatkan pelaporan SIMKOPDES untuk <b>' + simBelum.length + '</b> gerai.');
    return 'Rekomendasi tindak lanjut untuk ' + L + ':' + (r.length ? '<ul>' + r.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : ' seluruh indikator sudah terpenuhi. Pertahankan pemantauan berkala.') +
      '<span class="as-sumber">Rekomendasi disusun dari aturan sederhana atas data monitoring; sesuaikan dengan kondisi lapangan.</span>';
  }
  return '';
}
function tanyaAsisten(topik, teksPengguna) {
  pesanAsisten(esc(teksPengguna), true);
  ambilDashboard().then(function () {
    isiFilterAsisten();
    const d = S.pub.dashboard;
    let kec, kel;
    if (topik === 'bebas') {
      const q = teksPengguna.toLowerCase();
      const k = d.koperasi.filter(function (x) { return q.indexOf(x.Kelurahan.toLowerCase()) > -1 || q.indexOf(x.NamaKKMP.toLowerCase()) > -1; })[0];
      const kc = d.kecamatan.filter(function (x) { return q.indexOf(x.toLowerCase()) > -1; })[0];
      if (k) { kec = k.Kecamatan; kel = k.ID; } else if (kc) { kec = kc; kel = ''; }
      topik = /gerai|bangun|fisik|gedung/.test(q) ? 'gerai' : /\brat\b|rapat/.test(q) ? 'rat' : /nib|npwp|akun|hukum|legal|administrasi/.test(q) ? 'administrasi'
        : /rekomendasi|saran|tindak|prioritas/.test(q) ? 'rekomendasi' : /ringkas|perkembangan|umum|ringkasan/.test(q) ? 'ringkasan' : (k || kc) ? 'wilayah' : '';
      if (!topik) {
        pesanAsisten('Maaf, saya belum memahami pertanyaan itu. Saya dapat menjawab topik: ringkasan perkembangan, info wilayah (sebut nama kecamatan/kelurahan), progres gerai, perkembangan RAT, kelengkapan administrasi, dan rekomendasi tindak lanjut.');
        return;
      }
    }
    const c = cakupanAsisten(kec, kel);
    pesanAsisten(jawabAsisten(topik, c) + '<span class="as-sumber">Sumber: data monitoring per ' + esc(tglUpdate(d.statistik.lastUpdate)) + '.</span>');
  }).catch(function (e) { pesanAsisten('Data belum dapat dimuat: ' + esc(e.message)); });
}
// ===== AKHIR BLOK: ASISTEN_DATA =====


// ===== BLOK: M14_HASIL_VERVAL (PRIVAT) =====
// IKON_LAIN:add_circle,sync,content_copy,table_view,upload_file,attach_file,picture_as_pdf,download,photo_library,sticky_note_2,open_in_full,image_not_supported,bar_chart,donut_large,verified,rule,cancel,task_alt,draft,block,check_circle,pending,add_a_photo,error,visibility,edit,delete,add_task,close
// Semua data & foto diambil lewat API yang diperiksa sesinya di server. Menu yang disembunyikan di sini
// hanya kenyamanan tampilan; pembatasan sebenarnya ada di backend (cekSesi per peran).
const AKSES_AD = {
  ringkasan: ['Admin'], koperasi: ['Admin', 'Akses Monitoring'], rat: ['Admin'], gerai: ['Admin'], berita: ['Admin'], pustaka: ['Admin'], konten: ['Admin'], pesan: ['Admin'], pengguna: ['Admin'],
  'verval-rekap': ['Admin', 'Petugas Verval', 'Akses Monitoring'], 'verval-daftar': ['Admin', 'Petugas Verval', 'Akses Monitoring'],
  'verval-detail': ['Admin', 'Petugas Verval', 'Akses Monitoring'], 'verval-input': ['Admin', 'Petugas Verval']
};
function bolehAd(nama) { return (AKSES_AD[nama] || []).indexOf(S.peran) > -1; }
function terapkanAksesMenu() {
  document.querySelectorAll('#ad-nav [data-ad]').forEach(function (a) { a.hidden = !bolehAd(a.getAttribute('data-ad')); });
  // judul grup menu tampil hanya bila ada menu di bawahnya yang boleh dibuka
  document.querySelectorAll('#ad-nav [data-akses="grup"]').forEach(function (lab) {
    let n = lab.nextElementSibling, ada = false;
    while (n && !n.classList.contains('ad-menu-label')) { if (!n.hidden) ada = true; n = n.nextElementSibling; }
    lab.hidden = !ada;
  });
  // Data Koperasi: Akses Monitoring hanya melihat & mengunduh (tanpa impor/tambah/ubah/hapus)
  const kelolaKop = S.peran === 'Admin';
  ['kop-impor', 'kop-tambah'].forEach(function (id) { $(id).hidden = !kelolaKop; });
  $('ad-koperasi').classList.toggle('baca-saja', !kelolaKop);
  document.querySelectorAll('[data-ad="verval-input"]').forEach(function (a) { if (!a.closest('#ad-nav')) a.hidden = !bolehAd('verval-input'); });
}
const KES_KELAS = { 'Layak Digunakan': ['ln-sukses', 'verified', 'kes-layak'], 'Layak Digunakan dengan Catatan': ['ln-perhatian', 'rule', 'kes-catatan'], 'Belum Layak': ['ln-bahaya', 'cancel', 'kes-belum'] };
function lnKes(v, besar) { const k = KES_KELAS[v]; return k ? lencana(v, k[0] + (besar ? ' lencana-besar' : ''), k[1]) : lencana('Belum ada kesimpulan', 'ln-netral'); }
function lnData(v) { return v === 'Final' ? lencana('Final', 'ln-info', 'task_alt') : lencana('Draft', 'ln-netral', 'draft'); }
function lnVrvStatus(v, baik) { if (!v) return lencana('Belum diisi', 'ln-netral'); return v === baik ? lencana(v, 'ln-sukses', 'check_circle') : lencana(v, 'ln-bahaya', 'cancel'); }
function pctTeks(a, b) { return b ? Math.round(a / b * 100) + '%' : '-'; }
function ringkasBagian(x) { return '<span class="teks-kecil"><b>' + x.baik + '</b>/' + x.total + '</span>'; }
S.vrv = { daftar: null, fotoCache: {}, antrean: [], aktifUnduh: 0, info: {}, blob: {} };
S.st.vrd = { hal: 1, per: 10 }; S.st.vrk = { hal: 1, per: 10 };

function muatDaftarVerval(paksa) {
  if (S.vrv.daftar && !paksa) return Promise.resolve(S.vrv.daftar);
  return panggil('listVerval').then(function (d) { S.vrv.daftar = d; return d; });
}

// ---------- Rekapitulasi (capaian per KKMP) ----------
// Sumber data: hasil verval FINAL terakhir per KKMP (draft & pemeriksaan lama tidak dihitung ulang).
const TL_VRV = [
  { k: 'belum', label: 'Belum Ditindaklanjuti', warna: 'var(--tl-belum)' },
  { k: 'proses', label: 'Dalam Proses Perbaikan', warna: 'var(--tl-proses)' },
  { k: 'selesai', label: 'Selesai Ditindaklanjuti', warna: 'var(--tl-selesai)' }
];
// Aspek pemeriksaan untuk rincian temuan (kunci = bagian data hasil verval).
const ASPEK_VRV = [
  { k: 'administrasi', label: 'Pemeriksaan Administratif' },
  { k: 'fisik', label: 'Pemeriksaan Fisik' },
  { k: 'sarpras', label: 'Kelengkapan Sarana dan Prasarana' },
  { k: 'dokumentasi', label: 'Dokumentasi Foto' }
];
const SERI_FISIK = [{ k: 'struktur', label: 'Struktur / Arsitektur', warna: 'var(--g-seri-1)' }, { k: 'mep', label: 'Mekanikal, Elektrikal & Plumbing (MEP)', warna: 'var(--g-seri-2)' }];
const SERI_SARPRAS = [{ k: 'sarana', label: 'Sarana dan Prasarana', warna: 'var(--g-seri-1)' }, { k: 'kendaraan', label: 'Kendaraan Operasional', warna: 'var(--g-seri-2)' }];
function muatRekapVerval(paksa) {
  const btn = $('vrk-muat'); btn.classList.add('berputar');
  Promise.all([muatDaftarVerval(paksa), muatSiapVerval().catch(function () { S.vrvSiap = {}; })]).then(renderRekapVerval)
    .catch(function (e) { gagalTabel('vrk-body', 6, e); })
    .then(function () { btn.classList.remove('berputar'); });
}
function kecDenganVerval(daftar) {
  const ada = {};
  daftar.forEach(function (v) { if (v.Kecamatan && v.Kecamatan !== '-') ada[v.Kecamatan] = true; });
  return S.pilihan.Kecamatan.filter(function (k) { return ada[k]; }).concat(Object.keys(ada).filter(function (k) { return S.pilihan.Kecamatan.indexOf(k) === -1; }).sort());
}
function isiKecFilter(id, daftarKec, label) {
  const sel = $(id), v = sel.value;
  isiOpsi(sel, daftarKec, '<option value="">' + (daftarKec.length ? label : 'Belum ada data') + '</option>');
  sel.value = daftarKec.indexOf(v) > -1 ? v : '';
  return sel;
}
function terakhirFinal(periode) {
  const m = {};
  (S.vrv.daftar || []).forEach(function (v) {
    if (v.StatusData !== 'Final' || (periode && v.Periode !== periode)) return;
    const lama = m[v.IDKoperasi];
    if (!lama || (v.TanggalPemeriksaan + v.TerakhirDiperbarui) > (lama.TanggalPemeriksaan + lama.TerakhirDiperbarui)) m[v.IDKoperasi] = v;
  });
  return m;
}
function isiFilterRekap() {
  const fin = (S.vrv.daftar || []).filter(function (v) { return v.StatusData === 'Final'; });
  const per = Array.from(new Set(fin.map(function (v) { return v.Periode; }).filter(String))).sort();
  const sp = isiKecFilter('vrk-periode', per, 'Semua Periode'); sp.disabled = !per.length;
  const akhir = terakhirFinal($('vrk-periode').value), daftar = Object.keys(akhir).map(function (k) { return akhir[k]; });
  const kec = kecDenganVerval(daftar);
  const sk = isiKecFilter('vrk-kec', kec, 'Seluruh KKMP Kota Ternate'); sk.disabled = !kec.length;
  const kecPilih = sk.value, sel = $('vrk-kel'), v = sel.value;
  const kop = S.koperasi.filter(function (k) { return akhir[k.ID] && (!kecPilih || k.Kecamatan === kecPilih); })
    .sort(function (a, b) { return a.Kelurahan.localeCompare(b.Kelurahan); }).map(function (k) { return { v: k.ID, l: 'Kel. ' + k.Kelurahan + ' — ' + k.NamaKKMP }; });
  isiOpsi(sel, kop, '<option value="">' + (kop.length ? 'Semua Kelurahan / KKMP' : 'Belum ada data') + '</option>');
  sel.value = kop.some(function (x) { return x.v === v; }) ? v : ''; sel.disabled = !kop.length;
  return akhir;
}
function pctAngka(a, b) { return b ? Math.round(a / b * 1000) / 10 : 0; }
function teksPct(n) { return (Math.round(n * 10) / 10).toLocaleString('id-ID') + '%'; }
function renderRekapVerval() {
  const akhir = isiFilterRekap();
  const kecPilih = $('vrk-kec').value, kopPilih = $('vrk-kel').value;
  const kopCakupan = S.koperasi.filter(function (k) { return (!kecPilih || k.Kecamatan === kecPilih) && (!kopPilih || k.ID === kopPilih); });
  const cakupan = kopCakupan.filter(function (k) { return akhir[k.ID]; }).map(function (k) { return akhir[k.ID]; })
    .sort(function (a, b) { return (a.Kecamatan + a.Kelurahan).localeCompare(b.Kecamatan + b.Kelurahan); });
  // ringkasan
  const siap = kopCakupan.filter(function (k) { return (S.vrvSiap || {})[k.ID]; }).length;
  const hit = function (kes) { return cakupan.filter(function (a) { return a.Kesimpulan === kes; }).length; };
  $('vrk-sudah').textContent = angka(cakupan.length); $('vrk-sudah-ket').textContent = 'dari ' + angka(siap) + ' gerai selesai 100%';
  $('vrk-layak').textContent = angka(hit('Layak Digunakan')); $('vrk-catatan').textContent = angka(hit('Layak Digunakan dengan Catatan')); $('vrk-belum').textContent = angka(hit('Belum Layak'));
  // grafik capaian
  const kosong = '<div class="grafik-kosong">' + ik('bar_chart') + '<span>Belum ada hasil verval final untuk filter ini.</span></div>';
  if (!cakupan.length) { ['g-dok', 'g-fisik', 'g-sarpras'].forEach(function (id) { $(id).innerHTML = kosong; }); $('g-fisik-legenda').innerHTML = ''; $('g-sarpras-legenda').innerHTML = ''; }
  else {
    grafikDonatKkmp($('g-dok'), cakupan);
    grafikKolom($('g-fisik'), $('g-fisik-legenda'), cakupan, SERI_FISIK);
    grafikBaris($('g-sarpras'), $('g-sarpras-legenda'), cakupan, SERI_SARPRAS);
  }
  // tindak lanjut
  // sumber sama dengan daftar temuan: v.temuan per aspek (dihitung server dari data hasil verval final terakhir)
  const tl = { belum: 0, proses: 0, selesai: 0 }; let tidakWajib = 0;
  const aspek = {}; ASPEK_VRV.forEach(function (a) { aspek[a.k] = { belum: 0, proses: 0, selesai: 0 }; });
  cakupan.forEach(function (v) {
    Object.keys(v.temuan || {}).forEach(function (b) {
      const t = v.temuan[b];
      if (!v.wajibTL) { tidakWajib += t.total; return; }
      tl.belum += t.belum; tl.proses += t.proses; tl.selesai += t.selesai;
      if (aspek[b]) { aspek[b].belum += t.belum; aspek[b].proses += t.proses; aspek[b].selesai += t.selesai; }
    });
  });
  grafikDonat($('g-tl'), TL_VRV.map(function (t) { return { label: t.label, nilai: tl[t.k], warna: t.warna }; }));
  const totalTl = tl.belum + tl.proses + tl.selesai;
  $('tl-aspek').hidden = !totalTl; $('tl-panel').classList.toggle('tl-tunggal', !totalTl);
  if (totalTl) grafikAspek($('g-aspek'), aspek, totalTl);
  $('vrk-t-ket').textContent = 'Temuan dari hasil berkesimpulan Layak Digunakan dengan Catatan dan Belum Layak.' + (tidakWajib ? ' ' + tidakWajib + ' catatan dari hasil Layak Digunakan diarsipkan tanpa kewajiban tindak lanjut.' : '');
  // daftar
  const sel = $('vrk-status'), vs = sel.value, ada = {};
  cakupan.forEach(function (a) { ada[a.Kesimpulan] = true; });
  const opsi = S.instrumen.kesimpulan.filter(function (x) { return ada[x]; });
  isiOpsi(sel, opsi, '<option value="">' + (opsi.length ? 'Semua Kesimpulan' : 'Belum ada data') + '</option>');
  sel.value = opsi.indexOf(vs) > -1 ? vs : ''; sel.disabled = !opsi.length;
  const stt = sel.value, rows = cakupan.filter(function (a) { return !stt || a.Kesimpulan === stt; });
  const st = S.st.vrk; batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per;
  $('vrk-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (a, i) {
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="sel-utama nowrap">' + esc(a.NamaKKMP) + '<span class="sel-sub">Kel. ' + esc(a.Kelurahan) + '</span></td><td class="nowrap">' + esc(a.Kecamatan) + '</td>' +
      '<td class="nowrap">' + tglBln(a.TanggalPemeriksaan) + '<span class="sel-sub">' + esc(a.Periode || '') + '</span></td><td class="tc">' + lnKes(a.Kesimpulan) + '</td>' +
      '<td class="tc"><button type="button" class="btn btn-sekunder btn-kecil" data-lihat-vrv="' + esc(a.ID) + '">' + ik('visibility') + 'Lihat<span class="sr"> hasil verval ' + esc(a.NamaKKMP) + '</span></button></td></tr>';
  }).join('') : '<tr><td colspan="6" class="sel-kosong">' + (Object.keys(akhir).length ? 'Tidak ada KKMP yang sesuai filter.' : 'Belum ada KKMP dengan hasil verval final. Hasil akan tampil setelah disimpan melalui "Simpan Hasil Verval".') + '</td></tr>';
  $('vrk-info').textContent = infoRentang(awal, st.per, rows.length, 'KKMP');
  paginasi('vrk-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderRekapVerval(); });
}

// ---------- Grafik (HTML/SVG tanpa pustaka luar) ----------
function tabelSr(judulKolom, baris) {
  return '<div class="sr"><table><thead><tr>' + judulKolom.map(function (j) { return '<th scope="col">' + esc(j) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    baris.map(function (b) { return '<tr>' + b.map(function (x, i) { return i ? '<td>' + esc(x) + '</td>' : '<th scope="row">' + esc(x) + '</th>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
}
function legendaHtml(seri) { return seri.map(function (s) { return '<span><span class="g-kunci" style="background:' + s.warna + '" aria-hidden="true"></span>' + esc(s.label) + '</span>'; }).join(''); }
// Donat kecil per KKMP: dokumen "Sudah diterima" dari target.
function grafikDonatKkmp(el, cakupan) {
  const R = 34, C = 2 * Math.PI * R;
  el.innerHTML = '<div class="g-donat-kkmp">' + cakupan.map(function (v) {
    const c = v.capaian.dokumen, p = pctAngka(c.baik, c.total);
    return '<figure class="g-dk" data-tip="' + esc(v.NamaKKMP + ': ' + c.baik + ' dari ' + c.total + ' dokumen (' + teksPct(p) + ')') + '" tabindex="0">' +
      '<figcaption class="g-dk-nama">' + esc(v.NamaKKMP) + '</figcaption>' +
      '<div class="g-dk-isi"><svg viewBox="0 0 90 90" class="g-dk-svg" aria-hidden="true" focusable="false"><circle r="' + R + '" cx="45" cy="45" fill="none" stroke="var(--g-trek)" stroke-width="16"/>' +
      (c.baik ? '<circle r="' + R + '" cx="45" cy="45" fill="none" stroke="var(--g-capai)" stroke-width="16" stroke-dasharray="' + (p / 100 * C).toFixed(2) + ' ' + C.toFixed(2) + '" transform="rotate(-90 45 45)"/>' : '') + '</svg>' +
      '<b class="g-dk-pct">' + teksPct(p) + '</b></div>' +
      '<span class="g-dk-ket">target ' + c.total + ' · realisasi ' + c.baik + ' dokumen</span></figure>';
  }).join('') + '</div>' + tabelSr(['KKMP', 'Target dokumen', 'Realisasi', 'Capaian'], cakupan.map(function (v) { const c = v.capaian.dokumen; return [v.NamaKKMP, c.total, c.baik, teksPct(pctAngka(c.baik, c.total))]; }));
}
// Kolom berkelompok (vertikal) per KKMP, sumbu 0–100%.
function grafikKolom(el, legEl, cakupan, seri) {
  legEl.innerHTML = legendaHtml(seri);
  el.innerHTML = '<div class="g-kolom-wadah"><div class="g-kolom-sumbu" aria-hidden="true">' + [100, 75, 50, 25, 0].map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>' +
    '<div class="g-kolom-gulir"><div class="g-kolom" style="min-width:' + (cakupan.length * 120) + 'px">' + cakupan.map(function (v) {
      return '<div class="g-kolom-grup"><div class="g-kolom-batang">' + seri.map(function (s) {
        const c = v.capaian[s.k], p = pctAngka(c.baik, c.total);
        return '<div class="g-kolom-item" data-tip="' + esc(v.NamaKKMP + ' · ' + s.label + ': ' + teksPct(p) + ' (' + c.baik + '/' + c.total + ' item)') + '" tabindex="0"><span class="g-kolom-nilai" style="bottom:calc(' + p + '% + 4px)">' + teksPct(p).replace('%', '') + '</span>' +
          '<span class="g-kolom-isi" style="height:' + p + '%;background:' + s.warna + '"></span></div>';
      }).join('') + '</div><span class="g-kolom-label">' + esc(v.NamaKKMP) + '</span></div>';
    }).join('') + '</div></div></div><p class="g-satuan">Persentase capaian (%)</p>' +
    tabelSr(['KKMP'].concat(seri.map(function (s) { return s.label + ' (%)'; })), cakupan.map(function (v) { return [v.NamaKKMP].concat(seri.map(function (s) { return teksPct(pctAngka(v.capaian[s.k].baik, v.capaian[s.k].total)); })); }));
}
// Batang berkelompok (horizontal) per KKMP, sumbu 0–100%.
function grafikBaris(el, legEl, cakupan, seri) {
  legEl.innerHTML = legendaHtml(seri);
  el.innerHTML = '<div class="g-baris">' + cakupan.map(function (v) {
    return '<div class="g-baris-grup"><span class="g-baris-label">' + esc(v.NamaKKMP) + '</span><div class="g-baris-batang">' + seri.map(function (s) {
      const c = v.capaian[s.k], p = pctAngka(c.baik, c.total);
      return '<div class="g-baris-item" data-tip="' + esc(v.NamaKKMP + ' · ' + s.label + ': ' + teksPct(p) + ' (' + c.baik + '/' + c.total + ' jenis item)') + '" tabindex="0"><span class="g-baris-jalur"><span class="g-baris-isi" style="width:' + p + '%;background:' + s.warna + '"></span></span><span class="g-baris-nilai">' + teksPct(p) + '</span></div>';
    }).join('') + '</div></div>';
  }).join('') + '<div class="g-baris-sumbu" aria-hidden="true"><span></span><span class="g-baris-skala">' + [0, 25, 50, 75, 100].map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</span></div></div>' +
    tabelSr(['KKMP'].concat(seri.map(function (s) { return s.label + ' (%)'; })), cakupan.map(function (v) { return [v.NamaKKMP].concat(seri.map(function (s) { return teksPct(pctAngka(v.capaian[s.k].baik, v.capaian[s.k].total)); })); }));
}
function grafikDonat(el, data) {
  const total = data.reduce(function (t, d) { return t + d.nilai; }, 0);
  if (!total) { el.innerHTML = '<div class="grafik-kosong">' + ik('donut_large') + '<span>Belum ada temuan yang wajib ditindaklanjuti.</span></div>'; return; }
  const R = 70, C = 2 * Math.PI * R, celah = data.filter(function (d) { return d.nilai; }).length > 1 ? 3 : 0;
  let offset = 0, seg = '';
  data.forEach(function (d) {
    if (!d.nilai) return;
    const p = d.nilai / total * C;
    seg += '<circle r="' + R + '" cx="90" cy="90" fill="none" stroke="' + d.warna + '" stroke-width="22" stroke-dasharray="' + Math.max(0.5, p - celah).toFixed(2) + ' ' + C.toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '" class="g-seg" tabindex="0" data-tip="' + esc(d.label + ': ' + d.nilai + ' (' + pctTeks(d.nilai, total) + ')') + '"/>';
    offset += p;
  });
  el.innerHTML = '<div class="g-donat"><div class="g-donat-svg"><svg viewBox="0 0 180 180" class="g-svg" role="img" aria-label="Status tindak lanjut: ' + esc(data.map(function (d) { return d.label + ' ' + d.nilai + ' (' + pctTeks(d.nilai, total) + ')'; }).join(', ')) + '">' +
    '<circle r="' + R + '" cx="90" cy="90" fill="none" stroke="var(--g-trek)" stroke-width="22"/><g transform="rotate(-90 90 90)">' + seg + '</g>' +
    '<text x="90" y="88" text-anchor="middle" class="g-tengah">' + total + '</text><text x="90" y="108" text-anchor="middle" class="g-tengah-sub">temuan</text></svg></div>' +
    '<ul class="g-donat-legenda">' + data.map(function (d) {
      return '<li><span class="g-kunci" style="background:' + d.warna + '" aria-hidden="true"></span><span class="g-donat-teks">' + esc(d.label) + '</span><b>' + d.nilai + '</b><span class="g-pct">' + pctTeks(d.nilai, total) + '</span></li>';
    }).join('') + '</ul></div>';
}
// Batang horizontal per aspek. Panjang batang = porsi aspek dari seluruh temuan (jalur penuh = total temuan);
// isi batang dipecah menurut status tindak lanjut dengan warna yang sama dengan donat.
function grafikAspek(el, aspek, total) {
  el.innerHTML = '<ul class="g-aspek">' + ASPEK_VRV.map(function (a) {
    const d = aspek[a.k], n = d.belum + d.proses + d.selesai, pct = pctTeks(n, total);
    const seg = TL_VRV.map(function (t) {
      if (!d[t.k]) return '';
      return '<span class="g-aspek-seg" style="width:' + (d[t.k] / total * 100).toFixed(3) + '%;background:' + t.warna + '" tabindex="0" role="img" aria-label="' + esc(a.label + ' · ' + t.label + ': ' + d[t.k] + ' temuan') + '" data-tip="' + esc(a.label + ' · ' + t.label + ': ' + d[t.k] + ' temuan') + '"></span>';
    }).join('');
    return '<li class="g-aspek-baris"><div class="g-aspek-kepala"><span class="g-aspek-label">' + esc(a.label) + '</span><span class="g-aspek-nilai"><b>' + n + '</b> temuan<span class="g-pct">' + pct + '</span></span></div>' +
      '<div class="g-aspek-jalur">' + seg + '</div></li>';
  }).join('') + '</ul>' +
    tabelSr(['Aspek pemeriksaan', 'Jumlah temuan', 'Persentase'].concat(TL_VRV.map(function (t) { return t.label; })), ASPEK_VRV.map(function (a) {
      const d = aspek[a.k], n = d.belum + d.proses + d.selesai;
      return [a.label, n, pctTeks(n, total)].concat(TL_VRV.map(function (t) { return d[t.k]; }));
    }));
}
function pasangTooltipGrafik() {
  const tip = document.createElement('div'); tip.className = 'g-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true; document.body.appendChild(tip);
  const tampil = function (t, x, y) { tip.textContent = t.getAttribute('data-tip'); tip.hidden = false; const w = tip.offsetWidth; tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)) + 'px'; tip.style.top = Math.max(8, y - tip.offsetHeight - 12) + 'px'; };
  document.addEventListener('pointermove', function (e) { const t = e.target.closest && e.target.closest('#ad-verval-rekap [data-tip]'); if (t) tampil(t, e.clientX, e.clientY); else tip.hidden = true; });
  document.addEventListener('focusin', function (e) { const t = e.target.closest && e.target.closest('#ad-verval-rekap [data-tip]'); if (t) { const r = t.getBoundingClientRect(); tampil(t, r.left + r.width / 2, r.top); } else tip.hidden = true; });
  window.addEventListener('scroll', function () { tip.hidden = true; }, { passive: true });
}

// ---------- Daftar ----------
function muatDaftarHal(paksa) {
  muatDaftarVerval(paksa).then(function () { isiKecFilter('vrd-kec', kecDenganVerval(S.vrv.daftar || []), 'Semua Kecamatan'); renderDaftarVerval(); }).catch(function (e) { gagalTabel('vrd-body', 9, e); });
}
function renderDaftarVerval() {
  const semua = S.vrv.daftar || [], st = S.st.vrd;
  const kec = $('vrd-kec').value, stt = $('vrd-status').value, dt = $('vrd-data').value, q = $('vrd-cari').value.trim();
  const rows = semua.filter(function (v) { return (!kec || v.Kecamatan === kec) && (!stt || v.Kesimpulan === stt) && (!dt || v.StatusData === dt) && cocok(v, ['NamaKKMP', 'Kelurahan', 'Kecamatan', 'TimPemeriksa', 'Periode'], q); });
  batasHal(st, rows.length, st.per);
  const awal = (st.hal - 1) * st.per, ubah = bolehAd('verval-input'), hapus = S.peran === 'Admin';
  $('vrd-body').innerHTML = rows.length ? irisan(rows, st.hal, st.per).map(function (v, i) {
    return '<tr><td class="sel-no">' + (awal + i + 1) + '</td><td class="sel-utama nowrap">' + esc(v.NamaKKMP) + '<span class="sel-sub">Kel. ' + esc(v.Kelurahan) + ', ' + esc(v.Kecamatan) + '</span></td>' +
      '<td class="nowrap">' + tglBln(v.TanggalPemeriksaan) + '</td><td>' + esc(v.TimPemeriksa || '-') + '</td><td class="nowrap">' + esc(v.Periode || '-') + '</td><td class="tc">' + lnKes(v.Kesimpulan) + '</td><td class="tc">' + lnData(v.StatusData) + '</td>' +
      '<td class="nowrap teks-kecil">' + esc(relatif(v.TerakhirDiperbarui)) + '<span class="sel-sub">' + esc(v.DiperbaruiOleh || '') + '</span></td>' +
      '<td class="tc"><div class="aksi-sel"><button type="button" class="btn btn-ikon btn-hantu btn-kecil" data-lihat-vrv="' + esc(v.ID) + '" aria-label="Lihat hasil verval ' + esc(v.NamaKKMP) + ' ' + esc(v.TanggalPemeriksaan) + '">' + ik('visibility') + '</button>' +
      (ubah ? '<button type="button" class="btn btn-ikon btn-hantu btn-kecil" data-ubah-vrv="' + esc(v.ID) + '" aria-label="Ubah hasil verval ' + esc(v.NamaKKMP) + '">' + ik('edit') + '</button>' : '') +
      (hapus ? '<button type="button" class="btn btn-ikon btn-hantu btn-kecil teks-merah" data-hapus-vrv="' + esc(v.ID) + '" aria-label="Hapus hasil verval ' + esc(v.NamaKKMP) + '">' + ik('delete') + '</button>' : '') + '</div></td></tr>';
  }).join('') : '<tr><td colspan="9" class="sel-kosong">' + (semua.length ? 'Data tidak ditemukan.' : 'Belum ada hasil verval. Pilih "Input Hasil Verval".') + '</td></tr>';
  $('vrd-info').textContent = infoRentang(awal, st.per, rows.length, 'hasil verval');
  paginasi('vrd-pag', rows.length, st.hal, st.per, '', function (n) { st.hal = n; renderDaftarVerval(); });
}
function hapusVrv(id) {
  const v = (S.vrv.daftar || []).filter(function (x) { return x.ID === id; })[0]; if (!v) return;
  konfirmasi({ ikon: 'delete_forever', judul: 'Hapus Hasil Verval?', teks: 'Hasil verval <b>' + esc(v.NamaKKMP) + '</b> tanggal ' + esc(tglSedang(v.TanggalPemeriksaan)) + ' beserta seluruh fotonya akan dihapus permanen.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusVerval', id).then(function () { S.ad.gerai = null; tandaiBasi(); S.vrv.daftar = S.vrv.daftar.filter(function (x) { return x.ID !== id; }); isiKecFilter('vrd-kec', kecDenganVerval(S.vrv.daftar), 'Semua Kecamatan'); renderDaftarVerval(); toast('Hasil verval dihapus.'); if (S.adAktif === 'verval-detail') bukaAd('verval-daftar'); })
      .catch(function (err) { toast(err.message, true); });
  });
}

// ---------- Foto privat (diambil lewat API terautentikasi) ----------
function fotoVrv(id) {
  if (S.vrv.fotoCache[id]) return Promise.resolve(S.vrv.fotoCache[id]);
  return new Promise(function (res, rej) { S.vrv.antrean.push({ id: id, res: res, rej: rej }); jalankanAntreanFoto(); });
}
function jalankanAntreanFoto() {
  while (S.vrv.aktifUnduh < 3 && S.vrv.antrean.length) {
    const t = S.vrv.antrean.shift(); S.vrv.aktifUnduh++;
    (S.vrv.fotoCache[t.id] ? Promise.resolve(S.vrv.fotoCache[t.id]) : panggil('vervalFoto', t.id)).then(function (u) { S.vrv.fotoCache[t.id] = u; t.res(u); }, t.rej)
      .then(function () { S.vrv.aktifUnduh--; jalankanAntreanFoto(); });
  }
}
// Lampiran dapat berupa foto atau PDF. Jenisnya diketahui dari info ringan server (S.vrv.info) tanpa mengunduh isinya.
function berkasPdf(fid) { return !!(S.vrv.info[fid] && S.vrv.info[fid].pdf); }
function catatInfoBerkas(v) { Object.keys((v && v.berkas) || {}).forEach(function (k) { S.vrv.info[k] = v.berkas[k]; }); }
function namaBerkas(fid) { return (S.vrv.info[fid] && S.vrv.info[fid].n) || ''; }
// data URL -> blob URL (dipakai untuk menampilkan/mengunduh PDF; peramban memblokir navigasi ke data URL).
function blobBerkas(fid) {
  if (S.vrv.blob[fid]) return Promise.resolve(S.vrv.blob[fid]);
  return fotoVrv(fid).then(function (u) {
    const i = u.indexOf(','), mime = u.slice(5, u.indexOf(';')), biner = atob(u.slice(i + 1)), arr = new Uint8Array(biner.length);
    for (let n = 0; n < biner.length; n++) arr[n] = biner.charCodeAt(n);
    S.vrv.blob[fid] = URL.createObjectURL(new Blob([arr], { type: mime }));
    return S.vrv.blob[fid];
  });
}
function unduhBerkas(url, nama) { const a = document.createElement('a'); a.href = url; a.download = nama || 'lampiran-verval.pdf'; document.body.appendChild(a); a.click(); a.remove(); }
function bukaPdfVrv(fid) {
  toast('Membuka dokumen PDF…');
  blobBerkas(fid).then(function (url) {
    const w = window.open(url, '_blank', 'noopener');
    if (!w) { unduhBerkas(url, namaBerkas(fid)); toast('Tab baru diblokir peramban — PDF diunduh.'); }
  }).catch(function (err) { toast(err.message, true); });
}
function isiThumbs(wadah) {
  wadah.querySelectorAll('.vf-thumb[data-fid]:not([data-dimuat])').forEach(function (b) {
    b.setAttribute('data-dimuat', '1');
    if (b.classList.contains('vf-thumb-pdf')) return; // PDF cukup ditampilkan sebagai ikon
    b.classList.add('memuat');
    fotoVrv(b.getAttribute('data-fid')).then(function (u) { const img = b.querySelector('img'); img.src = u; b.classList.remove('memuat'); })
      .catch(function () { b.classList.remove('memuat'); b.title = 'File tidak dapat dimuat'; });
  });
}
function thumbHtml(fid, label, bisaHapus) {
  const pdf = berkasPdf(fid), nama = namaBerkas(fid);
  return '<span class="vf-thumb' + (pdf ? ' vf-thumb-pdf' : '') + '" data-fid="' + esc(fid) + '" role="button" tabindex="0" aria-label="' + (pdf ? 'Buka PDF ' : 'Lihat foto ') + esc(label) + '"' + (pdf && nama ? ' title="' + esc(nama) + '"' : '') + '>' +
    (pdf ? ik('picture_as_pdf') + '<span class="vf-thumb-jenis" aria-hidden="true">PDF</span>' : '<img alt="">') +
    (bisaHapus ? '<button type="button" class="vf-thumb-hapus" data-hapus-foto="' + esc(fid) + '" aria-label="Hapus file ' + esc(label) + '">' + ik('close') + '</button>' : '') + '</span>';
}
// Siapkan berkas sebelum diunggah: foto dikompres, PDF dikirim apa adanya (maks 5 MB).
function siapkanBerkasVf(file) {
  const pdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!pdf) return kompresGambar(file);
  return new Promise(function (res, rej) {
    if (file.size > 5 * 1048576) return rej(new Error('PDF "' + file.name + '" terlalu besar (maks 5 MB).'));
    const r = new FileReader();
    r.onload = function () { const u = String(r.result).replace(/^data:[^;]*;/, 'data:application/pdf;'); res({ nama: file.name, mime: 'application/pdf', isi: u.split(',')[1], data: u, pdf: true }); };
    r.onerror = function () { rej(new Error('PDF "' + file.name + '" tidak dapat dibaca.')); };
    r.readAsDataURL(file);
  });
}
function kompresGambar(file) {
  return new Promise(function (res, rej) {
    if (!/^image\//.test(file.type)) return rej(new Error('Berkas "' + file.name + '" bukan foto atau PDF.'));
    if (file.size > 15 * 1048576) return rej(new Error('Foto "' + file.name + '" terlalu besar (maks 15 MB sebelum dikompres).'));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      const maks = 1600, sk = Math.min(1, maks / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * sk); c.height = Math.round(img.naturalHeight * sk);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      const data = c.toDataURL('image/jpeg', 0.82);
      res({ nama: file.name.replace(/\.[^.]+$/, '') + '.jpg', mime: 'image/jpeg', isi: data.split(',')[1], pratinjau: data });
    };
    img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('Foto "' + file.name + '" tidak dapat dibaca.')); };
    img.src = url;
  });
}

// ---------- Formulir ----------
S.vf = { data: {}, kotor: false, unggah: 0 };
function bagianKosong() { const o = {}; ['administrasi', 'fisik', 'sarpras', 'dokumentasi'].forEach(function (b) { o[b] = {}; S.instrumen[b].item.forEach(function (i) { o[b][i.k] = { s: '', c: '', r: '', f: [] }; }); }); return o; }
// Bagian B (Administrasi) berisi dokumen -> kolom "File" (foto/PDF); bagian C, D, E -> kolom "Foto".
function lampiranFoto(bag) { return bag !== 'administrasi'; }
function renderTabelVf(bag) {
  const ins = S.instrumen[bag], d = S.vf.data[bag];
  const sarpras = bag === 'sarpras', dok = bag === 'dokumentasi', foto = lampiranFoto(bag);
  const kepala = sarpras ? '<th scope="col">Jenis / Model Item</th><th scope="col" class="tc">Rencana (Item)</th><th scope="col" class="tc">Realisasi (Item)</th><th scope="col" class="tc">Foto</th><th scope="col">Catatan</th>'
    : dok ? '<th scope="col" class="tc">No</th><th scope="col">Nama &amp; Keterangan</th><th scope="col" class="tc">Foto</th><th scope="col">Status Dokumentasi</th><th scope="col">Catatan</th>'
    : '<th scope="col">Kategori</th><th scope="col">Klasifikasi</th><th scope="col">Status</th><th scope="col" class="tc">' + (foto ? 'Foto' : 'File') + '</th><th scope="col">Catatan</th>';
  let katLalu = '';
  const baris = ins.item.map(function (i, n) {
    const x = d[i.k], idB = 'vf-' + bag + '-' + i.k;
    const label = i.k + ' ' + i.n;
    const selLampiran = '<td class="vf-sel-foto" data-label="' + (foto ? 'Foto' : 'File') + '"><div class="vf-foto" data-bag="' + bag + '" data-k="' + i.k + '">' + x.f.map(function (f) { return thumbHtml(f, label, true); }).join('') +
      (foto
        ? '<label class="vf-unggah" title="Unggah foto (JPG, PNG, WEBP) — maks ' + S.instrumen.maksFoto + ' foto"' + (x.f.length >= S.instrumen.maksFoto ? ' aria-disabled="true"' : '') + '>' + ik('add_a_photo', 'ik-18') + '<span class="sr">Unggah foto ' + esc(label) + '</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple data-unggah-vf="' + bag + '|' + i.k + '"></label></div></td>'
        : '<label class="vf-unggah" title="Unggah file: foto (JPG, PNG, WEBP) atau PDF — maks ' + S.instrumen.maksFoto + ' file"' + (x.f.length >= S.instrumen.maksFoto ? ' aria-disabled="true"' : '') + '>' + ik('upload_file', 'ik-18') + '<span class="sr">Unggah file (foto atau PDF) ' + esc(label) + '</span><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,.pdf" multiple data-unggah-vf="' + bag + '|' + i.k + '"></label></div></td>');
    const catatan = '<td data-label="Catatan"><label class="sr" for="' + idB + '-c">Catatan ' + esc(label) + '</label><input class="input vf-catatan" id="' + idB + '-c" data-vf="' + bag + '|' + i.k + '|c" maxlength="500" value="' + esc(x.c) + '" placeholder="Opsional"></td>';
    const status = function (labelKolom) {
      return '<td data-label="' + labelKolom + '"><label class="sr" for="' + idB + '-s">Status ' + esc(label) + '</label><select class="input" id="' + idB + '-s" data-vf="' + bag + '|' + i.k + '|s"><option value="">Pilih status</option>' +
        ins.opsi.map(function (o) { return '<option' + (x.s === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></td>';
    };
    if (sarpras) {
      return '<tr><td class="vf-item" data-label="Jenis / Model Item">' + esc(i.n) + '</td><td class="tc" data-label="Rencana (Item)"><b>' + i.r + '</b></td>' +
        '<td class="tc" data-label="Realisasi (Item)"><label class="sr" for="' + idB + '-r">Realisasi ' + esc(i.n) + '</label><input class="input vf-angka" id="' + idB + '-r" type="number" min="0" max="' + i.r + '" inputmode="numeric" data-vf="' + bag + '|' + i.k + '|r" value="' + esc(x.r) + '" aria-describedby="vf-selisih-' + i.k + '"><span class="sel-sub" id="vf-selisih-' + i.k + '" data-selisih="' + i.k + '" aria-live="polite"></span></td>' + selLampiran + catatan + '</tr>';
    }
    if (dok) return '<tr><td class="sel-no">' + (n + 1) + '</td><td class="vf-item" data-label="Nama & Keterangan">' + esc(i.n) + '</td>' + selLampiran + status('Status Dokumentasi') + catatan + '</tr>';
    const kat = i.kat !== katLalu ? (katLalu = i.kat, i.kat) : '';
    return '<tr' + (kat ? ' class="vf-kat-baris"' : '') + '><td class="vf-kat" data-label="' + (kat ? 'Kategori' : '') + '">' + esc(kat) + '</td><td class="vf-item" data-label="Klasifikasi"><b>' + esc(i.k) + '</b> ' + esc(i.n) + '</td>' + status('Status') + selLampiran + catatan + '</tr>';
  }).join('');
  $('vf-' + bag).innerHTML = '<div class="tabel-wadah"><table class="tabel tabel-vf"><thead><tr>' + kepala + '</tr></thead><tbody>' + baris + '</tbody></table></div>';
  hitungSumVf(bag);
}
// Realisasi SARPRAS tidak boleh melebihi rencana: nilai yang lebih otomatis disamakan dengan rencana + peringatan.
function batasRealisasiVf(input, k) {
  const it = S.instrumen.sarpras.item.filter(function (i) { return i.k === k; })[0]; if (!it) return;
  S.vf.lebih = S.vf.lebih || {};
  const v = input.value.trim();
  if (v !== '' && Number(v) > it.r) {
    input.value = String(it.r); S.vf.lebih[k] = true;
    toast('Realisasi "' + it.n + '" tidak boleh melebihi rencana (' + it.r + ' item). Nilai disesuaikan menjadi ' + it.r + '.', true);
  } else S.vf.lebih[k] = false;
}
function hitungSumVf(bag) {
  const ins = S.instrumen[bag], d = S.vf.data[bag], el = $('vf-sum-' + bag);
  if (bag === 'sarpras') {
    let ren = 0, real = 0, terisi = 0;
    ins.item.forEach(function (i) {
      const r = d[i.k].r; ren += i.r;
      if (r !== '' && r !== null && r !== undefined) { terisi++; real += Math.min(i.r, Number(r) || 0); }
      const sel = document.querySelector('[data-selisih="' + i.k + '"]');
      if (!sel) return;
      if (S.vf.lebih && S.vf.lebih[i.k]) sel.innerHTML = '<span class="vf-lebih">Melebihi rencana — disesuaikan menjadi ' + i.r + '</span>';
      else if (r !== '' && r !== undefined && Number(r) > i.r) sel.innerHTML = '<span class="vf-lebih">Melebihi rencana (' + i.r + '). Nilai harus sama dengan rencana.</span>';
      else sel.innerHTML = r === '' || r === undefined ? '' : (Number(r) >= i.r ? '<span class="vf-pas">Lengkap</span>' : '<span class="vf-kurang">Kurang ' + (i.r - Number(r)) + '</span>');
    });
    el.textContent = terisi + '/' + ins.item.length + ' terisi · realisasi ' + pctTeks(real, ren);
    el.className = 'lencana ' + (terisi === ins.item.length ? 'ln-info' : 'ln-netral');
    return;
  }
  const terisi = ins.item.filter(function (i) { return d[i.k].s; }).length, baik = ins.item.filter(function (i) { return d[i.k].s === ins.baik; }).length;
  el.textContent = terisi + '/' + ins.item.length + ' terisi · ' + baik + ' ' + ins.baik.toLowerCase();
  el.className = 'lencana ' + (terisi === ins.item.length ? 'ln-info' : 'ln-netral');
}
function muatSiapVerval() {
  return panggil('kkmpSiapVerval').then(function (ids) { S.vrvSiap = {}; ids.forEach(function (i) { S.vrvSiap[i] = true; }); });
}
function opsiKopVf(pilih) {
  const daftar = S.koperasi.filter(function (k) { return (S.vrvSiap || {})[k.ID] || k.ID === pilih; });
  $('vf-kop-bantu').textContent = daftar.length ? 'Hanya KKMP dengan gerai berprogres fisik 100% (Data Gedung Gerai) yang dapat dipilih.' : 'Belum ada KKMP dengan gerai berprogres fisik 100%. Perbarui progres di menu Data Gedung Gerai.';
  isiOpsi($('vf-kop'), daftar.slice().sort(function (a, b) { return (a.Kecamatan + a.Kelurahan).localeCompare(b.Kecamatan + b.Kelurahan); })
    .map(function (k) { return { v: k.ID, l: k.NamaKKMP + ' — Kel. ' + k.Kelurahan + ' (Kec. ' + k.Kecamatan + ')' }; }), '<option value="">' + (daftar.length ? 'Pilih KKMP / Kelurahan...' : 'Tidak ada KKMP yang siap diverval') + '</option>');
  $('vf-kop').value = pilih || '';
  aturKecVf();
}
function aturKecVf() { const k = S.koperasi.filter(function (x) { return x.ID === $('vf-kop').value; })[0]; $('vf-kec').value = k ? k.Kecamatan : ''; }
function aturKesVf() {
  const v = $('vf-kes').value, sel = $('vf-kes');
  sel.classList.remove('kes-layak', 'kes-catatan', 'kes-belum');
  if (KES_KELAS[v]) sel.classList.add(KES_KELAS[v][2]);
  $('vf-kes-badge').innerHTML = v ? lnKes(v, true) : '';
}
function bukaFormVerval(opsi) {
  opsi = opsi || {};
  const isi = function (v) {
    S.vf = { data: bagianKosong(), kotor: false, unggah: 0, statusLama: v ? v.StatusData : '' };
    if (v) ['administrasi', 'fisik', 'sarpras', 'dokumentasi'].forEach(function (b) {
      Object.keys(S.vf.data[b]).forEach(function (k) { const x = ((v.data || {})[b] || {})[k] || {}; S.vf.data[b][k] = { s: x.s || '', c: x.c || '', r: x.r === undefined ? '' : x.r, f: (x.f || []).slice() }; });
    });
    catatInfoBerkas(v);
    $('vf-id').value = v ? v.ID : ''; $('vf-lihat').hidden = !v;
    opsiKopVf(v ? v.IDKoperasi : (opsi.idKop || ''));
    $('vf-tgl').value = v ? v.TanggalPemeriksaan : hariIni(); $('vf-tim').value = v ? v.TimPemeriksa : ''; $('vf-periode').value = v ? v.Periode : '';
    $('vf-kes').value = v ? v.Kesimpulan || '' : ''; $('vf-kes-catatan').value = v ? v.CatatanKesimpulan || '' : ''; $('vf-rekom').value = v ? v.Rekomendasi || '' : '';
    $('vf-mode').innerHTML = v ? 'Mengubah pemeriksaan ' + esc(v.NamaKKMP) + ' · ' + esc(tglSedang(v.TanggalPemeriksaan)) + ' ' + lnData(v.StatusData) : 'Pemeriksaan baru';
    aturKesVf();
    ['administrasi', 'fisik', 'sarpras', 'dokumentasi'].forEach(renderTabelVf);
    isiThumbs($('form-verval'));
  };
  $('vf-mode').textContent = 'Memuat data...';
  const siap = muatSiapVerval().catch(function () { S.vrvSiap = {}; });
  if (opsi.id) {
    return siap.then(function () { return panggil('detailVerval', opsi.id); }).then(isi).catch(function (e) { toast(e.message, true); bukaAd('verval-daftar'); });
  }
  return siap.then(function () { isi(null); });
}
function kumpulkanVf(status) {
  const d = { ID: $('vf-id').value, IDKoperasi: $('vf-kop').value, TanggalPemeriksaan: $('vf-tgl').value, TimPemeriksa: $('vf-tim').value.trim(), Periode: $('vf-periode').value.trim(),
    StatusData: status, Kesimpulan: $('vf-kes').value, CatatanKesimpulan: $('vf-kes-catatan').value.trim(), Rekomendasi: $('vf-rekom').value.trim() };
  ['administrasi', 'fisik', 'sarpras', 'dokumentasi'].forEach(function (b) {
    d[b] = {};
    Object.keys(S.vf.data[b]).forEach(function (k) { const x = S.vf.data[b][k]; d[b][k] = { s: x.s, c: x.c, r: x.r, f: x.f.slice() }; });
  });
  return d;
}
function validasiFinalVf() {
  wajibIsi(['vf-kop', 'vf-tgl', 'vf-periode', 'vf-tim']);
  const urut = ['administrasi', 'fisik', 'sarpras', 'dokumentasi'];
  for (let b = 0; b < urut.length; b++) {
    const bag = urut[b], ins = S.instrumen[bag];
    for (let i = 0; i < ins.item.length; i++) {
      const it = ins.item[i], x = S.vf.data[bag][it.k];
      const kosong = bag === 'sarpras' ? (x.r === '' || x.r === null || x.r === undefined) : !x.s;
      if (kosong) {
        const el = $('vf-' + bag + '-' + it.k + (bag === 'sarpras' ? '-r' : '-s'));
        el.classList.add('salah'); el.setAttribute('aria-invalid', 'true'); el.focus();
        throw new Error((bag === 'sarpras' ? 'Realisasi ' : 'Status ') + (bag === 'sarpras' || bag === 'dokumentasi' ? it.n : it.k + ' – ' + it.n) + ' belum diisi.');
      }
    }
  }
  if (!$('vf-kes').value) { $('vf-kes').classList.add('salah'); $('vf-kes').setAttribute('aria-invalid', 'true'); $('vf-kes').focus(); throw new Error('Pilih Kesimpulan Hasil Verifikasi dan Validasi.'); }
}
function simpanVf(status) {
  const btn = $(status === 'Final' ? 'vf-final' : 'vf-draft');
  try {
    if (S.vf.unggah) throw new Error('Tunggu hingga seluruh foto selesai diunggah.');
    if (status === 'Final') validasiFinalVf(); else wajibIsi(['vf-kop', 'vf-tgl']);
  } catch (err) { return toast(err.message, true); }
  sibuk(btn, true, 'Menyimpan...');
  panggil('simpanVerval', kumpulkanVf(status)).then(function (r) {
    S.vf.kotor = false; $('vf-id').value = r.ID; $('vf-lihat').hidden = false;
    S.ad.gerai = null; tandaiBasi(); // status Verval/SARPRAS/SIMKOPDES gerai dihitung dari hasil verval
    if (S.vrv.daftar) { const i = S.vrv.daftar.findIndex(function (x) { return x.ID === r.ID; }); if (i > -1) S.vrv.daftar[i] = r; else S.vrv.daftar.unshift(r); }
    toast(status === 'Final' ? 'Hasil verval disimpan.' : 'Draft hasil verval disimpan.');
    if (status === 'Final') bukaDetailVerval(r.ID);
    else $('vf-mode').innerHTML = 'Mengubah pemeriksaan ' + esc(r.NamaKKMP) + ' · ' + esc(tglSedang(r.TanggalPemeriksaan)) + ' ' + lnData('Draft');
  }).catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); });
}
function unggahFotoVf(input) {
  const kunci = input.getAttribute('data-unggah-vf').split('|'), bag = kunci[0], k = kunci[1], x = S.vf.data[bag][k];
  let berkas = Array.prototype.slice.call(input.files || []);
  const sisa = S.instrumen.maksFoto - x.f.length;
  input.value = '';
  if (lampiranFoto(bag)) {
    const bukanFoto = berkas.filter(function (f) { return !/^image\/(jpeg|png|webp)$/.test(f.type); });
    if (bukanFoto.length) toast('Kolom Foto hanya menerima foto JPG, PNG, atau WEBP. ' + bukanFoto.length + ' berkas dilewati.', true);
    berkas = berkas.filter(function (f) { return bukanFoto.indexOf(f) === -1; });
  }
  if (!berkas.length) return;
  if (berkas.length > sisa) toast('Maksimal ' + S.instrumen.maksFoto + ' file per item. Hanya ' + Math.max(0, sisa) + ' file pertama yang diunggah.', true);
  const wadah = document.querySelector('.vf-foto[data-bag="' + bag + '"][data-k="' + k + '"]');
  berkas.slice(0, Math.max(0, sisa)).reduce(function (p, f) {
    return p.then(function () {
      const sementara = document.createElement('span');
      sementara.className = 'vf-thumb memuat'; sementara.innerHTML = '<img alt="">'; sementara.setAttribute('aria-label', 'Mengunggah file');
      wadah.insertBefore(sementara, wadah.querySelector('.vf-unggah'));
      S.vf.unggah++;
      return siapkanBerkasVf(f).then(function (b) {
        if (b.pdf) { sementara.classList.add('vf-thumb-pdf'); sementara.innerHTML = ik('picture_as_pdf') + '<span class="vf-thumb-jenis" aria-hidden="true">PDF</span>'; }
        else sementara.querySelector('img').src = b.pratinjau;
        return panggil('unggahFotoVerval', { nama: b.nama, mime: b.mime, isi: b.isi }).then(function (r) {
          S.vrv.fotoCache[r.id] = b.pdf ? b.data : b.pratinjau; S.vrv.info[r.id] = { n: r.nama, pdf: !!r.pdf };
          x.f.push(r.id); S.vf.kotor = true;
        });
      }).catch(function (err) { toast(err.message, true); }).then(function () { S.vf.unggah--; sementara.remove(); });
    });
  }, Promise.resolve()).then(function () { renderFotoVf(bag, k); });
}
function renderFotoVf(bag, k) {
  const wadah = document.querySelector('.vf-foto[data-bag="' + bag + '"][data-k="' + k + '"]'), x = S.vf.data[bag][k];
  const it = S.instrumen[bag].item.filter(function (i) { return i.k === k; })[0], label = k + ' ' + it.n;
  wadah.querySelectorAll('.vf-thumb').forEach(function (t) { t.remove(); });
  wadah.insertAdjacentHTML('afterbegin', x.f.map(function (f) { return thumbHtml(f, label, true); }).join(''));
  const lb = wadah.querySelector('.vf-unggah');
  if (x.f.length >= S.instrumen.maksFoto) lb.setAttribute('aria-disabled', 'true'); else lb.removeAttribute('aria-disabled');
  isiThumbs(wadah);
}
function keluarFormVf(lanjut) {
  if (!S.vf.kotor) return lanjut();
  konfirmasi({ ikon: 'warning', judul: 'Tinggalkan formulir?', sub: 'Perubahan belum disimpan', teks: 'Perubahan pada formulir hasil verval akan hilang. Pilih <b>Simpan Draft</b> terlebih dahulu bila ingin menyimpannya.', tombol: 'Tinggalkan' })
    .then(function (ok) { if (ok) { S.vf.kotor = false; lanjut(); } });
}

// ---------- Halaman detail (privat) ----------
function bukaDetailVerval(id) { S.vrvDetail = id; bukaAd('verval-detail'); }
function muatDetailVerval() {
  const id = S.vrvDetail;
  $('vd-ubah').hidden = !bolehAd('verval-input');
  if (!id) return bukaAd('verval-daftar');
  $('vd-isi').innerHTML = '<div class="kartu skel skel-baris"></div><div class="kartu skel skel-baris"></div>';
  panggil('detailVerval', id).then(renderDetailVerval).catch(function (e) { $('vd-isi').innerHTML = '<div class="gagal" role="alert">' + esc(e.message) + '</div>'; });
}
function renderDetailVerval(v) {
  $('vd-judul').textContent = 'Form Hasil Pelaksanaan Verifikasi dan Validasi (Verval)';
  $('vd-sub').textContent = v.NamaKKMP + ' · Kel. ' + v.Kelurahan + ', Kec. ' + v.Kecamatan + ' · ' + tglPanjang(v.TanggalPemeriksaan);
  S.vrvItem = {}; catatInfoBerkas(v);
  const JUDUL_BAG = { administrasi: 'B. Pemeriksaan Administrasi', fisik: 'C. Pemeriksaan Fisik Bangunan', sarpras: 'D. Kelengkapan Sarana dan Prasarana', dokumentasi: 'E. Dokumentasi Foto' };
  // tombol File & Catatan membuka popup; tanpa isi ditampilkan tanda "—"
  const selFoto = function (bag, k, f) {
    const n = (f || []).length;
    return n ? '<button type="button" class="btn btn-sekunder btn-kecil vd-btn" data-item-vrv="' + bag + '|' + k + '" data-fokus="foto">' + (lampiranFoto(bag) ? ik('photo_library', 'ik-18') + '<span>' + n + ' Foto</span>' : ik('attach_file', 'ik-18') + '<span>' + n + ' File</span>') + '<span class="sr"> untuk ' + esc(k) + '</span></button>' : '<span class="teks-redup">—</span>';
  };
  const selCatatan = function (bag, k, c) {
    return c ? '<button type="button" class="btn btn-hantu btn-kecil vd-btn" data-item-vrv="' + bag + '|' + k + '" data-fokus="catatan">' + ik('sticky_note_2', 'ik-18') + '<span>Lihat</span><span class="sr"> catatan ' + esc(k) + '</span></button>' : '<span class="teks-redup">—</span>';
  };
  const temuan = [];
  const tabel = function (bag) {
    const ins = S.instrumen[bag], d = (v.data || {})[bag] || {};
    let katLalu = '';
    const kepala = bag === 'sarpras' ? '<th>Jenis / Model Item</th><th class="tc">Rencana (Item)</th><th class="tc">Realisasi (Item)</th><th class="tc">Foto</th><th class="tc">Catatan</th>'
      : bag === 'dokumentasi' ? '<th class="tc">No</th><th>Nama &amp; Keterangan</th><th class="tc">Foto</th><th class="tc">Status Dokumentasi</th><th class="tc">Catatan</th>' : '<th>Kategori</th><th>Klasifikasi</th><th class="tc">Status</th><th class="tc">' + (lampiranFoto(bag) ? 'Foto' : 'File') + '</th><th class="tc">Catatan</th>';
    const rows = ins.item.map(function (i, n) {
      const x = d[i.k] || {};
      let statusHtml;
      if (bag === 'sarpras') {
        const r = x.r === '' || x.r === undefined ? null : Number(x.r);
        if (r !== null && r < i.r) temuan.push({ bag: bag, k: i.k, t: x.t, teks: 'SARPRAS ' + i.n + ': realisasi ' + r + ' dari rencana ' + i.r + ' item' + (x.c ? ' — ' + x.c : '') + '.' });
        statusHtml = r === null ? lencana('Belum diisi', 'ln-netral') : lencana('Realisasi ' + r + ' dari ' + i.r, r >= i.r ? 'ln-sukses' : 'ln-bahaya', r >= i.r ? 'check_circle' : 'cancel');
        S.vrvItem[bag + '|' + i.k] = { bagian: JUDUL_BAG[bag], judul: i.n, status: statusHtml, f: x.f || [], c: x.c || '' };
        return '<tr><td class="vf-item" data-label="Jenis / Model Item">' + esc(i.n) + '</td><td class="tc" data-label="Rencana (Item)">' + i.r + '</td><td class="tc" data-label="Realisasi (Item)">' + (r === null ? '<span class="teks-redup">-</span>' : '<b class="' + (r >= i.r ? 'vf-pas' : 'vf-kurang') + '">' + r + '</b>') + '</td>' +
          '<td class="tc" data-label="' + (lampiranFoto(bag) ? 'Foto' : 'File') + '">' + selFoto(bag, i.k, x.f) + '</td><td class="tc" data-label="Catatan">' + selCatatan(bag, i.k, x.c) + '</td></tr>';
      }
      if (x.s && x.s !== ins.baik) temuan.push({ bag: bag, k: i.k, t: x.t, teks: (bag === 'dokumentasi' ? 'Dokumentasi ' + i.n : i.k + ' ' + i.n) + ': ' + x.s + (x.c ? ' — ' + x.c : '') + '.' });
      statusHtml = lnVrvStatus(x.s, ins.baik);
      S.vrvItem[bag + '|' + i.k] = { bagian: JUDUL_BAG[bag], judul: (bag === 'dokumentasi' ? '' : i.k + ' – ') + i.n, status: statusHtml, f: x.f || [], c: x.c || '' };
      if (bag === 'dokumentasi') return '<tr><td class="sel-no">' + (n + 1) + '</td><td class="vf-item" data-label="Nama & Keterangan">' + esc(i.n) + '</td><td class="tc" data-label="' + (lampiranFoto(bag) ? 'Foto' : 'File') + '">' + selFoto(bag, i.k, x.f) + '</td><td class="tc" data-label="Status Dokumentasi">' + statusHtml + '</td><td class="tc" data-label="Catatan">' + selCatatan(bag, i.k, x.c) + '</td></tr>';
      const kat = i.kat !== katLalu ? (katLalu = i.kat, i.kat) : '';
      return '<tr' + (kat ? ' class="vf-kat-baris"' : '') + '><td class="vf-kat" data-label="' + (kat ? 'Kategori' : '') + '">' + esc(kat) + '</td><td class="vf-item" data-label="Klasifikasi"><b>' + esc(i.k) + '</b> ' + esc(i.n) + '</td><td class="tc" data-label="Status">' + statusHtml + '</td>' +
        '<td class="tc" data-label="' + (lampiranFoto(bag) ? 'Foto' : 'File') + '">' + selFoto(bag, i.k, x.f) + '</td><td class="tc" data-label="Catatan">' + selCatatan(bag, i.k, x.c) + '</td></tr>';
    }).join('');
    return '<div class="tabel-wadah"><table class="tabel tabel-vf tabel-vd"><thead><tr>' + kepala + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  };
  const kartu = function (huruf, judul, ringkas, isi) { return '<article class="kartu vf-bag"><div class="vf-bag-head"><h2 class="vf-bag-judul"><span class="vf-huruf">' + huruf + '</span>' + judul + '</h2>' + (ringkas || '') + '</div>' + isi + '</article>'; };
  const tAdm = tabel('administrasi'), tFis = tabel('fisik'), tSar = tabel('sarpras'), tDok = tabel('dokumentasi');
  const kes = KES_KELAS[v.Kesimpulan];
  const info = function (label, nilai) { return '<div><span>' + label + '</span><b>' + esc(nilai || '-') + '</b></div>'; };
  $('vd-isi').innerHTML =
    '<div class="vd-mode">' + ik('visibility', 'ik-18') + '<span><b>Mode Lihat</b> — formulir hanya dapat dibaca. Pilih tombol <b>File</b>/<b>Foto</b> atau <b>Catatan</b> untuk menampilkan isinya.</span>' + lnData(v.StatusData) + '</div>' +
    kartu('A', 'Informasi Pemeriksaan', '', '<div class="vd-meta">' + info('Nama KKMP / Kelurahan', v.NamaKKMP + ' — Kel. ' + v.Kelurahan) + info('Kecamatan', v.Kecamatan) +
      info('Tanggal Pemeriksaan', tglSedang(v.TanggalPemeriksaan)) + info('Periode Pemeriksaan', v.Periode) + info('Nama Tim / Petugas Pemeriksa', v.TimPemeriksa) + '</div>' +
      '<p class="teks-kecil teks-redup">Dicatat oleh ' + esc(v.DibuatOleh || '-') + ' · diperbarui ' + esc(waktuWIT(v.TerakhirDiperbarui)) + ' oleh ' + esc(v.DiperbaruiOleh || '-') + '</p>') +
    kartu('B', 'Pemeriksaan Administrasi', lencana(v.administrasi.baik + '/' + v.administrasi.total + ' sudah diterima', 'ln-info'), tAdm) +
    kartu('C', 'Pemeriksaan Fisik Bangunan', lencana(v.fisik.baik + '/' + v.fisik.total + ' sesuai', 'ln-info'), tFis) +
    kartu('D', 'Pemeriksaan Kelengkapan Sarana dan Prasarana', lencana('Realisasi ' + pctTeks(v.sarpras.realisasi, v.sarpras.rencana), 'ln-info'), tSar) +
    kartu('E', 'Dokumentasi Foto', lencana(v.dokumentasi.baik + '/' + v.dokumentasi.total + ' ada', 'ln-info'), tDok) +
    '<article class="kartu vf-bag vf-kesimpulan"><h2 class="vf-bag-judul"><span class="vf-huruf">F</span>Kesimpulan Hasil Verifikasi dan Validasi</h2>' +
      '<div class="vd-kes ' + (kes ? kes[2] : '') + '"><span class="label">Status Hasil Verval</span>' + lnKes(v.Kesimpulan, true) + '</div>' +
      '<div class="form-grid"><div><h3 class="label">Catatan Kesimpulan</h3><p class="vd-teks">' + esc(v.CatatanKesimpulan || '-') + '</p></div><div><h3 class="label">Rekomendasi Tindak Lanjut</h3><p class="vd-teks">' + esc(v.Rekomendasi || '-') + '</p></div></div></article>' +
    kartu('!', 'Temuan &amp; Tindak Lanjut', lencana(temuan.length + ' temuan', temuan.length ? 'ln-perhatian' : 'ln-sukses'), daftarTemuanHtml(v, temuan));
}

// ---------- Popup Foto & Catatan (mode lihat) ----------
S.mi = { f: [], i: 0 };
let fokusMi = null;
function bukaItemVrv(kunci, fokus) {
  const it = (S.vrvItem || {})[kunci]; if (!it) return;
  fokusMi = document.activeElement;
  // Tombol Catatan -> popup khusus "Catatan Verval" (tanpa bagian foto); tombol Foto -> penampil foto beserta catatannya.
  const modeCatatan = fokus === 'catatan';
  $('mi-sek-foto').hidden = modeCatatan;
  document.querySelector('#modal-item .modal').classList.toggle('modal-catatan', modeCatatan);
  $('mi-catatan-judul').textContent = modeCatatan ? 'Hasil Catatan Verval' : 'Catatan';
  $('mi-bagian').textContent = (modeCatatan ? 'Catatan Verval · ' : '') + it.bagian; $('mi-judul').textContent = it.judul; $('mi-status').innerHTML = it.status;
  $('mi-catatan').textContent = it.c || 'Tidak ada catatan untuk item ini.'; $('mi-catatan').classList.toggle('teks-redup', !it.c);
  S.mi = { f: it.f.slice(), i: 0, judul: it.judul };
  const modeFoto = lampiranFoto(String(kunci).split('|')[0]);
  $('mi-foto-judul').textContent = (modeFoto ? 'Foto (' : 'File (') + it.f.length + ')';
  $('mi-foto-kosong').lastChild.textContent = modeFoto ? 'Tidak ada foto untuk item ini.' : 'Tidak ada file untuk item ini.';
  $('mi-foto-wadah').hidden = !it.f.length; $('mi-foto-kosong').hidden = !!it.f.length;
  $('mi-strip').innerHTML = it.f.map(function (fid, n) {
    const pdf = berkasPdf(fid);
    return '<button type="button" class="mi-thumb' + (pdf ? ' mi-thumb-pdf' : '') + '" data-mi="' + n + '" aria-label="' + (pdf ? 'Dokumen PDF ' : 'Foto ') + (n + 1) + ' dari ' + it.f.length + '">' + (pdf ? ik('picture_as_pdf') + '<span aria-hidden="true">PDF</span>' : '<img alt="">') + '</button>';
  }).join('');
  $('mi-strip').hidden = it.f.length < 2; $('mi-prev').hidden = $('mi-next').hidden = it.f.length < 2;
  // pratinjau kecil hanya untuk foto; PDF diunduh saat dipilih
  it.f.forEach(function (fid, n) { if (berkasPdf(fid)) return; fotoVrv(fid).then(function (u) { const b = $('mi-strip').children[n]; if (b) b.querySelector('img').src = u; if (S.mi.f[S.mi.i] === fid) tampilFotoMi(); }).catch(function () { /* diabaikan */ }); });
  $('modal-item').hidden = false;
  if (!modeCatatan) tampilFotoMi();
  setTimeout(function () { (modeCatatan ? $('mi-catatan-judul') : $('mi-tutup')).focus(); }, 30);
}
function tampilFotoMi() {
  const n = S.mi.f.length; if (!n) return;
  const fid = S.mi.f[S.mi.i], pdf = berkasPdf(fid), img = $('mi-utama'), bingkai = $('mi-pdf');
  const u = pdf ? S.vrv.blob[fid] : S.vrv.fotoCache[fid];
  $('mi-hitung').textContent = (pdf ? 'Dokumen PDF ' : 'Foto ') + (S.mi.i + 1) + ' dari ' + n + (pdf && namaBerkas(fid) ? ' · ' + namaBerkas(fid) : '');
  $('mi-foto-wadah').classList.toggle('mi-mode-pdf', pdf);
  img.alt = 'Foto ' + (S.mi.i + 1) + ' — ' + S.mi.judul;
  bingkai.title = 'Pratinjau dokumen PDF — ' + S.mi.judul;
  if (u) {
    $('mi-memuat').hidden = true;
    if (pdf) { img.hidden = true; img.removeAttribute('src'); if (bingkai.getAttribute('src') !== u) bingkai.src = u; bingkai.hidden = false; }
    else { bingkai.hidden = true; bingkai.removeAttribute('src'); img.src = u; img.hidden = false; }
  } else {
    img.hidden = true; bingkai.hidden = true; $('mi-memuat').hidden = false;
    $('mi-memuat-teks').textContent = pdf ? 'Memuat dokumen…' : 'Memuat foto…';
    (pdf ? blobBerkas(fid) : fotoVrv(fid)).then(function () { if (!$('modal-item').hidden && S.mi.f[S.mi.i] === fid) tampilFotoMi(); })
      .catch(function (err) { if (S.mi.f[S.mi.i] === fid) $('mi-memuat-teks').textContent = err.message; });
  }
  $('mi-buka').hidden = !u; $('mi-unduh').hidden = !u;
  $('mi-buka-teks').textContent = pdf ? 'Buka di tab baru' : 'Ukuran penuh';
  Array.prototype.forEach.call($('mi-strip').children, function (b, i) { b.classList.toggle('aktif', i === S.mi.i); if (i === S.mi.i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
}
function geserFotoMi(arah) { const n = S.mi.f.length; if (n < 2) return; S.mi.i = (S.mi.i + arah + n) % n; tampilFotoMi(); }
function tutupItemVrv() { if ($('modal-item').hidden) return; $('modal-item').hidden = true; $('mi-utama').removeAttribute('src'); $('mi-pdf').removeAttribute('src'); $('mi-pdf').hidden = true; if (fokusMi && fokusMi.focus) fokusMi.focus(); }
function pasangEventItemVrv() {
  $('mi-tutup').addEventListener('click', tutupItemVrv);
  $('modal-item').addEventListener('click', function (e) {
    if (e.target === this) return tutupItemVrv();
    const t = e.target.closest('[data-mi]'); if (t) { S.mi.i = +t.getAttribute('data-mi'); tampilFotoMi(); }
  });
  $('mi-prev').addEventListener('click', function () { geserFotoMi(-1); });
  $('mi-next').addEventListener('click', function () { geserFotoMi(1); });
  $('mi-buka').addEventListener('click', function () {
    const fid = S.mi.f[S.mi.i];
    if (berkasPdf(fid)) return bukaPdfVrv(fid);
    const u = S.vrv.fotoCache[fid]; if (!u) return;
    const w = window.open(); if (w) { w.document.title = S.mi.judul; w.document.body.style.margin = '0'; w.document.body.style.background = '#000'; const im = w.document.createElement('img'); im.src = u; im.style.cssText = 'max-width:100%;display:block;margin:auto'; w.document.body.appendChild(im); }
  });
  $('mi-unduh').addEventListener('click', function () {
    const fid = S.mi.f[S.mi.i];
    blobBerkas(fid).then(function (url) { unduhBerkas(url, namaBerkas(fid) || ('lampiran-verval' + (berkasPdf(fid) ? '.pdf' : '.jpg'))); }).catch(function (err) { toast(err.message, true); });
  });
  $('modal-item').addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') geserFotoMi(-1); else if (e.key === 'ArrowRight') geserFotoMi(1); });
  $('vd-isi').addEventListener('click', function (e) { const b = e.target.closest('[data-item-vrv]'); if (b) bukaItemVrv(b.getAttribute('data-item-vrv'), b.getAttribute('data-fokus')); });
}

// Status tindak lanjut per temuan: hanya wajib untuk hasil final "Layak Digunakan dengan Catatan" / "Belum Layak".
const KELAS_TL = { 'Belum Ditindaklanjuti': ['ln-bahaya', 'error'], 'Dalam Proses Perbaikan': ['ln-perhatian', 'pending'], 'Selesai Ditindaklanjuti': ['ln-sukses', 'check_circle'] };
function lnTl(t) { t = t || 'Belum Ditindaklanjuti'; return lencana(t, KELAS_TL[t][0], KELAS_TL[t][1]); }
function daftarTemuanHtml(v, temuan) {
  if (!temuan.length) return '<p class="teks-redup">Tidak ada temuan ketidaksesuaian.</p>';
  const wajib = v.StatusData === 'Final' && (v.Kesimpulan === 'Layak Digunakan dengan Catatan' || v.Kesimpulan === 'Belum Layak');
  const ubah = wajib && bolehAd('verval-input');
  const info = !wajib ? '<p class="teks-kecil teks-redup">' + (v.StatusData !== 'Final' ? 'Data masih draft — tindak lanjut dicatat setelah hasil verval disimpan final.' : 'Kesimpulan Layak Digunakan: catatan diarsipkan tanpa kewajiban tindak lanjut.') + '</p>' : '';
  return info + '<ul class="vd-temuan">' + temuan.map(function (t, n) {
    const id = 'tl-' + t.bag + '-' + t.k;
    const kanan = !wajib ? lencana('Tidak wajib ditindaklanjuti', 'ln-netral') : ubah
      ? '<label class="sr" for="' + id + '">Status tindak lanjut temuan ' + (n + 1) + '</label><select class="input input-ringkas vd-tl" id="' + id + '" data-tl="' + esc(t.bag + '|' + t.k) + '" data-lama="' + esc(t.t || 'Belum Ditindaklanjuti') + '">' +
        S.instrumen.statusTindakLanjut.map(function (o) { return '<option' + ((t.t || 'Belum Ditindaklanjuti') === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>'
      : lnTl(t.t);
    return '<li class="vd-temuan-item">' + ik('error') + '<span class="vd-temuan-teks">' + esc(t.teks) + '</span><span class="vd-temuan-tl">' + kanan + '</span></li>';
  }).join('') + '</ul>';
}
function ubahTlVerval(sel) {
  const p = sel.getAttribute('data-tl').split('|'), lama = sel.getAttribute('data-lama') || '';
  sel.disabled = true;
  panggil('ubahTindakLanjut', S.vrvDetail, p[0], p[1], sel.value).then(function (r) {
    if (S.vrv.daftar) { const i = S.vrv.daftar.findIndex(function (x) { return x.ID === r.ID; }); if (i > -1) S.vrv.daftar[i] = r; }
    sel.setAttribute('data-lama', sel.value);
    toast('Status tindak lanjut diperbarui: ' + sel.value + '.');
  }).catch(function (err) { if (lama) sel.value = lama; toast(err.message, true); }).then(function () { sel.disabled = false; });
}

// ---------- Kelola pengguna ----------
function muatPengguna(paksa) {
  if (S.ad.pengguna && !paksa) return renderPengguna();
  $('usr-body').innerHTML = '<tr><td colspan="7" class="sel-memuat">Memuat data...</td></tr>';
  panggil('listPengguna').then(function (d) { S.ad.pengguna = d; renderPengguna(); }).catch(function (e) { gagalTabel('usr-body', 7, e); });
}
function renderPengguna() {
  const rows = S.ad.pengguna || [];
  $('usr-body').innerHTML = rows.length ? rows.map(function (u, i) {
    const saya = u.ID === S.penggunaId;
    return '<tr><td class="sel-no">' + (i + 1) + '</td><td class="sel-utama nowrap">' + esc(u.NamaLengkap) + (saya ? ' <span class="lencana ln-info lencana-kecil">Anda</span>' : '') + '</td><td class="sel-mono">' + esc(u.Username) + '</td>' +
      '<td>' + lencana(u.Role, u.Role === 'Admin' ? 'ln-merah' : u.Role === 'Petugas Verval' ? 'ln-info' : 'ln-teal') + '</td><td class="tc">' + (u.Aktif === 'Tidak' ? lencana('Dicabut', 'ln-bahaya', 'block') : lencana('Aktif', 'ln-sukses', 'check_circle')) + '</td>' +
      '<td class="nowrap">' + tglBln(u.Dibuat) + '</td><td class="tc"><div class="aksi-sel"><button type="button" class="btn btn-ikon btn-hantu btn-kecil" data-ubah-usr="' + esc(u.ID) + '" aria-label="Ubah pengguna ' + esc(u.Username) + '">' + ik('edit') + '</button>' +
      (saya ? '' : '<button type="button" class="btn btn-ikon btn-hantu btn-kecil teks-merah" data-hapus-usr="' + esc(u.ID) + '" aria-label="Hapus pengguna ' + esc(u.Username) + '">' + ik('delete') + '</button>') + '</div></td></tr>';
  }).join('') : '<tr><td colspan="7" class="sel-kosong">Belum ada pengguna.</td></tr>';
}
function formPengguna(id) {
  const u = id ? (S.ad.pengguna || []).filter(function (x) { return x.ID === id; })[0] : null;
  $('dr-usr-judul').textContent = u ? 'Ubah Pengguna' : 'Tambah Pengguna';
  $('uf-id').value = u ? u.ID : ''; $('uf-nama').value = u ? u.NamaLengkap : ''; $('uf-user').value = u ? u.Username : '';
  $('uf-peran').value = u ? u.Role : 'Petugas Verval'; $('uf-aktif').value = u ? (u.Aktif || 'Ya') : 'Ya';
  $('uf-pass').value = ''; $('uf-pass2').value = '';
  $('uf-pass-label').innerHTML = u ? 'Password baru <span class="teks-redup">(kosongkan bila tidak diganti)</span>' : 'Password <abbr title="wajib">*</abbr>';
  const saya = u && u.ID === S.penggunaId;
  $('uf-peran').disabled = !!saya; $('uf-aktif').disabled = !!saya;
  bukaDrawer('dr-pengguna');
}
function simpanUsr(e) {
  e.preventDefault();
  try {
    wajibIsi(['uf-nama', 'uf-user']);
    const p1 = $('uf-pass').value, p2 = $('uf-pass2').value;
    if (!$('uf-id').value && !p1) { $('uf-pass').classList.add('salah'); $('uf-pass').focus(); throw new Error('Password wajib diisi untuk pengguna baru.'); }
    if (p1 && (p1.length < 8 || !/[A-Za-z]/.test(p1) || !/\d/.test(p1))) { $('uf-pass').classList.add('salah'); $('uf-pass').focus(); throw new Error('Password minimal 8 karakter dan mengandung huruf serta angka.'); }
    if (p1 !== p2) { $('uf-pass2').classList.add('salah'); $('uf-pass2').focus(); throw new Error('Ulangi password tidak sama.'); }
  } catch (err) { return toast(err.message, true); }
  const d = { ID: $('uf-id').value, NamaLengkap: $('uf-nama').value.trim(), Username: $('uf-user').value.trim(), Role: $('uf-peran').value, Aktif: $('uf-aktif').value, PasswordBaru: $('uf-pass').value };
  const btn = $('uf-simpan'); sibuk(btn, true);
  panggil('simpanPengguna', d).then(function (r) { gantiBaris(S.ad, 'pengguna', r); renderPengguna(); tutupDrawer(); toast(d.ID ? 'Data pengguna diperbarui.' : 'Pengguna baru ditambahkan.'); })
    .catch(function (err) { toast(err.message, true); }).then(function () { sibuk(btn, false); $('uf-pass').value = ''; $('uf-pass2').value = ''; });
}
function hapusUsr(id) {
  const u = (S.ad.pengguna || []).filter(function (x) { return x.ID === id; })[0]; if (!u) return;
  konfirmasi({ judul: 'Hapus Pengguna?', teks: 'Akun <b>' + esc(u.Username) + '</b> (' + esc(u.NamaLengkap) + ') akan dihapus dan tidak dapat login lagi.' }).then(function (ok) {
    if (!ok) return;
    panggil('hapusPengguna', id).then(function () { S.ad.pengguna = S.ad.pengguna.filter(function (x) { return x.ID !== id; }); renderPengguna(); toast('Pengguna dihapus.'); }).catch(function (err) { toast(err.message, true); });
  });
}
function pasangEventVerval() {
  $('vrk-muat').addEventListener('click', function () { muatRekapVerval(true); });
  ['vrk-periode', 'vrk-kec', 'vrk-kel', 'vrk-status'].forEach(function (id) { $(id).addEventListener('change', function () { S.st.vrk.hal = 1; renderRekapVerval(); }); });
  pasangTooltipGrafik();
  ['vrd-kec', 'vrd-status', 'vrd-data'].forEach(function (id) { $(id).addEventListener('change', function () { S.st.vrd.hal = 1; renderDaftarVerval(); }); });
  $('vrd-cari').addEventListener('input', tunda(function () { S.st.vrd.hal = 1; renderDaftarVerval(); }));
  $('vf-kop').addEventListener('change', function () { aturKecVf(); S.vf.kotor = true; });
  $('vf-kes').addEventListener('change', aturKesVf);
  const form = $('form-verval');
  form.addEventListener('input', function (e) {
    const t = e.target, key = t.getAttribute && t.getAttribute('data-vf');
    S.vf.kotor = true;
    if (!key) return;
    const p = key.split('|');
    if (p[0] === 'sarpras' && p[2] === 'r') batasRealisasiVf(t, p[1]);
    S.vf.data[p[0]][p[1]][p[2]] = t.value.trim ? (p[2] === 'c' ? t.value : t.value.trim()) : t.value;
    hitungSumVf(p[0]);
  });
  form.addEventListener('change', function (e) {
    const t = e.target;
    if (t.matches && t.matches('[data-unggah-vf]')) return unggahFotoVf(t);
    const key = t.getAttribute && t.getAttribute('data-vf');
    if (key) { const p = key.split('|'); S.vf.data[p[0]][p[1]][p[2]] = t.value; hitungSumVf(p[0]); S.vf.kotor = true; }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); simpanVf('Final'); });
  $('vf-draft').addEventListener('click', function () { simpanVf('Draft'); });
  $('vf-kembali').addEventListener('click', function () { keluarFormVf(function () { bukaAd('verval-daftar'); }); });
  $('vd-kembali').addEventListener('click', function () { bukaAd('verval-daftar'); });
  $('vd-ubah').addEventListener('click', function () { S.vfBuka = { id: S.vrvDetail }; bukaAd('verval-input'); });
  $('vf-lihat').addEventListener('click', function () { const id = $('vf-id').value; if (id) keluarFormVf(function () { bukaDetailVerval(id); }); });
  document.addEventListener('keydown', function (e) {
    const t = e.target.closest && e.target.closest('.vf-thumb[data-fid]');
    if (t && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('.vf-thumb-hapus')) { e.preventDefault(); t.click(); }
  });
  $('vd-isi').addEventListener('focusin', function (e) { if (e.target.matches('.vd-tl') && !e.target.getAttribute('data-lama')) e.target.setAttribute('data-lama', e.target.value); });
  $('vd-isi').addEventListener('change', function (e) { if (e.target.matches('.vd-tl')) ubahTlVerval(e.target); });
  $('usr-tambah').addEventListener('click', function () { formPengguna(''); });
  $('form-pengguna').addEventListener('submit', simpanUsr);
  window.addEventListener('beforeunload', function (e) { if (S.adAktif === 'verval-input' && S.vf.kotor) { e.preventDefault(); e.returnValue = ''; } });
}
function klikVerval(e) {
  const hf = e.target.closest('[data-hapus-foto]');
  if (hf) {
    e.stopPropagation();
    const w = hf.closest('.vf-foto'), bag = w.getAttribute('data-bag'), k = w.getAttribute('data-k'), id = hf.getAttribute('data-hapus-foto');
    S.vf.data[bag][k].f = S.vf.data[bag][k].f.filter(function (x) { return x !== id; }); S.vf.kotor = true; renderFotoVf(bag, k);
    toast('File dilepas dari formulir. Simpan untuk menghapusnya permanen.');
    return true;
  }
  const th = e.target.closest('.vf-thumb[data-fid]');
  if (th) {
    const id = th.getAttribute('data-fid'), label = (th.getAttribute('aria-label') || '').replace(/^Lihat foto /, '');
    if (th.classList.contains('vf-thumb-pdf')) { bukaPdfVrv(id); return true; }
    fotoVrv(id).then(function (u) { bukaFoto(u, 'Foto Verval · ' + label, 'Dokumen privat — hanya untuk pengguna berwenang', ''); }).catch(function (err) { toast(err.message, true); });
    return true;
  }
  const lv = e.target.closest('[data-lihat-vrv]'); if (lv) { bukaDetailVerval(lv.getAttribute('data-lihat-vrv')); return true; }
  const uv = e.target.closest('[data-ubah-vrv]'); if (uv) { S.vfBuka = { id: uv.getAttribute('data-ubah-vrv') }; bukaAd('verval-input'); return true; }
  const iv = e.target.closest('[data-input-vrv]'); if (iv) { S.vfBuka = { idKop: iv.getAttribute('data-input-vrv') }; bukaAd('verval-input'); return true; }
  const hv = e.target.closest('[data-hapus-vrv]'); if (hv) { hapusVrv(hv.getAttribute('data-hapus-vrv')); return true; }
  const uu = e.target.closest('[data-ubah-usr]'); if (uu) { formPengguna(uu.getAttribute('data-ubah-usr')); return true; }
  const hu = e.target.closest('[data-hapus-usr]'); if (hu) { hapusUsr(hu.getAttribute('data-hapus-usr')); return true; }
  return false;
}
function bersihkanVerval() {
  Object.keys((S.vrv && S.vrv.blob) || {}).forEach(function (k) { try { URL.revokeObjectURL(S.vrv.blob[k]); } catch (e) { /* abaikan */ } });
  S.vrv = { daftar: null, fotoCache: {}, antrean: [], aktifUnduh: 0, info: {}, blob: {} }; S.vf = { data: {}, kotor: false, unggah: 0 }; S.vrvDetail = ''; S.vfBuka = null; S.vrvItem = {};
  ['vd-isi', 'vf-administrasi', 'vf-fisik', 'vf-sarpras', 'vf-dokumentasi'].forEach(function (id) { $(id).innerHTML = ''; });
  ['vrk-body', 'vrd-body', 'usr-body', 'g-dok', 'g-fisik', 'g-sarpras', 'g-tl', 'g-aspek'].forEach(function (id) { $(id).innerHTML = ''; });
  $('form-verval').reset();
}
// ===== AKHIR BLOK: M14_HASIL_VERVAL =====


// ===== BLOK: EVENT =====
// Mobile/tablet: tombol Asisten disembunyikan sementara saat menggulir ke bawah (agar tidak menutupi konten
// yang sedang dibaca) dan muncul lagi saat menggulir ke atas atau berhenti di dasar halaman.
function pasangFabGulir() {
  const fab = $('fab-asisten'), mq = window.matchMedia('(max-width: 1023px)');
  let lalu = window.scrollY;
  window.addEventListener('scroll', function () {
    const y = window.scrollY, dasar = y + innerHeight >= document.documentElement.scrollHeight - 4;
    if (!mq.matches || dasar || y < 80) fab.classList.remove('fab-sembunyi');
    else if (y > lalu + 6) fab.classList.add('fab-sembunyi');
    else if (y < lalu - 6) fab.classList.remove('fab-sembunyi');
    lalu = y;
  }, { passive: true });
  fab.addEventListener('focus', function () { fab.classList.remove('fab-sembunyi'); });
}
function pasangEvent() {
  pasangFabGulir();
  document.addEventListener('click', function (e) {
    const tema = e.target.closest('[data-tema-toggle]');
    if (tema) return terapkanTema(document.documentElement.getAttribute('data-tema') === 'gelap' ? 'terang' : 'gelap', true);
    const as = e.target.closest('[data-asisten]');
    if (as) { e.preventDefault(); return $('asisten').hidden ? bukaAsisten() : tutupAsisten(); }
    const topik = e.target.closest('[data-topik]');
    if (topik) return tanyaAsisten(topik.getAttribute('data-topik'), topik.textContent);
    if (!$('app-admin').hidden && klikVerval(e)) return;
    const eks = e.target.closest('[data-ekspor-kop]');
    if (eks) { e.preventDefault(); return eksporRekapKop(eks); }
    const masuk = e.target.closest('[data-masuk]');
    if (masuk) { e.preventDefault(); return bukaLogin(masuk.getAttribute('data-masuk')); }
    const go = e.target.closest('[data-go]');
    if (go) { e.preventDefault(); return go.getAttribute('data-go') === 'login' ? bukaLogin() : bukaHal(go.getAttribute('data-go')); }
    const ad = e.target.closest('[data-ad]');
    if (ad) { e.preventDefault(); return bukaAd(ad.getAttribute('data-ad')); }
    const brt = e.target.closest('[data-berita]');
    if (brt) { e.preventDefault(); return bukaHal('detail', brt.getAttribute('data-berita')); }
    const tg = e.target.closest('[data-tagar]');
    if (tg) { e.preventDefault(); $('brt-cari').value = tg.getAttribute('data-tagar'); S.st.brt.kat = ''; S.st.brt.hal = 1; return bukaHal('berita'); }
    const sl = e.target.closest('[data-slide]');
    if (sl) return geserSlide(0, +sl.getAttribute('data-slide'), true);
    const ig = e.target.closest('[data-ig]');
    if (ig) { S.ig.idx = +ig.getAttribute('data-ig'); return tampilInfografis(true); }
    const buka = e.target.closest('[data-buka]');
    if (buka) return window.open(buka.getAttribute('data-buka'), '_blank', 'noopener');
    const kec = e.target.closest('[data-kec]');
    if (kec) return pilihKecamatan(kec.getAttribute('data-kec'));
    if (e.target.closest('[data-kec-reset]')) return pilihKecamatan(S.kecPilih);
    const pk = e.target.closest('[data-pus-kat]');
    if (pk) { S.st.pus.kat = pk.getAttribute('data-pus-kat'); S.st.pus.hal = 1; return renderPustaka(); }
    const bk = e.target.closest('#brt-chips [data-kat]');
    if (bk) { S.st.brt.kat = bk.getAttribute('data-kat'); S.st.brt.hal = 1; return renderBerita(); }
    const fdb = e.target.closest('[data-foto-db]');
    if (fdb) {
      const g = (S.pub.dashboard.gerai || []).filter(function (x) { return x.ID === fdb.getAttribute('data-foto-db'); })[0];
      if (g) bukaFoto(g.FotoURL, 'Dokumentasi Gerai ' + g.NamaKKMP, 'Kelurahan ' + g.Kelurahan + ', Kota Ternate', 'Progres fisik ' + g.ProgresFisik + '%');
      return;
    }
    const fg = e.target.closest('[data-foto-ger]');
    if (fg) {
      const g = (S.ad.gerai || []).filter(function (x) { return x.ID === fg.getAttribute('data-foto-ger'); })[0];
      if (g) bukaFoto(g.FotoURL, 'Dokumentasi Gerai ' + g.NamaKKMP, 'Kelurahan ' + g.Kelurahan + ', Kota Ternate', 'Progres fisik ' + g.ProgresFisik + '%');
      return;
    }
    if (e.target.closest('[data-tutup]')) return tutupDrawer();
    const aksi = [
      ['data-ubah-kop', formKop], ['data-hapus-kop', hapusKop], ['data-ubah-rat', formRat], ['data-hapus-rat', hapusRat],
      ['data-ubah-ger', formGerai], ['data-hapus-ger', hapusGer], ['data-ubah-kb', formKb], ['data-hapus-kb', hapusKb], ['data-salin-kb', salinTautanKb],
      ['data-ubah-kp', formKp], ['data-hapus-kp', hapusKp], ['data-ubah-sl', formSlider], ['data-hapus-sl', hapusSl],
      ['data-ubah-ig', formIg], ['data-hapus-ig', hapusIg], ['data-ps', pilihPesan]
    ];
    for (let i = 0; i < aksi.length; i++) {
      const el = e.target.closest('[' + aksi[i][0] + ']');
      if (el) { e.stopPropagation(); return aksi[i][1](el.getAttribute(aksi[i][0])); }
    }
    const pl = e.target.closest('[data-pilih-sl]');
    if (pl) return formSlider(pl.getAttribute('data-pilih-sl'));
    const ps = e.target.closest('[data-pesan]');
    if (ps) { bukaAd('pesan'); return muatPesan(false, ps.getAttribute('data-pesan')); }
  });

  $('hero-prev').addEventListener('click', function () { geserSlide(-1, undefined, true); });
  $('hero-next').addEventListener('click', function () { geserSlide(1, undefined, true); });
  $('ig-prev').addEventListener('click', function () { geserIg(-1); });
  $('ig-next').addEventListener('click', function () { geserIg(1); });
  const heroArea = document.querySelector('.hero-utama');
  heroArea.addEventListener('mouseenter', function () { S.hero.hover = true; hentikanHero(); });
  heroArea.addEventListener('mouseleave', function () { S.hero.hover = false; if (S.halAktif === 'beranda') mulaiHero(); });
  heroArea.addEventListener('focusin', hentikanHero);

  pasangTab([$('tab-kel'), $('tab-rat'), $('tab-gerai')]);
  document.querySelectorAll('#kec-metrik .segmen-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      S.kecMetrik = b.getAttribute('data-metrik');
      document.querySelectorAll('#kec-metrik .segmen-btn').forEach(function (x) { const a = x === b; x.classList.toggle('aktif', a); x.setAttribute('aria-checked', a ? 'true' : 'false'); });
      renderKecChart();
    });
  });
  $('db-kel-kec').addEventListener('change', function () { S.kecPilih = this.value; S.st.dbKel.hal = 1; renderKecChart(); renderDbKel(); });
  $('db-kel-cari').addEventListener('input', tunda(function () { S.st.dbKel.hal = 1; renderDbKel(); }));
  $('db-rat-kec').addEventListener('change', function () { S.st.dbRat.hal = 1; renderDbRat(); });
  $('db-rat-cari').addEventListener('input', tunda(function () { S.st.dbRat.hal = 1; renderDbRat(); }));
  $('db-gerai-cari').addEventListener('input', tunda(function () { S.st.dbGer.hal = 1; renderDbGerai(); }));
  $('btn-ekspor').addEventListener('click', eksporGerai);

  $('pus-per').addEventListener('change', function () { S.st.pus.per = +this.value; S.st.pus.hal = 1; renderPustaka(); });
  $('pus-urut').addEventListener('change', function () { S.st.pus.urut = this.value; S.st.pus.hal = 1; renderPustaka(); });
  $('pus-cari').addEventListener('input', tunda(function () { S.st.pus.hal = 1; renderPustaka(); }));
  $('brt-cari').addEventListener('input', tunda(function () { S.st.brt.hal = 1; renderBerita(); }));

  window.addEventListener('scroll', aturProgresBaca, { passive: true });
  $('dt-print').addEventListener('click', function () { window.print(); });
  $('dt-copy').addEventListener('click', function () { salinTeks(tautanBerita(S.pub.detailId) || $('dt-judul').textContent).then(function (ok) { toast(ok ? 'Tautan berita disalin.' : 'Tautan tidak dapat disalin otomatis.', !ok); }); });
  $('dt-share').addEventListener('click', function () {
    const url = tautanBerita(S.pub.detailId), judul = $('dt-judul').textContent;
    if (navigator.share) navigator.share({ title: judul, text: judul, url: url || undefined }).catch(function () { /* dibatalkan pengguna */ });
    else salinTeks(url || judul).then(function (ok) { toast(ok ? 'Tautan berita disalin untuk dibagikan.' : 'Tautan tidak dapat disalin otomatis.', !ok); });
  });
  $('dt-manfaat').addEventListener('click', function () {
    const id = S.pub.detailId, btn = this;
    if (!id || sudahManfaat(id)) return;
    btn.disabled = true;
    panggil('publikBermanfaat', id).then(function (r) {
      tandaiManfaat(id); $('dt-manfaat-teks').textContent = 'Bermanfaat (' + r.JumlahBermanfaat + ')';
      if (S.pub.detailCache && S.pub.detailCache[id]) S.pub.detailCache[id].berita.JumlahBermanfaat = r.JumlahBermanfaat;
      toast('Terima kasih atas penilaian Anda.');
    }).catch(function (err) { btn.disabled = false; toast(err.message, true); });
  });

  $('kt-salin').addEventListener('click', function () { salinTeks((S.cfg.office_name ? S.cfg.office_name + ', ' : '') + (S.cfg.office_address || '')).then(function (ok) { toast(ok ? 'Alamat disalin.' : 'Alamat tidak dapat disalin otomatis.', !ok); }); });
  $('form-kontak').addEventListener('submit', kirimKontak);
  $('kt-captcha-baru').addEventListener('click', function () { muatCaptcha(); $('kt-captcha').focus(); });
  $('kt-captcha').addEventListener('input', function () { galatCaptcha(''); });
  document.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('salah')) { e.target.classList.remove('salah'); e.target.removeAttribute('aria-invalid'); } });

  $('form-login').addEventListener('submit', prosesLogin);
  $('login-mata').addEventListener('click', function () {
    const p = $('login-pass'), lihat = p.type === 'password';
    p.type = lihat ? 'text' : 'password';
    $('login-mata-ikon').textContent = lihat ? 'visibility_off' : 'visibility';
    this.setAttribute('aria-pressed', lihat ? 'true' : 'false');
    this.setAttribute('aria-label', lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
  });

  $('btn-logout').addEventListener('click', keluar);
  pasangEventVerval();
  pasangEventItemVrv();
  $('ad-toggle').addEventListener('click', function () { if ($('ad-sidebar').classList.contains('buka')) tutupSidebar(); else bukaSidebar(); });
  $('ad-backdrop').addEventListener('click', tutupSidebar);
  // Formulir hanya ditutup lewat tombol × atau Batal (klik di luar bingkai tidak menutup)
  $('rk-muat').addEventListener('click', function () { muatRingkasan(true); });

  $('kop-tambah').addEventListener('click', function () { formKop(''); });
  $('kop-filter-kec').addEventListener('change', function () { S.st.kop.hal = 1; renderKop(); });
  $('kop-cari').addEventListener('input', tunda(function () { S.st.kop.hal = 1; renderKop(); }));
  $('form-koperasi').addEventListener('submit', simpanKop);
  pasangEventKop();
  $('rat-tambah').addEventListener('click', function () { formRat(''); });
  ['rat-filter-tahun', 'rat-filter-status'].forEach(function (id) { $(id).addEventListener('change', function () { S.st.rat.hal = 1; renderRat(); }); });
  $('rat-cari').addEventListener('input', tunda(function () { S.st.rat.hal = 1; renderRat(); }));
  $('form-rat').addEventListener('submit', simpanRat);
  $('ger-tambah').addEventListener('click', function () { formGerai(''); });
  ['ger-filter-lahan', 'ger-filter-verval'].forEach(function (id) { $(id).addEventListener('change', function () { S.st.ger.hal = 1; renderGerai(); }); });
  $('ger-cari').addEventListener('input', tunda(function () { S.st.ger.hal = 1; renderGerai(); }));
  $('form-gerai').addEventListener('submit', simpanGer);
  $('gf-kop').addEventListener('change', function () { aturStatusOtomatisGf(null); });
  $('gf-simkopdes').addEventListener('change', function () { S.gfSimkopdes = this.value; });
  $('gf-foto').addEventListener('change', function () { const f = this.files[0]; if (f) $('gf-foto-box').innerHTML = '<img class="img-cover" src="' + URL.createObjectURL(f) + '" alt="Pratinjau foto baru">'; });

  $('brt-tambah').addEventListener('click', function () { formKb(''); });
  ['kb-filter-kategori', 'kb-filter-status'].forEach(function (id) { $(id).addEventListener('change', function () { S.st.kb.hal = 1; renderKb(); }); });
  $('kb-cari').addEventListener('input', tunda(function () { S.st.kb.hal = 1; renderKb(); }));
  $('form-berita').addEventListener('submit', simpanKb);
  $('bf-ringkasan').addEventListener('input', hitungRingkasan);
  $('bf-file').addEventListener('change', function () { const f = this.files[0]; if (!f) return; $('bf-file-nama').textContent = f.name; $('bf-thumb').innerHTML = '<img class="img-cover" src="' + URL.createObjectURL(f) + '" alt="Pratinjau gambar sampul baru">'; });
  document.querySelectorAll('.editor-btn').forEach(function (b) { b.addEventListener('click', function () { formatEditor(b.getAttribute('data-format')); }); });

  $('kp-tambah').addEventListener('click', function () { formKp(''); });
  $('kp-sinkron').addEventListener('click', function () { muatKp(true); });
  ['kp-filter-kategori', 'kp-filter-status'].forEach(function (id) { $(id).addEventListener('change', function () { S.st.kp.hal = 1; renderKp(); }); });
  $('kp-cari').addEventListener('input', tunda(function () { S.st.kp.hal = 1; renderKp(); }));
  $('form-pustaka').addEventListener('submit', simpanKp);
  document.querySelectorAll('.pf-tab').forEach(function (t) { t.addEventListener('click', function () { setSumber(t.getAttribute('data-sumber')); }); });
  $('pf-file').addEventListener('change', function () { if (this.files[0]) $('pf-file-nama').textContent = this.files[0].name; });
  const zona = $('pf-panel-unggah');
  zona.addEventListener('dragover', function (e) { e.preventDefault(); });
  zona.addEventListener('drop', function (e) { e.preventDefault(); if (e.dataTransfer.files.length) { $('pf-file').files = e.dataTransfer.files; $('pf-file-nama').textContent = e.dataTransfer.files[0].name; } });

  aktifkanTabKonten = pasangTab(Array.prototype.slice.call(document.querySelectorAll('.kn-tab')));
  $('kn-tambah-slider').addEventListener('click', function () { aktifkanTabKonten(0); formSlider(''); $('sl-nama').focus(); });
  $('form-slider').addEventListener('submit', simpanSl);
  $('sl-batal').addEventListener('click', function () { formSlider(S.slEdit); });
  ['sl-kapsul', 'sl-judul', 'sl-sub'].forEach(function (id) { $(id).addEventListener('input', pratinjauSlider); });
  $('sl-file').addEventListener('change', function () { const f = this.files[0]; if (!f) return; $('sl-file-nama').textContent = f.name; S.slGambar = URL.createObjectURL(f); pratinjauSlider(); });
  $('ig-tambah').addEventListener('click', function () { formIg(''); });
  $('form-infografis').addEventListener('submit', simpanIg);
  $('if-file').addEventListener('change', function () { if (this.files[0]) $('if-file-nama').textContent = this.files[0].name; });
  document.querySelectorAll('.btn-simpan-cfg').forEach(function (b) { b.addEventListener('click', function () { simpanCfg(b); }); });

  $('ps-refresh').addEventListener('click', function () { muatPesan(true); });
  $('ps-filter').addEventListener('change', renderPesan);
  $('ps-cari').addEventListener('input', tunda(renderPesan));
  $('ps-simpan').addEventListener('click', simpanStatusPesan);
  $('ps-hapus').addEventListener('click', hapusPesanIni);
  $('ps-salin').addEventListener('click', function () { salinTeks($('ps-isi').textContent).then(function (ok) { toast(ok ? 'Isi pesan disalin.' : 'Teks tidak dapat disalin otomatis.', !ok); }); });

  $('mh-batal').addEventListener('click', function () { tutupKonfirmasi(false); });
  $('mh-ok').addEventListener('click', function () { tutupKonfirmasi(true); });
  $('modal-hapus').addEventListener('click', function (e) { if (e.target === this) tutupKonfirmasi(false); });
  $('mf-tutup').addEventListener('click', tutupFoto);
  $('modal-foto').addEventListener('click', function (e) { if (e.target === this) tutupFoto(); });

  $('as-tutup').addEventListener('click', tutupAsisten);
  $('as-kec').addEventListener('change', function () { isiFilterAsisten(); });
  $('as-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const q = $('as-input').value.trim(); if (!q) return;
    $('as-input').value = ''; tanyaAsisten('bebas', q);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('modal-hapus').hidden) return tutupKonfirmasi(false);
    if (!$('modal-foto').hidden) return tutupFoto();
    if (!$('modal-item').hidden) return tutupItemVrv();
    if (!$('modal-impor').hidden) return tutupImpor();
    if (document.querySelector('.drawer.buka')) return tutupDrawer();
    if (!$('asisten').hidden) return tutupAsisten();
    if ($('ad-sidebar').classList.contains('buka')) { tutupSidebar(); $('ad-toggle').focus(); }
  });
  if (MODE_API) {
    window.addEventListener('popstate', function (e) { const st = e.state || parameterUrl(); if (!$('app-publik').hidden || st.hal) bukaHal(st.hal || 'beranda', st.id, true); });
  } else if (google.script.history) {
    google.script.history.setChangeHandler(function (e) { const st = e.state || {}; if (!$('app-publik').hidden || st.hal) bukaHal(st.hal || 'beranda', st.id, true); });
  }
}
// ===== AKHIR BLOK: EVENT =====


// ===== BLOK: MULAI =====
const VERSI_UI = '2026.11.26-1';
// Peringatan yang terlihat bila aplikasi gagal dimuat (mis. file Index/Style/Script/Code tidak sinkron setelah ditempel).
function tampilGalatMuat(pesan) {
  if (document.getElementById('galat-muat')) { document.getElementById('galat-muat-teks').innerHTML += '<br>' + pesan; return; }
  const d = document.createElement('div');
  d.id = 'galat-muat'; d.className = 'galat-muat'; d.setAttribute('role', 'alert');
  d.innerHTML = '<span id="galat-muat-teks">' + pesan + '</span><button type="button" onclick="location.reload()">Muat ulang</button>';
  document.body.appendChild(d);
  const p = document.getElementById('pemuat-awal'); if (p) p.hidden = true;
}
function cekVersi(versiServer) {
  const meta = document.querySelector('meta[name="kkmp-versi"]');
  const vIndex = meta ? meta.content : '(lama)';
  const vStyle = (getComputedStyle(document.documentElement).getPropertyValue('--kkmp-versi') || '').trim().replace(/['"]/g, '') || '(lama)';
  const vServer = versiServer || '(lama)';
  const beda = [];
  if (vIndex !== VERSI_UI) beda.push('Index (' + vIndex + ')');
  if (vStyle !== VERSI_UI) beda.push('Style (' + vStyle + ')');
  if (vServer !== VERSI_UI) beda.push('Code.gs (' + vServer + ')');
  if (beda.length) tampilGalatMuat('<b>File aplikasi tidak sinkron.</b> Versi Script ' + VERSI_UI + ', tetapi ' + beda.join(', ') + ' berbeda. ' + (MODE_API ? 'Perbarui frontend di GitHub (index.html, css/, js/) dan Code.gs di Apps Script dari paket yang sama, lalu buat <b>Versi baru</b> pada Kelola deployment.' : 'Tempel ulang keempat file (Code, Index, Style, Script) dari folder redesain-v2, simpan, lalu buat <b>Versi baru</b> pada Kelola deployment.'));
}
(function mulai() {
  let galat = null;
  try {
    terapkanTema(document.documentElement.getAttribute('data-tema') || 'gelap', false);
    if ($('login-bg')) $('login-bg').style.backgroundImage = 'url("' + ASET.login + '")';
    isiCfg(); pasangEvent();
  } catch (e) { galat = e; if (window.console) console.error(e); }
  // Pengaman: jangan pernah tertahan di layar memuat tanpa penjelasan.
  const batas = setTimeout(function () {
    if ($('pemuat-awal') && !$('pemuat-awal').hidden) tampilGalatMuat('<b>Portal terlalu lama dimuat.</b> Periksa koneksi internet, lalu pilih Muat ulang. Bila tetap terjadi, pastikan deployment Apps Script sudah memakai <b>Versi baru</b>' + (MODE_API ? ' dan <b>GAS_URL</b> di js/config.js sudah benar' : '') + '.');
  }, 25000);
  const lanjut = function (p) {
    muatPublik().then(function (d) {
      clearTimeout(batas);
      $('pemuat-awal').hidden = true;
      if (S.galatMuat) tampilGalatMuat('<b>Data portal gagal dimuat:</b> ' + esc(S.galatMuat));
      else cekVersi(S.versiServer);
      if (galat) tampilGalatMuat('<b>Sebagian fungsi gagal dijalankan:</b> ' + esc(galat.message) + '. Kemungkinan Index.html dan Script.html berasal dari versi berbeda.');
      if (p.hal === 'verval') return bukaLogin('verval-rekap');
      if (p.hal === 'ekspor') return bukaLogin('ekspor-koperasi');
      if (p.hal === 'login' || p.hal === 'admin') return bukaLogin();
      bukaHal(p.hal || 'beranda', p.id, true);
    }).catch(function (e) { clearTimeout(batas); tampilGalatMuat('<b>Portal gagal dimuat:</b> ' + esc(e && e.message ? e.message : String(e))); });
  };
  if (MODE_API) lanjut(parameterUrl());
  else {
    try { google.script.url.getLocation(function (loc) { lanjut((loc && loc.parameter) || {}); }); }
    catch (e) { lanjut({}); }
  }
})();
// ===== AKHIR BLOK: MULAI =====

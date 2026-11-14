# Panduan Instalasi — Portal Monitoring KKMP Kota Ternate
### Frontend di GitHub Pages + Backend di Google Apps Script (REST API)

Versi aplikasi: **2026.11.14-1**

---

## Gambaran singkat

```
Pengunjung ──► GitHub Pages (https://USERNAME.github.io/kkmp-ternate/)
                   │  index.html · css/ · js/ · img/
                   │  fetch() POST (text/plain, JSON)
                   ▼
               Google Apps Script (…/exec)  ──►  Google Sheets + Google Drive
                   Code.gs (proyek yang SAMA dengan sekarang)
```

- **Data tidak dipindahkan.** Spreadsheet, folder Drive, akun pengguna, dan hasil verval tetap sama.
- **Login tetap berlaku.** Setiap permintaan diperiksa sesi dan perannya di server.
- **Portal lama di script.google.com sudah dihapus.** Alamat …/exec kini hanya berfungsi sebagai backend API. Pengunjung yang membuka alamat lama otomatis **dialihkan** ke GitHub Pages, termasuk tautan lama ke berita, setelah `url_portal` diisi (Bagian D).

---

## BAGIAN A — Backend (Google Apps Script)

Kerjakan di proyek Apps Script yang **sudah ada**. Jangan membuat proyek baru.

1. Buka spreadsheet portal, lalu **Ekstensi › Apps Script**.
2. Tempel **Code.gs** dari folder `redesain-v2` (ganti seluruh isinya), lalu klik **Simpan**.
3. **Hapus** file **Index, Style, Script, dan Logo** dari proyek Apps Script (klik ⋮ di samping nama file › Hapus). File-file itu tidak dipakai lagi, karena tampilan sekarang ada di GitHub Pages.
   > File Index/Style/Script/Logo.html di folder `redesain-v2` tetap disimpan sebagai **sumber** untuk membangun frontend. Jangan dihapus dari komputer.
4. **Terapkan › Kelola deployment** › ikon pensil (Edit) › **Versi: Versi baru** › **Terapkan**. Pastikan pengaturannya:
   - Jalankan sebagai: **Saya**
   - Siapa yang memiliki akses: **Siapa saja**
5. **Salin URL aplikasi web** (diakhiri `/exec`). URL ini sama dengan alamat portal lama, dan sekarang menjadi alamat backend API.
6. **Uji backend:** buka di browser `URL_EXEC?api=ping`. Contoh:
   `https://script.google.com/macros/s/AKfy..../exec?api=ping`
   Hasilnya harus berupa teks JSON seperti:
   `{"ok":true,"data":{"aplikasi":"Portal Monitoring KKMP Kota Ternate","versi":"2026.11.14-1",...}}`

---

## BAGIAN B — Frontend (GitHub Pages)

### B1. Siapkan folder

Folder frontend bernama **`kkmp-ternate`** (ada di folder `redesain-v2\kkmp-ternate`, atau hasil ekstrak `kkmp-ternate.zip`). Isinya:

```
kkmp-ternate\            ◄── folder ini yang di-git init
├── index.html
├── README.md
├── PANDUAN-INSTALASI.md
├── .nojekyll
├── css\style.css
├── img\logo.png
└── js\
    ├── config.js
    └── app.js
```

> ⚠️ `index.html` **harus** berada langsung di dalam `kkmp-ternate`. Jangan menjalankan `git init` di folder induknya (`redesain-v2`). Kalau salah folder, situs akan 404 tanpa pesan error apa pun.

### B2. Isi alamat backend

Buka `js\config.js` dengan Notepad, lalu ganti `XXXX` dengan URL `/exec` dari Bagian A langkah 5:

```js
window.KKMP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfy..../exec'
};
```

Simpan file tersebut.

### B3. Install Git & identitas (sekali saja)

1. Unduh dan install Git: https://git-scm.com/download/win (pengaturan default).
2. Buka **PowerShell**, lalu cek: `git --version`
3. Atur identitas:
   ```
   git config --global user.name "Nama Anda"
   git config --global user.email "email-akun-github@contoh.com"
   ```

### B4. Buat repository di GitHub

github.com › tombol **+** › **New repository**:
- Repository name: **`kkmp-ternate`**
- Visibility: **Public** (wajib untuk GitHub Pages gratis; file frontend tidak berisi rahasia)
- **Jangan** centang README / .gitignore / license
- Klik **Create repository**

### B5. Kirim (push) frontend ke GitHub

Buka folder `kkmp-ternate` di File Explorer, klik address bar, ketik `powershell`, lalu Enter. Jalankan satu per satu:

```
dir
```
Pastikan `index.html`, `css`, `js`, dan `img` terlihat. Kalau yang terlihat justru folder `kkmp-ternate`, ketik `cd kkmp-ternate` dulu.

```
git init
git add .
git commit -m "Upload pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/kkmp-ternate.git
git push -u origin main
```

Saat `git push` meminta:
- **Username:** username GitHub Anda
- **Password:** tempel **Personal Access Token**, bukan password akun

> Saat menempel token, layar terlihat kosong. Itu normal. Tekan Enter.

**Membuat token:** https://github.com/settings/tokens › Generate new token (classic) › centang **repo** › Generate › salin token (`ghp_...`, hanya tampil sekali).

Tanda berhasil: `Writing objects: 100%` dan `* [new branch] main -> main`.

### B6. Aktifkan GitHub Pages

Repository › **Settings** › **Pages**:
- Source: **Deploy from a branch**
- Branch: **main** / **(root)** › **Save**
- Centang **Enforce HTTPS**

Tunggu 1–2 menit. Alamat portal: **`https://USERNAME.github.io/kkmp-ternate/`**

### B7. Uji

1. Buka alamat portal. Beranda dan dashboard harus menampilkan data.
2. Buka satu berita, klik ikon 🔗, lalu tempel tautannya di tab baru. Berita yang sama harus langsung terbuka (`…/kkmp-ternate/?hal=detail&id=BRT-…`).
3. Login sebagai admin, buka Data Koperasi, lalu coba **Ekspor Rekapitulasi (Excel)**.
4. Kalau ada masalah, tekan **F12 › Console** dan kirim screenshot-nya.

---

## BAGIAN C — Memperbarui aplikasi di kemudian hari

1. **Backend:** tempel Code.gs, lalu **Kelola deployment › Versi baru**. URL `/exec` tidak berubah.
2. **Frontend:** ganti file di folder `kkmp-ternate` dengan versi baru. **Jangan menimpa `js\config.js`**, karena berisi GAS_URL Anda. Lalu jalankan:
   ```
   git add .
   git commit -m "Pembaruan"
   git push
   ```
3. Kalau masih tampil versi lama, tekan **Ctrl+Shift+R**.
4. Versi frontend dan backend harus sama. Kalau berbeda, portal menampilkan banner merah "File aplikasi tidak sinkron".

---

## BAGIAN D — Alihkan alamat lama & Google Sites

1. Setelah GitHub Pages tayang, login sebagai Admin › **Konten & Pengaturan**.
2. Isi **`url_portal`** dengan alamat GitHub Pages, misalnya `https://USERNAME.github.io/kkmp-ternate/`, lalu simpan.
3. Uji: buka alamat lama `…/exec`. Pengunjung otomatis dibawa ke GitHub Pages. Kalau browser menahan pengalihan otomatis, akan muncul tombol **Buka Portal**.
   - Tautan lama `…/exec?hal=detail&id=BRT-002` ikut diteruskan ke berita yang sama di GitHub Pages.
4. **Google Sites:** ganti sematan lama dengan **Sisipkan › Sematkan › Menurut URL** › `https://USERNAME.github.io/kkmp-ternate/`, atau buat **Tombol** yang menautkan ke alamat tersebut. Untuk membagikan berita, pakai tautan GitHub Pages secara langsung, karena Google Sites tidak bisa meneruskan tautan langsung ke halaman yang disematkan.

> Selama `url_portal` belum diisi, alamat `…/exec` hanya menampilkan teks status API (JSON). Itu normal.

---

## Pemecahan masalah

| Gejala | Penyebab | Solusi |
|---|---|---|
| Banner "Alamat backend belum diatur" | `GAS_URL` masih `XXXX` | Isi `js/config.js`, lalu push ulang |
| "Respon server tidak valid" | URL salah, atau akses deployment bukan "Siapa saja" | Cek URL `/exec` dan pengaturan deployment |
| "Koneksi ke server gagal" | Internet terputus atau URL salah ketik | Uji `URL_EXEC?api=ping` di browser |
| Situs 404 | `git init` di folder yang salah | Repo harus menampilkan `index.html` di root; lihat B1 |
| Halaman tanpa warna/tata letak | Folder `css/` atau `js/` tidak ikut terkirim | Push dari terminal, jangan unggah lewat web GitHub |
| Banner "File aplikasi tidak sinkron" | Versi frontend dan Code.gs berbeda | Perbarui keduanya dari paket yang sama |
| Alamat lama …/exec hanya menampilkan teks JSON | `url_portal` belum diisi | Isi `url_portal` (Bagian D) |
| `Password authentication is not supported` | GitHub butuh token | Buat Personal Access Token (B5) |
| Perubahan belum tampil | Cache browser | Ctrl+Shift+R atau jendela Incognito |

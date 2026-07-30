# MaConnect – Madrasah Connect

Platform digital sekolah Muhammadiyah/Aisyiyah yang inklusif untuk **siswa, guru, dan orang tua**. Berjalan 100% gratis tanpa server — seluruh data tersimpan aman di browser (localStorage) dan tersinkron antar peran.

## ✨ Fitur

| Peran | Fitur |
|---|---|
| 🎒 **Siswa** | Dashboard, jadwal, tugas (kumpul file + checklist tersimpan), nilai real-time dari guru, pesan ke guru, ekskul, PPDB online |
| 👩‍🏫 **Guru** | Kelola kelas, input & simpan nilai (export/import CSV), absensi harian per tanggal, pengumuman (buat/edit/publish/hapus), pesan ke siswa & ortu, rapor |
| 👨‍👩‍👧 **Ortu** | Pantau nilai & absensi anak (data nyata dari guru), pembayaran SPP + kwitansi unduhan, riwayat transaksi, pesan ke guru, pengumuman sekolah |

- 🔐 **Login tervalidasi** dengan sesi per peran + route guard (halaman guru tak bisa diakses ortu, dst.)
- 🔄 **Sinkron lintas peran**: guru input nilai → siswa & ortu langsung melihat; siswa kirim pesan → guru menerima; guru catat absensi → ortu melihat rekap
- 🔔 **Notifikasi nyata** antar peran (nilai diperbarui, pesan baru, pengumuman, absensi)
- ♿ **Aksesibilitas WCAG 2.1 AA**: 14+ fitur (kontras tinggi, font disleksia, pembesar teks, panduan baca, dll.)

## 🚀 Menjalankan

Buka langsung `index.html` di browser, atau jalankan server statis:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## 🔑 Akun Demo

| Peran | Username / Email | Kata Sandi |
|---|---|---|
| Siswa | `0051234567` atau `ahmad@siswa.maconnect.sch.id` | `siswa123` |
| Guru | `196812052001` atau `siti@guru.maconnect.sch.id` | `guru123` |
| Orang Tua | `fauzi@ortu.maconnect.sch.id` | `ortu123` |

## 🏗️ Arsitektur

- `js/db.js` — lapisan data (MCDB): koleksi tersimpan di localStorage dengan seed otomatis & API CRUD
- `js/auth.js` — autentikasi (MCAuth): validasi login, sesi, route guard, personalisasi sidebar, logout
- `js/main.js` — komponen bersama: toast, modal, panel aksesibilitas, notifikasi
- `pages/*.html` + `js/*.js` — 34 halaman untuk 3 portal peran

> Untuk mengulang data contoh dari awal, jalankan `MCDB.resetAll()` di konsol browser.
# moudy.xyz — Portfolio & Articles

Portfolio Web3 Customer Support Specialist dengan bagian artikel dan admin panel untuk menulis.

## Stack

- **Next.js 16** (App Router, Server Actions) + **TypeScript**
- **Tailwind CSS v4** + `@tailwindcss/typography`
- **SQLite** (`better-sqlite3`) — database file lokal di `data/portfolio.db`, tanpa server database terpisah
- **Markdown** (`react-markdown` + GFM) untuk konten artikel
- Auth admin sederhana: password + session cookie JWT (`jose`)

## Menjalankan

```bash
npm install
npm run seed   # opsional: isi 1 artikel contoh
npm run dev
```

Buka http://localhost:3000

## Admin panel

- URL: `/admin` (login di `/admin/login`)
- Password default: `admin` — **ganti sebelum deploy!**

Salin `.env.example` ke `.env.local` dan isi:

```bash
ADMIN_PASSWORD=password-rahasiamu
AUTH_SECRET=string-acak-yang-panjang
```

Dari admin panel kamu bisa membuat, mengedit, mem-publish/draft, dan menghapus artikel. Konten ditulis dalam Markdown (heading, list, tabel, code block, dll).

## Struktur halaman

| Route | Deskripsi |
| --- | --- |
| `/` | Landing page (hero, about, toolkit, work, artikel terbaru, contact) |
| `/articles` | Daftar semua artikel yang dipublish |
| `/articles/[slug]` | Halaman baca artikel |
| `/admin` | Dashboard artikel (butuh login) |
| `/admin/new`, `/admin/edit/[id]` | Editor artikel |

## Catatan deploy

Database SQLite disimpan sebagai file di folder `data/`, jadi deploy di host dengan persistent disk (VPS, Railway, Fly.io, dsb). Platform serverless murni seperti Vercel tidak mempertahankan file lokal antar-request.

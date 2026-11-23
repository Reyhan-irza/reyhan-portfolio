# Reyhan’s Portfolio

**[Buka folder portfolio](artifacts/portfolio)** · **[Buka source code](artifacts/portfolio/src)** · [Asset web](artifacts/portfolio/public)

## Pengembangan lokal

Jalankan dari root repo.

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/portfolio dev
pnpm run typecheck
pnpm run build
```

Tes browser memakai Chromium. Instal dengan `pnpm --filter @workspace/portfolio exec playwright-core install chromium`, lalu jalankan `pnpm --filter @workspace/portfolio test:browser`. Untuk Chromium sistem, tentukan path executable lewat `CHROMIUM_PATH`.

## Deploy

Vercel menjalankan `pnpm run build` dan menyajikan `artifacts/portfolio/dist/public`. Konfigurasi Supabase frontend memakai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`. Simpan kredensial server di environment backend.

[Skema Supabase](artifacts/portfolio/supabase/portfolio-schema.sql) memuat tabel rating dan migrasi izin komentar. Terapkan SQL setelah meninjau perubahan dengan konfigurasi database yang sudah ada. [Migrasi komentar tersendiri](artifacts/portfolio/supabase/enable-public-comment-insert.sql) juga tersedia. Login admin memakai tabel `admins` yang sudah ada.

Workspace lain ada di [API server](artifacts/api-server), [mockup sandbox](artifacts/mockup-sandbox), dan [library bersama](lib). API server untuk pengembangan lokal memakai `DATABASE_URL` dan bisa dijalankan dengan `pnpm --filter @workspace/api-server dev`.

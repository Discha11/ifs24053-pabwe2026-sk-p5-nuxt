# ifs24025-pabwe2026-sk-p5-nuxt

Studi Kasus 2 PABWE 2026 Praktikum 5: **Delcom Cash Flow** (Nuxt 4 + TypeScript + Pinia + Tailwind CSS v4).

Sumber data: <https://open-api.delcom.org/docs/1.0/api-cash-flows>

## Menjalankan

```bash
bun install
cp .env.example .env     # jika belum ada
bun run dev              # http://localhost:3000
bun run test:coverage    # unit test + laporan coverage (threshold 100%)
```

## Struktur singkat

- `src/helpers`: `apiHelper.ts` (fetch + Bearer token), `toolsHelper.ts` (SweetAlert2, `formatRupiah`, `formatDate`)
- `src/hooks/useInput.ts`: composable input form
- `src/features/auth`: login & register
- `src/features/users`: daftar pengguna & profil
- `src/features/cashflows`: dashboard arus kas (ringkasan saldo, filter, tambah/ubah/hapus, reset semua) dan halaman detail
- `src/routes.ts` + `src/router.options.ts`: rute Nuxt (auth, dashboard terproteksi, 404)

## Catatan

- Browser memanggil API lewat proxy same-origin `/api/delcom/**` (`server/api/delcom/[...path].ts`) yang meneruskan ke `VITE_DELCOM_BASEURL`. Ini menghindari peringatan Chrome "Authorization will not be covered by the wildcard symbol (*)" yang berasal dari CORS server Delcom. Untuk kembali memanggil Delcom langsung, set `VITE_DELCOM_DIRECT=true` lalu build ulang.

- Endpoint ganti password mengikuti dokumentasi Delcom: `PUT /users/password`.
- Rute terproteksi dijaga di `CashFlowLayout.vue` (redirect ke `/auth/login` jika belum login).

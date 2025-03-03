# Admin Masjid Dashboard

Aplikasi dashboard admin untuk manajemen masjid, dibangun dengan Nuxt 3, Tailwind CSS, dan Shadcn Vue.

## Fitur

- 🔐 Autentikasi Admin
- 💰 Manajemen Keuangan
  - Pencatatan Pemasukan & Pengeluaran
  - Kategorisasi Transaksi
  - Laporan Keuangan
- 📅 Manajemen Jadwal
  - Jadwal Khatib Jumat
  - Jadwal Kajian
- 🖼️ Manajemen Konten
  - Upload Logo
  - Pengaturan Gambar
- 🎨 UI Modern dengan Shadcn Vue
- 🔄 State Management dengan Pinia
- 📱 Responsive Design

## Teknologi

- [Nuxt 3](https://nuxt.com) - Framework Vue.js
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Shadcn Vue](https://www.shadcn-vue.com/) - UI Components
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [VueUse](https://vueuse.org/) - Collection of Vue Composables

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Update environment variables di `.env`

## Development

Start development server:

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

## Production

Build aplikasi:

```bash
pnpm build
```

Preview build:

```bash
pnpm preview
```

## Project Structure

```
├── components/     # Vue components
├── composables/    # Composable functions
├── layouts/        # Layout components
├── middleware/     # Route middleware
├── pages/         # Application pages
├── public/        # Static files
├── server/        # API routes
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

[MIT License](LICENSE)

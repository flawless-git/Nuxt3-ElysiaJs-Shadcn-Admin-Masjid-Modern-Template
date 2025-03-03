# Sistem Manajemen Masjid

Aplikasi manajemen masjid yang terdiri dari REST API (Backend) dan Dashboard Admin (Frontend).

## Struktur Project

```
.
├── Backend/        # REST API dengan Bun & Elysia
├── Frontend/       # Dashboard Admin dengan Nuxt 3
└── README.md
```

## Tech Stack

### Backend

- [Bun](https://bun.sh) - JavaScript runtime & package manager
- [Elysia](https://elysiajs.com) - Web framework
- [PostgreSQL](https://www.postgresql.org) - Database
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM

### Frontend

- [Nuxt 3](https://nuxt.com) - Vue.js Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Shadcn Vue](https://www.shadcn-vue.com/) - UI Components
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## Fitur Utama

- 🔐 Autentikasi Admin
- 💰 Manajemen Keuangan
  - Pencatatan Pemasukan & Pengeluaran
  - Kategorisasi Transaksi
  - Laporan Keuangan
- 📅 Manajemen Jadwal
  - Jadwal Khatib Jumat
  - Jadwal Kajian
- 🖼️ Manajemen Konten & Gambar

## Setup Development

### Prerequisites

- Node.js & npm
- Bun runtime
- PostgreSQL database

### 1. Setup Backend

#### Windows

1. Download PostgreSQL installer dari [website resmi](https://www.postgresql.org/download/windows/)
2. Jalankan installer
3. Pilih komponen yang akan diinstall (minimal PostgreSQL Server dan pgAdmin)
4. Tentukan password untuk user postgres
5. Pilih port (default: 5432)
6. Setelah instalasi selesai, buka pgAdmin
7. Buat database baru:
   ```sql
   CREATE DATABASE masjid_db;
   ```

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Masuk ke PostgreSQL shell
sudo -u postgres psql

# Buat database
CREATE DATABASE masjid_db;

# Buat user baru (opsional)
CREATE USER masjid_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE masjid_db TO masjid_user;
```

#### macOS

```bash
# Menggunakan Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Buat database
createdb masjid_db
```

Setelah database dibuat, update `.env` dengan kredensial database:

```env
DATABASE_URL=postgres://username:password@localhost:5432/masjid_db
```

### 2. Backend Setup

```bash
# Masuk ke direktori backend
cd Backend

# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Setup environment variables
# DATABASE_URL=postgres://user:pass@localhost:5432/dbname
# PORT=1010
# HOST=0.0.0.0

# Run database migration
bun drizzle-kit push:pg

# Run seed data
bun run seed

# Start development server
bun run dev
```

Backend akan berjalan di `http://localhost:1010`

### 3. Frontend Setup

```bash
# Masuk ke direktori frontend
cd Frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

Frontend akan berjalan di `http://localhost:3000`

## Default Credentials

```
Email: admin@masjid.com
Password: admin123
```

## API Documentation

Swagger UI tersedia di:

```
http://localhost:1010/swagger
```

## Development Commands

### Backend

```bash
# Development
bun run dev

# Build
bun run build

# Tests
bun test
```

### Frontend

```bash
# Development
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/dbname

# Server
PORT=1010
HOST=0.0.0.0
```

### Frontend (.env)

```env
# API URL
NUXT_PUBLIC_API_BASE=http://localhost:1010
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT

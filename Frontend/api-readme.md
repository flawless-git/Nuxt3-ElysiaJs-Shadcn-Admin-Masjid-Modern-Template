# Cash Flow API

## Overview

REST API untuk mencatat dan mengelola arus kas (cash flow) dengan fitur:

- Autentikasi pengguna (register & login)
- Manajemen kategori transaksi
- Pencatatan transaksi (pemasukan/pengeluaran)
- Ringkasan keuangan harian

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime & package manager
- [Elysia](https://elysiajs.com) - Web framework
- [PostgreSQL](https://www.postgresql.org) - Database
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing

## Setup

### 1. Prerequisites

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install PostgreSQL
# ... install sesuai OS
```

### 2. Instalasi Project

```bash
# Clone repository
git clone <repository_url>
cd <project_folder>

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi:
# DATABASE_URL=postgres://user:pass@localhost:5432/dbname
```

### 3. Database Migration

```bash
# Run migration
bun drizzle-kit push:pg
```

## API Endpoints

### 1. Auth

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

### 2. Categories

#### Get All Categories

```http
GET /categories
```

#### Create Category

```http
POST /categories
Content-Type: application/json

{
  "name": "Gaji",
  "description": "Pemasukan dari gaji"
}
```

### 3. Balance

#### Get Balance History

```http
GET /balance
```

#### Initialize Balance

```http
POST /balance/initialize
Content-Type: application/json

{
  "amount": 1000000
}
```

### 4. Transactions

#### Get All Transactions

```http
GET /transactions
```

#### Create Transaction

```http
POST /transactions
Content-Type: application/json

{
  "amount": 500000,    // Positif=pemasukan, negatif=pengeluaran
  "description": "Gaji bulan Maret",
  "userId": 1,
  "categoryId": 1
}
```

### 5. Summary

#### Get Daily Summary

```http
GET /summary
```

Response:

```json
{
  "date": "2024-03-14T00:00:00.000Z",
  "income": {
    "categories": {
      "1": {
        "categoryName": "Gaji",
        "total": 5000000,
        "transactions": [...]
      }
    },
    "total": 5000000
  },
  "expense": {
    "categories": {
      "2": {
        "categoryName": "Belanja",
        "total": 150000,
        "transactions": [...]
      }
    },
    "total": 150000
  },
  "currentBalance": 4850000
}
```

## Alur Penggunaan

1. **Setup Awal**

   - Register user baru
   - Initialize balance awal
   - Buat kategori-kategori transaksi

2. **Pencatatan Transaksi**

   - Catat pemasukan (amount positif)
   - Catat pengeluaran (amount negatif)
   - Balance terupdate otomatis

3. **Monitoring**
   - Cek summary harian
   - Lihat history transaksi
   - Monitor saldo terkini

## Development

```bash
# Run development server
bun run dev

# Build project
bun run build

# Run tests
bun test
```

## API Documentation

Swagger UI tersedia di:

```
http://localhost:1010/swagger
```

## Error Handling

API mengembalikan error dengan format:

```json
{
  "error": "Pesan error"
}
```

Common errors:

- 400: Bad Request - Input tidak valid
- 401: Unauthorized - Belum login
- 404: Not Found - Data tidak ditemukan
- 500: Internal Server Error

## Environment Variables

```env
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/dbname

# Server
PORT=1010
HOST=0.0.0.0
```

## Project Structure

```
.
├── src/
│   ├── db/
│   │   ├── index.ts    # Database connection
│   │   └── schema.ts   # Database schema
│   └── index.ts        # API routes & server
├── .env
├── package.json
└── README.md
```

## License

MIT

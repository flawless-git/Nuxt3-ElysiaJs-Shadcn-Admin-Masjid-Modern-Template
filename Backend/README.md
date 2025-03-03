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
bun drizzle-kit push

# Run seed untuk membuat admin dan kategori default
bun run seed
```

Default credentials:

```
Email: admin@masjid.com
Password: admin123
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
  // Login dengan username
  "username": "john_doe",
  "password": "secure_password"
}

// ATAU

{
  // Login dengan email
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

#### Update Category

```http
PUT /categories/:id
Content-Type: application/json

{
  "name": "Infaq",
  "description": "Pemasukan dari infaq jamaah"
}
```

#### Delete Category

```http
DELETE /categories/:id
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

#### Update Transaction

```http
PUT /transactions/:id
Content-Type: application/json

{
  "amount": 450000,    // Positif=pemasukan, negatif=pengeluaran
  "description": "Update gaji bulan Maret",
  "categoryId": 1
}
```

#### Delete Transaction

```http
DELETE /transactions/:id
```

Response:

```json
{
  "transaction": {
    "id": 1,
    "amount": 450000,
    "description": "Gaji bulan Maret",
    "categoryId": 1,
    "createdAt": "2024-03-14T10:00:00.000Z"
  },
  "previousBalance": 1000000,
  "currentBalance": 550000
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

### 6. Khatib Schedule

#### Get All Schedules

```http
GET /khatib
```

#### Create Schedule

```http
POST /khatib
Content-Type: application/json

{
  "name": "Ustadz Ahmad",
  "description": "Khotbah tentang Ramadhan",
  "date": "2024-03-15",
  "title": "Persiapan Ramadhan"
}
```

#### Update Schedule

```http
PUT /khatib/:id
Content-Type: application/json

{
  "name": "Ustadz Ahmad",
  "description": "Khotbah tentang Ramadhan",
  "date": "2024-03-15",
  "title": "Persiapan Ramadhan"
}
```

#### Delete Schedule

```http
DELETE /khatib/:id
```

### 7. Kajian

#### Get All Kajian

```http
GET /kajian
```

#### Create Kajian

```http
POST /kajian
Content-Type: application/json

{
  "name": "Ustadz Budi",
  "description": "Kajian Fiqih",
  "date": "2024-03-16",
  "title": "Fiqih Puasa"
}
```

#### Update Kajian

```http
PUT /kajian/:id
Content-Type: application/json

{
  "name": "Ustadz Budi",
  "description": "Kajian Fiqih",
  "date": "2024-03-16",
  "title": "Fiqih Puasa"
}
```

#### Delete Kajian

```http
DELETE /kajian/:id
```

### 8. Image Management

#### Get All Images

```http
GET /image
```

#### Upload Image

```http
POST /image/upload
Content-Type: multipart/form-data

name: "Gambar Masjid"
image: <file>  # File gambar (JPG/PNG, max 2MB)
```

#### Update Image

```http
PUT /image/:id
Content-Type: multipart/form-data

name: "Gambar Masjid Updated"
image: <file>  # Optional, file gambar baru (JPG/PNG, max 2MB)
```

#### Delete Image

```http
DELETE /image/:id
```

Response:

```json
{
  "id": 1,
  "name": "Gambar Masjid",
  "path": "/public/image/1234567890-image.png",
  "createdAt": "2024-03-14T10:00:00.000Z",
  "updatedAt": "2024-03-14T11:00:00.000Z"
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

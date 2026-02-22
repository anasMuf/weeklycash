# API Contract: WeeklyCash

> Berdasarkan: [erd.md](./erd.md)

## Base URL

```
/api/v1
```

## Global Configuration

- **Content-Type:** `application/json`
- **Authentication:** Bearer Token (JWT) — disertakan di header `Authorization: Bearer <token>`
- **Validation:** Request body divalidasi menggunakan Zod

---

## Endpoint Overview

| Module | Method | Path | Description | Auth |
|--------|--------|------|-------------|------|
| Auth | `POST` | `/api/v1/auth/register` | Registrasi user baru | ❌ |
| Auth | `POST` | `/api/v1/auth/login` | Login dan dapatkan token | ❌ |
| Auth | `GET` | `/api/v1/auth/me` | Get profil user yang login | ✅ |
| Auth | `PUT` | `/api/v1/auth/me` | Update profil user | ✅ |
| Category | `GET` | `/api/v1/categories` | List semua kategori | ✅ |
| Category | `POST` | `/api/v1/categories` | Buat kategori kustom | ✅ |
| Category | `PUT` | `/api/v1/categories/:id` | Update kategori kustom | ✅ |
| Category | `DELETE` | `/api/v1/categories/:id` | Hapus kategori kustom | ✅ |
| Transaction | `GET` | `/api/v1/transactions` | List transaksi dengan filter | ✅ |
| Transaction | `POST` | `/api/v1/transactions` | Catat transaksi baru | ✅ |
| Transaction | `GET` | `/api/v1/transactions/:id` | Detail satu transaksi | ✅ |
| Transaction | `PUT` | `/api/v1/transactions/:id` | Update transaksi | ✅ |
| Transaction | `DELETE` | `/api/v1/transactions/:id` | Hapus transaksi | ✅ |
| Budget | `GET` | `/api/v1/budgets/current` | Budget minggu aktif + sisa | ✅ |
| Budget | `GET` | `/api/v1/budgets` | List riwayat budget | ✅ |
| Budget | `POST` | `/api/v1/budgets` | Set budget minggu baru | ✅ |
| Budget | `PUT` | `/api/v1/budgets/:id` | Update budget | ✅ |
| Dashboard | `GET` | `/api/v1/dashboard/summary` | Ringkasan dashboard | ✅ |

---

## Endpoint Details

### 1. Authentication

#### Register

```
POST /api/v1/auth/register
```

Request Body:

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "Anas Mufti"
}
```

Response `201 Created`:

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Anas Mufti",
    "created_at": "2026-02-22T00:00:00Z"
  }
}
```

Response `409 Conflict`:

```json
{
  "error": "Email sudah terdaftar"
}
```

---

#### Login

```
POST /api/v1/auth/login
```

Request Body:

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response `200 OK`:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Anas Mufti"
    }
  }
}
```

Response `401 Unauthorized`:

```json
{
  "error": "Email atau password salah"
}
```

---

#### Get Profile

```
GET /api/v1/auth/me
```

Response `200 OK`:

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Anas Mufti",
    "created_at": "2026-02-22T00:00:00Z",
    "updated_at": "2026-02-22T00:00:00Z"
  }
}
```

---

#### Update Profile

```
PUT /api/v1/auth/me
```

Request Body:

```json
{
  "full_name": "Anas M."
}
```

Response `200 OK`:

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Anas M.",
    "updated_at": "2026-02-22T01:00:00Z"
  }
}
```

---

### 2. Categories

#### List Categories

```
GET /api/v1/categories
```

Query Parameters:

| Param | Type | Required | Keterangan |
|-------|------|----------|------------|
| type | string | no | Filter by `INCOME` atau `EXPENSE` |

Response `200 OK`:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Makanan",
      "type": "EXPENSE",
      "icon": "🍔",
      "is_default": true
    },
    {
      "id": 10,
      "name": "Freelance",
      "type": "INCOME",
      "icon": "💻",
      "is_default": false
    }
  ]
}
```

---

#### Create Category

```
POST /api/v1/categories
```

Request Body:

```json
{
  "name": "Freelance",
  "type": "INCOME",
  "icon": "💻"
}
```

Response `201 Created`:

```json
{
  "data": {
    "id": 10,
    "name": "Freelance",
    "type": "INCOME",
    "icon": "💻",
    "is_default": false,
    "created_at": "2026-02-22T00:00:00Z"
  }
}
```

---

#### Update Category

```
PUT /api/v1/categories/:id
```

> Hanya kategori kustom (is_default = false) yang bisa diupdate.

Request Body:

```json
{
  "name": "Side Hustle",
  "icon": "🚀"
}
```

Response `200 OK`:

```json
{
  "data": {
    "id": 10,
    "name": "Side Hustle",
    "type": "INCOME",
    "icon": "🚀",
    "is_default": false,
    "updated_at": "2026-02-22T01:00:00Z"
  }
}
```

Response `403 Forbidden`:

```json
{
  "error": "Kategori default tidak bisa diubah"
}
```

---

#### Delete Category

```
DELETE /api/v1/categories/:id
```

> Hanya kategori kustom yang bisa dihapus. Kategori yang masih digunakan oleh transaksi tidak bisa dihapus.

Response `200 OK`:

```json
{
  "data": {
    "message": "Kategori berhasil dihapus"
  }
}
```

Response `403 Forbidden`:

```json
{
  "error": "Kategori default tidak bisa dihapus"
}
```

Response `409 Conflict`:

```json
{
  "error": "Kategori masih digunakan oleh 5 transaksi"
}
```

---

### 3. Transactions

#### List Transactions

```
GET /api/v1/transactions
```

Query Parameters:

| Param | Type | Required | Keterangan |
|-------|------|----------|------------|
| page | number | no | Halaman (default: 1) |
| limit | number | no | Per page (default: 10, max: 100) |
| type | string | no | Filter `INCOME` atau `EXPENSE` |
| category_id | number | no | Filter by kategori |
| start_date | string (date) | no | Filter dari tanggal (YYYY-MM-DD) |
| end_date | string (date) | no | Filter sampai tanggal (YYYY-MM-DD) |
| sort | string | no | Field untuk sorting (default: `transaction_date`) |
| order | string | no | `asc` atau `desc` (default: `desc`) |

Response `200 OK`:

```json
{
  "data": [
    {
      "id": 101,
      "amount": 75000,
      "type": "EXPENSE",
      "category": {
        "id": 1,
        "name": "Makanan",
        "icon": "🍔"
      },
      "note": "Makan siang dengan tim",
      "transaction_date": "2026-02-22",
      "created_at": "2026-02-22T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

---

#### Create Transaction

```
POST /api/v1/transactions
```

Request Body:

```json
{
  "amount": 75000,
  "type": "EXPENSE",
  "category_id": 1,
  "transaction_date": "2026-02-22",
  "note": "Makan siang dengan tim"
}
```

Response `201 Created`:

```json
{
  "data": {
    "id": 101,
    "amount": 75000,
    "type": "EXPENSE",
    "category": {
      "id": 1,
      "name": "Makanan",
      "icon": "🍔"
    },
    "note": "Makan siang dengan tim",
    "transaction_date": "2026-02-22",
    "created_at": "2026-02-22T12:00:00Z"
  }
}
```

---

#### Get Transaction Detail

```
GET /api/v1/transactions/:id
```

Response `200 OK`:

```json
{
  "data": {
    "id": 101,
    "amount": 75000,
    "type": "EXPENSE",
    "category": {
      "id": 1,
      "name": "Makanan",
      "icon": "🍔"
    },
    "note": "Makan siang dengan tim",
    "transaction_date": "2026-02-22",
    "created_at": "2026-02-22T12:00:00Z",
    "updated_at": "2026-02-22T12:00:00Z"
  }
}
```

---

#### Update Transaction

```
PUT /api/v1/transactions/:id
```

Request Body:

```json
{
  "amount": 80000,
  "note": "Makan siang dengan tim (revisi)"
}
```

Response `200 OK`:

```json
{
  "data": {
    "id": 101,
    "amount": 80000,
    "type": "EXPENSE",
    "category": {
      "id": 1,
      "name": "Makanan",
      "icon": "🍔"
    },
    "note": "Makan siang dengan tim (revisi)",
    "transaction_date": "2026-02-22",
    "updated_at": "2026-02-22T13:00:00Z"
  }
}
```

---

#### Delete Transaction

```
DELETE /api/v1/transactions/:id
```

Response `200 OK`:

```json
{
  "data": {
    "message": "Transaksi berhasil dihapus"
  }
}
```

---

### 4. Budgets

#### Get Current Weekly Budget

```
GET /api/v1/budgets/current
```

> Mengembalikan budget minggu aktif beserta perhitungan sisa budget.

Response `200 OK`:

```json
{
  "data": {
    "id": 50,
    "amount_limit": 1000000,
    "spent": 450000,
    "remaining": 550000,
    "percentage": 45.0,
    "start_date": "2026-02-17",
    "end_date": "2026-02-23",
    "transaction_count": 12
  }
}
```

Response `404 Not Found` (belum set budget minggu ini):

```json
{
  "error": "Belum ada budget untuk minggu ini"
}
```

---

#### List Budget History

```
GET /api/v1/budgets
```

Query Parameters:

| Param | Type | Required | Keterangan |
|-------|------|----------|------------|
| page | number | no | Halaman (default: 1) |
| limit | number | no | Per page (default: 10) |

Response `200 OK`:

```json
{
  "data": [
    {
      "id": 50,
      "amount_limit": 1000000,
      "spent": 450000,
      "remaining": 550000,
      "percentage": 45.0,
      "start_date": "2026-02-17",
      "end_date": "2026-02-23"
    },
    {
      "id": 49,
      "amount_limit": 900000,
      "spent": 870000,
      "remaining": 30000,
      "percentage": 96.7,
      "start_date": "2026-02-10",
      "end_date": "2026-02-16"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8
  }
}
```

---

#### Create Budget

```
POST /api/v1/budgets
```

> Satu user hanya boleh punya satu budget per minggu.

Request Body:

```json
{
  "amount_limit": 1000000,
  "start_date": "2026-02-17",
  "end_date": "2026-02-23"
}
```

Response `201 Created`:

```json
{
  "data": {
    "id": 50,
    "amount_limit": 1000000,
    "start_date": "2026-02-17",
    "end_date": "2026-02-23",
    "created_at": "2026-02-17T00:00:00Z"
  }
}
```

Response `409 Conflict`:

```json
{
  "error": "Budget untuk minggu ini sudah ada"
}
```

---

#### Update Budget

```
PUT /api/v1/budgets/:id
```

Request Body:

```json
{
  "amount_limit": 1200000
}
```

Response `200 OK`:

```json
{
  "data": {
    "id": 50,
    "amount_limit": 1200000,
    "start_date": "2026-02-17",
    "end_date": "2026-02-23",
    "updated_at": "2026-02-18T00:00:00Z"
  }
}
```

---

### 5. Dashboard

#### Get Dashboard Summary

```
GET /api/v1/dashboard/summary
```

> Ringkasan untuk dashboard utama. Mencakup budget minggu ini, total income/expense, dan breakdown per kategori.

Response `200 OK`:

```json
{
  "data": {
    "current_budget": {
      "amount_limit": 1000000,
      "spent": 450000,
      "remaining": 550000,
      "percentage": 45.0,
      "start_date": "2026-02-17",
      "end_date": "2026-02-23"
    },
    "weekly_summary": {
      "total_income": 5000000,
      "total_expense": 450000,
      "transaction_count": 12
    },
    "category_breakdown": [
      {
        "category": { "id": 1, "name": "Makanan", "icon": "🍔" },
        "total": 250000,
        "percentage": 55.6
      },
      {
        "category": { "id": 2, "name": "Transportasi", "icon": "🚗" },
        "total": 120000,
        "percentage": 26.7
      },
      {
        "category": { "id": 3, "name": "Hiburan", "icon": "🎮" },
        "total": 80000,
        "percentage": 17.7
      }
    ],
    "recent_transactions": [
      {
        "id": 101,
        "amount": 75000,
        "type": "EXPENSE",
        "category": { "id": 1, "name": "Makanan", "icon": "🍔" },
        "note": "Makan siang",
        "transaction_date": "2026-02-22"
      }
    ]
  }
}
```

---

## HTTP Status Codes

| Code | Keterangan |
|------|------------|
| `200` | OK — Request berhasil |
| `201` | Created — Resource berhasil dibuat |
| `400` | Bad Request — Validasi gagal (field kosong, format salah, nominal negatif) |
| `401` | Unauthorized — Token tidak ada atau expired |
| `403` | Forbidden — Tidak punya akses (e.g., edit kategori default) |
| `404` | Not Found — Resource tidak ditemukan |
| `409` | Conflict — Data sudah ada (e.g., email duplikat, budget minggu sudah ada) |
| `500` | Internal Server Error |

## Response Format

```json
// Success (single resource)
{
  "data": { ... }
}

// Success (list dengan pagination)
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}

// Error
{
  "error": "Pesan error yang jelas dalam Bahasa Indonesia"
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| `email` | Required, valid email format, unique |
| `password` | Required, min 8 karakter |
| `full_name` | Optional, max 100 karakter |
| `amount` | Required, positive number, max 15 digit |
| `type` | Required, enum: `INCOME` atau `EXPENSE` |
| `transaction_date` | Required, format `YYYY-MM-DD`, tidak boleh di masa depan |
| `category_id` | Required (untuk transaksi), harus valid dan milik user |
| `start_date` | Required (untuk budget), harus hari Senin |
| `end_date` | Required (untuk budget), harus hari Minggu, `end_date > start_date` |
| `amount_limit` | Required, positive number |
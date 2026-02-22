# UX Flow: WeeklyCash

> Berdasarkan: [prd.md](./prd.md)

## Sitemap

```
/                               → Redirect ke /dashboard (jika login) atau /login
├── /auth
│   ├── /login                  → Halaman login
│   └── /register               → Halaman registrasi
├── /dashboard                  → Dashboard utama (budget overview + ringkasan)
├── /transactions
│   ├── /                       → Daftar riwayat transaksi (History Ledger)
│   └── /new                    → Form input transaksi baru
├── /budgets
│   ├── /                       → Riwayat budget mingguan
│   └── /new                    → Set budget minggu baru
├── /categories
│   └── /                       → Kelola kategori (list + CRUD)
└── /settings
    └── /                       → Pengaturan profil akun
```

## Navigation Pattern

- **Layout utama**: Sidebar (desktop) + Bottom navigation (mobile)
- **Sidebar items**:
  - 📊 Dashboard
  - 💸 Transaksi
  - 🎯 Budget
  - 🏷️ Kategori
  - ⚙️ Settings
- **Navigasi sekunder**: Breadcrumb di halaman detail
- **Auth guard**: Semua halaman kecuali `/auth/*` membutuhkan login. Redirect ke `/login` jika belum login.
- **Quick action**: Floating Action Button (FAB) "+" di mobile untuk tambah transaksi cepat

## User Flows

### Flow 1: Registrasi & Login

```mermaid
flowchart TD
    A[User buka app] --> B{Sudah login?}
    B -->|Tidak| C[Redirect ke /login]
    C --> D{Punya akun?}
    D -->|Tidak| E[Klik 'Daftar']
    E --> F[/register — Isi email, password, nama/]
    F --> G[Klik Submit]
    G --> H{Validasi berhasil?}
    H -->|Tidak| I[Tampilkan error inline]
    I --> F
    H -->|Ya| J[Akun dibuat]
    J --> K[Redirect ke /login]
    D -->|Ya| L[/login — Isi email & password/]
    L --> M[Klik Login]
    M --> N{Kredensial valid?}
    N -->|Tidak| O[Tampilkan error 'Email/password salah']
    O --> L
    N -->|Ya| P[Redirect ke /dashboard]
    B -->|Ya| P
```

### Flow 2: Set Budget Mingguan

> **User Story**: *"Sebagai user, saya ingin menentukan budget mingguan sebesar Rp700.000, agar saya punya batasan harian yang jelas dan tidak boros."*

```mermaid
flowchart TD
    A[User buka /dashboard] --> B{Budget minggu ini sudah ada?}
    B -->|Tidak| C[Banner 'Belum ada budget minggu ini' + CTA 'Set Budget']
    C --> D[Klik 'Set Budget']
    D --> E[/budgets/new — Form input budget/]
    E --> F[Input nominal limit misal Rp700.000]
    F --> G[Tanggal minggu otomatis terisi Senin-Minggu]
    G --> H[Klik Simpan]
    H --> I{Validasi berhasil?}
    I -->|Tidak| J[Error inline]
    J --> F
    I -->|Ya| K[Budget tersimpan]
    K --> L[Redirect ke /dashboard — progress bar muncul]
    B -->|Ya| L
```

### Flow 3: Catat Transaksi Cepat

> **User Story**: *"Sebagai user, saya ingin mencatat pengeluaran makan siang dengan cepat, agar saya tidak lupa mencatat detail kecil saat sedang bepergian."*

```mermaid
flowchart TD
    A[User di halaman manapun] --> B[Klik FAB '+' atau menu 'Transaksi > Baru']
    B --> C[/transactions/new — Form input/]
    C --> D[Pilih tipe: Income / Expense]
    D --> E[Input nominal]
    E --> F[Pilih kategori dari dropdown]
    F --> G[Tanggal default hari ini, bisa diubah]
    G --> H[Opsional: tulis catatan]
    H --> I[Klik Simpan]
    I --> J{Validasi berhasil?}
    J -->|Tidak| K[Error inline di field yang salah]
    K --> C
    J -->|Ya| L[Transaksi tersimpan]
    L --> M[Toast 'Transaksi berhasil dicatat']
    M --> N[Redirect ke /dashboard — angka budget terupdate]
```

### Flow 4: Lihat Dashboard & Progress Budget

> **User Story**: *"Sebagai user, saya ingin melihat persentase budget yang sudah terpakai di dashboard, agar saya bisa mengerem pengeluaran jika kuota sudah mencapai 80%."*

```mermaid
flowchart TD
    A[User buka /dashboard] --> B{Budget minggu ini ada?}
    B -->|Tidak| C[Banner ajakan set budget]
    B -->|Ya| D[Tampilkan progress bar + persentase]
    D --> E{Persentase >= 80%?}
    E -->|Ya| F[Progress bar berubah warna MERAH + warning text]
    E -->|Tidak| G[Progress bar warna HIJAU/KUNING]
    D --> H[Tampilkan ringkasan: spent, remaining, limit]
    D --> I[Tampilkan breakdown per kategori chart]
    D --> J[Tampilkan 5 transaksi terakhir]
    J --> K[Klik 'Lihat Semua' → /transactions]
```

### Flow 5: Edit / Hapus Transaksi

> **User Story**: *"Sebagai user, saya ingin mengedit atau menghapus transaksi yang salah input, agar data keuangan saya tetap akurat."*

```mermaid
flowchart TD
    A[User buka /transactions] --> B[Lihat daftar transaksi]
    B --> C[Klik baris transaksi atau ikon edit]
    C --> D[Dialog/Sheet edit muncul — form pre-filled]
    D --> E[User ubah data]
    E --> F[Klik Update]
    F --> G{Validasi berhasil?}
    G -->|Tidak| H[Error inline]
    H --> D
    G -->|Ya| I[Transaksi terupdate]
    I --> J[Toast 'Transaksi berhasil diupdate']

    B --> K[Klik ikon hapus]
    K --> L[Dialog konfirmasi 'Yakin hapus transaksi ini?']
    L --> M{Konfirmasi?}
    M -->|Tidak| B
    M -->|Ya| N[Transaksi terhapus]
    N --> O[Toast 'Transaksi berhasil dihapus']
    O --> B
```

### Flow 6: Lihat Rekap Minggu Lalu

> **User Story**: *"Sebagai user, saya ingin melihat rekap pengeluaran minggu lalu, agar saya bisa mengevaluasi apakah budget minggu ini perlu ditambah atau dikurangi."*

```mermaid
flowchart TD
    A[User buka /transactions] --> B[Default filter: Minggu ini]
    B --> C[Klik filter waktu]
    C --> D[Pilih 'Minggu Lalu' / rentang kustom]
    D --> E[Tabel transaksi di-filter ulang]
    E --> F[Tampilkan summary: total income, total expense]

    G[User buka /budgets] --> H[List riwayat budget per minggu]
    H --> I[Baris minggu lalu: limit vs spent vs remaining]
    I --> J{Overspend?}
    J -->|Ya| K[Badge merah 'Over Budget']
    J -->|Tidak| L[Badge hijau 'On Track']
```

## State per Halaman

### /login

| State | Tampilan |
|-------|----------|
| Default | Form email + password + tombol Login + link Daftar |
| Loading | Tombol Login disabled + spinner |
| Error | Inline error di bawah form ("Email atau password salah") |
| Success | Redirect ke /dashboard |

### /register

| State | Tampilan |
|-------|----------|
| Default | Form email + password + nama + tombol Daftar + link Login |
| Loading | Tombol Daftar disabled + spinner |
| Error | Inline error per field (email sudah terdaftar, password terlalu pendek) |
| Success | Redirect ke /login dengan toast "Registrasi berhasil" |

### /dashboard

| State | Tampilan |
|-------|----------|
| Loading | Skeleton placeholder untuk semua widget |
| No Budget | Banner "Belum ada budget minggu ini" + CTA "Set Budget" |
| Normal (< 80%) | Progress bar hijau/kuning + ringkasan + chart kategori + recent transactions |
| Warning (≥ 80%) | Progress bar merah + warning text "Budget hampir habis!" |
| Over Budget | Progress bar merah penuh + badge "Over Budget" |

### /transactions

| State | Tampilan |
|-------|----------|
| Loading | Skeleton placeholder |
| Empty | Ilustrasi + "Belum ada transaksi" + CTA "Catat Transaksi Pertama" |
| Success | Tabel transaksi + filter (waktu, tipe, kategori) + pagination |
| Error | Alert banner + tombol retry |

### /transactions/new

| State | Tampilan |
|-------|----------|
| Default | Form kosong (tipe, nominal, kategori, tanggal, catatan) |
| Loading | Tombol Simpan disabled + spinner |
| Error | Inline error di field yang salah |
| Success | Toast "Transaksi berhasil dicatat" + redirect ke /dashboard |

### /budgets

| State | Tampilan |
|-------|----------|
| Loading | Skeleton placeholder |
| Empty | "Belum pernah set budget" + CTA |
| Success | List card budget per minggu (limit, spent, remaining, status badge) |

### /budgets/new

| State | Tampilan |
|-------|----------|
| Default | Form: nominal limit, tanggal minggu (auto-filled) |
| Conflict | Error "Budget minggu ini sudah ada" + link ke edit |
| Loading | Tombol disabled + spinner |
| Success | Toast + redirect ke /dashboard |

### /categories

| State | Tampilan |
|-------|----------|
| Loading | Skeleton placeholder |
| Success | List kategori (default + kustom) — kustom bisa edit/hapus |
| Empty Custom | Hanya kategori default + CTA "Tambah Kategori" |

### /settings

| State | Tampilan |
|-------|----------|
| Default | Form profil (nama, email) + tombol Simpan |
| Loading | Spinner |
| Success | Toast "Profil berhasil diupdate" |

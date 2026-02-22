# UI Spec: WeeklyCash

> Berdasarkan: [ux-flow.md](./ux-flow.md)

## Tech Stack UI

- **Framework**: React 19 (TanStack Start, file-based routing)
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui (new-york style, neutral base color)
- **Icons**: lucide-react
- **Charts**: recharts (untuk dashboard breakdown)
- **Font**: Inter (Google Fonts)

---

## Layout Global

### Desktop (≥ 1024px)

```
┌──────────────────────────────────────────────────────┐
│  Sidebar 260px          │  Content Area              │
│  ┌───────────────────┐  │  ┌──────────────────────┐  │
│  │  🟢 WeeklyCash    │  │  │  Header               │  │
│  │                   │  │  │  ┌─────────────────┐  │  │
│  │  📊 Dashboard     │  │  │  │  Page Title      │  │  │
│  │  💸 Transaksi     │  │  │  │          [+ Baru] │  │  │
│  │  🎯 Budget        │  │  │  └─────────────────┘  │  │
│  │  🏷️ Kategori      │  │  │                        │  │
│  │  ⚙️ Settings      │  │  │  Main Content          │  │
│  │                   │  │  │                        │  │
│  │                   │  │  │                        │  │
│  │  ─────────────    │  │  │                        │  │
│  │  👤 Anas Mufti    │  │  │                        │  │
│  │  user@email.com   │  │  │                        │  │
│  └───────────────────┘  │  └──────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Mobile (< 1024px)

```
┌──────────────────────┐
│  Header              │
│  ☰ WeeklyCash  👤    │
├──────────────────────┤
│                      │
│  Main Content        │
│                      │
│                      │
│              [+ FAB] │
├──────────────────────┤
│  Bottom Navigation   │
│  📊  💸  🎯  🏷️  ⚙️  │
└──────────────────────┘
```

### Komponen Layout

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Sidebar | `Sidebar` | Collapsible di tablet, hidden di mobile |
| Header | — | Custom flexbox: page title kiri, action buttons kanan |
| Bottom Nav | — | Custom, fixed bottom, 5 icon tabs (mobile only) |
| FAB | `Button` | variant="default", size="icon", rounded-full, fixed bottom-right (mobile) |
| User menu | `DropdownMenu` | Avatar + nama di sidebar bawah, klik untuk logout |

---

## Halaman: /login

### Layout

```
┌──────────────────────────────────────┐
│            (no sidebar)              │
│                                      │
│     ┌────────────────────────┐       │
│     │   🟢 WeeklyCash        │       │
│     │                        │       │
│     │   Email                │       │
│     │   ┌──────────────────┐ │       │
│     │   │ user@email.com   │ │       │
│     │   └──────────────────┘ │       │
│     │                        │       │
│     │   Password             │       │
│     │   ┌──────────────────┐ │       │
│     │   │ ••••••••         │ │       │
│     │   └──────────────────┘ │       │
│     │                        │       │
│     │   [      Login       ] │       │
│     │                        │       │
│     │   Belum punya akun?    │       │
│     │   Daftar di sini       │       │
│     └────────────────────────┘       │
│                                      │
└──────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Container | `Card` | max-w-md, centered |
| Logo | — | Text + icon, di atas form |
| Email input | `Input` | type="email", placeholder="Email" |
| Password input | `Input` | type="password", placeholder="Password" |
| Login button | `Button` | variant="default", full width, type="submit" |
| Link daftar | — | `<Link>` ke /register, text-sm |
| Error message | `Alert` | variant="destructive", di atas form |

### Interaksi

- **Klik Login** → Validasi client-side dulu, lalu POST `/auth/login`
- **Enter key** → Submit form
- **Error** → Alert muncul di atas form, input tidak di-clear
- **Success** → Redirect ke `/dashboard`

### Responsive

- **Desktop**: Card centered di halaman
- **Mobile**: Card full-width, padding dikurangi

---

## Halaman: /register

### Layout

Sama dengan `/login`, tapi dengan field tambahan:

```
┌────────────────────────┐
│   🟢 WeeklyCash        │
│                        │
│   Nama Lengkap         │
│   ┌──────────────────┐ │
│   │ Anas Mufti       │ │
│   └──────────────────┘ │
│                        │
│   Email                │
│   ┌──────────────────┐ │
│   │ user@email.com   │ │
│   └──────────────────┘ │
│                        │
│   Password             │
│   ┌──────────────────┐ │
│   │ ••••••••         │ │
│   └──────────────────┘ │
│                        │
│   [     Daftar       ] │
│                        │
│   Sudah punya akun?    │
│   Login di sini        │
└────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Nama input | `Input` | placeholder="Nama lengkap" |
| Email input | `Input` | type="email" |
| Password input | `Input` | type="password", min 8 karakter |
| Register button | `Button` | variant="default", full width |
| Error per field | `Label` | text-destructive di bawah field |

---

## Halaman: /dashboard

### Layout

```
┌──────────────────────────────────────────────────┐
│  Header: "Dashboard"                              │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─── Budget Minggu Ini ───────────────────────┐  │
│  │  Rp450.000 / Rp700.000                      │  │
│  │  ████████████████░░░░░░░░░  64%              │  │
│  │  Sisa: Rp250.000  •  12 transaksi            │  │
│  │  17 Feb — 23 Feb 2026                        │  │
│  └──────────────────────────────────────────────┘  │
│                                                   │
│  ┌─── Ringkasan Minggu Ini ────┬─── Breakdown ─┐  │
│  │  💰 Income    Rp5.000.000   │   🍔 56%      │  │
│  │  💸 Expense   Rp450.000     │   🚗 27%      │  │
│  │  📊 12 transaksi           │   🎮 17%      │  │
│  └─────────────────────────────┴───────────────┘  │
│                                                   │
│  ┌─── Transaksi Terakhir ──────────────────────┐  │
│  │  🍔  Makan siang       -Rp75.000   22 Feb   │  │
│  │  🚗  Grab ke kantor    -Rp25.000   22 Feb   │  │
│  │  💰  Freelance project +Rp500.000  21 Feb   │  │
│  │  🍔  Kopi              -Rp35.000   21 Feb   │  │
│  │  🎮  Netflix           -Rp54.000   20 Feb   │  │
│  │                                              │  │
│  │  [Lihat Semua Transaksi →]                   │  │
│  └──────────────────────────────────────────────┘  │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Budget card | `Card` | Prominent, di atas. Berisi progress bar + angka |
| Progress bar | `Progress` | value=percentage. Warna: hijau (<60%), kuning (60-79%), merah (≥80%) |
| Warning text | `Alert` | variant="destructive", muncul jika ≥80% |
| No-budget banner | `Alert` | variant="default" + `Button` CTA "Set Budget" |
| Summary cards | `Card` | 2-3 card grid: income, expense, jumlah transaksi |
| Income value | — | text-green-500 |
| Expense value | — | text-red-500 |
| Breakdown chart | — | Donut chart (recharts) atau list bar sederhana |
| Recent transactions | `Card` + list | Max 5 item, tiap item: icon + nama + nominal + tanggal |
| Nominal income | — | text-green-500. prefix "+" |
| Nominal expense | — | text-red-500, prefix "-" |
| Lihat semua link | `Button` | variant="link", navigate ke /transactions |

### Interaksi

- **Klik budget card** → Navigate ke `/budgets`
- **Klik "Set Budget"** (jika belum ada) → Navigate ke `/budgets/new`
- **Klik item transaksi** → Dialog edit transaksi (Sheet)
- **Klik "Lihat Semua Transaksi"** → Navigate ke `/transactions`
- **Progress bar animasi** → Smooth transition saat data loaded

### Responsive

- **Desktop**: Grid 2 kolom untuk summary + breakdown
- **Mobile**: Stack vertikal, semua card full-width

---

## Halaman: /transactions

### Layout

```
┌──────────────────────────────────────────────────┐
│  Header: "Transaksi"                 [+ Baru]    │
├──────────────────────────────────────────────────┤
│  ┌─ Filter ──────────────────────────────────┐   │
│  │ Waktu: [Minggu ini ▾]  Tipe: [Semua ▾]   │   │
│  │ Kategori: [Semua ▾]    🔍 Cari...         │   │
│  └───────────────────────────────────────────┘   │
│                                                   │
│  ┌─ Summary Bar ────────────────────────────┐    │
│  │  Income: +Rp5.000.000   Expense: -Rp450K │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
│  ┌──────┬──────────┬───────┬────────┬────────┐   │
│  │ Tgl  │ Kategori │ Note  │ Nominal│ Aksi   │   │
│  ├──────┼──────────┼───────┼────────┼────────┤   │
│  │22/02 │🍔 Makan  │Siang  │-75.000 │ ✏️ 🗑️  │   │
│  │22/02 │🚗 Trans  │Grab   │-25.000 │ ✏️ 🗑️  │   │
│  │21/02 │💰 Free.. │Projek │+500.000│ ✏️ 🗑️  │   │
│  └──────┴──────────┴───────┴────────┴────────┘   │
│                                                   │
│  Pagination: ‹  1  2  3  ...  5  ›               │
└──────────────────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Tombol Baru | `Button` | variant="default", size="sm", icon Plus |
| Filter waktu | `Select` | Options: Minggu ini, Minggu lalu, Bulan ini, Custom |
| Filter tipe | `Select` | Options: Semua, Income, Expense |
| Filter kategori | `Select` | Dynamic dari API |
| Search | `Input` | placeholder="Cari transaksi...", debounce 300ms |
| Summary bar | — | Flexbox, total income (green) + total expense (red) |
| Tabel | `Table` | Sortable by tanggal, nominal |
| Nominal income | — | text-green-500, prefix "+" |
| Nominal expense | — | text-red-500, prefix "-" |
| Edit button | `Button` | variant="ghost", size="icon", icon Pencil |
| Delete button | `Button` | variant="ghost", size="icon", icon Trash2, text-destructive |
| Pagination | `Pagination` | — |
| Edit dialog | `Sheet` | Side sheet (kanan), form pre-filled |
| Delete dialog | `AlertDialog` | Konfirmasi sebelum hapus |

### Interaksi

- **Klik "+ Baru"** → Navigate ke `/transactions/new`
- **Klik ✏️** → `Sheet` terbuka dari kanan dengan form pre-filled
- **Klik 🗑️** → `AlertDialog` konfirmasi "Yakin hapus transaksi ini?"
- **Ganti filter** → Reset ke halaman 1, re-fetch data
- **Ketik di search** → Debounce 300ms, filter tabel
- **Klik header kolom** → Sort ascending/descending

### Responsive

- **Desktop**: Tabel penuh dengan semua kolom
- **Mobile**: Card list (bukan tabel). Setiap card: kategori icon + nama, nominal, tanggal. Swipe left untuk edit/delete.

---

## Halaman: /transactions/new

### Layout

```
┌──────────────────────────────────────┐
│  Header: "Catat Transaksi"    [←]    │
├──────────────────────────────────────┤
│                                      │
│  Tipe Transaksi                      │
│  ┌──────────┐  ┌──────────┐         │
│  │ 💸 Expense│  │ 💰 Income│         │
│  │  (active) │  │          │         │
│  └──────────┘  └──────────┘         │
│                                      │
│  Nominal                             │
│  ┌──────────────────────────┐       │
│  │ Rp  75.000               │       │
│  └──────────────────────────┘       │
│                                      │
│  Kategori                            │
│  ┌──────────────────────────┐       │
│  │ 🍔 Makanan           ▾   │       │
│  └──────────────────────────┘       │
│                                      │
│  Tanggal                             │
│  ┌──────────────────────────┐       │
│  │ 📅 22 Feb 2026           │       │
│  └──────────────────────────┘       │
│                                      │
│  Catatan (opsional)                  │
│  ┌──────────────────────────┐       │
│  │ Makan siang dengan tim   │       │
│  └──────────────────────────┘       │
│                                      │
│  [        Simpan Transaksi         ] │
│                                      │
└──────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Back button | `Button` | variant="ghost", icon ArrowLeft |
| Tipe toggle | `ToggleGroup` | 2 opsi: Expense (default) dan Income |
| Nominal input | `Input` | type="number", prefix "Rp", auto-format ribuan |
| Kategori | `Select` | Options dynamis, grouped by type (income/expense) |
| Tanggal | `DatePicker` (`Popover` + `Calendar`) | Default hari ini |
| Catatan | `Textarea` | placeholder="Tulis catatan...", opsional |
| Simpan button | `Button` | variant="default", full width, type="submit" |
| Error per field | `Label` | text-destructive |

### Interaksi

- **Toggle tipe** → Kategori dropdown berubah sesuai tipe (Income categories / Expense categories)
- **Input nominal** → Auto-format ribuan (75000 → 75.000)
- **Klik Simpan** → Validasi → POST → Toast success → Redirect ke /dashboard
- **Klik ←** → Navigate back

### Responsive

- **Desktop**: Form max-w-lg centered
- **Mobile**: Form full-width, padding normal

---

## Halaman: /budgets

### Layout

```
┌──────────────────────────────────────────────────┐
│  Header: "Budget Mingguan"           [+ Baru]    │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─ Minggu ini (17-23 Feb) ─── AKTIF ──────────┐ │
│  │  Limit: Rp700.000                            │ │
│  │  ████████████████░░░░░░░  64%                │ │
│  │  Spent: Rp450.000   Sisa: Rp250.000          │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌─ 10-16 Feb ─── ✅ On Track ─────────────────┐ │
│  │  Limit: Rp700.000                            │ │
│  │  Spent: Rp620.000   Sisa: Rp80.000    89%   │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌─ 3-9 Feb ─── 🔴 Over Budget ───────────────┐  │
│  │  Limit: Rp600.000                            │ │
│  │  Spent: Rp750.000   Over: -Rp150.000  125%  │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  Pagination: ‹  1  2  ›                          │
└──────────────────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Tombol Baru | `Button` | variant="default", hidden jika budget minggu ini sudah ada |
| Budget card | `Card` | Tiap card = 1 minggu |
| Progress bar | `Progress` | Warna sesuai persentase |
| Status badge | `Badge` | "Aktif" (blue), "On Track" (green), "Over Budget" (red) |
| Angka nominal | — | Font mono, format Rp |
| Pagination | `Pagination` | — |

### Interaksi

- **Klik card aktif** → `Sheet` edit budget (ubah limit)
- **Klik "+ Baru"** → Navigate ke `/budgets/new`

### Responsive

- **Desktop**: Card stack, max-w-2xl
- **Mobile**: Card full-width

---

## Halaman: /budgets/new

### Layout

```
┌──────────────────────────────────────┐
│  Header: "Set Budget Minggu Ini" [←] │
├──────────────────────────────────────┤
│                                      │
│  Batas Pengeluaran Minggu Ini        │
│  ┌──────────────────────────┐       │
│  │ Rp  700.000              │       │
│  └──────────────────────────┘       │
│                                      │
│  Periode Minggu                      │
│  ┌──────────────────────────┐       │
│  │ 📅 17 Feb — 23 Feb 2026  │       │
│  │ (auto-filled minggu ini)  │       │
│  └──────────────────────────┘       │
│                                      │
│  [        Simpan Budget            ] │
│                                      │
└──────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Nominal input | `Input` | type="number", prefix "Rp", auto-format |
| Periode | `DatePicker` (range) | Auto-filled Senin-Minggu minggu ini, bisa diubah |
| Simpan button | `Button` | variant="default", full width |

---

## Halaman: /categories

### Layout

```
┌──────────────────────────────────────────────────┐
│  Header: "Kategori"                 [+ Baru]     │
├──────────────────────────────────────────────────┤
│                                                   │
│  Pengeluaran (Expense)                            │
│  ┌──────────────────────────────────────────────┐ │
│  │  🍔  Makanan              default             │ │
│  │  🚗  Transportasi         default             │ │
│  │  🎮  Hiburan              default             │ │
│  │  🏠  Tagihan              default             │ │
│  │  🛒  Belanja              default             │ │
│  │  📦  Lainnya              default             │ │
│  │  ☕  Kopi                 kustom    ✏️ 🗑️     │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  Pemasukan (Income)                               │
│  ┌──────────────────────────────────────────────┐ │
│  │  💰  Gaji                 default             │ │
│  │  💼  Freelance            default             │ │
│  │  🎁  Bonus                default             │ │
│  │  💻  Side Hustle          kustom    ✏️ 🗑️     │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Tombol Baru | `Button` | variant="default", size="sm" |
| Section header | — | "Pengeluaran" / "Pemasukan", font-semibold |
| Category list | `Card` + list | Icon + nama + badge (default/kustom) |
| Default badge | `Badge` | variant="secondary", "default" |
| Custom badge | `Badge` | variant="outline", "kustom" |
| Edit button | `Button` | variant="ghost", size="icon", hanya untuk kustom |
| Delete button | `Button` | variant="ghost", size="icon", text-destructive, hanya untuk kustom |
| Add/Edit dialog | `Dialog` | Form: nama, tipe (select), icon (emoji picker/input) |
| Delete confirm | `AlertDialog` | "Kategori masih digunakan oleh X transaksi" jika ada konflik |

### Interaksi

- **Klik "+ Baru"** → `Dialog` form tambah kategori
- **Klik ✏️** → `Dialog` form edit (pre-filled)
- **Klik 🗑️** → `AlertDialog` konfirmasi. Error jika masih ada transaksi terkait.
- **Kategori default** → Tidak bisa diedit/dihapus (tombol hidden)

### Responsive

- **Desktop**: List max-w-2xl centered
- **Mobile**: List full-width

---

## Halaman: /settings

### Layout

```
┌──────────────────────────────────────┐
│  Header: "Pengaturan"                │
├──────────────────────────────────────┤
│                                      │
│  Profil                              │
│  ┌──────────────────────────┐       │
│  │  Nama Lengkap            │       │
│  │  ┌────────────────────┐  │       │
│  │  │ Anas Mufti         │  │       │
│  │  └────────────────────┘  │       │
│  │                          │       │
│  │  Email                   │       │
│  │  ┌────────────────────┐  │       │
│  │  │ user@email.com 🔒  │  │       │
│  │  └────────────────────┘  │       │
│  │                          │       │
│  │  [  Simpan Perubahan  ]  │       │
│  └──────────────────────────┘       │
│                                      │
│  ──────────────────────────         │
│                                      │
│  [🚪 Logout]                        │
│                                      │
└──────────────────────────────────────┘
```

### Komponen

| Komponen | shadcn/ui | Keterangan |
|----------|-----------|------------|
| Profil card | `Card` | max-w-lg |
| Nama input | `Input` | Editable |
| Email input | `Input` | Disabled (read-only), icon Lock |
| Simpan button | `Button` | variant="default" |
| Separator | `Separator` | — |
| Logout button | `Button` | variant="destructive", variant="outline" |

### Interaksi

- **Klik Simpan** → PUT `/auth/me` → Toast "Profil berhasil diupdate"
- **Klik Logout** → Clear token → Redirect ke `/login`

---

## Design Tokens

### Warna Semantik

| Token | Penggunaan | Warna |
|-------|------------|-------|
| `--income` | Nominal pemasukan | Green (Tailwind `green-500`) |
| `--expense` | Nominal pengeluaran | Red (Tailwind `red-500`) |
| `--budget-safe` | Progress bar < 60% | Green |
| `--budget-warning` | Progress bar 60-79% | Yellow/Amber |
| `--budget-danger` | Progress bar ≥ 80% | Red |
| `--budget-over` | Progress bar > 100% | Red + pulse animation |

### Typography

| Element | Style |
|---------|-------|
| Page title | `text-2xl font-bold` |
| Card title | `text-lg font-semibold` |
| Nominal uang | `font-mono tabular-nums` |
| Label | `text-sm font-medium text-muted-foreground` |
| Body | `text-sm` (Inter, 14px) |

### Animasi & Transitions

| Element | Animasi |
|---------|---------|
| Progress bar | `transition-all duration-500 ease-out` saat value berubah |
| Card hover | `hover:shadow-md transition-shadow` |
| Toast | Slide in dari kanan atas, auto-dismiss 3 detik |
| Sheet | Slide in dari kanan, backdrop blur |
| Dialog | Fade in + scale, backdrop blur |
| FAB | `hover:scale-105 active:scale-95 transition-transform` |
| Budget warning | `animate-pulse` saat ≥ 80% |
| Number counter | Count-up animation saat dashboard loaded |

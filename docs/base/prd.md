# PRD: WeeklyCash

## Product Overview

**WeeklyCash** adalah aplikasi web manajemen keuangan pribadi yang dirancang untuk memberikan kontrol lebih ketat melalui sistem penganggaran mingguan. Berbeda dengan aplikasi keuangan tradisional yang fokus pada laporan bulanan, platform ini membantu pengguna membagi alokasi dana ke dalam unit waktu yang lebih kecil agar tidak terjadi pengeluaran berlebih di awal bulan.

## Background Problem & Solution

### Problem

- **Monthly Overspending:** Banyak orang gagal mengelola anggaran bulanan karena mereka cenderung "royal" di minggu pertama setelah gajian dan kehabisan uang di minggu terakhir.
- **Complexity:** Aplikasi keuangan seringkali terlalu rumit dengan fitur investasi atau pajak, padahal kebutuhan utama pengguna adalah tahu: "Sisa uang saya untuk minggu ini berapa?"
- **Lack of Discipline:** Sulit menjaga kedisiplinan jika evaluasi hanya dilakukan sebulan sekali.

### Solution

- **Weekly Granularity:** Memecah anggaran bulanan menjadi target mingguan yang lebih mudah dikelola.
- **Real-time Tracking:** Memberikan visualisasi langsung mengenai sisa kuota belanja minggu berjalan.
- **Simplified Interface:** Fokus pada input cepat (pemasukan/pengeluaran) dan status budget.

## Features

### Core Features (MVP — Priority 1)

- [ ] **Transaction Logging:** Input pengeluaran dan pemasukan (nominal, kategori, tanggal, catatan).
- [ ] **Weekly Budget Setting:** Fitur menetapkan batas maksimal pengeluaran per minggu.
- [ ] **Dashboard Visual:** Progress bar yang menunjukkan sisa budget minggu ini.
- [ ] **Category Management:** Kategori default (Makanan, Transportasi, Hiburan, dll) dan kemampuan menambah kategori kustom.
- [ ] **History Ledger:** Daftar riwayat transaksi sederhana dengan filter waktu.

### Nice to Have (NTH — Priority 2)

- [ ] **Dark Mode:** UI yang nyaman untuk mata (esensial untuk penggunaan malam hari).
- [ ] **CSV/Excel Export:** Memungkinkan pengguna mengolah data secara mandiri.
- [ ] **Multi-Account/Wallet:** Memisahkan saldo tunai, rekening bank, dan *e-wallet*.
- [ ] **Recurring Transactions:** Pencatatan otomatis untuk pengeluaran rutin (seperti tagihan internet atau langganan).

### Plan to Have (PTH — Priority 3)

- [ ] **AI Categorization:** Menggunakan NLP untuk mengkategorikan transaksi secara otomatis berdasarkan deskripsi.
- [ ] **Receipt Scanner (OCR):** Ambil foto struk dan data nominal otomatis terinput.
- [ ] **Family/Shared Wallet:** Berbagi satu dompet dengan pasangan (sinkronisasi real-time).
- [ ] **Progressive Web App (PWA):** Agar bisa diakses seperti aplikasi native di smartphone tanpa lewat App Store.

## User Stories

- Sebagai user, saya ingin **menentukan budget mingguan sebesar Rp700.000**, agar saya punya batasan harian yang jelas dan tidak boros.
- Sebagai user, saya ingin **mencatat pengeluaran makan siang dengan cepat**, agar saya tidak lupa mencatat detail kecil saat sedang bepergian.
- Sebagai user, saya ingin **melihat persentase budget yang sudah terpakai di dashboard**, agar saya bisa mengerem pengeluaran jika kuota sudah mencapai 80%.
- Sebagai user, saya ingin **mengedit atau menghapus transaksi yang salah input**, agar data keuangan saya tetap akurat.
- Sebagai user, saya ingin **melihat rekap pengeluaran minggu lalu**, agar saya bisa mengevaluasi apakah budget minggu ini perlu ditambah atau dikurangi.

## Reference & Inspiration

- **YNAB (You Need A Budget):** Terkenal dengan filosofi *"Give Every Dollar a Job"*.
- **Mint (Legacy):** Untuk referensi visualisasi chart dan kategori.
- **Wallet by BudgetBakers:** Referensi untuk sinkronisasi antar perangkat.
- **Local Apps (BukuKas/Pina):** Referensi UX yang relevan dengan kebiasaan transaksi orang Indonesia.
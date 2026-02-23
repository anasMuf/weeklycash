# Rencana Implementasi PWA (Progressive Web App)

Dokumen ini menjelaskan tahapan untuk mengubah aplikasi WeeklyCash (berbasis Vite/TanStack Start) menjadi Progressive Web App secara berkesinambungan.

## 🎯 Tujuan Utama
1. **Installability**: Pengguna dapat menginstal aplikasi di *Home Screen* (Android/iOS) atau Desktop layaknya aplikasi native.
2. **Offline Resilience**: Aplikasi tetap bisa dibuka (tidak menampilkan halaman dinosaurus) saat koneksi internet terputus, dan menampilkan state offline yang informatif.
3. **Performance**: Mempercepat waktu muat (load time) menggunakan cache dari Service Worker.

---

## 🛠️ Rekomendasi Teknologi
Karena kita menggunakan ekosistem Vite, kita akan menggunakan plugin standar industri:
- **`vite-plugin-pwa`**: Wrapper terbaik untuk Workbox di ekosistem Vite. Plugin ini mengotomatiskan pembuatan Service Worker dan file Manifest web.

---

## 📋 Tahapan Implementasi (Roadmap)

### Fase 1: Persiapan Aset & Manifest Web (Dasar PWA)
Fokus pada pembuatan identitas aplikasi agar bisa dikenali oleh browser sebagai PWA yang valid.

*   **Pembuatan Icon**:
    *   Siapkan logo WeeklyCash dalam 2 ukuran wajib: `192x192 px` dan `512x512 px` (format PNG).
    *   Opsional: SVG logo untuk favicon/maskable icon.
*   **Web App Manifest**:
    *   Konfigurasi file manifest (nama aplikasi, nama pendek, deskripsi, warna tema, warna latar belakang, dan mode tampilan/display mode: `standalone`).
*   **Instalasi Plugin**:
    *   Install package: `pnpm add -D vite-plugin-pwa` di dalam folder `apps/platform`.
    *   Tambahkan konfigurasi awal `VitePWA` di dalam `vite.config.ts`.

### Fase 2: Konfigurasi Service Worker & Caching
Fokus pada pengaturan cache (Workbox) agar aplikasi memuat dengan cepat dan aset statis tersedia offline.

*   **Static Assets Caching**:
    *   Konfigurasi Workbox untuk nge-cache semua file HTML, CSS, JS, dan font yang dibuild oleh Vite.
*   **API Runtime Caching (Opsional tapi disarankan)**:
    *   Caching endpoint `/api/v1/categories` dan profil agar setidaknya dashboard memiliki data fallback saat offline. (Strategi: `NetworkFirst` atau `StaleWhileRevalidate`).
*   **Register Service Worker**:
    *   Injeksi script pendaftaran Service Worker ke dalam entry point TanStack Router (`__root.tsx` atau `client.tsx`).

### Fase 3: Penanganan Status Offline (UX)
Memastikan pengalaman pengguna tetap baik ketika koneksi terputus.

*   **Deteksi Online/Offline**:
    *   Buat hook khusus (misal: `useNetworkStatus`) untuk memonitor perpindahan status jaringan (`window.addEventListener('online' / 'offline')`).
*   **Offline Banner/Toast**:
    *   Tampilkan banner peringatan *"Peringatan: Anda sedang offline, menampilkan data terakhir yang tersimpan"* ketika koneksi mati.
*   **Disable Fitur Mutasi**:
    *   Disable tombol Tambah Transaksi, Tambah Budget, edit profil (semua mutasi API `POST`/`PUT`) selama aplikasi dalam status offline agar tidak terjadi error request.

### Fase 4: Prompt Instalasi Otomatis/Manual (Opsional/Polesan)
Mengajak pengguna secara proaktif untuk menginstal aplikasi.

*   **Deteksi Instalasi**: Menangkap event `beforeinstallprompt` (khusus Chrome/Android).
*   **Tombol Instal Khusus**: Membuat komponen UI (misal di sidebar atau navbar) dengan tulisan "Install App" yang memicu prompt instalasi native.
*   **Instruksi iOS**: Membuat modal instruksi khusus untuk Safari/iOS (karena iOS tidak mendukung `beforeinstallprompt`, pengguna harus diarahkan untuk klik "Share" -> "Add to Home Screen").

---

## 🚀 Langkah Pertama yang Harus Dilakukan
Untuk memulai, kita perlu mengumpulkan aset icon dasar.
Apakah Anda sudah memiliki file logo berformat PNG atau SVG berukuran kotak/persegi proporsional yang ingin digunakan sebagai App Icon? Jika belum, saya bisa membuatkan placeholder konfigurasinya terlebih dahulu melalui `vite-plugin-pwa`.

# Cretivox Endurance Test - Interactive Web Experience

Sebuah *web experience* interaktif berkinerja tinggi dan imersif yang dibangun sebagai bagian dari Cretivox Endurance Test. Proyek ini menunjukkan implementasi *frontend engineering* tingkat lanjut, menggabungkan animasi *scrolling* yang mulus dengan elemen 3D untuk memberikan pengalaman pengguna yang interaktif dan premium.

## 🚀 Tech Stack (Core Engine)
- **Framework**: React & Next.js (App Router)
- **Bahasa Pemrograman**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animasi**: GSAP (ScrollTrigger)
- **Render 3D**: Three.js & React Three Fiber (R3F)
- **Deployment**: Vercel

## 🎯 Fitur & Bagian Utama
### 1. Hero Section
Layar pendaratan (*landing screen*) yang kuat, menampilkan tipografi dinamis dengan animasi *stagger* dan teks berjalan (marquee) tanpa akhir yang mengulang pernyataan inti project ini.

### 2. Identity (`SEC_02`)
Pengalaman *scrolling* menyamping (horizontal) yang dikunci menggunakan `ScrollTrigger` dan terbagi menjadi tiga panel berbeda. Bagian ini menampilkan teks yang muncul mengikuti irama *scroll* dan tata letak visual bernuansa *grayscale* yang elegan.

### 3. Fierce Gallery (`SEC_03`)
Galeri foto interaktif yang menampilkan "tiga sisi dari orang yang sama". Mengarahkan *mouse* (hover) ke gambar akan memicu efek partikel debu piksel (*pixel-dust particle*) berbasis matematika yang dibangun dari nol menggunakan HTML5 `<canvas>`.

### 4. Engine (`SEC_04`)
Daftar teknologi yang digunakan, disusun secara rapi dan dinamis. Melakukan *scroll* ke bawah akan memicu animasi penarikan garis yang presisi serta pengacakan huruf tipografi, menyoroti *tools* utama yang dipakai (Frontend, Animasi, Tools, Desain).

### 5. Truth or Dare (`SEC_05`)
Pengalaman interaktif acak kartu 3D yang sangat kompleks.
- Menampilkan tumpukan kartu yang membentang seperti kipas secara elegan berdasarkan posisi *scroll* pengguna.
- Mengeklik **SHUFFLE** akan memicu *timeline* GSAP khusus yang meniru gerakan mengocok kartu fisik.
- Mengeklik **TRUTH** atau **DARE** akan memilih satu kartu secara acak, menariknya ke tengah, memutarnya di ruang 3D, dan mengacak teks untuk menampilkan hasil secara dinamis.

### 6. Exclusive Access (`SEC_06`)
Sebuah gerbang autentikasi *mock-up* yang mensimulasikan *login* menuju arsip internal. Fitur ini memiliki integrasi REST API yang berfungsi penuh (menggunakan DummyJSON) untuk memvalidasi kredensial, mengatur *state*, dan menampilkan teks *glitch* saat akses berhasil diberikan.

### 7. Accept Me (`SEC_07`)
Proposal penutup (*grand finale*).
- Mengintegrasikan **React Three Fiber** untuk merender Kotak Cincin Tunangan 3D (format `.glb`) dengan pencahayaan dinamis, kamera *rigging* yang bisa menyesuaikan skala otomatis, dan kendali *OrbitControls*.
- Memiliki tombol **NO** interaktif yang selalu "menghindar" secara acak di sekitar layar agar tidak bisa diklik.
- Mengeklik tombol **YES** akan memicu perayaan *confetti* menggunakan *canvas* dan animasi layar penuh.

## 🛠️ Instalasi & Setup
1. Clone repositori ini:
   ```bash
   git clone https://github.com/JazeL2304/NAMA-REPO-ANDA.git
   
2. Masuk ke dalam direktori:
cd NAMA-REPO-ANDA

3. Install semua dependencies:
npm install

4. Jalankan development server:
npm run dev

5. Buka http://localhost:3000 di browser Anda.


👨‍💻 Developer
Jastin Lim

GitHub: @JazeL2304
LinkedIn: Jastin Lim
Instagram: @jast.lim

Made with Obsession.

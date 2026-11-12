# RV portfolio · motion review

[Rekaman ponsel](docs/motion-evidence/mobile-review.mp4) · [Rekaman desktop](docs/motion-evidence/desktop-review.mp4) · [IbraCode, sebelum dan sesudah](docs/motion-evidence/mobile-comparison.jpg) · [Urutan menu dan kartu](docs/motion-evidence/sequence-comparison.jpg) · [Perbandingan desktop RV](docs/motion-evidence/desktop-comparison.jpg) · [Detail huruf](docs/motion-evidence/heading-comparison.png)

Pembanding mobile adalah video asli **382096.mp4**, 720 × 1604, durasi 51,968 detik. Pembanding desktop adalah interaksi langsung dengan menu dan daftar proyek pada **ibracode.dev**. Baseline RV menggunakan frontend main pada **32abbb32**, sesudah PR #11. Waktu IbraCode di tabel menunjukkan posisi rekaman. Angka easing, durasi, jarak dan origin di kolom terakhir merupakan keputusan implementasi RV. Video sumber tidak memuat kurva input atau pengaturan engine.

## Motion Fidelity Matrix

| Adegan | Teramati pada referensi | RV sebelum revisi | Selisih yang ditangani | RV sesudah revisi |
| --- | --- | --- | --- | --- |
| Intro | HTML intro RV yang diberikan memperlihatkan fragmen logam, kilatan, nama dan perpindahan logo ke navbar. Video IbraCode tidak memuat intro RV. | Film RV menyertakan Enter dan Skip. | Dua tombol menjalankan aksi keluar yang sama. | Film berjalan otomatis. Skip atau Escape melewati film, dan Tab atau Shift+Tab mempertahankan fokus pada Skip. Reduced motion langsung membuka konten. |
| Hero | Desktop IbraCode membuka lanskap berlapis dengan nama di tengah. Pada film mobile, hero tetap terlihat di belakang menu yang masuk. | Monogram dan teks RV muncul dalam jarak waktu pendek, dilanjutkan typing loop. | Seni, nama dan tombol berebut perhatian saat awal. | Monogram dari scale 1,15 ke 1 selama 1,75 detik. Tiga baris nama mulai 0,22 detik, bertahap 0,13 detik. Bio dan aksi menyusul pada 0,88 detik. Parent terpisah menggerakkan kedalaman saat pengunjung menggulir. Typing loop asli tetap berjalan. |
| Navigasi | Sekitar 5–9 detik, tirai gelap menutup hero mobile dari kanan. Menu desktop live menempati sekitar separuh layar di kanan. | Mobile memiliki panel reversible. Desktop hanya memiliki tautan langsung. | Transisi antaradegan hilang pada desktop. | Satu timeline menggeser panel 100% ke 0 selama 0,85 detik dengan power4.inOut. Tautan naik dari balik mask mulai 0,24 detik dengan stagger 0,065 detik. Panel penuh pada ponsel dan sekitar 51% lebar desktop. Escape dan penutupan membalik timeline serta mengembalikan fokus. |
| About dan batas bagian | Sekitar 23–26 detik, komposisi gelap menggabungkan potret dan teks yang makin terbaca. Garis melintang mendahului beberapa judul. | RV menggunakan biografi dan catatan belajar. Sebagian mask memotong bagian bawah tulisan. | Gerak membaca, aksen garis dan reveal judul perlu ritme berlainan. | Judul catatan bergerak 30 px dari samping. Baris paragraf menguat saat melewati viewport. Garis membentang dari kiri, kanan atau tengah. Reveal judul berjalan 1,25 detik, dengan ruang untuk descender. Mask judul lepas setelah entrance selesai. |
| Proyek | Sekitar 29–34 detik, judul dan metadata berada di atas screenshot. Beberapa proyek bisa terlihat sekaligus pada ponsel. Desktop live menampilkan daftar vertikal rapat bergaris. | Gambar mendahului nama pada mobile. Desktop memakai lintasan horizontal yang dipin. | Hierarki mobile terbalik dan scroll vertikal berganti sumbu pada desktop. | TJKT, VIREON Library dan Reyhan WhatsApp Portfolio naik menurut posisi masing-masing. Urutan ponsel adalah judul, gambar, deskripsi, teknologi dan tiga aksi. Tablet serta desktop berganti ke dua kolom. Proyek kedua membalik sisi gambar. Urutan, modal, tautan dan detail tetap tersedia melalui keyboard. |
| Logo teknologi | Sekitar 12–14 detik, lajur teks layanan berpindah horizontal pada film mobile. Sumber gerak persisnya tidak dapat dibaca dari piksel. | Lajur teknologi dan teks indeks proyek sama-sama bergerak mengikuti scroll. | Ada gerak horizontal kedua di tengah halaman. | Hanya tiga lajur teknologi memetakan jarak horizontal ke posisi scroll. Lajur tengah melawan arah lajur luar. Satu panjang kelompok dipakai sebagai jarak lintasan. Scrub 0,16 detik mengembalikan posisi saat scroll dibalik. |
| GitHub dan tipografi | Referensi tidak memiliki seksi statistik GitHub yang setara. | Main sudah memakai label GitHub dan data integrasi asli. Font eksternal memungkinkan hasil geometri berubah ketika font cadangan dipakai. | Garis kiri judul, statistik dan tautan perlu diperiksa sesudah font final dimuat. | Tiga elemen berbagi tepi kiri di enam viewport. Outfit dan Manrope melayani konten utama, Barlow Condensed untuk label display, Fraunces untuk aksen editorial. Webfont disajikan oleh build RV sendiri. |
| Kontak dan penutup | Sekitar 48–51 detik, judul kontak masuk ke bidang gelap, disusul tautan. Pita huruf tebal terlihat di bawah. | Kontak, rating, arsip dan footer tersedia. Teks berjalan akhir belum ada. | Akhir halaman kehilangan ketukan tipografi sesudah konten fungsional. | Judul kontak, keterangan, label dan CTA berbagi scrub 0,38 detik dari top 88% ke top 38%. Isi footer naik 64 px. Strip tebal tersendiri menutup halaman, dengan kontrol jeda dan versi statis pada reduced motion. |

## Urutan dan pembagian gerak

**Intro RV.** Tiga fragmen masuk dari kiri atas, kiri bawah dan kanan atas mulai detik 0,4. Penguncian dimulai sekitar 1,5 detik. Logo utuh, pantulan dan kilatan mengambil alih sekitar 2,1 detik. Nama naik dari mask dengan stagger 0,02 detik, lalu subtitle. Pada 3,95 detik monogram bergerak ke titik tengah dan ukuran logo navbar yang diukur saat itu. Hero mulai sekitar 4,4 detik. Film terjadwal selesai sekitar 4,85 detik setelah aset siap. Kegagalan decode, Skip dan pengaturan reduced motion melepaskan halaman.

**Satu kartu, satu pemilik gerak.** Artikel tetap diam sebagai titik ukur. Pembungkusnya naik hingga 64 px, judul dari y 96%, dan label dari x −14 px. Dua bidang gambar bergerak berlawanan dari ±88% dengan sine.inOut. Paragraf lalu teknologi dan tombol masuk bertumpang tindih pada bagian terakhir. Parallax pada pembungkus gambar yang lebih dalam bergerak dari +4% ke −4%. Trigger mulai ketika tepi atas kartu mencapai 96% tinggi layar. Jarak masuk adalah nilai terkecil dari 90% tinggi artikel dan 80% tinggi viewport. Scrub 0,30 detik. Saat scroll dibalik, urutan tersebut terurai mengikuti posisi semula.

**Dua jenis lajur.** Logo berhenti setelah scrub menyusul posisi scroll. Wordmark akhir menggunakan pengulangan 26 detik, dengan dua kelompok berukuran sama. Saat terlihat, arah dan kecepatan merespons input secara bertahap selama 0,65 detik dan maksimal 1,85×. Saat pembaca berhenti menggulir, wordmark tetap berjalan. Tombol jeda menghentikannya. Keluar viewport, tab tersembunyi dan reduced motion membatasi pekerjaan animasi.

## Berkas dan siklus hidup

| Berkas di artifacts/portfolio | Perubahan |
| --- | --- |
| src/components/IntroAnimation.tsx, intro.css, HeroSection.tsx, Navbar.tsx | Film RV, fokus keyboard, handoff, kedalaman hero dan tirai navigasi |
| src/components/ProjectsSection.tsx, Reveal.tsx, SectionBoundary.tsx, JourneySection.tsx | Urutan setiap proyek dan detailnya, mask judul, garis antarbagian dan milestone yang mengikuti posisi scroll |
| src/components/ClosingMarquee.tsx, Footer.tsx, src/hooks/useEditorialScenes.ts | Urutan baca kontak, peralihan ke footer dan strip akhir yang bisa dijeda |
| src/hooks/useLenis.ts, src/lib/scroll.ts, src/lib/motion.ts | Satu instance Lenis, satu GSAP ticker, touch scrolling native, refresh ketika lebar berubah dan cleanup saat meninggalkan home |
| src/App.tsx, src/hooks/useSectionTheme.ts, src/theme.css, index.html, src/assets/type | Penghapusan kontrol dan preferensi tema, palet per bagian, font lokal dan tautan proyek saat JavaScript mati |
| tests/*.browser.test.mjs, tests/record-reference-review.mjs | Perilaku intro, dialog, navigasi, rute developer, ukuran layar, input lambat/cepat, jeda, reverse dan render huruf |

Panduan resmi GSAP dan skills-lock.json tersedia dalam repo. Efek scroll memakai gsap.matchMedia beserta cleanup. Objek yang bergerak saat entrance, scroll, dan hover memakai pembungkus yang berbeda. Framer Motion tetap menangani dialog React. Konfigurasi Supabase, tabel, aset proyek, isi asli dan workspace lain dipertahankan.

## Pengujian visual

Pada film sumber, hero masih terbuka di detik 5,0. Pada 5,3 panel sudah menutup sebagian hero dan dua tautan mulai terlihat. Di 6,0 panel dan seluruh daftar terlihat. Pada 8,3 sisi kiri hero kembali terlihat. Bukti berpasangan di atas memperlihatkan pose sela dan pose terbuka RV. Waktu jari pertama kali menyentuh layar tidak terekam. Pada 29,4 dan 30,5 detik, dua gambar proyek berbeda berbagi layar dalam urutan vertikal. RV memakai jarak lebih panjang untuk deskripsi, teknologi, dan tombol setiap proyek.

| Viewport | Lebar logo teknologi | Ukuran teks akhir | Tepi kiri GitHub | Overflow horizontal | Selisih piksel lima judul |
| --- | ---: | ---: | ---: | ---: | ---: |
| 360 × 800 | 39.2 px | 41.6 px | 24 px | 0 px | 0 |
| 390 × 844 | 39.2 px | 41.6 px | 24 px | 0 px | 0 |
| 430 × 932 | 39.2 px | 41.6 px | 24 px | 0 px | 0 |
| 768 × 1024 | 39.2 px | 56.8 px | 24 px | 0 px | 0 |
| 1280 × 900 | 58.9 px | 94.7 px | 64 px | 0 px | 0 |
| 1440 × 900 | 66.2 px | 106.6 px | 144 px | 0 px | 0 |

Urutan gambar, deskripsi, stack dan tiga aksi diperiksa pada 18 lintasan kartu. Pengujian mengambil posisi sebelum masuk, tengah, akhir dan kembali ke tengah. Pada enam ukuran, posisi artikel di dokumen tetap, dan lajur logo kembali ke posisi semula. Pada 390 × 844, input sentuh Chromium menggeser halaman +325 px, +380 px lalu −245 px. Di desktop, rangkaian wheel menghasilkan +340 px, +395 px lalu −260 px. Rekaman berisi lompatan antarseksi untuk mempersingkat navigasi, dengan gerak kartu direkam langsung pada kecepatan pemutaran asli.

Uji huruf membandingkan screenshot heading yang sudah berhenti dengan heading yang sama saat pembatas overflow dibuka. Selisih luminans minimal 12/255 dihitung per piksel. Baseline “Dari ide / jadi karya.” kehilangan 101 piksel pada 390 px dan 447 pada 1440 px. Pada hasil revisi, 30 pasangan screenshot untuk hero, about, proyek, GitHub dan kontak menghasilkan nol. Baseline memakai fallback untuk font Google eksternal dalam fixture. Font Barlow dan Fraunces italic untuk judul proyek tersedia lokal pada kedua versi. [Data pengukuran](docs/motion-evidence/review-results.json)

## Batas perbandingan

RV mempertahankan monogram dan tipografi hero, sementara IbraCode memakai lanskap. About RV berupa biografi tanpa potret referensi. Kartu RV lebih panjang supaya deskripsi, teknologi dan tautan terbaca. Rating dan arsip memberi jarak tambahan antara kontak dan footer. Perbedaan ini terlihat dalam tangkapan layar. Kurva easing internal dan input asli IbraCode tidak diketahui.

Rekaman menggunakan Chromium dengan font asli yang dibundel dan fixture untuk layanan eksternal. Uji login memeriksa penolakan dan keberhasilan dengan akun uji sementara. Form publik Developer Access tersedia di /admin. Implementasi produksi mencocokkan username dan password yang sudah ada di public.admins. Repo tidak menyediakan kredensial default. Akun produksi, penulisan data pelanggan, WebKit iOS, suhu perangkat dan performa GPU Oppo fisik belum diverifikasi.

## Hasil build dan pengujian

TypeScript lulus. Vite membangun frontend sesudah penambahan CADIAK dalam 10,95 detik. Bundle entri berukuran 830,04 kB, atau 266,62 kB dengan gzip, dan memicu peringatan ukuran chunk. Pada build produksi, 33 dari 36 tes browser lulus. Tiga tes yang memakai akses ke modul pengembangan dilewati pada build ini. Ketiganya lulus pada Vite dev, termasuk pemulihan saat render gagal, perubahan tinggi akibat bilah peramban, serta pelepasan seluruh ScrollTrigger dan Lenis saat berpindah rute. Kedua suite yang dijalankan di Vite dev mencatat 18 lulus. Dengan JavaScript dimatikan, nama pemilik, tiga tautan proyek dan tautan GitHub tampil pada 390 × 844. [Log browser](docs/motion-evidence/browser-tests.txt)

Uji perubahan lebar menemukan SplitText dapat menyelesaikan pemenggalan ulang setelah ScrollTrigger mengukur dokumen. Dalam 20 pengukuran awal, tiga melampaui toleransi 2 px dan selisih terbesar mencapai 260,47 px. Sesudah pemenggalan ulang memicu pengukuran bersama pada frame berikutnya, 20 pengukuran pada sepuluh putaran resize mencatat selisih maksimum 0,47 px. Pada uji akhir Chromium dengan perlambatan CPU 4×, intro berlangsung 5,35 detik. Dalam tiga sesi pengukuran 180 interval saat menggulir, median tetap 16,7 ms, persentil ke-95 berkisar 33,4–166,6 ms, dan 3–16 interval melebihi 50 ms. Pada sesi terakhir tercatat 16 interval di atas 50 ms. Pengaruh beban lingkungan dan pekerjaan browser belum dipisahkan. Hasil ini belum menetapkan FPS stabil pada perangkat fisik.

## Sertifikat CADIAK, 12 November 2026

Entri umum “Posisi kedua / CTF Competition” diganti dengan kartu **CADIAK CTF 2026**. Dokumen sumber dari Drive mencantumkan Reyhan Irza Alvano, SMKN 2 Lubuk Basung, 2nd Place, Padang 30 September 2026, dan nomor SS/SERT/002-2026. PDF 3.371.937 byte disalin utuh ke aset publik. Preview WebP 1800 px dirender dari halaman pertama. Kartu memuat tempat, tanggal, hasil dan penerbit, disertai tautan buka dan unduh PDF lokal. Warna label unduh ketiga sertifikat mengikuti tinta palet section.

[Dokumen sumber](https://drive.google.com/file/d/1QjghGXc-j3f0hQfrd9FPY6SDM9ty4Myo/view) · [Tampilan ponsel](docs/motion-evidence/cadiak-390.png) · [Tampilan desktop](docs/motion-evidence/cadiak-1440.png) · [Data pengujian sertifikat](docs/motion-evidence/cadiak-results.json)

Preview, unduhan dengan nama berkas benar, tiga kartu prestasi, dan overflow 0 px diperiksa pada keenam viewport. Pengujian normal-motion menggulir ke masing-masing kartu dan mengubah lebar 390–700 px saat kartu sedang terlihat. Ketiga kartu tetap terbaca. Pengujian reduced motion memeriksa ketiga preview dan PDF asli. Rekaman motion dan perbandingan IbraCode di awal laporan diambil sebelum kartu CADIAK ditambahkan. Screenshot CADIAK serta log bertanggal 12 November memeriksa revisi yang menyertakan kartu baru.

## Reproduksi

Bangun frontend dengan variabel Vite untuk project Supabase uji. Arahkan PORTFOLIO_BUILD_DIRECTORY ke dist/public dan CHROMIUM_PATH ke Chromium. Jalankan suite dengan `node --test --test-concurrency=1 tests/*.browser.test.mjs`. Untuk pengujian khusus server pengembangan, kosongkan PORTFOLIO_BUILD_DIRECTORY dan jalankan reduced-motion.browser.test.mjs dan scroll-resize.browser.test.mjs. Untuk merekam, jalankan `node tests/record-reference-review.mjs` dengan MOTION_EVIDENCE_DIR dan encoder ffmpeg Playwright tersedia. REVIEW_BASELINE=1 menghasilkan pasangan pembanding dari build lama.

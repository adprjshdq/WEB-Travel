# JelajahNusa

Website travel dan wisata Indonesia yang menyediakan informasi
destinasi, paket wisata, penginapan, transportasi, wishlist, review,
booking, pembayaran, serta dashboard administrasi.

Project ini menggunakan **React + Vite + Tailwind CSS** untuk frontend
dan **Node.js + Express + MariaDB** untuk backend.

> Status project: fitur utama frontend, backend, database, booking,
> pembayaran, admin, upload gambar, dan transportasi sudah berjalan di
> lingkungan lokal. Tahap security dan production deployment akan
> dirapikan berikutnya.

------------------------------------------------------------------------

## 1. Gambaran Project

JelajahNusa dibuat untuk memudahkan pengguna mencari dan memesan
kebutuhan perjalanan dalam satu website.

Alur utama:

``` text
Pengunjung
   ↓
Beranda
   ↓
Destinasi / Paket / Penginapan / Transportasi
   ↓
Detail pilihan
   ↓
Booking
   ↓
Login
   ↓
Isi tanggal + jumlah tamu
   ↓
Buat booking
   ↓
Pembayaran
   ↓
Booking tersimpan
   ↓
Akun / Riwayat Booking
```

Administrator memiliki dashboard untuk mengelola data website:

``` text
Login Admin
    ↓
Dashboard
    ├── Statistik
    ├── Kelola User
    ├── Kelola Destinasi
    ├── Kelola Penginapan
    ├── Kelola Transportasi
    └── Kelola Booking
```

------------------------------------------------------------------------

# 2. Teknologi

## Frontend

-   React 19
-   Vite 8
-   Tailwind CSS 4
-   React Router
-   Font Awesome
-   JavaScript / JSX

## Backend

-   Node.js
-   Express.js
-   MySQL2
-   MariaDB
-   CORS
-   dotenv
-   bcrypt
-   JSON Web Token (JWT)
-   Multer
-   Nodemon

## Database

-   MariaDB 10.4.x
-   XAMPP
-   Database: `jelajahnusa`

------------------------------------------------------------------------

# 3. Struktur Project

Struktur utama project:

``` text
WEB-Travel/
└── jelajahnusa/
    ├── front-end/
    │   ├── public/
    │   │   └── images/
    │   │
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── data/
    │   │   ├── hooks/
    │   │   ├── pages/
    │   │   ├── routes/
    │   │   ├── services/
    │   │   ├── utils/
    │   │   ├── App.jsx
    │   │   ├── index.css
    │   │   └── main.jsx
    │   │
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    │
    └── backend/
        ├── src/
        │   ├── config/
        │   ├── controllers/
        │   ├── middleware/
        │   └── routes/
        │
        ├── uploads/
        ├── .env
        ├── package.json
        └── server.js
```

> Folder atau file tambahan dapat bertambah selama pengembangan.
> Struktur di atas menggambarkan pembagian utama frontend dan backend.

------------------------------------------------------------------------

# 4. Lokasi Project Saat Development

Frontend:

``` text
C:\PROJECT WEB\WEB-Travel\jelajahnusa\front-end
```

Backend:

``` text
C:\PROJECT WEB\WEB-Travel\jelajahnusa\backend
```

Frontend berjalan di:

``` text
http://localhost:5173
```

Backend berjalan di:

``` text
http://localhost:5001
```

API dasar:

``` text
http://localhost:5001/api
```

------------------------------------------------------------------------

# 5. Fitur Frontend

## Beranda

Berisi halaman utama JelajahNusa dan navigasi menuju fitur utama
website.

Fitur terkait:

-   Hero section
-   Navigasi website
-   Rekomendasi wisata
-   Paket wisata
-   Penginapan
-   Transportasi
-   Call-to-action
-   Responsive layout

------------------------------------------------------------------------

## Destinasi

Pengguna dapat melihat destinasi wisata Indonesia yang datanya berasal
dari backend/database.

Contoh destinasi:

-   Raja Ampat
-   Gunung Bromo
-   Candi Borobudur
-   Tanah Lot
-   Kelingking Beach
-   Kawah Ijen
-   Pantai Pangandaran
-   Pantai Madasari

Fitur:

-   Daftar destinasi
-   Lokasi
-   Deskripsi
-   Rating
-   Harga
-   Gambar
-   Wishlist
-   Booking

------------------------------------------------------------------------

## Paket Wisata

Paket yang tersedia antara lain:

-   Eksplorasi Pangandaran & Madasari
-   Komodo Sailing
-   Bromo dan Ijen
-   Jogja Heritage
-   Raja Ampat Diving
-   Rinjani Hero --- Sembalun Summit
-   Indahnesia Trekking --- Sembalun ke Senaru

Paket dapat memiliki:

-   Nama paket
-   Durasi
-   Harga
-   Mata uang
-   Kuota
-   Operator
-   Lokasi
-   Rating
-   Itinerary
-   Fasilitas
-   Wishlist
-   Booking

Harga paket dapat menggunakan:

``` text
IDR
```

atau:

``` text
USD
```

------------------------------------------------------------------------

## Penginapan

Pengguna dapat melihat hotel/penginapan yang tersedia.

Contoh data:

-   Villa Padi Ubud
-   Malioboro Heritage
-   Bromo Permai Homestay
-   Meridian Adventure Marina Club & Resort
-   Jiwa Jawa Resort Ijen

Informasi:

-   Nama hotel
-   Kota
-   Jumlah bintang
-   Harga
-   Fasilitas
-   Rating
-   Gambar

------------------------------------------------------------------------

## Transportasi

Pengguna dapat melihat transportasi dari database.

Jenis yang sudah tersedia:

-   Pesawat
-   Kereta
-   Bus
-   Sewa mobil

Informasi:

-   Jenis transportasi
-   Rute
-   Operator
-   Jam
-   Harga
-   Booking

Contoh data:

``` text
Pesawat | Jakarta - Labuan Bajo | Garuda Indonesia
Pesawat | Jakarta - Yogyakarta | Citilink
Pesawat | Surabaya - Denpasar | Lion Air
Kereta  | Gambir - Yogyakarta  | Argo Lawu
Kereta  | Surabaya - Malang    | Penataran
Bus     | Medan - Parapat      | ALS Executive
Sewa mobil | Bali              | Bali Trans
Sewa mobil | Yogyakarta         | Jogja Rental
```

------------------------------------------------------------------------

## Galeri

Galeri mengambil data destinasi melalui API.

Fitur:

-   Grid/masonry image
-   Gambar destinasi
-   Lokasi
-   Preview gambar
-   Dialog gambar
-   Fallback gambar jika gambar gagal dimuat
-   Loading state

------------------------------------------------------------------------

## Tentang Kami

Menampilkan perjalanan JelajahNusa dari tahun ke tahun dan prinsip kerja
perusahaan.

Timeline:

``` text
2018
Dua pemandu dari Yogyakarta mulai membawa tamu ke Bromo.

2021
Bermitra dengan 40 homestay milik warga lokal.

2024
Membuka rute Labuan Bajo dan Raja Ampat.

2026
Lebih dari 18.000 tamu, 96% memberi bintang 4 ke atas.
```

------------------------------------------------------------------------

## FAQ

Halaman pertanyaan umum menggunakan data FAQ dan elemen HTML
`<details>`.

Fitur:

-   Accordion FAQ
-   Pertanyaan
-   Jawaban
-   Animasi icon chevron

------------------------------------------------------------------------

## Kontak

Pengguna dapat mengirim pesan melalui halaman kontak.

Form:

-   Nama
-   Email
-   Pesan

Validasi:

-   Nama wajib
-   Email wajib
-   Pesan wajib
-   Minimal 10 karakter

------------------------------------------------------------------------

## Wishlist

Pengguna dapat menyimpan:

-   Destinasi
-   Paket
-   Hotel

Fitur:

-   Tambah wishlist
-   Hapus wishlist
-   Melihat daftar wishlist
-   Link menuju halaman item
-   Harga item

------------------------------------------------------------------------

## Review

Pengguna yang login dapat memberikan review.

Data review:

-   Nama pengguna
-   Paket
-   Rating
-   Tanggal
-   Isi review

Fitur:

-   Pilih paket
-   Rating 1--5
-   Tulis review
-   Rata-rata rating
-   Daftar review

------------------------------------------------------------------------

# 6. Sistem Booking

Booking dapat dilakukan untuk:

``` text
package
hotel
transport
destination
```

Data booking meliputi:

-   User
-   Destinasi
-   Transportasi
-   Jenis item
-   Nama item
-   Tanggal booking
-   Jumlah tamu
-   Total harga
-   Mata uang
-   Catatan
-   Status
-   Waktu dibuat

Status booking:

``` text
pending
confirmed
cancelled
```

------------------------------------------------------------------------

# 7. Validasi Tanggal Booking

Tanggal booking tidak boleh:

-   Kosong
-   Format salah
-   Tanggal kalender tidak valid
-   Lebih kecil dari tanggal hari ini

Frontend menggunakan atribut:

``` text
min={today}
```

Backend juga melakukan validasi sehingga validasi tidak hanya bergantung
pada browser.

------------------------------------------------------------------------

# 8. Pembayaran

Setelah booking berhasil dibuat, pengguna diarahkan ke halaman
pembayaran.

Fitur:

-   Ringkasan booking
-   Total harga
-   Mata uang
-   Konfirmasi pembayaran
-   Status booking
-   Riwayat pesanan

Endpoint pembayaran:

``` text
PUT /api/bookings/:id/pay
```

------------------------------------------------------------------------

# 9. Pembatalan Booking

Pengguna dapat membatalkan booking miliknya.

Endpoint:

``` text
PUT /api/bookings/:id/cancel
```

------------------------------------------------------------------------

# 10. Akun Pengguna

Halaman akun menampilkan:

-   Profil pengguna
-   Nama
-   Email
-   Riwayat booking
-   Status booking
-   Detail booking
-   Logout

Endpoint riwayat:

``` text
GET /api/bookings/my
```

Detail:

``` text
GET /api/bookings/my/:id
```

------------------------------------------------------------------------

# 11. Sistem Authentication

JelajahNusa menggunakan JWT untuk autentikasi.

Fitur:

-   Register
-   Login
-   JWT token
-   Protected route
-   Role user
-   Role admin
-   Middleware authentication
-   Middleware admin

Password menggunakan hashing dengan:

``` text
bcrypt
```

Token dikirim melalui header:

``` http
Authorization: Bearer <token>
```

------------------------------------------------------------------------

# 12. Role User dan Admin

## User

User dapat:

-   Melihat destinasi
-   Melihat paket
-   Melihat hotel
-   Melihat transportasi
-   Wishlist
-   Booking
-   Pembayaran
-   Melihat riwayat
-   Membatalkan booking
-   Memberikan review
-   Mengirim pesan

## Admin

Admin dapat:

-   Melihat dashboard
-   Mengelola user
-   Mengelola destinasi
-   Mengelola penginapan
-   Mengelola transportasi
-   Mengelola booking
-   Melihat statistik

------------------------------------------------------------------------

# 13. Dashboard Admin

Dashboard admin menyediakan statistik dan akses pengelolaan data.

Menu:

``` text
Dashboard
Kelola User
Kelola Destinasi
Kelola Penginapan
Kelola Transportasi
Kelola Booking
```

------------------------------------------------------------------------

# 14. CRUD Destinasi

Admin dapat:

``` text
CREATE
READ
UPDATE
DELETE
```

Data destinasi:

``` text
id
name
location
description
image
category
rating
price
created_at
```

Upload gambar menggunakan Multer.

------------------------------------------------------------------------

# 15. CRUD Penginapan

Admin dapat:

``` text
CREATE
READ
UPDATE
DELETE
```

Data:

``` text
id
name
city
stars
price
facilities
image
rating
created_at
```

------------------------------------------------------------------------

# 16. CRUD Transportasi

Admin dapat:

``` text
CREATE
READ
UPDATE
DELETE
```

Data:

``` text
id
jenis
rute
operator
jam
price
created_at
```

Endpoint admin:

``` text
GET    /api/admin/transports
POST   /api/admin/transports
PUT    /api/admin/transports/:id
DELETE /api/admin/transports/:id
```

Endpoint publik:

``` text
GET /api/transports
```

------------------------------------------------------------------------

# 17. Upload Gambar

Upload menggunakan:

``` text
Multer
```

Format yang diperbolehkan:

``` text
JPG
JPEG
PNG
WEBP
```

Batas ukuran:

``` text
5 MB
```

File upload disimpan pada:

``` text
backend/uploads/
```

Nama file dibuat otomatis agar lebih aman dan menghindari konflik nama.

Frontend membentuk URL gambar berdasarkan sumber:

``` text
public/images/
```

atau:

``` text
backend/uploads/
```

------------------------------------------------------------------------

# 18. Struktur Database

Database:

``` text
jelajahnusa
```

Tabel utama:

``` text
users
destinations
hotels
bookings
transports
```

------------------------------------------------------------------------

# 19. Tabel Users

Struktur:

``` text
users
├── id              INT PK AUTO_INCREMENT
├── name            VARCHAR(100)
├── email           VARCHAR(150) UNIQUE
├── password        VARCHAR(255)
├── role            ENUM('user','admin')
└── created_at      TIMESTAMP
```

Role default:

``` text
user
```

------------------------------------------------------------------------

# 20. Tabel Destinations

``` text
destinations
├── id              INT PK AUTO_INCREMENT
├── name            VARCHAR(150)
├── location        VARCHAR(200)
├── description     TEXT
├── image           VARCHAR(255)
├── category        VARCHAR(100)
├── rating          DECIMAL(2,1)
├── price           DECIMAL(12,2)
└── created_at      TIMESTAMP
```

------------------------------------------------------------------------

# 21. Tabel Hotels

``` text
hotels
├── id              INT PK AUTO_INCREMENT
├── name            VARCHAR(150)
├── city            VARCHAR(100)
├── stars            INT
├── price            DECIMAL(12,2)
├── facilities      TEXT
├── image           VARCHAR(255)
├── rating          DECIMAL(2,1)
└── created_at      TIMESTAMP
```

------------------------------------------------------------------------

# 22. Tabel Transports

``` text
transports
├── id              INT PK AUTO_INCREMENT
├── jenis           VARCHAR(50)
├── rute            VARCHAR(200)
├── operator        VARCHAR(150)
├── jam             VARCHAR(100)
├── price           DECIMAL(12,2)
└── created_at      TIMESTAMP
```

------------------------------------------------------------------------

# 23. Tabel Bookings

``` text
bookings
├── id              INT PK AUTO_INCREMENT
├── user_id         INT
├── destination_id  INT NULL
├── transport_id    INT NULL
├── item_type       ENUM(
│                    'package',
│                    'hotel',
│                    'transport',
│                    'destination'
│                  )
├── item_name       VARCHAR(200)
├── booking_date    DATE
├── guests          INT
├── total_price     DECIMAL(12,2)
├── currency        VARCHAR(3)
├── notes           TEXT
├── status          ENUM(
│                    'pending',
│                    'confirmed',
│                    'cancelled'
│                  )
└── created_at      TIMESTAMP
```

------------------------------------------------------------------------

# 24. Relasi Data

Relasi utama:

``` text
users
  │
  └──── bookings
            │
            ├──── destinations
            │
            └──── transports
```

`item_type` menentukan jenis barang yang dipesan:

``` text
package
hotel
transport
destination
```

Paket wisata dan hotel masih dapat menggunakan sumber harga/identitas
yang dikelola aplikasi sesuai implementasi controller.

------------------------------------------------------------------------

# 25. API Endpoint

## API dasar

``` http
GET /api
```

Digunakan untuk mengecek apakah API berjalan.

------------------------------------------------------------------------

## Authentication

``` http
POST /api/auth/register
POST /api/auth/login
```

------------------------------------------------------------------------

## Destinasi

``` http
GET /api/destinations
```

Admin:

``` http
GET    /api/admin/destinations
POST   /api/admin/destinations
PUT    /api/admin/destinations/:id
DELETE /api/admin/destinations/:id
```

------------------------------------------------------------------------

## Penginapan

``` http
GET /api/hotels
```

Admin:

``` http
GET    /api/admin/hotels
POST   /api/admin/hotels
PUT    /api/admin/hotels/:id
DELETE /api/admin/hotels/:id
```

------------------------------------------------------------------------

## Transportasi

Publik:

``` http
GET /api/transports
```

Admin:

``` http
GET    /api/admin/transports
POST   /api/admin/transports
PUT    /api/admin/transports/:id
DELETE /api/admin/transports/:id
```

------------------------------------------------------------------------

## Booking

User:

``` http
POST /api/bookings
GET  /api/bookings/my
GET  /api/bookings/my/:id
PUT  /api/bookings/:id/pay
PUT  /api/bookings/:id/cancel
```

Admin:

``` http
GET    /api/bookings
PUT    /api/bookings/:id/status
DELETE /api/bookings/:id
```

------------------------------------------------------------------------

## Admin Dashboard

``` http
GET /api/admin/stats
```

------------------------------------------------------------------------

# 26. Environment Variables

Backend menggunakan file:

``` text
backend/.env
```

Contoh development:

``` env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jelajahnusa
DB_PORT=3306

PORT=5001

JWT_SECRET=jelajahnusa_secret_123
```

> Untuk production, `JWT_SECRET` wajib diganti dengan secret acak yang
> kuat dan `.env` tidak boleh di-upload ke repository publik.

------------------------------------------------------------------------

# 27. Instalasi

## Persyaratan

Install terlebih dahulu:

-   Node.js
-   npm
-   XAMPP
-   MariaDB/MySQL
-   Git (opsional)
-   VS Code (disarankan)

------------------------------------------------------------------------

## Menjalankan MariaDB

Buka XAMPP lalu aktifkan:

``` text
Apache
MySQL
```

Pada project ini database menggunakan MariaDB dari XAMPP.

------------------------------------------------------------------------

# 28. Membuat Database

Buka phpMyAdmin atau MariaDB client.

Buat:

``` sql
CREATE DATABASE jelajahnusa;
```

Kemudian:

``` sql
USE jelajahnusa;
```

Buat tabel sesuai struktur pada bagian database README ini.

Jika project memiliki dump SQL, import dump tersebut agar struktur dan
data dapat dipulihkan sekaligus.

------------------------------------------------------------------------

# 29. Instalasi Backend

Masuk ke folder backend:

``` powershell
cd "C:\PROJECT WEB\WEB-Travel\jelajahnusa\backend"
```

Install dependency:

``` powershell
npm install
```

Jalankan development server:

``` powershell
npm run dev
```

Backend akan berjalan di:

``` text
http://localhost:5001
```

Tes:

``` text
http://localhost:5001/api
```

------------------------------------------------------------------------

# 30. Instalasi Frontend

Buka terminal baru:

``` powershell
cd "C:\PROJECT WEB\WEB-Travel\jelajahnusa\front-end"
```

Install dependency:

``` powershell
npm install
```

Jalankan:

``` powershell
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 31. Package Backend

Dependency utama backend:

``` text
express
mysql2
cors
dotenv
bcrypt
jsonwebtoken
multer
```

Development dependency:

``` text
nodemon
```

Script:

``` json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

------------------------------------------------------------------------

# 32. Package Frontend

Dependency utama frontend:

``` text
react
react-dom
react-router-dom
```

Development dependency:

``` text
@tailwindcss/vite
@vitejs/plugin-react
tailwindcss
vite
```

------------------------------------------------------------------------

# 33. Perintah Development

Frontend:

``` powershell
npm run dev
```

Backend:

``` powershell
npm run dev
```

Production backend:

``` powershell
npm start
```

Install dependency:

``` powershell
npm install
```

------------------------------------------------------------------------

# 34. Arsitektur Backend

Backend menggunakan pola:

``` text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Database
   ↓
Response
```

Contoh:

``` text
POST /api/bookings
        ↓
bookingRoutes
        ↓
authenticate
        ↓
bookingController
        ↓
MariaDB
        ↓
JSON response
```

------------------------------------------------------------------------

# 35. Middleware

Middleware authentication bertugas:

-   Membaca JWT
-   Memvalidasi token
-   Menentukan user
-   Melindungi endpoint

Middleware admin memastikan hanya akun dengan:

``` text
role = admin
```

yang dapat mengakses endpoint admin.

------------------------------------------------------------------------

# 36. Context Frontend

Frontend menggunakan `AppContext` untuk state aplikasi seperti:

-   User
-   Booking sementara
-   Wishlist
-   Review
-   Pesan
-   State aplikasi lainnya

State tertentu disimpan pada frontend sesuai kebutuhan aplikasi.

------------------------------------------------------------------------

# 37. Utility Gambar

Utility gambar digunakan untuk membedakan:

``` text
/images/nama-file.jpg
```

dan upload backend:

``` text
http://localhost:5001/uploads/nama-file.jpg
```

Contoh:

``` text
public/images/raja-ampat.jpg
```

digunakan sebagai:

``` text
/images/raja-ampat.jpg
```

Sedangkan file hasil upload admin:

``` text
backend/uploads/upload-....jpg
```

diakses melalui backend.

------------------------------------------------------------------------

# 38. Data Awal Destinasi

Beberapa destinasi yang digunakan dalam project:

``` text
Raja Ampat
Gunung Bromo
Candi Borobudur
Tanah Lot
Kelingking Beach
Kawah Ijen
Pantai Pangandaran
Pantai Madasari
```

Gambar lokal berada di:

``` text
front-end/public/images/
```

------------------------------------------------------------------------

# 39. Data Awal Penginapan

Contoh:

``` text
Villa Padi Ubud
Malioboro Heritage
Bromo Permai Homestay
Meridian Adventure Marina Club & Resort
Jiwa Jawa Resort Ijen
```

------------------------------------------------------------------------

# 40. Data Awal Transportasi

Contoh:

``` text
Jakarta - Labuan Bajo
Jakarta - Yogyakarta
Surabaya - Denpasar
Gambir - Yogyakarta
Surabaya - Malang
Medan - Parapat
Sewa mobil Bali
Sewa mobil Yogyakarta
```

------------------------------------------------------------------------

# 41. Mata Uang

Project mendukung:

``` text
IDR
USD
```

Contoh tampilan IDR:

``` text
Rp 2.500.000
```

Contoh USD:

``` text
USD 175
```

Nilai mata uang disimpan pada kolom:

``` text
bookings.currency
```

------------------------------------------------------------------------

# 42. Error Handling

Frontend menggunakan:

-   `try/catch`
-   loading state
-   error response
-   fallback image
-   alert untuk validasi tertentu

Backend menggunakan:

-   `try/catch`
-   HTTP status
-   JSON response
-   logging error pada server

Contoh response sukses:

``` json
{
  "success": true,
  "data": []
}
```

Contoh response error:

``` json
{
  "success": false,
  "message": "Gagal mengambil data"
}
```

------------------------------------------------------------------------

# 43. Keamanan

Fitur keamanan yang sudah tersedia:

-   Password hashing dengan bcrypt
-   JWT authentication
-   Protected API
-   Admin authorization
-   Validasi tanggal booking
-   Validasi harga transportasi
-   Validasi upload gambar
-   Batas ukuran upload 5 MB
-   Pembatasan MIME type gambar

## Pekerjaan security berikutnya

Sebelum production, lakukan:

-   Ganti `JWT_SECRET`
-   Jangan commit `.env`
-   Atur CORS hanya untuk domain resmi
-   Tambahkan security headers
-   Validasi dan sanitasi input lebih ketat
-   Tambahkan rate limiting
-   Perkuat validasi authentication
-   Pastikan error production tidak membocorkan detail database
-   Validasi file berdasarkan isi/extension secara aman
-   Gunakan HTTPS
-   Gunakan password database production yang kuat
-   Batasi akses database
-   Backup database secara rutin

------------------------------------------------------------------------

# 44. Production Preparation

Project saat ini masih menggunakan:

``` text
localhost
```

Sebelum hosting, beberapa bagian harus diubah.

Contoh:

Development:

``` text
http://localhost:5001/api
```

Production:

``` text
https://api.domainanda.com/api
```

Frontend:

``` text
http://localhost:5173
```

Production:

``` text
https://domainanda.com
```

------------------------------------------------------------------------

# 45. CORS Production

Development dapat menggunakan CORS yang lebih longgar.

Production sebaiknya hanya mengizinkan domain frontend.

Contoh konsep:

``` text
https://jelajahnusa.com
```

bukan:

``` text
*
```

------------------------------------------------------------------------

# 46. Environment Production

Jangan menggunakan:

``` env
JWT_SECRET=jelajahnusa_secret_123
```

untuk production.

Gunakan secret acak yang panjang.

Contoh format:

``` env
JWT_SECRET=GENERATE_RANDOM_SECRET_HERE
```

Jangan memasukkan secret asli ke README.

------------------------------------------------------------------------

# 47. Build Frontend

Sebelum deploy:

``` powershell
npm run build
```

Hasil build biasanya berada pada:

``` text
dist/
```

Folder `dist` adalah hasil production frontend.

------------------------------------------------------------------------

# 48. Deployment

Secara umum:

``` text
Browser
   ↓
Frontend Hosting
   ↓
HTTPS
   ↓
Backend/API
   ↓
MariaDB
```

Frontend dapat ditempatkan pada hosting static/frontend.

Backend membutuhkan environment Node.js yang mendukung Express.

Database membutuhkan MariaDB/MySQL.

------------------------------------------------------------------------

# 49. Checklist Sebelum Hosting

## Frontend

-   [ ] Semua halaman tidak error
-   [ ] Responsive mobile
-   [ ] Responsive desktop
-   [ ] Tidak ada console error
-   [ ] Tidak ada data dummy yang tidak diperlukan
-   [ ] Semua gambar tampil
-   [ ] Semua link benar
-   [ ] Booking berjalan
-   [ ] Pembayaran berjalan
-   [ ] Wishlist berjalan
-   [ ] Review berjalan

## Backend

-   [ ] API berjalan
-   [ ] Authentication berjalan
-   [ ] Authorization admin berjalan
-   [ ] CRUD berjalan
-   [ ] Upload berjalan
-   [ ] Booking berjalan
-   [ ] Pembayaran berjalan
-   [ ] Cancel booking berjalan
-   [ ] Error handling sudah aman
-   [ ] CORS production sudah dibatasi
-   [ ] Environment production sudah disiapkan

## Database

-   [ ] Struktur tabel benar
-   [ ] Data penting sudah tersedia
-   [ ] Tidak ada data test yang tidak diperlukan
-   [ ] Backup database dibuat
-   [ ] User admin tersedia
-   [ ] Password sudah di-hash

## Security

-   [ ] `.env` tidak masuk repository
-   [ ] JWT secret production berbeda
-   [ ] Database password production kuat
-   [ ] HTTPS aktif
-   [ ] CORS dibatasi
-   [ ] Upload dibatasi
-   [ ] Input divalidasi
-   [ ] Rate limiting dipertimbangkan

------------------------------------------------------------------------

# 50. Backup Database

Sebelum deployment, buat backup database.

Contoh menggunakan `mysqldump`:

``` powershell
mysqldump -u root -p jelajahnusa > jelajahnusa_backup.sql
```

Untuk XAMPP, jika `mysqldump` tidak dikenali, gunakan executable dari
folder MySQL/MariaDB XAMPP.

Contoh:

``` text
C:\xampp\mysql\bin\mysqldump.exe
```

------------------------------------------------------------------------

# 51. Troubleshooting

## Frontend tidak berjalan

``` powershell
cd "C:\PROJECT WEB\WEB-Travel\jelajahnusa\front-end"
npm install
npm run dev
```

------------------------------------------------------------------------

## Backend tidak berjalan

``` powershell
cd "C:\PROJECT WEB\WEB-Travel\jelajahnusa\backend"
npm install
npm run dev
```

------------------------------------------------------------------------

## API tidak terhubung

Pastikan:

``` text
Backend : http://localhost:5001
Frontend: http://localhost:5173
```

Cek:

``` text
http://localhost:5001/api
```

------------------------------------------------------------------------

## Database tidak terhubung

Periksa:

``` env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jelajahnusa
DB_PORT=3306
```

Pastikan MySQL/MariaDB XAMPP aktif.

------------------------------------------------------------------------

## Gambar upload tidak muncul

Periksa:

``` text
backend/uploads/
```

Pastikan backend mengekspose folder uploads dan URL gambar sesuai
konfigurasi frontend.

------------------------------------------------------------------------

# 52. Status Project

Status saat ini:

``` text
[✓] React frontend
[✓] Vite
[✓] Tailwind CSS
[✓] Node.js
[✓] Express
[✓] MariaDB
[✓] Authentication
[✓] JWT
[✓] Role user/admin
[✓] Destinasi
[✓] Paket wisata
[✓] Penginapan
[✓] Transportasi
[✓] Wishlist
[✓] Review
[✓] Galeri
[✓] FAQ
[✓] Kontak
[✓] Booking
[✓] Pembayaran
[✓] Pembatalan booking
[✓] Riwayat booking
[✓] Admin dashboard
[✓] CRUD destinasi
[✓] CRUD penginapan
[✓] CRUD transportasi
[✓] Upload gambar
[✓] Validasi tanggal booking
[✓] Dukungan IDR/USD
[ ] Final security hardening
[ ] Production CORS
[ ] Production environment
[ ] Production deployment
```

------------------------------------------------------------------------

# 53. Pengembangan Selanjutnya

Tahap berikutnya yang disarankan:

1.  Security hardening
2.  Production `.env`
3.  CORS production
4.  Validasi input lebih ketat
5.  Security upload
6.  Error handling production
7.  API cleanup
8.  Review struktur folder
9.  Review `package.json`
10. Build frontend
11. Setup backend production
12. Setup database production
13. Backup database
14. Deployment
15. Testing setelah deployment

------------------------------------------------------------------------

# 54. Catatan Penting

README ini mendokumentasikan kondisi project berdasarkan implementasi
development saat ini.

Sebelum production, selalu periksa kembali:

-   struktur file aktual
-   `package.json`
-   endpoint aktual
-   schema database aktual
-   environment variable
-   konfigurasi server
-   domain production
-   konfigurasi CORS

Jangan memasukkan:

``` text
.env
password
JWT_SECRET
token
credential database
```

ke repository publik.

------------------------------------------------------------------------

# 55. Lisensi

Project ini merupakan project pengembangan website travel JelajahNusa.

Lisensi dapat ditentukan sesuai kebutuhan project.

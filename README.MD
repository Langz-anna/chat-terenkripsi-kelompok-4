# Proyek Chat Terenkripsi Sederhana

## 📖 Cover
**Judul Proyek**: Chat Terenkripsi Sederhana  
**Mata Kuliah**: Kriptografi  
**Dosen Pengampu**: Muhammad Najamuddin Dwi Miharja, S.Kom, M.Kom  
**Universitas Pelita Bangsa, Bekasi, Jawa Barat — 2025**

### 👥 Kelompok 4:
- Dimas Galang (312310221)  
- Gilang Ramadhan (312310203)  
- Astian Handal Cahya Putra (312310527)  
- Robertus Amuala Alfonsius Daeli (312310634)  

---

## 📌 Deskripsi Proyek
Aplikasi ini adalah sistem **chat sederhana** berbasis web dengan fitur:
- Registrasi akun dengan password terenkripsi.  
- Login aman menggunakan hashing (bcrypt).  
- Tampilan sederhana untuk register dan login.  
- Penyimpanan data user dan pesan di MySQL.  

Tujuan: memahami penerapan kriptografi sederhana dalam **penyimpanan password terenkripsi** serta komunikasi dasar antar pengguna.

---

## ⚙️ Teknologi yang Digunakan
- **Frontend**: HTML, CSS, JavaScript (vanilla)  
- **Backend**: Node.js + Express.js  
- **Database**: MySQL (phpMyAdmin untuk manajemen)  
- **Library**:
  - `bcrypt` → enkripsi password
  - `mysql2` → koneksi database
  - `dotenv` → environment variable  

---

## 📥 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/username/chat-terenkripsi-kelompok-4.git
cd chat-terenkripsi-kelompok-4
2. Install Dependencies
bash
Salin kode
npm install
3. Setup Database
Buka phpMyAdmin

Buat database baru, misalnya: kripto_web

Import file:

pgsql
Salin kode
database/kripto_web.sql
4. Konfigurasi .env
Buat file .env di root folder:

env
Salin kode
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=kripto_web
PORT=3000
5. Jalankan Server
bash
Salin kode
node index.js
Buka browser → http://localhost:3000

🔄 Alur Sistem
1. Register User
📸 Screenshot halaman register

User mengisi username, password, display name.

Password langsung di-hash menggunakan bcrypt sebelum masuk database.

Data tersimpan di tabel users.

📸 Screenshot tabel users di phpMyAdmin

Terlihat kolom password_hash berisi string hash, bukan password asli.

Membuktikan password aman dan terenkripsi.

2. Login User
📸 Screenshot halaman login

User memasukkan username & password.

Server mencocokkan hash password di database menggunakan bcrypt.

Jika cocok → diarahkan ke profile.html dengan session user.

3. Chat Sederhana
📸 Screenshot halaman chat

User yang sudah login bisa mengirim pesan.

Pesan tersimpan di tabel messages pada database.

Pesan ditampilkan di halaman chat sesuai urutan waktu.

📂 Struktur Proyek
pgsql
Salin kode
kripto-web/
│── database/
│   └── kripto_web.sql
│── public/
│   ├── index.html
│   ├── profile.html
│   └── style.css
│── .env
│── .gitignore
│── index.js
│── package.json
│── README.md

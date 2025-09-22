-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Sep 2025 pada 15.41
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kripto_demo`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_encrypted` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message_encrypted`, `created_at`) VALUES
(2, 11, 10, '610b6eTuCMxvB6+oihGXCxo2VRfc7c5RL1aLlzoNQP4=', '2025-09-21 15:27:56'),
(3, 10, 11, 'gg7NgGgQNlMV8wJaK21u0vfdQAz08E8KSGydxvYANNk=', '2025-09-21 15:28:14'),
(4, 11, 11, 'bvtRj8Bdi+SxZLqO6ZKu+J6RMx2a2mWVVYIKEVIKuIc=', '2025-09-21 15:28:27'),
(5, 10, 11, 'f8gaEODPPEsplPLhmPd6gaIvsSvbxfshB9Us1EEmVqI=', '2025-09-22 06:33:23'),
(6, 11, 10, '+sxxAuKbTcmLdJ0tYhia6SUNRbSp3G2bJxZVF1Exrj4=', '2025-09-22 06:33:35'),
(7, 11, 10, 'vMDcY+zTL3/iBv/WjHclYN4p7o0xoLd25VU4YUfz4q872vizaHd1bWhCqKkC0MdR', '2025-09-22 06:35:21'),
(8, 10, 11, 'OXI0NhxrPZ+WavGfAMjdxuVWokSUggcqI/YaLE7R4N0=', '2025-09-22 06:35:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `display_name`, `created_at`) VALUES
(10, 'dimas', '$2b$10$7vvEgbOS9C241MfzaYhcj.3nLTtP7UWZcJbpz2ST238Li6wOkBe5K', 'dimskuy', '2025-09-21 15:26:41'),
(11, 'fanny', '$2b$10$KCLD6e0VIYw6.9OtCGhIUOxHiTTkJ7Suz1OeODIXFPw/mrIIVXqRe', 'fanskuy', '2025-09-21 15:27:29');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

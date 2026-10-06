const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

// ========================================
// REGISTER
// ========================================

const register = async (req, res) => {
    try {
        let {
            name,
            email,
            password
        } = req.body

        // Validasi tipe data
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Data registrasi tidak valid'
            })
        }

        // Bersihkan input
        name = name.trim()
        email = email.trim().toLowerCase()

        // Validasi wajib
        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama, email, dan password wajib diisi'
            })
        }

        // Validasi nama
        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama minimal 2 karakter'
            })
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama maksimal 100 karakter'
            })
        }

        // Validasi email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message:
                    'Format email tidak valid'
            })
        }

        if (email.length > 150) {
            return res.status(400).json({
                success: false,
                message:
                    'Email maksimal 150 karakter'
            })
        }

        // Validasi password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    'Password minimal 8 karakter'
            })
        }

        if (password.length > 72) {
            return res.status(400).json({
                success: false,
                message:
                    'Password maksimal 72 karakter'
            })
        }

        // Cek email sudah terdaftar
        const [existingUser] =
            await pool.query(
                `
                SELECT id
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [email]
            )

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    'Email sudah terdaftar'
            })
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            )

        // Simpan user
        const [result] =
            await pool.query(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password
                )
                VALUES (?, ?, ?)
                `,
                [
                    name,
                    email,
                    hashedPassword
                ]
            )

        return res.status(201).json({
            success: true,
            message:
                'Registrasi berhasil',
            data: {
                id: result.insertId,
                name,
                email
            }
        })
    } catch (error) {
        console.error(
            'Register error:',
            error
        )

        // Duplicate email
        if (
            error.code ===
            'ER_DUP_ENTRY'
        ) {
            return res.status(409).json({
                success: false,
                message:
                    'Email sudah terdaftar'
            })
        }

        return res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan pada server'
        })
    }
}

// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {
    try {
        let {
            email,
            password
        } = req.body

        // Validasi tipe data
        if (
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Email dan password tidak valid'
            })
        }

        email = email.trim().toLowerCase()

        // Validasi wajib
        if (
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Email dan password wajib diisi'
            })
        }

        // Validasi email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message:
                    'Format email tidak valid'
            })
        }

        // Cari user
        const [users] =
            await pool.query(
                `
                SELECT
                    id,
                    name,
                    email,
                    password,
                    role
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [email]
            )

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message:
                    'Email atau password salah'
            })
        }

        const user = users[0]

        // Cek password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    'Email atau password salah'
            })
        }

        // Pastikan JWT_SECRET tersedia
        if (!process.env.JWT_SECRET) {
            console.error(
                'JWT_SECRET belum dikonfigurasi'
            )

            return res.status(500).json({
                success: false,
                message:
                    'Konfigurasi server belum lengkap'
            })
        }

        // Buat JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        return res.json({
            success: true,
            message:
                'Login berhasil',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    } catch (error) {
        console.error(
            'Login error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan pada server'
        })
    }
}

// ========================================
// EXPORT
// ========================================

module.exports = {
    register,
    login
}
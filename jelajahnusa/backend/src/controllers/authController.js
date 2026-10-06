const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan password wajib diisi'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal 6 karakter'
            })
        }

        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        )

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                id: result.insertId,
                name,
                email
            }
        })
    } catch (error) {
        console.error('Register error:', error)

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        })
    }
}

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            })
        }

        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            })
        }

        const user = users[0]

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            })
        }

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

        res.json({
            success: true,
            message: 'Login berhasil',
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
        console.error('Login error:', error)

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        })
    }
}

module.exports = {
    register,
    login
}
const pool = require('../config/database')
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        )

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data user'
        })
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan password wajib diisi'
            })
        }

        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah digunakan'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                role === 'admin' ? 'admin' : 'user'
            ]
        )

        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: {
                id: result.insertId
            }
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Gagal membuat user'
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, role, password } = req.body

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan email wajib diisi'
            })
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)

            await pool.query(
                `UPDATE users
                 SET name = ?, email = ?, role = ?, password = ?
                 WHERE id = ?`,
                [
                    name,
                    email,
                    role === 'admin' ? 'admin' : 'user',
                    hashedPassword,
                    id
                ]
            )
        } else {
            await pool.query(
                `UPDATE users
                 SET name = ?, email = ?, role = ?
                 WHERE id = ?`,
                [
                    name,
                    email,
                    role === 'admin' ? 'admin' : 'user',
                    id
                ]
            )
        }

        res.json({
            success: true,
            message: 'User berhasil diperbarui'
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui user'
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Admin tidak dapat menghapus akun sendiri'
            })
        }

        await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        )

        res.json({
            success: true,
            message: 'User berhasil dihapus'
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus user'
        })
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
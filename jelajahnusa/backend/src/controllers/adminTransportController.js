const pool = require('../config/database')

// GET semua transportasi
const getTransports = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id,
                jenis,
                rute,
                operator,
                jam,
                price,
                created_at
            FROM transports
            ORDER BY id DESC
        `)

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error('Get admin transports error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data transportasi'
        })
    }
}


// CREATE transportasi
const createTransport = async (req, res) => {
    try {
        const {
            jenis,
            rute,
            operator,
            jam,
            price
        } = req.body

        if (
            !jenis ||
            !rute ||
            !operator ||
            !jam ||
            price === undefined ||
            price === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Semua data transportasi wajib diisi'
            })
        }

        const harga = Number(price)

        if (Number.isNaN(harga) || harga < 0) {
            return res.status(400).json({
                success: false,
                message: 'Harga tidak valid'
            })
        }

        const [result] = await pool.query(
            `
            INSERT INTO transports
            (
                jenis,
                rute,
                operator,
                jam,
                price
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                jenis.trim(),
                rute.trim(),
                operator.trim(),
                jam.trim(),
                harga
            ]
        )

        const [rows] = await pool.query(
            `
            SELECT
                id,
                jenis,
                rute,
                operator,
                jam,
                price,
                created_at
            FROM transports
            WHERE id = ?
            `,
            [result.insertId]
        )

        res.status(201).json({
            success: true,
            message: 'Transportasi berhasil ditambahkan',
            data: rows[0]
        })
    } catch (error) {
        console.error('Create transport error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan transportasi'
        })
    }
}


// UPDATE transportasi
const updateTransport = async (req, res) => {
    try {
        const { id } = req.params

        const {
            jenis,
            rute,
            operator,
            jam,
            price
        } = req.body

        if (
            !jenis ||
            !rute ||
            !operator ||
            !jam ||
            price === undefined ||
            price === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Semua data transportasi wajib diisi'
            })
        }

        const harga = Number(price)

        if (Number.isNaN(harga) || harga < 0) {
            return res.status(400).json({
                success: false,
                message: 'Harga tidak valid'
            })
        }

        const [result] = await pool.query(
            `
            UPDATE transports
            SET
                jenis = ?,
                rute = ?,
                operator = ?,
                jam = ?,
                price = ?
            WHERE id = ?
            `,
            [
                jenis.trim(),
                rute.trim(),
                operator.trim(),
                jam.trim(),
                harga,
                id
            ]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transportasi tidak ditemukan'
            })
        }

        const [rows] = await pool.query(
            `
            SELECT
                id,
                jenis,
                rute,
                operator,
                jam,
                price,
                created_at
            FROM transports
            WHERE id = ?
            `,
            [id]
        )

        res.json({
            success: true,
            message: 'Transportasi berhasil diperbarui',
            data: rows[0]
        })
    } catch (error) {
        console.error('Update transport error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui transportasi'
        })
    }
}


// DELETE transportasi
const deleteTransport = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await pool.query(
            `
            DELETE FROM transports
            WHERE id = ?
            `,
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transportasi tidak ditemukan'
            })
        }

        res.json({
            success: true,
            message: 'Transportasi berhasil dihapus'
        })
    } catch (error) {
        console.error('Delete transport error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus transportasi'
        })
    }
}


module.exports = {
    getTransports,
    createTransport,
    updateTransport,
    deleteTransport
}
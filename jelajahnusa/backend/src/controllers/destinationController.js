const pool = require('../config/database')
const fs = require('fs')
const path = require('path')

// GET semua destinasi
const getDestinations = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM destinations ORDER BY created_at DESC'
        )

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error('Get destinations error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data destinasi'
        })
    }
}


// POST tambah destinasi
const createDestination = async (req, res) => {
    try {
        const {
            name,
            location,
            description,
            category,
            rating
        } = req.body

        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan lokasi wajib diisi'
            })
        }

        // Jika ada upload gambar
        const image = req.file
            ? req.file.filename
            : ''

        const [result] = await pool.query(
            `INSERT INTO destinations
            (
                name,
                location,
                description,
                image,
                category,
                rating
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                location,
                description || '',
                image,
                category || '',
                rating || 0
            ]
        )

        const [rows] = await pool.query(
            'SELECT * FROM destinations WHERE id = ?',
            [result.insertId]
        )

        res.status(201).json({
            success: true,
            message: 'Destinasi berhasil ditambahkan',
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Create destination error:',
            error
        )

        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan destinasi'
        })
    }
}


// PUT edit destinasi
const updateDestination = async (req, res) => {
    try {
        const { id } = req.params

        const {
            name,
            location,
            description,
            category,
            rating
        } = req.body

        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan lokasi wajib diisi'
            })
        }

        // Ambil data lama
        const [oldRows] = await pool.query(
            'SELECT * FROM destinations WHERE id = ?',
            [id]
        )

        if (oldRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Destinasi tidak ditemukan'
            })
        }

        const oldImage = oldRows[0].image

        // Kalau upload gambar baru → gunakan gambar baru
        // Kalau tidak → tetap gunakan gambar lama
        const image = req.file
            ? req.file.filename
            : oldImage

        const [result] = await pool.query(
            `UPDATE destinations
            SET
                name = ?,
                location = ?,
                description = ?,
                image = ?,
                category = ?,
                rating = ?
            WHERE id = ?`,
            [
                name,
                location,
                description || '',
                image,
                category || '',
                rating || 0,
                id
            ]
        )

        // Hapus file gambar lama jika diganti
        if (
            req.file &&
            oldImage &&
            oldImage !== image
        ) {
            const oldFile = path.join(
                __dirname,
                '../../uploads',
                oldImage
            )

            if (fs.existsSync(oldFile)) {
                fs.unlinkSync(oldFile)
            }
        }

        const [rows] = await pool.query(
            'SELECT * FROM destinations WHERE id = ?',
            [id]
        )

        res.json({
            success: true,
            message: 'Destinasi berhasil diperbarui',
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Update destination error:',
            error
        )

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui destinasi'
        })
    }
}


// DELETE hapus destinasi
const deleteDestination = async (req, res) => {
    try {
        const { id } = req.params

        // Ambil data sebelum dihapus
        const [rows] = await pool.query(
            'SELECT image FROM destinations WHERE id = ?',
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Destinasi tidak ditemukan'
            })
        }

        const image = rows[0].image

        const [result] = await pool.query(
            'DELETE FROM destinations WHERE id = ?',
            [id]
        )

        // Hapus file gambar dari uploads
        if (image) {
            const imagePath = path.join(
                __dirname,
                '../../uploads',
                image
            )

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        res.json({
            success: true,
            message: 'Destinasi berhasil dihapus'
        })
    } catch (error) {
        console.error(
            'Delete destination error:',
            error
        )

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus destinasi'
        })
    }
}


module.exports = {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination
}
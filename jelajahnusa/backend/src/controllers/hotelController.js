const pool = require('../config/database')
const fs = require('fs')
const path = require('path')

// GET semua penginapan
const getHotels = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id,
                name,
                city,
                stars,
                price,
                facilities,
                image,
                rating,
                created_at
            FROM hotels
            ORDER BY created_at DESC
        `)

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get hotels error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data penginapan'
        })
    }
}


// POST tambah penginapan
const createHotel = async (req, res) => {
    try {
        const {
            name,
            city,
            stars,
            price,
            facilities,
            rating
        } = req.body

        if (!name || !city || !price) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama, lokasi, dan harga wajib diisi'
            })
        }

        // Nama file hasil upload
        const image = req.file
            ? req.file.filename
            : ''

        const [result] = await pool.query(
            `INSERT INTO hotels
            (
                name,
                city,
                stars,
                price,
                facilities,
                image,
                rating
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                city,
                stars || 1,
                price,
                facilities || '',
                image,
                rating || 0
            ]
        )

        const [rows] = await pool.query(
            `SELECT
                id,
                name,
                city,
                stars,
                price,
                facilities,
                image,
                rating
             FROM hotels
             WHERE id = ?`,
            [result.insertId]
        )

        res.status(201).json({
            success: true,
            message:
                'Penginapan berhasil ditambahkan',
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Create hotel error:',
            error
        )

        // Kalau database gagal setelah file
        // berhasil diupload, hapus file tersebut
        if (req.file) {
            const uploadedFile =
                path.join(
                    __dirname,
                    '../../uploads',
                    req.file.filename
                )

            if (
                fs.existsSync(
                    uploadedFile
                )
            ) {
                fs.unlinkSync(
                    uploadedFile
                )
            }
        }

        res.status(500).json({
            success: false,
            message:
                'Gagal menambahkan penginapan'
        })
    }
}


// PUT edit penginapan
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params

        const {
            name,
            city,
            stars,
            price,
            facilities,
            rating
        } = req.body

        if (!name || !city || !price) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama, lokasi, dan harga wajib diisi'
            })
        }

        // Ambil data lama
        const [oldRows] =
            await pool.query(
                'SELECT * FROM hotels WHERE id = ?',
                [id]
            )

        if (oldRows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    'Penginapan tidak ditemukan'
            })
        }

        const oldImage =
            oldRows[0].image

        // Kalau upload gambar baru,
        // gunakan gambar baru.
        // Kalau tidak, pertahankan gambar lama.
        const image = req.file
            ? req.file.filename
            : oldImage

        const [result] =
            await pool.query(
                `UPDATE hotels
                 SET
                    name = ?,
                    city = ?,
                    stars = ?,
                    price = ?,
                    facilities = ?,
                    image = ?,
                    rating = ?
                 WHERE id = ?`,
                [
                    name,
                    city,
                    stars || 1,
                    price,
                    facilities || '',
                    image,
                    rating || 0,
                    id
                ]
            )

        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Penginapan tidak ditemukan'
            })
        }

        // Hapus gambar lama hanya kalau:
        // 1. Ada gambar baru
        // 2. Gambar lama berasal dari uploads
        // 3. Nama gambar berbeda
        if (
            req.file &&
            oldImage &&
            oldImage !== image &&
            oldImage.startsWith('upload-')
        ) {
            const oldFile =
                path.join(
                    __dirname,
                    '../../uploads',
                    oldImage
                )

            if (
                fs.existsSync(oldFile)
            ) {
                fs.unlinkSync(oldFile)
            }
        }

        const [rows] =
            await pool.query(
                `SELECT
                    id,
                    name,
                    city,
                    stars,
                    price,
                    facilities,
                    image,
                    rating
                 FROM hotels
                 WHERE id = ?`,
                [id]
            )

        res.json({
            success: true,
            message:
                'Penginapan berhasil diperbarui',
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Update hotel error:',
            error
        )

        // Kalau upload baru berhasil
        // tetapi proses database gagal,
        // hapus file baru.
        if (req.file) {
            const uploadedFile =
                path.join(
                    __dirname,
                    '../../uploads',
                    req.file.filename
                )

            if (
                fs.existsSync(
                    uploadedFile
                )
            ) {
                fs.unlinkSync(
                    uploadedFile
                )
            }
        }

        res.status(500).json({
            success: false,
            message:
                'Gagal memperbarui penginapan'
        })
    }
}


// DELETE hapus penginapan
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params

        // Ambil gambar terlebih dahulu
        const [rows] =
            await pool.query(
                'SELECT image FROM hotels WHERE id = ?',
                [id]
            )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    'Penginapan tidak ditemukan'
            })
        }

        const image =
            rows[0].image

        // Hapus dari database
        const [result] =
            await pool.query(
                'DELETE FROM hotels WHERE id = ?',
                [id]
            )

        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Penginapan tidak ditemukan'
            })
        }

        // Hapus file upload
        if (
            image &&
            image.startsWith('upload-')
        ) {
            const imagePath =
                path.join(
                    __dirname,
                    '../../uploads',
                    image
                )

            if (
                fs.existsSync(imagePath)
            ) {
                fs.unlinkSync(
                    imagePath
                )
            }
        }

        res.json({
            success: true,
            message:
                'Penginapan berhasil dihapus'
        })
    } catch (error) {
        console.error(
            'Delete hotel error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Gagal menghapus penginapan'
        })
    }
}

// GET penginapan berdasarkan lokasi
const getHotelsByCity = async (req, res) => {
    try {
        const { city } = req.params

        const [rows] = await pool.query(
            `SELECT
                id,
                name,
                city,
                stars,
                price,
                facilities,
                image,
                rating,
                created_at
             FROM hotels
             WHERE city LIKE ?
             ORDER BY created_at DESC`,
            [`%${city}%`]
        )

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get hotels by city error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Gagal mengambil penginapan berdasarkan lokasi'
        })
    }
}

module.exports = {
    getHotels,
    createHotel,
    updateHotel,
    getHotelsByCity,
    deleteHotel
}
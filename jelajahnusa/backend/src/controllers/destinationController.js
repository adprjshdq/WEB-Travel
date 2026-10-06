const pool = require('../config/database')
const fs = require('fs')
const path = require('path')

// ========================================
// HELPER
// ========================================

const isValidId = (id) => {
    return /^\d+$/.test(String(id)) &&
        Number(id) > 0
}

const validateRating = (rating) => {
    const value = Number(rating)

    return (
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 5
    )
}

const validatePrice = (price) => {
    const value = Number(price)

    return (
        Number.isFinite(value) &&
        value >= 0
    )
}

const deleteUploadedFile = (filename) => {
    if (!filename) {
        return
    }

    // Hanya hapus file hasil upload
    if (!filename.startsWith('upload-')) {
        return
    }

    const filePath = path.join(
        __dirname,
        '../../uploads',
        path.basename(filename)
    )

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath)
        } catch (error) {
            console.error(
                'Gagal menghapus file:',
                error
            )
        }
    }
}

// ========================================
// GET SEMUA DESTINASI
// ========================================

const getDestinations = async (req, res) => {
    try {
        const [rows] =
            await pool.query(`
                SELECT
                    id,
                    name,
                    location,
                    description,
                    image,
                    category,
                    rating,
                    price,
                    created_at
                FROM destinations
                ORDER BY created_at DESC
            `)

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get destinations error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data destinasi'
        })
    }
}

// ========================================
// CREATE DESTINATION
// ========================================

const createDestination = async (req, res) => {
    try {
        let {
            name,
            location,
            description,
            category,
            rating,
            price
        } = req.body

        // Validasi tipe data dasar
        if (
            typeof name !== 'string' ||
            typeof location !== 'string'
        ) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan lokasi tidak valid'
            })
        }

        // Bersihkan input
        name = name.trim()
        location = location.trim()

        description =
            typeof description === 'string'
                ? description.trim()
                : ''

        category =
            typeof category === 'string'
                ? category.trim()
                : ''

        // Validasi wajib
        if (!name || !location) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan lokasi wajib diisi'
            })
        }

        // Validasi panjang
        if (name.length > 150) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama maksimal 150 karakter'
            })
        }

        if (location.length > 200) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Lokasi maksimal 200 karakter'
            })
        }

        if (description.length > 5000) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Deskripsi terlalu panjang'
            })
        }

        if (category.length > 100) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Kategori maksimal 100 karakter'
            })
        }

        // Nilai default
        const finalRating =
            rating === undefined ||
                rating === ''
                ? 0
                : Number(rating)

        const finalPrice =
            price === undefined ||
                price === ''
                ? 0
                : Number(price)

        // Validasi rating
        if (!validateRating(finalRating)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Rating harus antara 0 sampai 5'
            })
        }

        // Validasi harga
        if (!validatePrice(finalPrice)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Harga harus berupa angka dan tidak boleh negatif'
            })
        }

        // Simpan nama file upload
        const image = req.file
            ? req.file.filename
            : ''

        const [result] =
            await pool.query(
                `
                INSERT INTO destinations
                (
                    name,
                    location,
                    description,
                    image,
                    category,
                    rating,
                    price
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    name,
                    location,
                    description,
                    image,
                    category,
                    finalRating,
                    finalPrice
                ]
            )

        const [rows] =
            await pool.query(
                `
                SELECT
                    id,
                    name,
                    location,
                    description,
                    image,
                    category,
                    rating,
                    price,
                    created_at
                FROM destinations
                WHERE id = ?
                `,
                [result.insertId]
            )

        return res.status(201).json({
            success: true,
            message:
                'Destinasi berhasil ditambahkan',
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Create destination error:',
            error
        )

        if (req.file) {
            deleteUploadedFile(
                req.file.filename
            )
        }

        return res.status(500).json({
            success: false,
            message:
                'Gagal menambahkan destinasi'
        })
    }
}

// ========================================
// UPDATE DESTINATION
// ========================================

const updateDestination = async (req, res) => {
    try {
        const { id } = req.params

        // Validasi ID
        if (!isValidId(id)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'ID destinasi tidak valid'
            })
        }

        let {
            name,
            location,
            description,
            category,
            rating,
            price
        } = req.body

        // Validasi tipe
        if (
            typeof name !== 'string' ||
            typeof location !== 'string'
        ) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan lokasi tidak valid'
            })
        }

        name = name.trim()
        location = location.trim()

        description =
            typeof description === 'string'
                ? description.trim()
                : ''

        category =
            typeof category === 'string'
                ? category.trim()
                : ''

        // Validasi wajib
        if (!name || !location) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan lokasi wajib diisi'
            })
        }

        // Validasi panjang
        if (name.length > 150) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama maksimal 150 karakter'
            })
        }

        if (location.length > 200) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Lokasi maksimal 200 karakter'
            })
        }

        if (description.length > 5000) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Deskripsi terlalu panjang'
            })
        }

        if (category.length > 100) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Kategori maksimal 100 karakter'
            })
        }

        // Ambil data lama
        const [oldRows] =
            await pool.query(
                `
                SELECT *
                FROM destinations
                WHERE id = ?
                `,
                [id]
            )

        if (oldRows.length === 0) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(404).json({
                success: false,
                message:
                    'Destinasi tidak ditemukan'
            })
        }

        const oldDestination =
            oldRows[0]

        // Jika field tidak dikirim saat update,
        // gunakan nilai lama
        const finalRating =
            rating === undefined ||
                rating === ''
                ? Number(
                    oldDestination.rating || 0
                )
                : Number(rating)

        const finalPrice =
            price === undefined ||
                price === ''
                ? Number(
                    oldDestination.price || 0
                )
                : Number(price)

        // Validasi rating
        if (!validateRating(finalRating)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Rating harus antara 0 sampai 5'
            })
        }

        // Validasi harga
        if (!validatePrice(finalPrice)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Harga harus berupa angka dan tidak boleh negatif'
            })
        }

        const oldImage =
            oldDestination.image || ''

        const image = req.file
            ? req.file.filename
            : oldImage

        // Update database
        await pool.query(
            `
            UPDATE destinations
            SET
                name = ?,
                location = ?,
                description = ?,
                image = ?,
                category = ?,
                rating = ?,
                price = ?
            WHERE id = ?
            `,
            [
                name,
                location,
                description,
                image,
                category,
                finalRating,
                finalPrice,
                id
            ]
        )

        // Hapus gambar lama hanya jika
        // benar-benar diganti dengan upload baru
        if (
            req.file &&
            oldImage &&
            oldImage !== image
        ) {
            deleteUploadedFile(
                oldImage
            )
        }

        const [rows] =
            await pool.query(
                `
                SELECT
                    id,
                    name,
                    location,
                    description,
                    image,
                    category,
                    rating,
                    price,
                    created_at
                FROM destinations
                WHERE id = ?
                `,
                [id]
            )

        return res.json({
            success: true,
            message:
                'Destinasi berhasil diperbarui',
            data: rows[0]
        })
    } catch (error) {
        console.error(
            'Update destination error:',
            error
        )

        if (req.file) {
            deleteUploadedFile(
                req.file.filename
            )
        }

        return res.status(500).json({
            success: false,
            message:
                'Gagal memperbarui destinasi'
        })
    }
}

// ========================================
// DELETE DESTINATION
// ========================================

const deleteDestination = async (req, res) => {
    try {
        const { id } = req.params

        // Validasi ID
        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID destinasi tidak valid'
            })
        }

        // Ambil data sebelum dihapus
        const [rows] =
            await pool.query(
                `
                SELECT image
                FROM destinations
                WHERE id = ?
                `,
                [id]
            )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    'Destinasi tidak ditemukan'
            })
        }

        const image =
            rows[0].image || ''

        // Hapus database
        const [result] =
            await pool.query(
                `
                DELETE FROM destinations
                WHERE id = ?
                `,
                [id]
            )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    'Destinasi tidak ditemukan'
            })
        }

        // Hapus file upload
        if (image) {
            deleteUploadedFile(
                image
            )
        }

        return res.json({
            success: true,
            message:
                'Destinasi berhasil dihapus'
        })
    } catch (error) {
        console.error(
            'Delete destination error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal menghapus destinasi'
        })
    }
}

// ========================================
// EXPORT
// ========================================

module.exports = {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination
}
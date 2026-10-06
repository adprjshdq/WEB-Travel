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

const validateStars = (stars) => {
    const value = Number(stars)

    return (
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 5
    )
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
                'Gagal menghapus file hotel:',
                error
            )
        }
    }
}

// ========================================
// GET SEMUA PENGINAPAN
// ========================================

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

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get hotels error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data penginapan'
        })
    }
}

// ========================================
// CREATE HOTEL
// ========================================

const createHotel = async (req, res) => {
    try {
        let {
            name,
            city,
            stars,
            price,
            facilities,
            rating
        } = req.body

        // Validasi tipe data
        if (
            typeof name !== 'string' ||
            typeof city !== 'string'
        ) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan kota tidak valid'
            })
        }

        name = name.trim()
        city = city.trim()

        facilities =
            typeof facilities === 'string'
                ? facilities.trim()
                : ''

        // Wajib
        if (!name || !city) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan kota wajib diisi'
            })
        }

        // Panjang teks
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

        if (city.length > 100) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Kota maksimal 100 karakter'
            })
        }

        if (facilities.length > 5000) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Fasilitas terlalu panjang'
            })
        }

        // Default stars
        const finalStars =
            stars === undefined ||
                stars === ''
                ? 1
                : Number(stars)

        // Harga
        const finalPrice =
            price === undefined ||
                price === ''
                ? 0
                : Number(price)

        // Rating
        const finalRating =
            rating === undefined ||
                rating === ''
                ? 0
                : Number(rating)

        // Validasi stars
        if (!validateStars(finalStars)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Jumlah bintang harus antara 1 sampai 5'
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

        const image = req.file
            ? req.file.filename
            : ''

        const [result] = await pool.query(
            `
            INSERT INTO hotels
            (
                name,
                city,
                stars,
                price,
                facilities,
                image,
                rating
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                city,
                finalStars,
                finalPrice,
                facilities,
                image,
                finalRating
            ]
        )

        const [rows] = await pool.query(
            `
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
            WHERE id = ?
            `,
            [result.insertId]
        )

        return res.status(201).json({
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

        if (req.file) {
            deleteUploadedFile(
                req.file.filename
            )
        }

        return res.status(500).json({
            success: false,
            message:
                'Gagal menambahkan penginapan'
        })
    }
}

// ========================================
// UPDATE HOTEL
// ========================================

const updateHotel = async (req, res) => {
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
                    'ID penginapan tidak valid'
            })
        }

        let {
            name,
            city,
            stars,
            price,
            facilities,
            rating
        } = req.body

        // Validasi tipe
        if (
            typeof name !== 'string' ||
            typeof city !== 'string'
        ) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan kota tidak valid'
            })
        }

        name = name.trim()
        city = city.trim()

        facilities =
            typeof facilities === 'string'
                ? facilities.trim()
                : ''

        if (!name || !city) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Nama dan kota wajib diisi'
            })
        }

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

        if (city.length > 100) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Kota maksimal 100 karakter'
            })
        }

        if (facilities.length > 5000) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Fasilitas terlalu panjang'
            })
        }

        // Ambil data lama
        const [oldRows] = await pool.query(
            `
            SELECT *
            FROM hotels
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
                    'Penginapan tidak ditemukan'
            })
        }

        const oldHotel = oldRows[0]

        // Pertahankan nilai lama jika tidak dikirim
        const finalStars =
            stars === undefined ||
                stars === ''
                ? Number(oldHotel.stars || 1)
                : Number(stars)

        const finalPrice =
            price === undefined ||
                price === ''
                ? Number(oldHotel.price || 0)
                : Number(price)

        const finalRating =
            rating === undefined ||
                rating === ''
                ? Number(oldHotel.rating || 0)
                : Number(rating)

        // Validasi
        if (!validateStars(finalStars)) {
            if (req.file) {
                deleteUploadedFile(
                    req.file.filename
                )
            }

            return res.status(400).json({
                success: false,
                message:
                    'Jumlah bintang harus antara 1 sampai 5'
            })
        }

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

        const oldImage =
            oldHotel.image || ''

        const image = req.file
            ? req.file.filename
            : oldImage

        // Update database
        await pool.query(
            `
            UPDATE hotels
            SET
                name = ?,
                city = ?,
                stars = ?,
                price = ?,
                facilities = ?,
                image = ?,
                rating = ?
            WHERE id = ?
            `,
            [
                name,
                city,
                finalStars,
                finalPrice,
                facilities,
                image,
                finalRating,
                id
            ]
        )

        // Hapus gambar lama jika diganti
        if (
            req.file &&
            oldImage &&
            oldImage !== image
        ) {
            deleteUploadedFile(
                oldImage
            )
        }

        const [rows] = await pool.query(
            `
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
            WHERE id = ?
            `,
            [id]
        )

        return res.json({
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

        // Hapus file baru jika proses gagal
        if (req.file) {
            deleteUploadedFile(
                req.file.filename
            )
        }

        return res.status(500).json({
            success: false,
            message:
                'Gagal memperbarui penginapan'
        })
    }
}

// ========================================
// DELETE HOTEL
// ========================================

const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message:
                    'ID penginapan tidak valid'
            })
        }

        // Ambil gambar terlebih dahulu
        const [rows] = await pool.query(
            `
            SELECT image
            FROM hotels
            WHERE id = ?
            `,
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
            rows[0].image || ''

        // Hapus database
        const [result] = await pool.query(
            `
            DELETE FROM hotels
            WHERE id = ?
            `,
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    'Penginapan tidak ditemukan'
            })
        }

        // Hanya hapus file hasil upload
        deleteUploadedFile(image)

        return res.json({
            success: true,
            message:
                'Penginapan berhasil dihapus'
        })
    } catch (error) {
        console.error(
            'Delete hotel error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal menghapus penginapan'
        })
    }
}

// ========================================
// GET HOTEL BERDASARKAN KOTA
// ========================================

const getHotelsByCity = async (req, res) => {
    try {
        const { city } = req.params

        if (
            typeof city !== 'string' ||
            !city.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Kota tidak valid'
            })
        }

        const cleanCity = city.trim()

        if (cleanCity.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    'Nama kota terlalu panjang'
            })
        }

        const [rows] = await pool.query(
            `
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
            WHERE city LIKE ?
            ORDER BY created_at DESC
            `,
            [`%${cleanCity}%`]
        )

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get hotels by city error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil penginapan berdasarkan lokasi'
        })
    }
}

// ========================================
// EXPORT
// ========================================

module.exports = {
    getHotels,
    createHotel,
    updateHotel,
    getHotelsByCity,
    deleteHotel
}
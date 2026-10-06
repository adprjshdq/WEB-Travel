const jwt = require('jsonwebtoken')

// ========================================
// AUTHENTICATE
// ========================================

const authenticate = (req, res, next) => {
    try {
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

        const authHeader =
            req.headers.authorization

        // Token tidak ditemukan
        if (
            !authHeader ||
            !authHeader.startsWith('Bearer ')
        ) {
            return res.status(401).json({
                success: false,
                message:
                    'Token tidak ditemukan'
            })
        }

        const token =
            authHeader.substring(7).trim()

        // Token kosong
        if (!token) {
            return res.status(401).json({
                success: false,
                message:
                    'Token tidak ditemukan'
            })
        }

        // Verifikasi JWT
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            )

        // Pastikan payload JWT memiliki ID
        if (
            !decoded ||
            !decoded.id
        ) {
            return res.status(401).json({
                success: false,
                message:
                    'Token tidak valid'
            })
        }

        // Simpan data user ke request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        }

        next()
    } catch (error) {
        // Token expired
        if (
            error.name ===
            'TokenExpiredError'
        ) {
            return res.status(401).json({
                success: false,
                message:
                    'Token sudah expired, silakan login kembali'
            })
        }

        // Token rusak / signature salah
        if (
            error.name ===
            'JsonWebTokenError'
        ) {
            return res.status(401).json({
                success: false,
                message:
                    'Token tidak valid'
            })
        }

        console.error(
            'Authentication error:',
            error
        )

        return res.status(401).json({
            success: false,
            message:
                'Autentikasi gagal'
        })
    }
}

// ========================================
// ADMIN CHECK
// ========================================

const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message:
                'Anda belum login'
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message:
                'Akses hanya untuk admin'
        })
    }

    next()
}

// ========================================
// EXPORT
// ========================================

module.exports = {
    authenticate,
    isAdmin
}
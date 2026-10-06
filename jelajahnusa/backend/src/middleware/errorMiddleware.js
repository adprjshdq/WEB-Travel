const multer = require('multer')

// 404 HANDLER
const notFound = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`
    })
}

// GLOBAL ERROR HANDLER
const errorHandler = (
    error,
    req,
    res,
    next
) => {
    console.error(
        'Global server error:',
        error
    )

    // -------------------------
    // MULTER ERROR
    // -------------------------
    if (
        error instanceof multer.MulterError
    ) {
        if (
            error.code ===
            'LIMIT_FILE_SIZE'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Ukuran gambar maksimal 5 MB'
            })
        }

        if (
            error.code ===
            'LIMIT_FILE_COUNT'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Maksimal 1 gambar yang dapat diupload'
            })
        }

        if (
            error.code ===
            'LIMIT_UNEXPECTED_FILE'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Field upload gambar tidak valid'
            })
        }

        return res.status(400).json({
            success: false,
            message:
                'Terjadi kesalahan saat upload gambar'
        })
    }

    // -------------------------
    // CUSTOM UPLOAD ERROR
    // -------------------------
    if (
        error.message ===
        'Format gambar harus JPG, JPEG, PNG, atau WEBP'
    ) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

    // -------------------------
    // INVALID JSON
    // -------------------------
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        error.body
    ) {
        return res.status(400).json({
            success: false,
            message:
                'Format JSON tidak valid'
        })
    }

    // -------------------------
    // CORS ERROR
    // -------------------------
    if (
        error.message ===
        'Origin tidak diizinkan oleh CORS'
    ) {
        return res.status(403).json({
            success: false,
            message:
                'Origin tidak diizinkan'
        })
    }

    // -------------------------
    // DEFAULT ERROR
    // -------------------------
    const statusCode =
        Number.isInteger(error.status) &&
            error.status >= 400 &&
            error.status <= 599
            ? error.status
            : 500

    return res.status(
        statusCode
    ).json({
        success: false,
        message:
            statusCode === 500
                ? 'Terjadi kesalahan pada server'
                : error.message
    })
}

module.exports = {
    notFound,
    errorHandler
}
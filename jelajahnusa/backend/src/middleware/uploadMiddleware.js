const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(
    __dirname,
    '../../uploads'
)

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },

    filename: (req, file, cb) => {
        const ext =
            path.extname(
                file.originalname
            )

        const name =
            path
                .basename(
                    file.originalname,
                    ext
                )
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    '-'
                )
                .replace(
                    /^-+|-+$/g,
                    ''
                )

        cb(
            null,
            `upload-${Date.now()}-${name}${ext.toLowerCase()}`
        )
    }
})

const fileFilter = (
    req,
    file,
    cb
) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ]

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(null, true)
    } else {
        cb(
            new Error(
                'Format gambar harus JPG, JPEG, PNG, atau WEBP'
            )
        )
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize:
            5 * 1024 * 1024
    }
})

module.exports = upload
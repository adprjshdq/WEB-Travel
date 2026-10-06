const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan'
            })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah expired'
        })
    }
}

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses hanya untuk admin'
        })
    }

    next()
}

module.exports = {
    authenticate,
    isAdmin
}
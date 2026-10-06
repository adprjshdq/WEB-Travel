const pool = require('../config/database')

// ========================================
// GET SEMUA TRANSPORTASI
// ========================================

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
            ORDER BY id ASC
        `)

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get transports error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data transportasi'
        })
    }
}

// ========================================
// EXPORT
// ========================================

module.exports = {
    getTransports
}
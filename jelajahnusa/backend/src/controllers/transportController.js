const pool = require('../config/database')

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

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error(
            'Get transports error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Gagal mengambil data transportasi'
        })
    }
}

module.exports = {
    getTransports
}
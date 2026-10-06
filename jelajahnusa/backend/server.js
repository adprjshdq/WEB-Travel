const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./src/config/database')

const authRoutes = require('./src/routes/authRoutes')
const adminDestinationRoutes = require('./src/routes/adminDestinationRoutes')
const adminUserRoutes = require('./src/routes/adminUserRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')
const hotelRoutes = require('./src/routes/hotelRoutes')
const adminHotelRoutes = require('./src/routes/adminHotelRoutes')
const transportRoutes = require('./src/routes/transportRoutes')
const adminTransportRoutes = require('./src/routes/adminTransportRoutes')

const path = require('path')

const {
    authenticate,
    isAdmin
} = require('./src/middleware/authMiddleware')

const app = express()


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors())

app.use(express.json())

app.use(
    '/uploads',
    express.static(
        path.join(__dirname, 'uploads')
    )
)


// ===============================
// ROUTES
// ===============================

// Auth
app.use(
    '/api/auth',
    authRoutes
)

// Admin Destinations
app.use(
    '/api/admin/destinations',
    adminDestinationRoutes
)

// Admin Users
app.use(
    '/api/admin/users',
    adminUserRoutes
)

// Bookings
app.use(
    '/api/bookings',
    bookingRoutes
)

// Public Hotels
app.use(
    '/api/hotels',
    hotelRoutes
)

// Admin Hotels
app.use(
    '/api/admin/hotels',
    adminHotelRoutes
)

// Public Transport
app.use(
    '/api/transports',
    transportRoutes
)

// Admin Transport
app.use(
    '/api/admin/transports',
    adminTransportRoutes
)


// ===============================
// API TEST
// ===============================

app.get(
    '/api',
    (req, res) => {
        res.json({
            success: true,
            message:
                'API JelajahNusa berhasil berjalan!'
        })
    }
)


// ===============================
// ADMIN TEST
// ===============================

app.get(
    '/api/admin/test',
    authenticate,
    isAdmin,
    (req, res) => {
        res.json({
            success: true,
            message:
                'Halo Admin! Akses berhasil.',
            user: req.user
        })
    }
)


// ===============================
// DATABASE TEST
// ===============================

app.get(
    '/api/places',
    async (req, res) => {
        try {
            const [rows] =
                await pool.query(
                    'SELECT 1 AS connected'
                )

            res.json({
                success: true,
                data: rows
            })
        } catch (error) {
            console.error(error)

            res.status(500).json({
                success: false,
                message:
                    'Terjadi kesalahan pada server'
            })
        }
    }
)


// ===============================
// DESTINATIONS
// ===============================

app.get(
    '/api/destinations',
    async (req, res) => {
        try {
            const [rows] =
                await pool.query(
                    'SELECT * FROM destinations'
                )

            res.json({
                success: true,
                data: rows
            })
        } catch (error) {
            console.error(error)

            res.status(500).json({
                success: false,
                message:
                    'Gagal mengambil data destinasi'
            })
        }
    }
)


// ===============================
// ADMIN STATS
// ===============================

app.get(
    '/api/admin/stats',
    authenticate,
    isAdmin,
    async (req, res) => {
        try {

            const [users] =
                await pool.query(
                    'SELECT COUNT(*) AS total FROM users'
                )

            const [destinations] =
                await pool.query(
                    'SELECT COUNT(*) AS total FROM destinations'
                )

            const [bookings] =
                await pool.query(
                    'SELECT COUNT(*) AS total FROM bookings'
                )

            const [revenue] =
                await pool.query(
                    `
                    SELECT
                        COALESCE(
                            SUM(total_price),
                            0
                        ) AS total
                    FROM bookings
                    WHERE status = 'confirmed'
                    `
                )

            res.json({
                success: true,

                data: {
                    totalUsers:
                        users[0].total,

                    totalDestinations:
                        destinations[0].total,

                    totalBookings:
                        bookings[0].total,

                    totalRevenue:
                        revenue[0].total
                }
            })

        } catch (error) {

            console.error(error)

            res.status(500).json({
                success: false,
                message:
                    'Gagal mengambil statistik admin'
            })
        }
    }
)


// ===============================
// SERVER
// ===============================

const PORT =
    process.env.PORT || 5001

app.listen(
    PORT,
    () => {
        console.log(
            `Server berjalan di http://localhost:${PORT}`
        )
    }
)
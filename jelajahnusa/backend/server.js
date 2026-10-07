const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const pool = require('./src/config/database')

const authRoutes = require('./src/routes/authRoutes')
const adminDestinationRoutes = require('./src/routes/adminDestinationRoutes')
const adminUserRoutes = require('./src/routes/adminUserRoutes')
const bookingRoutes = require('./src/routes/bookingRoutes')
const hotelRoutes = require('./src/routes/hotelRoutes')
const adminHotelRoutes = require('./src/routes/adminHotelRoutes')
const transportRoutes = require('./src/routes/transportRoutes')
const adminTransportRoutes = require('./src/routes/adminTransportRoutes')

const {
    authenticate,
    isAdmin
} = require('./src/middleware/authMiddleware')

const {
    notFound,
    errorHandler
} = require('./src/middleware/errorMiddleware')

const app = express()

// ========================================
// CONFIGURATION
// ========================================

const PORT = process.env.PORT || 5001

const allowedOrigins = (
    process.env.CORS_ORIGIN ||
    'http://localhost:5173'
)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

// ========================================
// MIDDLEWARE
// ========================================

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true)
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            }

            return callback(
                new Error('Origin tidak diizinkan oleh CORS')
            )
        },

        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'OPTIONS'
        ],

        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ],

        optionsSuccessStatus: 204
    })
)

app.use(
    express.json({
        limit: '1mb'
    })
)

app.use(
    express.urlencoded({
        extended: true,
        limit: '1mb'
    })
)

// Static uploaded images
app.use(
    '/uploads',
    express.static(
        path.join(__dirname, 'uploads')
    )
)

// ========================================
// PUBLIC ROUTES
// ========================================

// Auth
app.use(
    '/api/auth',
    authRoutes
)

// Public Hotels
app.use(
    '/api/hotels',
    hotelRoutes
)

// Public Transport
app.use(
    '/api/transports',
    transportRoutes
)

// ========================================
// BOOKING ROUTES
// ========================================

app.use(
    '/api/bookings',
    bookingRoutes
)

// ========================================
// ADMIN ROUTES
// ========================================

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

// Admin Hotels
app.use(
    '/api/admin/hotels',
    adminHotelRoutes
)

// Admin Transport
app.use(
    '/api/admin/transports',
    adminTransportRoutes
)

// ========================================
// API TEST
// ========================================

app.get(
    '/api',
    (req, res) => {
        res.json({
            success: true,
            message: 'API JelajahNusa berhasil berjalan!'
        })
    }
)

// ========================================
// ADMIN TEST
// ========================================

app.get(
    '/api/admin/test',
    authenticate,
    isAdmin,
    (req, res) => {
        res.json({
            success: true,
            message: 'Halo Admin! Akses berhasil.',
            user: req.user
        })
    }
)

// ========================================
// DATABASE TEST
// ========================================

app.get(
    '/api/health',
    async (req, res) => {
        try {
            await pool.query('SELECT 1')

            return res.json({
                success: true,
                message: 'API dan database berjalan normal'
            })
        } catch (error) {
            console.error(
                'Health check error:',
                error
            )

            return res.status(503).json({
                success: false,
                message: 'Database tidak tersedia'
            })
        }
    }
)

// ========================================
// PUBLIC DESTINATIONS
// ========================================

// /api/destinations
app.get(
    '/api/destinations',
    async (req, res) => {
        try {
            const [rows] = await pool.query(`
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
                ORDER BY id ASC
            `)

            res.json({
                success: true,
                data: rows
            })
        } catch (error) {
            console.error(
                'Get destinations error:',
                error
            )

            res.status(500).json({
                success: false,
                message: 'Gagal mengambil data destinasi'
            })
        }
    }
)

// /api/places
app.get(
    '/api/places',
    async (req, res) => {
        try {
            const [rows] = await pool.query(`
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
                ORDER BY id ASC
            `)

            res.json({
                success: true,
                data: rows
            })
        } catch (error) {
            console.error('ERROR /api/places:', error);

            res.status(500).json({
                success: false,
                message: 'Gagal mengambil data tempat',
                error: error.message
            });
        }
    }
)

// ========================================
// ADMIN STATS
// ========================================

app.get(
    '/api/admin/stats',
    authenticate,
    isAdmin,
    async (req, res) => {
        try {
            const [users] = await pool.query(`
                SELECT COUNT(*) AS total
                FROM users
            `)

            const [destinations] = await pool.query(`
                SELECT COUNT(*) AS total
                FROM destinations
            `)

            const [bookings] = await pool.query(`
                SELECT COUNT(*) AS total
                FROM bookings
            `)

            const [revenue] = await pool.query(`
                SELECT
                    COALESCE(
                        SUM(total_price),
                        0
                    ) AS total
                FROM bookings
                WHERE status = 'confirmed'
            `)

            res.json({
                success: true,
                data: {
                    totalUsers: Number(users[0].total),

                    totalDestinations:
                        Number(
                            destinations[0].total
                        ),

                    totalBookings:
                        Number(
                            bookings[0].total
                        ),

                    totalRevenue:
                        Number(
                            revenue[0].total
                        )
                }
            })
        } catch (error) {
            console.error(
                'Admin stats error:',
                error
            )

            res.status(500).json({
                success: false,
                message: 'Gagal mengambil statistik admin'
            })
        }
    }
)

// ========================================
// 404 HANDLER
// ========================================

app.use(notFound)

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(errorHandler)

// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    () => {
        console.log(
            `Server berjalan di http://localhost:${PORT}`
        )

        console.log(
            `CORS aktif untuk: ${allowedOrigins.join(', ')}`
        )
    }
)
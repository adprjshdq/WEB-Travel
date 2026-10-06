const express = require('express')

const {
    getBookings,
    getMyBookings,
    getMyBookingDetail,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    payBooking,
    cancelMyBooking
} = require('../controllers/bookingController')

const {
    authenticate,
    isAdmin
} = require('../middleware/authMiddleware')

const router = express.Router()

// User membuat booking
router.post(
    '/',
    authenticate,
    createBooking
)

// User melihat riwayat booking miliknya
router.get(
    '/my',
    authenticate,
    getMyBookings
)

// User melihat detail booking miliknya
router.get(
    '/my/:id',
    authenticate,
    getMyBookingDetail
)

// User membayar booking miliknya
router.put(
    '/:id/pay',
    authenticate,
    payBooking
)

// User membatalkan booking miliknya
router.put(
    '/:id/cancel',
    authenticate,
    cancelMyBooking
)

// Admin melihat semua booking
router.get(
    '/',
    authenticate,
    isAdmin,
    getBookings
)

// Admin mengubah status booking
router.put(
    '/:id/status',
    authenticate,
    isAdmin,
    updateBookingStatus
)

// Admin menghapus booking
router.delete(
    '/:id',
    authenticate,
    isAdmin,
    deleteBooking
)

module.exports = router
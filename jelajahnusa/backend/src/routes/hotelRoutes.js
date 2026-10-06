const express = require('express')

const {
    getHotels,
    getHotelsByCity
} = require('../controllers/hotelController')

const router = express.Router()

// Semua penginapan
router.get('/', getHotels)

// Penginapan berdasarkan kota/lokasi
router.get('/location/:city', getHotelsByCity)

module.exports = router
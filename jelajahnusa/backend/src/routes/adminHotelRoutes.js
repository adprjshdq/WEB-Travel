const express = require('express')

const {
    getHotels,
    createHotel,
    updateHotel,
    deleteHotel
} = require('../controllers/hotelController')

const {
    authenticate,
    isAdmin
} = require('../middleware/authMiddleware')

const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

router.use(
    authenticate,
    isAdmin
)

router.get(
    '/',
    getHotels
)

router.post(
    '/',
    upload.single('image'),
    createHotel
)

router.put(
    '/:id',
    upload.single('image'),
    updateHotel
)

router.delete(
    '/:id',
    deleteHotel
)

module.exports = router
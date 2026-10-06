const express = require('express')

const {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination
} = require('../controllers/destinationController')

const {
    authenticate,
    isAdmin
} = require('../middleware/authMiddleware')

const upload = require('../middleware/uploadMiddleware')

const router = express.Router()

router.use(authenticate, isAdmin)

router.get(
    '/',
    getDestinations
)

router.post(
    '/',
    upload.single('image'),
    createDestination
)

router.put(
    '/:id',
    upload.single('image'),
    updateDestination
)

router.delete(
    '/:id',
    deleteDestination
)

module.exports = router
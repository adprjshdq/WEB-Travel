const express = require('express')

const {
    getTransports,
    createTransport,
    updateTransport,
    deleteTransport
} = require('../controllers/adminTransportController')

const {
    authenticate,
    isAdmin
} = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticate, isAdmin)

router.get('/', getTransports)

router.post('/', createTransport)

router.put('/:id', updateTransport)

router.delete('/:id', deleteTransport)

module.exports = router
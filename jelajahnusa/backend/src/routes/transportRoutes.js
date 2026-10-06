const express = require('express')

const {
    getTransports
} = require('../controllers/transportController')

const router = express.Router()

router.get('/', getTransports)

module.exports = router
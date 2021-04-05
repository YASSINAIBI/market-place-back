const express = require('express')
const router = express.Router()
const {showAllProducts, relatedProduct} = require('../controllers/productController')

router.get('/all', showAllProducts)
router.get('/related/:category/:id', relatedProduct)

module.exports = router

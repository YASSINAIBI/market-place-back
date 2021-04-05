const express = require('express')
const router = express.Router()
const {vendeurSignup, vendeurSignin, upload, getOneVendeur, VById, findProduct, findVendeur, productsImg, addProduct, paypaleApi, changeCurrency, calculateProduct, updateVendeurPlane, checkProductImageIfExiste} = require('../controllers/vendeurController')
const {vendeurAcivated, requireSignIn, isAuth, vendeurRequired} = require('../middllwars/auth')
const {VendeurValidator, SignInValidator} = require('../middllwars/signInAndsignUpValidator')

router.post('/product/add', [requireSignIn, vendeurRequired, productsImg, findProduct, findVendeur, checkProductImageIfExiste], addProduct)

router.get('/paypale', paypaleApi)

// router.post('/checkLimit', findProduct)

router.post('/calculateValue', calculateProduct)

router.post('/vendeurSignUp', upload, VendeurValidator, vendeurSignup)
router.post('/vendeurSignIn', SignInValidator, vendeurSignin)

router.get('/:Vid', requireSignIn, isAuth, vendeurRequired, vendeurAcivated, getOneVendeur)
router.param('Vid', VById)

module.exports = router

const express = require('express')
const router = express.Router()
const {SAsignin, SaById, SignOut, signup} = require('../controllers/superAdmineController')
const {SignInValidator, SignUpValidator} = require('../middllwars/signInAndsignUpValidator')
const {requireSignIn, isAuth, isSuperAdmin} = require('../middllwars/auth')
const {getOneSAdmine} = require('../controllers/superAdmineController')

router.post('/SadmineSignUp', SignUpValidator, signup)
router.post('/signIn', SignInValidator, SAsignin)
router.post('/signOut', SignOut)

router.get('/:SAid', requireSignIn, isAuth, isSuperAdmin, getOneSAdmine)
router.param('SAid', SaById)

module.exports = router


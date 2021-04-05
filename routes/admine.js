const express = require('express')
const router = express.Router()
const {Asignin, AById, signup, SignOut, checkLivreur, addLivreur, addCategory} = require('../controllers/admineController')

const {SignInValidator, SignUpValidator, LivreurValidator} = require('../middllwars/signInAndsignUpValidator')
const {requireSignIn, isAuth, isAdmine, isSuperAdmin, isAdmineRequire} = require('../middllwars/auth')
const {getOneAdmine} = require('../controllers/admineController')

router.post('/category/add', [requireSignIn, isAdmineRequire], addCategory)

router.post('/admineSignUp', [SignUpValidator, requireSignIn, isSuperAdmin], signup)

router.post('/signIn', SignInValidator, Asignin)
router.post('/signOut', SignOut)

router.post('/livreur/add', LivreurValidator, requireSignIn, isAdmineRequire, checkLivreur, addLivreur)

router.get('/:Aid', requireSignIn, isAuth, isAdmine, getOneAdmine)
router.param('Aid', AById)

// SaById

module.exports = router

const expressJWT = require('express-jwt')
require('dotenv').config()

exports.requireSignIn = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && (req.profile._id == req.auth._id)

    if(!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }

    next()
}

exports.isSuperAdmin = (req, res, next) => {
    if(req.auth.role !== 0) {
        return res.status(403).json({
            error: "Super Admin Resource, Access Denied !"
        })
    }
    next()
}

exports.isAdmine = (req, res, next) => {
    if(req.auth.role !== 1) {
        return res.status(403).json({
            error: "Admin Resource, Access Denied !"
        })
    }
    if(!req.profile.activated) {
        return res.status(403).json({
            error: "this account is susppended"
        })
    }
    next()
}

exports.isAdmineRequire = (req, res, next) => {
    if(req.auth.role !== 1) {
        return res.status(403).json({
            error: "Admin Resource, Access Denied !"
        })
    }
    next()
}

exports.vendeurAcivated = (req, res, next) => {
    if(!req.profile.activated) {
        return res.status(403).json({
            error: "this account is not activated"
        })
    }
    next()
}

exports.vendeurRequired = (req, res, next) => {
    if(req.auth.role !== 2) {
        return res.status(403).json({
            error: "vendeur Resource, Access Denied !"
        })
    }
    next()
}


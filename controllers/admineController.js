const Admine = require('../models/admine')
const Livreur = require('../models/livreur')
const Category = require('../models/categorie')
const jwt = require('jsonwebtoken')

exports.addCategory = (req, res) => {
    try {
        const category = new Category(req.body)
        category.save((err, category) => {
            if(err) {
                return res.status(400).json({error: err.message})
            }
            res.send(category)
        })
    }
    catch(err) {

    }
}

exports.checkLivreur = (req, res, next) => {
    try {
        const findl = req.body
        Livreur.findOne(findl, (err, findl) => {
            if(err || findl) {
                return res.status(400).json({error: "this livreur is already existe"})
            }
            next()
        })
    }
    catch(error) {

    }
}

exports.addLivreur = (req,res) => {
    try {
        const livreur = new Livreur(req.body)

        livreur.save((err, livreur) => {
            if(err) {
                return res.status('400').json({error: err.message})
            }
            res.send(livreur)
        })
    }
    catch(error) {

    }
}

exports.signup = (req, res) => {
    try {
        if(req.body.confirmPass !== req.body.password || !req.body.confirmPass) {
            return res.status('400').json({error: "the password dosn't match"})
        }
        const admine = new Admine(req.body)

        admine.save((err, admine) => {
            if(err) {
                return res.status('400').json({error: "this email is already existe"})
            }
            admine.hashed_password = undefined
            admine.salt = undefined

            res.send(admine)
        })
    }
    catch(error) {

    }
}

exports.Asignin = (req, res) => {
    try {
        const {email, password} = req.body

        Admine.findOne({email}, (err, admine) => {
            if(err || !admine) {
                return res.status(400).json({error: "admine not found ith this email, please sign up"})
            }
            if(!admine.authenticate(password)) {
                return res.status(401).json({error: 'Email and password d\'ont match !'})
            }

            const token = jwt.sign({_id: admine._id, role: admine.role, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET);

            res.cookie('token', token, {expire: new Date() + 5000})

            const {_id, name, email, role} = admine;

            return res.json({
                token, sAdmine: {_id, name, email, role}
            })
        })
    }
    catch(error) {

    }
}

exports.AById = (req, res, next, id) => {
    Admine.findById(id).exec((err, admine) => {
        if(err || !admine) {
            return res.status(404).json({
                error: "admine not found !"
            })
        }

        req.profile = admine;
        next();
    })
}

exports.getOneAdmine = (req, res) => {
    res.json({
        SA: req.profile
    })
}

exports.SignOut = (req, res) =>  {
    res.clearCookie('token');

    res.json({
        message: "user signout"
    })
}

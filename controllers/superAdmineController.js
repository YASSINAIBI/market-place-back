const SuperAdmine = require('../models/superAdmine')
const jwt = require('jsonwebtoken')

exports.signup = (req, res) => {
    try {
        if(req.body.confirmPass !== req.body.password || !req.body.confirmPass) {
            return res.status('400').json({error: "the password dosn't match"})
        }
        const sAdmine = new SuperAdmine(req.body)

        sAdmine.save((err, sAdmine) => {
            if(err) {
                return res.status('400').json({error: "this email is already existe"})
            }
            sAdmine.hashed_password = undefined
            sAdmine.salt = undefined

            res.send(sAdmine)
        })
    }
    catch(error) {

    }
}

exports.SAsignin = (req, res) => {
    try {
        const {email, password} = req.body

        SuperAdmine.findOne({email}, (err, sAdmine) => {
            if(err || !sAdmine) {
                return res.status(400).json({error: "SuperAdmine not found ith this email, please sign up"})
            }
            if(!sAdmine.authenticate(password)) {
                return res.status(401).json({error: 'Email and password d\'ont match !'})
            }

            const token = jwt.sign({_id: sAdmine._id, role: sAdmine.role, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET);
    
            res.cookie('token', token, {expire: new Date() + 5000})

            const {_id, name, email, role} = sAdmine;

            return res.json({
                token, sAdmine: {_id, name, email, role}
            })
        })
    }
    catch(error) {

    }
}

exports.SaById = (req, res, next, id) => {
    SuperAdmine.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error: "user not found !"
            })
        }

        req.profile = user;
        next();
    })
}

exports.getOneSAdmine = (req, res) => {
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

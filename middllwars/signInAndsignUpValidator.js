exports.SignUpValidator = (req, res, next) => {
    req.check('name', 'name is required').notEmpty().withMessage('user name is required')
    req.check('email', 'email is required').notEmpty().isEmail().withMessage('enter a valid email')
    req.check('password', 'the password is required').notEmpty().isLength({min: 8}).withMessage('password must contain at less 10 character')

    const errors = req.validationErrors()

    if(errors) {
        // const arrayError = errors.map(errorList => {
        //     return errorList.msg
        // })
        return res.status(400).json({error: errors[0].msg})
    }
    next()
}

exports.SignInValidator = (req, res, next) => {
    req.check('email', 'email is required').notEmpty().isEmail().withMessage('enter a valid email')
    req.check('password', 'the password is required').notEmpty().isLength({min: 8}).withMessage('password must contain at less 10 character')

    const errors = req.validationErrors()

    if(errors) {
        // const arrayError = errors.map(errorList => {
        //     return errorList.msg
        // })
        return res.status(400).json({error: errors[0].msg})
    }
    next()
}

// livreur validator
exports.LivreurValidator = (req, res, next) => {
    req.check('lName', 'name is required').notEmpty()
    req.check('type', 'type is required').notEmpty()

    const errors = req.validationErrors()

    if(errors) {
        return res.status(400).json({error: errors[0].msg})
    }
    next()
}

// vendeur validator
exports.VendeurValidator = (req, res, next) => {
    req.check('name', 'name is required').notEmpty()
    req.check('email', 'type is required').notEmpty().isEmail().withMessage('enter a valid email')

    const errors = req.validationErrors()

    if(errors) {
        return res.status(400).json({error: errors[0].msg})
    }
    next()
}
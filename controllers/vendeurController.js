const Vendeur = require('../models/vendeur')
const Product = require('../models/product')
const jwt = require('jsonwebtoken')

const paypal = require('@paypal/checkout-server-sdk');

const _ = require('lodash')
const multer = require('multer')

const { convert } = require('exchange-rates-api');
// const session = require('express-session');
// const { json } = require('body-parser');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});
exports.upload = multer({storage: storage}).single('identityF');

exports.vendeurSignup = (req, res) => {
    try {
        if(req.body.confirmPass !== req.body.password || !req.body.confirmPass) {
            return res.status('400').json({error: "the password dosn't match"})
        }

        const {name, email, phone, identifcation, password, confirmPass} = req.body

        const vendeur = new Vendeur({
            name: name,
            email: email,
            phone: phone,
            identifcation: identifcation,
            password: password,
            confirmPass: confirmPass,
            identityF: req.file.path
        })

        vendeur.save((err, vendeur) => {
            if(err) {
                return res.status('400').json({error: err.message})
            }
            vendeur.hashed_password = undefined
            vendeur.salt = undefined

            if(req.file.mimetype != "application/pdf") {
				return res.status(400).json('accept only pdf file')
			}

			if(req.file.size > Math.pow(50, 6)) {
				return res.status(400).json('this file is too large')
			}

			if(err) {
				return res.status(400).json('bad request')
			}
			res.json({data: vendeur});
        })
    }
    catch(error) {

    }
}

exports.vendeurSignin = (req, res) => {
    try {
        const {email, password} = req.body

        Vendeur.findOne({email}, (err, vendeur) => {
            if(err || !vendeur) {
                return res.status(400).json({error: "vendeur not found ith this email, please sign up"})
            }
            if(!vendeur.authenticate(password)) {
                return res.status(401).json({error: 'Email and password d\'ont match !'})
            }

            const token = jwt.sign({_id: vendeur._id, role: vendeur.role, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET);
    
            res.cookie('token', token, {expire: new Date() + 5000})

            const {_id, name, email, role} = vendeur;

            return res.json({
                token, vendeur: {_id, name, email, role}
            })
        })
    }
    catch(error) {

    }
}

const productStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "productsImg/");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});
exports.productsImg = multer({storage: productStorage}).single('product');

exports.findProduct = (req, res, next) => {
    try {
        Product.find({addedBy: req.body.addedBy}, (err, Product) => {
            if(err) {
                return res.status(400).send(err.message)
            }
            req.productDetails = Product
            next()
        })
    }
    catch {

    }
}

exports.findVendeur = (req, res, next) => {
    try {
        // console.log(req.productDetails.length)
        Vendeur.find({_id: req.body.addedBy}, (err, Vendeur) => {
            if(err) {
                return res.status(400)
            }

            // const vendeur = Vendeur
            const product = req.productDetails.length
            const compte = Vendeur[0].typeV

            if(compte == "Starter" && product >= 10) {
                return res.status(400).json({error: "you can add only 10 product at starter plane"})
            }
            if(compte == "Pro" && product >= 20) {
                return res.status(400).json({error: "you can add only 20 product at pro plane"})
            }
            // if(compte == "Expert") {
            //     console.log("Expert")
            // }

            next()
        })
    }
    catch {

    }
}

exports.checkProductImageIfExiste = (req, res, next) => {
    try {
        Product.find({product: req.file.path}, (err, Product) => {
            if(err) {
                return res.status(400)
            }
            if(Product.length > 0)
                return res.status(400).json({error: "change the name off the image and upload again"})

            next()
        })
    }
    catch {

    }
}

exports.addProduct = (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            category: req.body.category,
            addedBy: req.body.addedBy,
            livrison: req.body.livrison,
            prix: req.body.prix,
            product: req.file.path
        })
        product.save((err, product) => {
            if(err) {
                return res.status(400).json({error: err.message})
            }
            res.end()
        })
    }
    catch {

    }
}

// paypal api
let date_ob = new Date();

let day = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();

// var currencVal = []

// convert(1, 'USD', 'EUR', year + "-" + month + "-" + day).then((value) => {
//     currencVal.push(value)
// })

// const example = async () => {
//     let amount = await convert(2000, 'USD', 'EUR', '2018-01-01');
//     console.log(amount);    // 1667.6394564000002
// };
 
// example();

exports.changeCurrency = (req, res, next) => {
    convert(1, 'USD', 'EUR', year + "-" + month + "-" + day).then((value) => {
        currencVal.push(value)
    })
    var RES = currencVal
    req.showCurrency = RES[0]
    currencVal = []
    next()
}

exports.paypaleApi = (req, res) => {
    var planeNam = req.body.plane
    var planeVal
    if(planeNam == "starter")
        planeVal = 3000

    else if(planeNam == "Expert")
        planeVal = 5000

    else {
        return res.status(404).send("this plane is not found")
    }
// Creating an environment
let clientId = "ATif2_dc29mjMsPkSCFzM5VUDLlVTTaCOecm7sssK7TF-WcgOkZNu3cGvTFiahjvZ_jYJ7aBCq5Gb3S0";
let clientSecret = "EGGKy_-s4hru-z3HuMa_oCr62oCRDG13JC3PXtQIvsi8XCoVseNSC6H8Fxl_urLpdtnQEmQGgTaSeF66";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
                          "intent": "CAPTURE",
                          "purchase_units": [
                              {
                                  "amount": {
                                      "currency_code": "USD",
                                      "value": planeVal
                                  }
                              }
                           ]
                    });

// Call API with your client and get a response for your call
var createdOrderVal = []
let createOrder  = async function(){
        let response = await client.execute(request);
        // console.log(`${JSON.stringify(response.result.id)}`);
        createdOrderVal.push({value: JSON.stringify(response.result.id)})
        
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
       console.log(`Order: ${JSON.stringify(response.result)}`);
}
createOrder();

console.log(createdOrderVal)

res.end()
}

exports.findProduct = (req, res, next) => {
    try {
        Product.find({addedBy: req.body.addedBy}, (err, Product) => {
            if(err) {
                return res.status(400).send(err.message)
            }
            req.productDetails = Product
            console.log(Product)
            next()
        })
    }
    catch {

    }
}

exports.calculateProduct = (req, res, next) => {
    try {
        Product.find({addedBy: req.body.from}, (err, Product) => {
            if(err) {
                return res.status(400).send(err.message)
            }
            var userCalculatedProduct = 0
            Product.map(show => {
                userCalculatedProduct += show.prix
            })
            res.json({sum: userCalculatedProduct, length: Product.length, vender: req.body.from})
        })
    }
    catch {

    }
}

// exports.updateVendeurPlane = (req, res) => {
//     Vendeur.findOneAndUpdate({ _id: req.calculatedProduct.vender }, { typeV: "Starter" }, function(
//         err,
//         result
//       ) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.send(result);
//         }
//       });
// }

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

exports.getOneVendeur = (req, res) => {
    res.json({
        Vendeur: req.profile
    })
}

exports.VById = (req, res, next, id) => {
    Vendeur.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error: "user not found !"
            })
        }

        req.profile = user;
        next();
    })
}


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser');
var cors = require('cors')
const session = require('express-session');

// routes
const superAdmineRouter = require('./routes/superAdmine')
const admineRouter = require('./routes/admine')
const vendeurRouter = require('./routes/vendeur')
const productsRouter = require('./routes/products')

app.get('/', (req, res) => {
    res.send('OK')
})

// config app
require('dotenv').config()

// connection to database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => console.log('connected to database'))
.catch(() => console.log('database is not connected'))

// middllwares
app.use('/uploads', express.static('./uploads'));
app.use('/productsImg', express.static('./productsImg'));
app.use(express.json())
app.use(express.urlencoded());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressValidator())
app.use(cors())

// routes
app.use('/api/superAdmin', superAdmineRouter)
app.use('/api/admin', admineRouter)
app.use('/api/vendeur', vendeurRouter)
app.use('/api/products', productsRouter)

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`app is now listening at port ${port}`))

module.exports = app


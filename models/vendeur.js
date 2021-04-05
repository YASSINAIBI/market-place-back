const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuid } = require('uuid')

const vendeurSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true
    },
    typeV: {
        type: String,
        enum: ["Starter", "Pro", "Expert"],
        default: "Starter"
    },
    identifcation: {
        type: String,
        require: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    role: {
        type: Number,
        default: 2
    },
    identityF: {
        type: String,
        require: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
})

vendeurSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuid()
    this.hashed_password = this.cryptPassword(password)
})
.get(function() {
    return this._password
})

vendeurSchema.methods = {
    authenticate: function(plainText) {
        return this.cryptPassword(plainText) === this.hashed_password;
    },
    cryptPassword: function(password) {
        if(!password) return "";

        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        }catch(error) {
            return ""
        }
    }
}

module.exports = mongoose.model('Vendeur', vendeurSchema)
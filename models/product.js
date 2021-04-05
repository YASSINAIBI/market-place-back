const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    addedBy: {
        type: ObjectId,
        ref: 'Admine'
    },
    livrison: {
        type: String,
        required: true,
        enum: ['5 jours', '1 jours']
    },
    prix: {
        type: Number,
        required: true
    },
    product: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)

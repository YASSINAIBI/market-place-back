const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const livreurSchema = new mongoose.Schema({
    lName: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['5 jours', '1 jours']
    },
    addedBy: {
        type: ObjectId,
        required: true,
        ref: 'Admine'
    }
}, {timestamps: true})

module.exports = mongoose.model('Livreur', livreurSchema)
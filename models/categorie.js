const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'Admine'
    }
})

module.exports = mongoose.model('Category', categorySchema)

const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: {
        type: String,
        required: true
    },
    manufacturerName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isInStock: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);
const req = require('express/lib/request');
const mongoose = require('mongoose');
const product = require('./product');


const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quantity: { type: Number, default: 1},
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'}
});

module.exports = mongoose.model("Order", orderSchema);

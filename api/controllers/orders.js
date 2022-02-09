const product = require('../models/product');
const Order = require('../models/order');
const mongoose = require('mongoose');
//CONTROLLER
exports.orders_get_all = (request, response, next) => {
    Order.find()
        .select("product quantity _id")
       // .populate("product", schema)
   //make the "product: doc.product" to show all variables product got / without: product": "61e5b30ddc5926543186ff01"
        .exec()
        .then(doc => {
            const orderObject = {
                count: doc.length,
                order: doc.map(doc => {
                    return ({
                        _id: doc._id,
                        quantity: doc.quantity,
                        product: doc.product
                    })
                })
            };
            response.status(201).json(orderObject);
        })
        .catch( err => {
            console.log(err);
            response.status(500).json(err)
        })
};

exports.orders_create = (req, res, next) => {
    product.findById(req.body.productId)
    .then( product => {
        if(!product) {
            return res.status.json({
                message: "Product not found"
            })
        }
        const order = new Order ({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            productId: req.body.productId
        });
        return order.save();
    })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Order saved",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantitiy: result.quantity
                }
            })
        })
        .catch( err =>{
            console.log(err);
            res.status(500).json(err);
        })
};

exports.orders_getOne = (req, res, next) => {
    const id = req.params.orderId;
    //takes orderId from the route  /:orderId
    Order.findById(id)
        .then( doc => {
            res.json({
                order_id: id,
                quantity: doc.quantity
            })
        })
        .catch( err => {
            console.log(err);
            res.status(500).json(err);
        })
};

exports.orders_delete = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
        .then( doc => {
            res.status(200).json({
                message: "Order deleted"
            })
        })
        .catch( err => {
            console.log(err);
            res.status(500).json(err);
        })
};
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/product');
const res = require('express/lib/response');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const req = require('express/lib/request');
const router = express.Router();
// dont need /products or sth like this, app.js connects with:app.js:const productRoutes = require('./api/routes/products');
// so the incoming here is already here when it get worked out
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(rq, file, cb) {
        cb(null,file.originalname);
    }
});
//doesnt save files from the same name!
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        console.log("fileFilter Suceess");
        cb(null, true);
        //true = save , falste = dont save
    } else {
        console.log("fileFilter failed");
        cb(null, false);
    }
};

const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
} );

router.get('/', (request, res, next) => {
    Product.find()
        .select('name price _id')//to fetch exactly that fields
        .exec()
        .then(docs => {
            const responseObject = {
                count: docs.length,
                products: docs.map(doc => {
                    return ({
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        requestObject: {
                            type: 'GET',
                            url: "localhost:3500/products/" + doc._id
                        }
                    })
                })
            };
            res.json(responseObject)
        })
        .catch(err => {
            console.log(err,"thats an product/get error");
            response.status(500).json({
                error: err
            });
        });
});
//create module Product in db
router.post('/', checkAuth, (request, response, next) => {
// router.post('/', upload.single('productImage'), (request, response, next) => {
    // console.log(request.file);
    const product = new Product ({
        //KONSTRUKTOR
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price
    });
    product
        .save()
        .then(product => {
            response.json({
                message: "Creation was a complete success",
                createdProduct: {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    createdProductObject: {
                        type: "GET",
                        url: "localhost:3500/products/" + product._id
                    }
                }
            })    
        })
        .catch(err => {
            console.log(err)
            response.status(500).json({
                error: err
            })
        });
});
//TEST BEGIN
//create module Product in db
// router.post('/test', (request, response, next) => {
    router.post('/test', checkAuth, upload.single('productImage'),  (request, response, next) => {
        console.log(request.file);
        console.log(request.body);
        const product = new Product ({
            //KONSTRUKTOR
            _id: new mongoose.Types.ObjectId(),
            name: request.body.name,
            price: request.body.price,
            productImage: "request.body.file"
        });
        product
            .save()
            .then(product => {
                response.json({
                    message: "Creation was a complete success",
                    createdProduct: {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        createdProductObject: {
                            type: "GET",
                            url: "localhost:3500/products/" + product._id
                        }
                    }
                })    
            })
            .catch(err => {
                console.log(err)
                response.status(500).json({
                    error: err
                })
            });
    });
//TEST ENDED

router.get('/:productId', (req, response, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id') //FROM THERE TO ALL FOLLOWING MEHTODS
    .exec()
    .then(doc => {
        console.log("from database:",doc);
        if (doc) {
            response.json({
                product: doc,
                requestObject: {
                    type: "GET",
                    url: "localhost:3500/products/" + doc._id
                }
            });
        } else {
            response.status(404).json({message: "no valid entry found for provided id"})
        }
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({error: err});
    })
});

router.patch('/:productId', (req, response, next) => {
    const id = req.params.productId;
    const updateOps = {};//empty js opject
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id }, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message: 'product updated',
                requestObject: {
                    type: 'GET',
                    url: "localhost:3500/products/" + id
                }
            });
        })
        .catch(err => {
        console.log("update failed:", err);
        response.status(500).json({
            error: err
        })
    });
});
//patch needs a json body from the request:
//{
//     "name": "HerrDerFlammen",
//     "price": "30"
// }

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'product deleted',
                requestObject: {
                    type: 'Post',
                    url: 'localhost:3500/products',
                    body: { name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log("deleted failed:",err);
            res.status(500).json({
                error: err
            });
        })
});
module.exports = router;
// router.blabla can be used in other files

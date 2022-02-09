const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require ('mongoose');
//morgan calls the next function, request still comes through
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const bodyParser = require('body-parser');
// const { use } = require('./api/routes/orders'); //WHY
// const { request, response } = require('express'); //WHY
// const req = require('express/lib/request'); // WHY
// const res = require('express/lib/response'); //WHY

mongoose.connect('mongodb+srv://mama:'+ process.env.MONGO_ATLAS_PW + '@dsa.0xhbj.mongodb.net/DSA?retryWrites=true&w=majority');

app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin','*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // response.header('Access-Controll-Allow-Methods','GET, POST, DELETE, PATCH, PUT')
    if (request.method === 'OPTIONS') {
        response.header('Access-Controll-Allow-Methods','GET, POST, DELETE, PATCH, PUT')
        return res.status(200).json({});
    }
    next();
});

//all requests on /products/orders/user connect to the route because of
// const productRoutes = require('./api/routes/products');
// const orderRoutes = require('./api/routes/orders');
// const userRoutes = require('./api/routes/users');
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})
//Error handlers are middleware with the signature function(err, req, res, next)
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
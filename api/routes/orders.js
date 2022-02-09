
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
// dont need /products or sth like this, app.js connects with:app.js:const productRoutes = require('./api/routes/products');
// so the incoming here is already here when it get worked out
router.get('/', orderController.orders_get_all);
// router.post('/', orderController.order_create);
router.post('/', orderController.orders_create); 
//ORDER BY ID
router.get('/:orderId', orderController.orders_getOne);
//DELETE ORDER BY ID
router.delete('/:orderId', orderController.orders_delete);
// router.blabla can be used in other files
module.exports = router;


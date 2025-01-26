const express = require('express');
const orderController = require("../controllers/orders.controller");
const auth = require('../middlewares/auth');


const router = express.Router();

router.route("/")
    .get(auth('order_auth'), orderController.getOrders)
    .post(auth('order_auth'), orderController.placeOrder)

router.route("/:orderId", auth('order_auth'))
    .get(auth('order_auth'), orderController.getOrder)
    .patch(auth('order_auth'), orderController.updateOrder)
    .delete(auth('order_auth'), orderController.deleteOrder);



module.exports = router;
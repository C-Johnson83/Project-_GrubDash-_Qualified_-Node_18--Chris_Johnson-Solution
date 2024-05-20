const router = require("express").Router();
const controller = require("../orders/orders.controller")
// TODO: Implement the /orders routes needed to make the tests pass

router
.route("/:orderId")
.get(controller.read)


router
.route("/")
.get(controller.list)
module.exports = router;

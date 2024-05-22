const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes, quantity } } = req.body;
    const newDish = {
        id: nextId(),
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        status: status,
        dishes: dishes.find,
        quantity: quantity
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}
function hasParams(propertyName){
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
        next({ status: 400, message: `Must include a ${propertyName}` });
    }
    }

function list(req, res) {
    res.json({ data: orders });
}

function orderExists(req, res, next) {
    const orderId = (req.params.orderId);
    const foundOrder = orders.find((order) => order.id === orderId)
    console.log(orderId, foundOrder);
    if (foundOrder) {
        res.locals.order = foundOrder
        return next();
    }
    next({
        status: 404,
        message: `Order does not exist: ${req.params.orderId}`
    });

}
function read(req, res) {
    res.json({ data: res.locals.order });
}

function update(req, res) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes, quantity } = {} } = req.body;
    order.deliverTo = deliverTo,
        order.mobileNumber = mobileNumber,
        order.status = status,


        res.json({ data: order })


}

function destroy(req, res) {
    const orderId = res.locals.order.id;
    const index = orders.findIndex((order) => order.id === orderId);
    const deleteOrder = orders.splice(index, 1);
    res.sendStatus(204);
    }
    
module.exports = {
    create: [
    hasParams("deliverTo"),
    hasParams("mobileNumber"),
    hasParams("Status"),
    hasParams("dishes"),
    hasParams("quantity"), create],
    list,
    read: [orderExists, read],
    update: [orderExists, update],
    delete:[orderExists, destroy]
}
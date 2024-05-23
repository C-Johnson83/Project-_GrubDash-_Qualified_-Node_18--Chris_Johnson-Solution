const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function create(req, res) {
  const {
    data: { deliverTo, mobileNumber, dishes },
  } = req.body;
  console.log(dishes)
  const newOrder = {
    id: nextId(),
    deliverTo: deliverTo,
    mobileNumber: mobileNumber,

    dishes: dishes,
    quantity: dishes.quantity,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function hasParams(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}
function hasDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({ status: 400, message: "Must include at least one dish" });
  }
  next();
}
function list(req, res) {
  res.json({ data: orders });
}

function checkDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  for (let index = 0; index < dishes.length; index++) {
    const dish = dishes[index];
    if (
      dish.quantity === undefined ||
      typeof dish.quantity !== "number" ||
      !Number.isInteger(dish.quantity) ||
      dish.quantity <= 0
    ) {
      return next({
        status: 400,
        message: `dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }

  next();
}

function orderExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order does not exist: ${req.params.orderId}`,
  });
}
function read(req, res) {
  res.json({ data: res.locals.order });
}

function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes, quantity } = {} } =
    req.body;
  (order.deliverTo = deliverTo),
    (order.mobileNumber = mobileNumber),
    (order.status = status),
    res.json({ data: order });
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
    hasParams("dishes"),
    hasDishes,
    checkDishes,
    create,
  ],
  list,
  read: [orderExists, read],
  update: [orderExists, update],
  delete: [orderExists, destroy],
};

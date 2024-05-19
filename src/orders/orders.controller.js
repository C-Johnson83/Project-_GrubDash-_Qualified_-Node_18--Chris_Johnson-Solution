const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function create (req, res) {
    const { data: { deliverTo, mobileNumber, price, image_url } } = req.body;
    const newDish = {
        id: nextId(),
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        price: price,
        image_url: image_url
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}
function hasDescription(req, res, next) {
    const { data: { description } = {} } = req.body;
  
    if (description) {
      return next();
    }
    next({ status: 404, message: "A 'description' property is required." });
  }








function list(req, res) {
    res.json({ data: orders });
}



module.exports = {
    list
}